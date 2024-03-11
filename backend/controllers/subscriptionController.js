const asyncHandler = require('express-async-handler');
const Gym = require('../models/gymModel');
const User = require('../models/userModel');
const Subscription = require('../models/subscriptionModel');
const jwt = require('jsonwebtoken');

// @desc    let gym owner create a subscripton model
// @route   POST /api/subscription/create/
// @access  Private
const createSub = asyncHandler(async (req, res) => {
    console.log("!23");
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
// @access  public
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

// @desc    get one subscription
// @route   GET /api/subscription/get/:subID
// @access  private
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
// @access  private
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
// @access  private
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



module.exports = {createSub, getSubs, getSub, updateSub, deleteSub}