const asyncHandler = require('express-async-handler');
const Gym = require('../models/gymModel');
const User = require('../models/userModel');

// @desc    Gets all reviews for a spesifc gym
// @route   GET /api/review/getReviews/:gymID
// @access  Public
const getReviews = asyncHandler(async (req, res) => {
    //TODO
});

// @desc    Write a review for a gym
// @route   POST /api/review/writeReview
// @access  Private
const writeReview = asyncHandler(async (req, res) => {
    //TODO
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