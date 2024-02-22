const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const UserRequestGymOwner = require('../models/userRequestGymOwnerModel');

// @desc    Approves a user and makes them a GymOwner
// @route   POST /api/admin/makeGymOwner
// @access  Private
const makeUserAGymOwner = asyncHandler(async(req, res) => {
    const {token, userID, adminID} = req.body;
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
            await User.findOneAndUpdate({_id: userID}, {isGymOwner: true, applytoGymStatus: "3"}, {new: true});
        }else{
            res.status(401);
            throw new Error('Unauthorized');
        }
    }else{
        res.status(400)
        throw new Error('User does not exist')
    }
});

// @desc    Approves a user and makes them a GymOwner
// @route   GET /api/admin/makeGymOwner
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



module.exports = {makeUserAGymOwner, getAllRequestsForGymOwners}