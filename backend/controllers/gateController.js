const asyncHandler = require('express-async-handler');
const Gym = require('../models/gymModel');
const User = require('../models/userModel');
const UserEntry = require('../models/gymEntryByUserModel');
const UserExit = require('../models/gymExitByUserModel');
const Subscription = require('../models/subscriptionModel');
const UserSubscription = require('../models/userSubscriptionModel');
const { default: mongoose, mongo } = require('mongoose');

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
    const currentDate = new Date(); 
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
    try{
        const userSubs = await UserSubscription.find({userID: new mongoose.Types.ObjectId(userID), gymID: new mongoose.Types.ObjectId(gymID)});
        if(userSubs.length === 0){
            res.status(401).json({
                msg: 'Unauthorized'
            });
        }

        const activeSubs = userSubs.filter(sub => {
            const startDate = new Date(sub.startDate);
            const endDate = new Date(sub.endDate);
            return startDate <= currentDate && endDate >= currentDate;
        });

        if(activeSubs.length === 0){
            return res.status(401).json({
                msg: 'Unauthorized, subscription expired'
            });
        }
        //const activeSub = activeSubs[0];
       // const updatedTotalVisits = parseInt(activeSub.totalVistis, 10) + 1; 
        //await UserSubscription.findByIdAndUpdate(activeSub._id, {
        //    $set: { totalVistis: updatedTotalVisits } // Correct the field name if necessary
        //});
        res.status(200).json({
            msg: 'Entry authorized',
            userSubs: activeSubs 
        });
    }catch(error){
        console.error(error);
        res.status(500).json({
            error: error.message
        })
    }
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