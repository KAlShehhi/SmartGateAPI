const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const UserRequestGymOwner = require('../models/userRequestGymOwnerModel');
const ApprovedGymOwner = require('../models/approvedGymOwnerModel');
const DisapprovedGymOwner = require('../models/diapprovedGymOwnerModel');

// @desc    Approves a user and makes them a GymOwner
// @route   POST /api/admin/makeUserAGymOwner
// @access  Private
const makeUserAGymOwner = asyncHandler(async(req, res) => {
    const {token, userID, adminID, approval} = req.body;
    console.log(req.body);
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
    const userAdmin = await User.findOne({ _id: adminID});
    if(userAdmin){
        if(userAdmin.isAdmin){
            const user = await User.findById(userID);
            if(!user){
                res.status(400);
                throw new Error('User not found!');
            }
            if(user.isGymOwner){
                res.status(400)
                throw new Error('User is a gym owner');
            }
            try{
                if(approval == "1"){
                    await User.findOneAndUpdate({_id: userID}, {isGymOwner: true, applytoGymStatus: "3"}, {new: true});
                    const approved = await ApprovedGymOwner.create({
                        userID,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        email: user.email
                    });
                    await UserRequestGymOwner.findOneAndDelete({userID});
                    res.status(200).json({
                        msg: 'done'
                    });
                }else{
                    await User.findOneAndUpdate({_id: userID}, {isGymOwner: false, applytoGymStatus: "2"}, {new: true});
                    const disapproved = await DisapprovedGymOwner.create({
                        userID,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        email: user.email
                    });
                    await UserRequestGymOwner.findOneAndDelete({userID});
                    res.status(200).json({
                        msg: 'done'
                    });
                }
            }catch{
                console.error(err);
                res.status(500)
                throw new Error('Internal server error');
            }
        }else{
            res.status(401);
            throw new Error('Unauthorized');
        }
    }else{
        res.status(400)
        throw new Error('User does not exist')
    }
});

// @desc    Get all users that have requested to become a gymOwner
// @route   GET /api/admin/getUserRequests
// @access  Private
const getAllRequestsForGymOwners = asyncHandler(async(req, res) => {
    try {
        const users = await UserRequestGymOwner.find({});
        res.status(200).json({
            users
        });
    } catch (error) {
        // Handle errors
        console.error(error);
        res.status(500).json({
            msg: 'Internal server error'
        });
    }
});

// @desc    Get all users that have been approved to become a gym owner
// @route   GET /api/admin/getAllGymOwners
// @access  Private
const getAllGymOwners = asyncHandler(async(req, res) => {
    try {
        const users = await ApprovedGymOwner.find({});
        res.status(200).json({
            users
        });
    } catch (error) {
        // Handle errors
        console.error(error);
        res.status(500).json({
            msg: 'Internal server error'
        });
    }
});

// @desc    Get all users that have been disapproved to become a gym owner
// @route   GET /api/admin/getAllGymOwners
// @access  Private
const getAllRejectedGymOwners = asyncHandler(async(req, res) => {
    try {
        const users = await DisapprovedGymOwner.find({});
        res.status(200).json({
            users
        });
    } catch (error) {
        // Handle errors
        console.error(error);
        res.status(500).json({
            msg: 'Internal server error'
        });
    }
});




module.exports = {makeUserAGymOwner, getAllRequestsForGymOwners, getAllGymOwners, getAllRejectedGymOwners}