const asyncHandler = require('express-async-handler');
const Gym = require('../models/gymModel');
const User = require('../models/userModel');
const UserEntry = require('../models/gymEntryByUserModel');
const UserExit = require('../models/gymExitByUserModel');
const Subscription = require('../models/subscriptionModel');
const UserSubscription = require('../models/userSubscriptionModel');
const { default: mongoose } = require('mongoose');

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
// @route   GET /api/gate/entry/:gymID/:userID
// @access  PUBLIC
const userEntry = asyncHandler(async(req, res) => {
    const {userID, gymID} = req.params;
    const user = await User.findById(userID);
    if(!user){
        res.status(400).json({
            msg: 'User does not exist'
        });
    }
    const gym = await Gym.findById(gymID);
    if(!gym){
        res.status(400).json({
            msg: 'Gym does not exist'
        });
    }
    const userSubs = await UserSubscription.find({userID: userID})
    if(!userSubs){
        res.status(400).json({
            msg: 'User does not have any subscritpions'
        }); 
    }
    const subs = await Subscription.find({gymID: gymID});
    if(!subs){
        res.status(400).json({
            msg: 'Gym does not have any subscritpion models'
        }); 
    }
    for(let sub in subs){
        for(let userS in subs){
            
        }
    }    
    res.status(400).json({
        msg: 'User does not have any subscritpions'
    }); 
});


// @desc    un-authenticate users exiting the gym using the gate
// @route   GET /api/gate/exit/:gymID/:userID
// @access  PUBLIC
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