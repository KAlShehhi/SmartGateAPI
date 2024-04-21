const asyncHandler = require('express-async-handler');
const Gym = require('../models/gymModel');
const User = require('../models/userModel');
const Review = require('../models/reviewModel');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken')

// @desc    Gets a single review
// @route   GET /api/review/getReview/:reviewID
// @access  Public
const getReview = asyncHandler(async (req, res) => {
    const reviewID = req.params.reviewID;
    if(!reviewID){
        return res.status(400).json({
            msg: 'Bad request, no review id'
        });
    }
    const review = await Review.findById(reviewID);
    if(!review){
        return res.status(400).json({
            msg: 'Cannot get reviews'
        });
    }
    return res.status(200).json(review);
});


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


// @desc    Gets all reviews for a spesifc gym
// @route   GET /api/review/getOtherUsersreview/:userID/:gymID
// @access  Public
const getOtherUsersReview = asyncHandler(async (req, res) => {
    const gymID = req.params.gymID;
    const userID = req.params.userID;

    if (!gymID) {
        return res.status(400).json({
            msg: 'Bad request, no gym ID provided'
        });
    }

    if (!userID) {
        return res.status(400).json({
            msg: 'Bad request, no user ID provided'
        });
    }

    // Use aggregation to fetch reviews and join with the User collection
    const reviews = await Review.aggregate([
        {
            $match: {
                gymID: new mongoose.Types.ObjectId(gymID),
                userID: { $ne: new mongoose.Types.ObjectId(userID) } // Exclude the given userID
            }
        },
        {
            $lookup: {
                from: "users",  // Assuming the collection name of users is 'users'
                localField: "userID",  // Field in the reviews collection
                foreignField: "_id",  // Field in the users collection
                as: "userDetails"  // Array of matching users
            }
        },
        {
            $unwind: "$userDetails"  // Deconstruct the array to merge user details
        },
        {
            $project: {
                _id: 1,
                userID: 1,
                gymID: 1,
                review: 1,
                rating: 1,
                createdAt: 1,
                updatedAt: 1,
                __v: 1,
                email: "$userDetails.email"  // Add email directly at the root level of the review document
            }
        }
    ]);

    if (!reviews || reviews.length === 0) {
        return res.status(404).json({
            msg: 'No reviews found or cannot get reviews'
        });
    }

    return res.status(200).json(reviews);
});

// @desc    Write a review for a gym
// @route   POST /api/review/writeReview
// @access  Private
const writeReview = asyncHandler(async (req, res) => {
    console.log(req.body);
    console.log(123);
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
    console.log(123);
    try{
        const {rating, review, gymID, _id, userID} = req.body;
        if(!rating || !review || !gymID || !_id){
            return res.status(400).json({
                msg: 'Bad request, write all required fields.'
            });
        }
    
        const rev = await Review.findById(_id);
        if(!rev){
            return res.status(404).json({
                msg: 'Cannot find review'
            }); 
        }
        if (rev.userID.toString() !== userID) {
            return res.status(401).json({ msg: 'User not authorized to update this review' });
        }
    
        const newReview = await Review.findByIdAndUpdate(_id, {
            review,
            rating
        }, {new: true});
        if(!newReview){
            return res.status(404).json({
                msg: 'Cannot find review'
            }); 
        }
    
        const reviews = await Review.find({gymID :  new mongoose.Types.ObjectId(gymID)});
        if (reviews.length === 0) {
            return res.status(404).json({
                msg: 'No reviews found for the gym'
            });
        }else if (reviews.length === 1){
            const updatedGym = await Gym.findByIdAndUpdate(gymID, {rating: rating}, {new: true});
            if(!updatedGym){
                return res.status(500).json({
                    msg: 'Internal server error'
                }); 
            }
        }else {
            //new rating 
            const gym = await Gym.findById(gymID);
            if(!gym){
                return res.status(500).json({
                    msg: 'Internal server error'
                }); 
            }
            let totalRating = 0;
            reviews.forEach(review => {
                totalRating += Number(review.rating); // Convert rating from string to number and add to total
            });
            const newAverageRating = totalRating / reviews.length;
            const updatedGym = await Gym.findByIdAndUpdate(
                gymID,
                { rating: newAverageRating },
                { new: true }
            );
            
            if (!updatedGym) {
                return res.status(500).json({
                    msg: 'Internal server error'
                });
            }
            
            // Send back the updated gym information or a success message
            return res.status(200).json({
                msg: 'Gym rating updated successfully',
                updatedGym: updatedGym.rating
            });
        }
    
        return res.status(200).json({
            msg: "Review updated"
        });
    
    }catch(error){
        res.status(500);
        throw new Error(error)
    }
    
});

// @desc    Delte a review
// @route   DELETE /api/review/deleteReview/:reviewID/:userID
// @access  Private
const deleteReview = asyncHandler(async (req, res) => {
    const { reviewID, userID, token } = req.params; 
    console.log(req.params);
    if(!reviewID){
        res.status(400);
        throw new Error('No review ID');
    }
    console.log(1);
    if(!userID){
        res.status(400);
        throw new Error('No userID');
    }
    console.log(2);
    if(!token){
        res.status(400);
        throw new Error('No token');
    }
    console.log(3);
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if(err){
            res.status(400);
            throw new Error('Invalid token');
        }
    });
    console.log(4);
    const review = await Review.findById(reviewID);
    const gymID = review.gymID
    if (!review) {
        return res.status(404).json({ msg: 'Review not found' });
    }
    console.log(5);
    if (review.userID.toString() !== userID) {
        return res.status(401).json({ msg: 'User not authorized to delete this review' });
    }
    console.log(6);
    await Review.findByIdAndDelete(reviewID);
    const reviews = await Review.find({gymID :  new mongoose.Types.ObjectId(gymID)});
    if(reviews.length === 0){
        await Gym.findByIdAndUpdate(gymID, { rating: 0 });
    }else if(reviews.length === 1){
        await Gym.findByIdAndUpdate(gymID, { rating: reviews[0].rating });
    }else{
        let totalRating = 0;
        reviews.forEach(review => {
            totalRating += Number(review.rating); 
        });
        const newAverageRating = totalRating / reviews.length;
        const updatedGym = await Gym.findByIdAndUpdate(
            gymID,
            { rating: newAverageRating },
            { new: true }
        );
    }
    console.log(123);
    res.status(200).json({ msg: 'Review deleted successfully' });
});


// @desc    Get reviews for a user
// @route   GET /api/review/getReviewsForUser/:userID/:gymID
// @access  PUBLIC
const getReviewsForUser = asyncHandler(async (req, res) => {
    const {userID, gymID} = req.params;
    if (!userID || !gymID) {
        return res.status(404).json({ msg: 'Please fill in all required fields'});
    }
    try {
        const reviews = await Review.find({
            gymID: new mongoose.Types.ObjectId(gymID),
            userID: new mongoose.Types.ObjectId(userID)
        });
        return res.status(200).json(reviews);
    } catch (error) {
        return res.status(500).json({ msg: 'Server error', error: error.message });
    }
});


module.exports = {
    getReview,
    getReviews, 
    writeReview,
    updateReview,
    deleteReview,
    getReviewsForUser,
    getOtherUsersReview
}