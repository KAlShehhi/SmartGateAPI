const asyncHandler = require('express-async-handler');
const Gym = require('../models/gymModel');
const User = require('../models/userModel');
const Subscription = require('../models/subscriptionModel');


// @desc    let gym owner create a subscripton model
// @route   POST /api/subscription/create/
// @access  Private
const createSub = asyncHandler(async (req, res) =>{
    const {subName, subType, userID} = req.body;
    const user = await User.findById({userID});
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

// @desc    get all subscriptions that a specific gym offers
// @route   GET /api/subscription/getSubs/:gymId
// @access  public
const getSubs = asyncHandler(async(req, res) => {
    const gymID = req.params.id;
    const subs = await Subscription.find({gymID: gymID});
    if(subs){
        res.status(200).json({
            subs
        });
    }else{
        res.status(400).json({
            msg: 'Gym does not have any subscription options'
        });
    }
});

// @desc    get one subscription
// @route   PUT /api/subscription/getSub/:subid
// @access  private
const getSub = asyncHandler(async(req, res) =>{});

// @desc    update a subscription
// @route   PUT /api/subscription/
// @access  private
const updateSub = asyncHandler(async(req, res) =>{
    const subid = req.params.id
    const userID = req.user.id
    const sub = await Subscription.findById({subid});
    const user = await User.findById({userID});
    if(sub){
        const gymID = sub.gymID;
        const subID = sub.id;
        if(user){
            if(user.gymID === gymID){
                const updatedSub = await Subscription.findByIdAndUpdate({
                    subID,
                    gymID,
                    subName: req.body.subName,
                    subType: req.body.subType,
                })
            }else{
                res.status(400).json({
                    msg: 'User is not authorized'
                })
            }
        }else{
            res.status(400).json({
                msg: 'User not found'
            })
        }
    }else{
        res.status(400).json({
            msg: 'Subscription not found'
        });
    }
});


// @desc    delete a subscription
// @route   PUT /api/subscription/delete
// @access  private
const deleteSub = asyncHandler(async(req, res) =>{});



module.exports = {createSub, getSubs, getSub, updateSub, deleteSub}