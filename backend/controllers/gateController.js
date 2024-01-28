const asyncHandler = require('express-async-handler');

// @desc    check if the server is online or not
// @route   GET /api/gate/check
// @access  Public
const checkServer = asyncHandler(async (req, res) => {
    res.status(201).json({
        isOnline: true
    })
});


// @desc    authenticate users into the gym using the gate
// @route   POST /api/gate/entry/:gymID/:userID
// @access  Private
const userEntry = asyncHandler(async(req, res) => {
    
});


// @desc    un-authenticate users exiting the gym using the gate
// @route   POST /api/gate/exit/:gymID/:userID
// @access  Private
const userExit = asyncHandler(async(req, res) => {
    
});




module.exports = {userEntry, userExit, checkServer}