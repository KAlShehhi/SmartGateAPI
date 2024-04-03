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
    if(!rating || !review || !gymID || !userID){
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
    if(reviews.length === 1){
        const gym = await Gym.findByIdAndUpdate(gymID, {rating},{new: true});
        if(!gym){
            return res.status(500).json({
                msg: 'Internal server error'
            }); 
        }
    }else{
        const gym = await Gym.findById(gymID);
        if(!gym){
            return res.status(500).json({
                msg: 'Internal server error'
            }); 
        }
        let gymRating = gym.rating;
        let newGymRating = (Number((gymRating * (Number(reviews.length - 1)))) + Number(rating)) / (Number(reviews.length));
        const newGym = await Gym.findByIdAndUpdate(gymID, {rating: Number(newGymRating)}, {new: true});
        if(!newGym){
            return res.status(500).json({
                msg: 'Internal server error'
            }); 
        }
    }
    return res.status(200).json({
        msg: "Review added"
    });
});

// @desc    Edit a review
// @route   PUT /api/review/updateReview/
// @access  Private
const updateReview = asyncHandler(async (req, res) => {
    const {rating, review, gymID, reviewID, userID} = req.body;

    if(!rating || !review || !gymID || !reviewID){
        return res.status(400).json({
            msg: 'Bad request, write all required fields.'
        });
    }

    const rev = await Review.findById(reviewID);
    if (rev.userID.toString() !== userID) {
        return res.status(401).json({ msg: 'User not authorized to update this review' });
    }

    const newReview = await Review.findByIdAndUpdate(reviewID, {
        review,
        rating
    }, {new: true});
    if(!newReview){
        return res.status(404).json({
            msg: 'Cannot find review'
        }); 
    }
    const reviews = await Review.find({gymID :  new mongoose.Types.ObjectId(gymID)});
    
    if (reviews.length > 0) {
        const totalRating = reviews.reduce((acc, {rating}) => acc + rating, 0);
        const newGymRating = totalRating / reviews.length;
        const updatedGym = await Gym.findByIdAndUpdate(gymID, {rating: newGymRating}, {new: true});
        if (!updatedGym) {
            return res.status(500).json({
                msg: 'Internal server error'
            });
        }
    }

    return res.status(200).json({
        msg: "Review updated"
    });

});

// @desc    Delte a review
// @route   DELETE /api/review/deleteReview/:reviewID/:userID
// @access  Private
const deleteReview = asyncHandler(async (req, res) => {
    const { reviewID, userID } = req.params; // Extracting reviewID and userID from the request parameters

    // First, find the review to ensure it exists and belongs to the user
    const review = await Review.findById(reviewID);
    if (!review) {
        return res.status(404).json({ msg: 'Review not found' });
    }

    if (review.userID.toString() !== userID) {
        return res.status(401).json({ msg: 'User not authorized to delete this review' });
    }

    // Delete the review
    await Review.findByIdAndDelete(reviewID);
    const reviews = await Review.find({ gymID: review.gymID });
    const totalRating = reviews.reduce((acc, curr) => acc + curr.rating, 0);
    const newAverageRating = reviews.length > 0 ? totalRating / reviews.length : 0;
    await Gym.findByIdAndUpdate(review.gymID, { rating: newAverageRating });

    res.status(200).json({ msg: 'Review deleted successfully' });
});


module.exports = {
    getReviews, 
    writeReview,
    updateReview,
    deleteReview
}