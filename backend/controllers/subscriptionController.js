const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const Gym = require('../models/gymModel');
const User = require('../models/userModel');
const Subscription = require('../models/subscriptionModel');
const UserSubscription = require('../models/userSubscriptionModel');
const cron = require('node-cron');
const jwt = require('jsonwebtoken');

// @desc    let gym owner create a subscripton model
// @route   POST /api/subscription/create/
// @access  PRIVATE
const createSub = asyncHandler(async (req, res) => {
    const {subName, subType, subPrice, userID, gymID} = req.body;
    // Check for required fields
    if (!subName || !subType || !subPrice) {
        return res.status(400).json({
            msg: 'Bad request, missing required fields'
        });
    }
    try {
        // Verify user exists and is a gym owner
        const user = await User.findById(userID);
        if (!user) {
            return res.status(400).json({
                msg: 'User does not exist'
            });
        }
        if (!user.isGymOwner) {
            return res.status(400).json({
                msg: 'User unauthorized, not a gym owner'
            });
        }
        // Create subscription
        const subscription = await Subscription.create({
            gymID,
            subName,
            subType,
            subPrice,
        });
        // Verify subscription was created successfully
        if (subscription) {
            console.log(`Subscription:${subscription.id} created successfuly`.green);
            res.status(200).json(subscription);
        } else {
            return res.status(400).json({
                msg: 'Failed to create subscription'
            });
        }
    } catch (error) {
        console.error("Error creating subscription:", error);
        return res.status(500).json({
            msg: 'Internal Server Error'
        });
    }
});


// @desc    get all subscriptions that a specific gym offers
// @route   GET /api/subscription/getSubs/:gymID
// @access  PUBLIC
const getSubs = asyncHandler(async(req, res) => {
    if(!req.params.id){ 
        return res.status(400).json({
            msg: 'No gym ID provided'
        });
    }
    const gymID = req.params.id; 
    try {
        const gym = await Gym.findById(gymID);
        if (!gym) {
            return res.status(400).json({
                msg: 'Gym does not exist'
            });
        }
        const subs = await Subscription.find({gymID: gymID});
        const transformedSubs = subs.map(sub => ({
            subID: sub._id,
            gymID: sub.gymID,
            subName: sub.subName,
            subType: sub.subType,
            subPrice: sub.subPrice,
        }));
        res.status(200).json(transformedSubs);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            msg: 'Server error: getting subs'
        });
    }
});

// @desc    get all subscriptions that are associated with a user
// @route   GET /api/subscription/getUserSubs/:userID
// @access  PUBLIC
const getUserSubs = asyncHandler(async(req, res) => {
    if(!req.params.id){ 
        return res.status(400).json({
            msg: 'No user ID provided'
        });
    }
    const userID = req.params.id; 
    try {
        const userSubs = await UserSubscription.find({userID: new mongoose.Types.ObjectId(userID)});
        if (userSubs.length === 0) {
            return res.status(404).json({ msg: "No subscriptions found for the given user ID" });
        }
        const subs = [];
        for(let sub of userSubs){
            const gymSub = await Subscription.findOne(sub.subID);
            const gym = await Gym.findOne({_id: gymSub.gymID}, 'name');
            subs.push({
                subID: sub.id,
                subName: gymSub.subName,
                subType: gymSub.subType,
                subPrice: gymSub.subPrice,
                gymName: gym.name,
                startDate: sub.startDate,
                endDate: sub.endDate,
                hadExpired: sub.hadExpired,
                accessRevoked: sub.accessRevoked,
            });
        }
        res.status(200).json(subs);

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            msg: 'Server error: getting subs'
        });
    }
});

// @desc    get one subscription
// @route   GET /api/subscription/get/:subID
// @access  PRIVATE
const getSub = asyncHandler(async(req, res) =>{
    if(!req.params.id){
        return res.status(400).json({
            msg: 'No sub ID provided'
        });
    }
    const subID = req.params.id;
    try{
        const sub = await Subscription.findById(subID);
        if(!sub){
            return res.status(400).json({
                msg: 'Subscription does not exist'
            });
        }
        const subResponse = {
            subID: sub._id,
            gymID: sub.gymID,
            subName: sub.subName,
            subType: sub.subType,
            subPrice: sub.subPrice,
            accessRevoked: sub.accessRevoked,
            hadExpired: sub.hadExpired
        };
        res.status(200).json(subResponse);
    } catch (error) {
        console.error(error); 
        return res.status(500).json({
            msg: 'Server error: getting sub'
        });
    }
});


// @desc    update a subscription
// @route   PUT /api/subscription/update
// @access  PRIVATE
const updateSub = asyncHandler(async(req, res) =>{
    const {subName, subType, subPrice, userID, subID, gymID} = req.body;
    if(!subName || !subType || !subPrice|| !subID || !gymID){
        return res.status(400).json({
            msg: 'Invalid input'
        });
    }
    try{
        const gym = await Gym.findById(gymID);
        if (!gym) {
            return res.status(400).json({
                msg: 'Gym does not exist'
            });
        }
        const user = await User.findById(userID);
        if (!user || (user.gymID.toString() !== gymID)) {
            return res.status(401).json({
                msg: "Not authorized"
            });
        }
        const newSub = await Subscription.findByIdAndUpdate(subID,{
            subName,
            subPrice,
            subType
        }, {new : true});
        if (!newSub) {
            return res.status(404).json({
                msg: 'Subscription not found'
            });
        }
        return res.status(200).json({
            msg: 'done'
        });
    }catch (error) {
        console.error(error); 
        return res.status(500).json({
            msg: 'Server error: updating class'
        });
    }
});


// @desc    delete a subscription
// @route   DELETE /api/subscription/delete/:subID/:userID/:token
// @access  PRIVATE
const deleteSub = asyncHandler(async(req, res) =>{
    const subID = req.params.subID;
    const userID = req.params.userID;
    const token = req.params.token
    if(!token){
        res.status(400);
        throw new Error('No token');
    }
    //Check token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if(err){
            res.status(400);
            throw new Error('Invalid token');
        }
    });
    if(!subID || !userID){
        return res.status(400).json({
            msg: 'Invalid input'
        }); 
    }
    try{
        const user = await User.findById(userID);
        if(!user){
            return res.status(400).json({
                msg: 'User does not exist'
            }); 
        }
        console.log(user);
        if(!user.isGymOwner){
            return res.status(400).json({
                msg: 'User unauthorized'
            });
        }
        const sub = await Subscription.findById(subID);
        if(!sub){
            return res.status(404).json({
                msg: 'Subscription not found'
            });
        }
        if (user.gymID !== sub.gymID.toString()) {
            return res.status(401).json({
                msg: "Not authorized"
            });
        }
        const deletedSub = await Subscription.findByIdAndDelete(subID);
        if (!deletedSub) {
            return res.status(404).json({
                msg: 'Subscription not found'
            });
        }
        return res.status(200).json({
            msg: 'Subscription deleted'
        });
    }catch{
        return res.status(400).json({
            msg: 'Server error:  deleting subscription'
        })
    }
});


// @desc    Subscribes a user to a gym
// @route   POST /api/subscription/subUser/
// @access  PRIVATE
const subUser = asyncHandler(async(req, res) =>{
    const { userID, genericID, genericID2 } = req.body;
    if(!userID || !genericID){
        return res.status(400).json({ msg: 'Bad request, missing required fields' });
    }
    const subID =  genericID;
    const gymID = genericID2;

    //check if user is already subscribed
    const userIDObj = new mongoose.Types.ObjectId(userID);
    const checkSubs = await UserSubscription.find({userID: userIDObj});
    const isAlreadySubscribed = checkSubs.some(subscription => subscription.subID.toString() === subID);
    if(isAlreadySubscribed){
        return res.status(409).json({ msg: 'User is already subscribed to this subscription' });
    }
    const AlreadyHasSubInTheSameGym = checkSubs.some(subscription => subscription.gymID.toString() === gymID);
    if(AlreadyHasSubInTheSameGym){
        return res.status(409).json({ msg: 'User is already subscribed to this gym' });
    }

    const sub = await Subscription.findById(subID);
    if (!sub) {
        return res.status(404).json({
            msg: 'Subscription not found'
        });
    }

    let startDate = new Date();
    let endDate;
    switch(sub.subType.toLowerCase()){
        case "yearly":
            endDate = new Date(startDate);
            endDate.setFullYear(startDate.getFullYear() + 1);
            break;
        case "monthly":
            endDate = new Date(startDate);
            endDate.setMonth(startDate.getMonth() + 1);
            break;
        case "daily":
            endDate = new Date(startDate);
            endDate.setDate(startDate.getDate() + 1);
            break;
        default:
            return res.status(400).json({
                msg: 'Invalid subscription type'
            });
    }

    // Create user subscription
    const userSub = await UserSubscription.create({
        userID,
        subID,
        gymID,
        startDate,
        endDate,
        hadExpired: false,
        accessRevoked: false,
    });

    if(!userSub){
        return res.status(500).json({
            msg: 'Cannot subscribe user, server error'
        });
    }

    // Successfully subscribed
    return res.status(200).json({
        msg: 'User subscribed'
    });
});

// @desc    Cancel a user's subscription
// @route   DELETE /api/subscription/cancel/token/userID/userSubID
// @access  PRIVATE
const cancel = asyncHandler(async(req, res) =>{
    const {token, userID, userSubID} = req.params;
    try{
        if(!token){
            return res.status(400).json({
                msg: 'No token'
            });
        }
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if(err){
                res.status(400);
                throw new Error('Invalid token');
            }
        });
        if(!userID){
            return res.status(400).json({
                msg: 'No UserID'
            });
        }
        const user = await User.findById(userID);
        if(!user){
            return res.status(400).json({
                msg: 'User does not exist'
            });
        }
        if(!userSubID){
            return res.status(400).json({
                msg: 'No SubID'
            });
        }
        const userSub = await UserSubscription.findById(userSubID);
        if(!userSub){
            return res.status(400).json({
                msg: 'Subscription does not exist'
            });
        }
        if(userSub.userID.toString() != user._id.toString()){
            return res.status(401).json({
                msg: 'Unauthorized'
            });
        }
        const deletedSub = await UserSubscription.findByIdAndDelete(userSub.id);
        if(!deletedSub){
            return res.status(500).json({
                msg: 'Server error'
            });
        }
        return res.status(200).json({
            msg: `User subscription ${deleteSub.id} deleted`
        });
    }catch(error){
        console.error(error);
        res.status(500).json({
            error: error.message
        });
    }
    
});


// @desc    Cancel a user's subscription
// @route   GET /api/subscription/getUserSub/:userSubID
// @access  PUBLIC
const getUserSub = asyncHandler(async(req, res) =>{
    const {userSubID} = req.params;
    try{
        if(!userSubID){
            res.status(500).json({
                msg: "No subID"
            });  
        }
        const userSub = await UserSubscription.findById(userSubID);
        if(!userSub){
            res.status(500).json({
                msg: "user subscription does not exist"
            });   
        }
        res.status(200).json({
            id: userSub.id,
            userID: userSub.userID,
            gymID: userSub.gymID,
            subID: userSub.subID,
            startDate: userSub.startDate,
            endDate: userSub.endDate,
            totalVistis: userSub.totalVistis,
            accessRevoked: userSub.accessRevoked,
            hadExpired: userSub.hadExpired
        });  
    }catch{
        console.error(error);
        res.status(500).json({
            error: error.message
        });  
    }
});



// @desc    Cancel a user's subscription
// @route   GET /api/subscription/getGymUserSubs/:gymID
// @access  PRIVATE
const getGymUserSubs = asyncHandler(async (req, res) => {
    const gymID = req.params.gymID;
    try {
        if (!gymID) {
            return res.status(500).json({
                msg: "No gymID provided"
            });  
        }
        // Find subscriptions for the gym and populate the user details
        const gymSubs = await UserSubscription.find({ gymID: gymID }).populate('userID', 'firstName lastName email phoneNumber');
        if (!gymSubs || gymSubs.length === 0) {
            return res.status(400).json({
                msg: "No one is subscribed to this gym"
            });   
        }
        // Map the gymSubs to extract the required user details
        const userSubDetails = gymSubs.map(sub => {
            return {
                userID: sub.userID._id,
                firstName: sub.userID.firstName,
                lastName: sub.userID.lastName,
                phoneNumber: "0" + sub.userID.phoneNumber,
                email: sub.userID.email,
                startDate: sub.startDate,
                endDate: sub.endDate,
                accessRevoked: sub.accessRevoked,
                hadExpired: sub.hadExpired
            };
        });
        res.status(200).json(userSubDetails);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: error.message
        });  
    }
});

// @desc    Revoke a user access
// @route   POST /api/subscription/revokeUserAccess/
// @access  PRIVATE
const revokeUserAccess = asyncHandler(async (req, res) => {
    const {userID, memberID, gymID} = req.body;
    try{
        const owner = await User.findById(new mongoose.Types.ObjectId(userID))
        if(!owner){
            return res.status(400).json({
                msg: "Gym owner not found"
            });  
        }
        const member = await User.findById(new mongoose.Types.ObjectId(memberID))
        if(!member){
            return res.status(400).json({
                msg: "Member not found"
            });  
        }
        if(owner.gymID != gymID){
            return res.status(401).json({
                msg: "Unauthorized"
            });  
        }
        const userSub = await UserSubscription.findOne({userID: memberID, gymID: gymID});
        if(!userSub){
            return res.status(400).json({
                msg: "User Subscription not found"
            });  
        }
        const updatedUserSub = await UserSubscription.findOneAndUpdate({userID: memberID, gymID: gymID},{
            accessRevoked: true
        }, {new: true})
        if(updatedUserSub){
            res.status(200).json(updatedUserSub);
        }
    }catch(error){
        console.log(error);
        res.status(500).json({
            error: error.message
        });  
    }
});

// @desc    Re-grant a user access
// @route   POST /api/subscription/grantUserAccess/
// @access  PRIVATE
const grantUserAccess = asyncHandler(async (req, res) => {
    const {userID, memberID, gymID} = req.body;
    try{
        const owner = await User.findById(new mongoose.Types.ObjectId(userID))
        if(!owner){
            return res.status(400).json({
                msg: "Gym owner not found"
            });  
        }
        const member = await User.findById(new mongoose.Types.ObjectId(memberID))
        if(!member){
            return res.status(400).json({
                msg: "Member not found"
            });  
        }
        if(owner.gymID != gymID){
            return res.status(401).json({
                msg: "Unauthorized"
            });  
        }
        const userSub = await UserSubscription.findOne({userID: memberID, gymID: gymID});
        if(!userSub){
            return res.status(400).json({
                msg: "User Subscription not found"
            });  
        }
        const updatedUserSub = await UserSubscription.findOneAndUpdate({userID: memberID, gymID: gymID},{
            accessRevoked: false
        }, {new: true})
        if(updatedUserSub){
            res.status(200).json(updatedUserSub);
        }
    }catch(error){
        console.log(error);
        res.status(500).json({
            error: error.message
        });  
    }
});



cron.schedule('0 0 * * *', async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const expiredSubscriptions = await UserSub.find({
        endDate: { $lt: today },
        hasExpired: false
    });
    expiredSubscriptions.forEach(async (sub) => {
        sub.hasExpired = true;
        await sub.save();
        console.log(`Updated subscription ${sub._id} as expired.`);
    });
});



module.exports = {createSub, getSubs, getSub, getUserSubs, updateSub, deleteSub, subUser, cancel, getUserSub, getGymUserSubs, revokeUserAccess, grantUserAccess}