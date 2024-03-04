const asyncHandler = require('express-async-handler');
const Gym = require('../models/gymModel');
const User = require('../models/userModel');
const Entry = require('../models/gymEntryByUserModel');
const Exit = require('../models/gymExitByUserModel');

// @desc    check if the server is online or not
// @route   GET /api/gate/check
// @access  Public
const checkServer = asyncHandler(async (req, res) => {
    console.log("123");
    res.status(201).json({
        isOnline: true
    })
});


// @desc    authenticate users into the gym using the gate
// @route   POST /api/gate/entry/:gymID/:userID
// @access  Private
const userEntry = asyncHandler(async(req, res) => {
    const gymID = req.body.gymID
    const userID = req.body.userID;
    const user = await User.findById({userID});
    const gym = await Gym.findById({gymID});
    if(!user){
        res.status(400).json({
            msg: 'User does not exist'
        });
    }
    if(!gym){
        res.status(400).json({
            msg: 'Gym does not exist'
        });
    }
    //TODO: auth user into gym
    
});


// @desc    un-authenticate users exiting the gym using the gate
// @route   POST /api/gate/exit/:gymID/:userID
// @access  Private
const userExit = asyncHandler(async(req, res) => {
    const gymID = req.body.gymID
    const userID = req.body.userID;
    const user = await User.findById({userID});
    const gym = await Gym.findById({gymID});
    if(!user){
        res.status(400).json({
            msg: 'User does not exist'
        });
    }
    if(!gym){
        res.status(400).json({
            msg: 'Gym does not exist'
        });
    }
    //TODO: auth user out of gym
});




module.exports = {userEntry, userExit, checkServer}