const asyncHandler = require('express-async-handler');
const Gym = require('../models/gymModel');
const User = require('../models/userModel');
const Class = require('../models/classModel');


// @desc    check if the server is online or not
// @route   POST /api/class/createClass
// @access  Private
const createClass = asyncHandler(async (req, res) => {
    const {name, startTime, endTime, days, trainerName, gymID} = req.body;
    if(!name || !startTime || !endTime || !days || !trainerName){
        return res.status(400).json({
            msg: 'invalid input'
        });
    }
    try{
        const gym = await Gym.findById(gymID);
        if(!gym){
            return res.status(400).json({
                msg: 'Gym does not exist'
            });
        }
        const newClass = await Class.create({
            gymID,
            name,
            startTime,
            endTime,
            days,
            trainerName
        });
        if(newClass){
            console.log(`Class ${newClass.id} have been created`.green);
            return res.status(200).json({
                msg: "done"
            });
        }
        return res.status(400).json({
            msg: 'error creating class'
        })
    }catch{
        return res.status(400).json({
            msg: 'Server error:  creating class'
        })
    }
});

// @desc    gets all classes for a spesifc gym
// @route   GET /api/class/getGymClasses/:id
// @access  Public
const getGymClasses = asyncHandler(async (req, res) => {
    const { gymID } = req.params.id;
    try{
        const gym = await Gym.findById(gymID);
        if(!gym){
            return res.status(400).json({
                msg: 'Gym does not exist'
            })
        }
        const classes = await Class.find({gymID});
        res.status(200).json(classes);
    }catch{
        return res.status(400).json({
            msg: 'Server error:  getting classes'
        })
    }
});

// @desc    deletes class
// @route   DELETE /api/class/deleteClass/
// @access  Private
const deleteClass = asyncHandler(async (req, res) => {
    const {gymID, classID, userID } = req.body;
    try{
        const user = await User.findById(userID);
        if(!user){
            return res.status(400).json({
                msg: 'User does not exist'
            }); 
        }
        if(!user.isGymOwner){
            return res.status(400).json({
                msg: 'User unauthorized'
            });
        }
        if(!user.gymID != gymID){
            return res.status(400).json({
                msg: 'User unauthorized'
            });
        }
        await Class.findByIdAndDelete(classID, function(err, decs){
            if(err){
                return res.status(400).json({
                    msg: 'Server error:  deleting class'
                })
            }else{
                return res.status(200).json({
                    msg: 'Class deleted'
                })
            }
        })
    }catch{
        return res.status(400).json({
            msg: 'Server error:  deleting class'
        })
    }
});

// @desc    deletes class
// @route   PUT /api/class/updateClass/
// @access  Private
const updateClass = asyncHandler(async (req, res) => {
    const {name, startTime, endTime, days, trainerName, gymID, classID} = req.body;
    if(!name || !startTime || endTime || !days || !trainerName){
        return res.status(400).json({
            msg: 'invalid input'
        });
    }
    try{
        const gym = await Gym.findById(gymID);
        if(!gym){
            return res.status(400).json({
                msg: 'Gym does not exist'
            });
        }
        await Class.findOneAndUpdate({_id: classID}, {
            gymID,
            name,
            startTime,
            endTime,
            days,
            trainerName
        }, {new: true});
        return res.status(400).json({
            msg: 'error updating class'
        })
    }catch{
        return res.status(400).json({
            msg: 'Server error:  updating class'
        })
    }
});





module.exports = {createClass, getGymClasses, deleteClass, updateClass}