const asyncHandler = require('express-async-handler');
const Gym = require('../models/gymModel');
const User = require('../models/userModel');
const UserEntry = require('../models/gymEntryByUserModel');
const UserExit = require('../models/gymExitByUserModel');
const Subscription = require('../models/subscriptionModel');
const UserSubscription = require('../models/userSubscriptionModel');
const mongoose = require('mongoose');

var cron = require('node-cron');



// @desc    check if the server is online or not
// @route   GET /api/gate/check
// @access  Public
const checkServer = asyncHandler(async (req, res) => {
    res.status(201).json({
        isOnline: true
    })
});


// @desc    authenticate users into the gym using the gate
// @route   GET /api/gate/entry/:gymID/:userID
// @access  PUBLIC
const userEntry = asyncHandler(async(req, res) => {
    const {userID, gymID} = req.params;
    console.log(req.params);
    const isValidMongoID = (id) => mongoose.Types.ObjectId.isValid(id);
    if(!isValidMongoID(userID) || !isValidMongoID(gymID)){
        return res.status(401).json({
            msg: 'ID not valid'
        });
    }
    const user = await User.findById(userID);
    const currentDate = new Date(); 
    if(!user){
        return res.status(401).json({
            msg: 'User does not exist'
        });
    }
    const gym = await Gym.findById(gymID);
    if(!gym){
        return res.status(401).json({
            msg: 'Gym does not exist'
        });
    }
    try{
        const userSubs = await UserSubscription.find({userID: new mongoose.Types.ObjectId(userID), gymID: new mongoose.Types.ObjectId(gymID)});
        if(userSubs.length === 0){
            return res.status(401).json({
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
        const activeSub = activeSubs[0];
        if(activeSub.hadExpired){
            return res.status(401).json({
                msg: 'Unauthorized'
            });
        }
        if(activeSub.accessRevoked === true){
            return res.status(401).json({
                msg: 'Unauthorized'
            });
        }
        
        const updatedTotalVisits = parseInt(activeSub.totalVistis, 10) + 1; 
        const currentSub = await UserSubscription.findByIdAndUpdate(activeSub._id, {
            $set: { totalVistis: updatedTotalVisits } 
        });
        const currentGym = await Gym.findById(gymID)
        await Gym.findOneAndUpdate({_id: gymID}, {currentVisitors: Number(currentGym.currentVisitors + 1)})
        const entry = await UserEntry.create({
            userID,
            subID: currentSub.id,
            enteredAt: currentDate
            
        })

        return res.status(200).json({
            msg: 'Entry authorized',
            userSubs: activeSubs,
            entry: entry
        });

    }catch(error){
        console.error(error);
        res.status(401).json({
            error: error.message
        })
    }
});


// @desc    un-authenticate users exiting the gym using the gate
// @route   GET /api/gate/exit/:gymID/:userID
// @access  PUBLIC
const userExit = asyncHandler(async(req, res) => {
    const {userID, gymID} = req.params;
    const isValidMongoID = (id) => mongoose.Types.ObjectId.isValid(id);
    if(!isValidMongoID(userID) || !isValidMongoID(gymID)){
        return res.status(401).json({
            msg: 'ID not valid'
        });
    }
    const user = await User.findById(userID);
    const currentDate = new Date(); 
    if(!user){
        return res.status(401).json({
            msg: 'User does not exist'
        });
    }

    const gym = await Gym.findById(gymID);
    if(!gym){
        return res.status(401).json({
            msg: 'Gym does not exist'
        });
    }

    const entry = await UserEntry.findOneAndUpdate({hasExisted: false}, {hasExisted: true}).sort({enteredAt: -1});
    if(!entry){
        return res.status(401).json({
            msg: 'No entry'
        }); 
    }
    const currentGym = await Gym.findById(gymID)
    if(Number(currentGym.currentVisitors - 1) <= 0){
        await Gym.findOneAndUpdate({_id: gymID}, {currentVisitors: 0})
    }else{
        await Gym.findOneAndUpdate({_id: gymID}, {currentVisitors: Number(currentGym.currentVisitors - 1)})
    }

    const exit = await UserExit.create({
        userID,
        subID: entry.subID,
        entryID: entry.id,
        exitedAt: currentDate
    });

    return res.status(200).json({
        entry,
        exit
    });
});




module.exports = {userEntry, userExit, checkServer}