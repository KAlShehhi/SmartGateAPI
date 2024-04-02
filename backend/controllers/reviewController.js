const asyncHandler = require('express-async-handler');
const Gym = require('../models/gymModel');
const User = require('../models/userModel');
const Review = require('../models/reviewModel');
const mongoose = require('mongoose');

// @desc    Gets all reviews for a spesifc gym
// @route   GET /api/review/getReviews/:gymID
// @access  Public
const getReviews = asyncHandler(async (req, res) => {
    const gymID = req.params.gymID;
    if(!gymID){
        return res.status(400).json({
            msg: 'Bad request, no gym id'
        });
    }
    const reviews = await Review.find({gymID :  new mongoose.Types.ObjectId(gymID)});
    if(!reviews){
        return res.status(400).json({
            msg: 'Cannot get reviews'
        });
    }
    return res.status(200).json(reviews);
});

// @desc    Write a review for a gym
// @route   POST /api/review/writeReview
// @access  Private
const writeReview = asyncHandler(async (req, res) => {
    const {rating, review, userID, gymID} = req.body;
    if(!rating || !review){
        return res.status(400).json({
            msg: 'Bad request, write all required fields.'
        });
    }
    const newReview = await Review.create({
        userID,
        gymID,
        review,
        rating
    });

    if(!newReview){
        return res.status(500).json({
            msg: 'Internal server error'
        }); 
    }

    const reviews = await Review.find({gymID :  new mongoose.Types.ObjectId(gymID)});

    if(reviews.length == 0){
        const gym = await Gym.findByIdAndUpdate(gymID, {
            rating
        }, function(err, docs){
            if(err){
                console.log(error);
            }
        });
        if(!gym){
            return res.status(500).json({
                msg: 'Internal server error'
            }); 
        }
    }else{
        const gym = await Gym.findById(gymID);
        const gymRating = gym.rating;
        const newRating = (rating + gymRating)/reviews.length;
        await Gym.findByIdAndUpdate(gymID, {
            rating: newRating
        }, function(err, docs){
            if(err){
                console.log(err);
            }
        });
        if(!gym){
            return res.status(500).json({
                msg: 'Internal server error'
            }); 
        }
    }

    return res.status(200).json({
        msg: "Review added discovry"
    });
    
});

// @desc    Edit a review
// @route   PUT /api/review/updateReview/:id/:userID
// @access  Private
const updateReview = asyncHandler(async (req, res) => {
    //TODO
});

// @desc    Delte a review
// @route   DELETE /api/review/deleteReview/:id/:userID
// @access  Private
const deleteReview = asyncHandler(async (req, res) => {
    //TODO
});


module.exports = {
    getReviews, 
    writeReview,
    updateReview,
    deleteReview
}