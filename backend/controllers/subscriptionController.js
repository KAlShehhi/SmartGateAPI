const asyncHandler = require('express-async-handler');
const Gym = require('../models/gymModel');
const User = require('../models/userModel');
const Subscription = require('../models/subscriptionModel');


// @desc    let gym owner create a subscripton model
// @route   POST /api/subscription/create/:id
// @access  Private
const createSub = asyncHandler(async (req, res) =>{
    const userID = req.params.id
    const {subName, subType} = req.body;
    const user = User.findById({userID});
    if(!user){
        res.status(400).json({
            msg: 'User does not exists'
        })
    }else{
        if(user.isGymOwner){
            //Create subscription
            const subscription = await Subscription.create({
                gymID: user.gymID,
                subName,
                subType
            })
            if(subscription){
                res.status(200).json({
                    userId: user.id,
                    gymID: subscription.gymID,
                    subName,
                    subType
                });
            }else{
                res.status(400).json({
                    msg: 'Subscription invalid'
                })
            }
        }else{
            res.status(400).json({
                msg: 'User is not authorized'
            })
        }
    }
});



module.exports = {createSub}