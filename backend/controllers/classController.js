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
    if(!req.params.id){
        return res.status(400).json({
            msg: 'no gym id'
        })
    }
    const gymID = req.params.id;
    console.log(gymID);
    try{
        const gym = await Gym.findById(gymID);
        if(!gym){
            return res.status(400).json({
                msg: 'Gym does not exist'
            })
        }
        const classes = await Class.find({gymID: gymID});
        res.status(200).json(classes);
    }catch{
        return res.status(400).json({
            msg: 'Server error:  getting classes'
        })
    }
});

// @desc    gets a specific classes for a spesifc gym
// @route   GET /api/class/getClass/:id
// @access  Public
const getClass = asyncHandler(async (req, res) => {
    const classID = req.params.id;
    try{
        const currentClass = await Class.findById(classID);
        if(!currentClass){
            return res.status(400).json({
                msg: 'Class does not exist'
            })
        }
        res.status(200).json(currentClass);
    }catch{
        return res.status(400).json({
            msg: 'Server error:  getting classes'
        })
    }
});

// @desc    deletes class
// @route   POST /api/class/deleteClass/
// @access  Private
const deleteClass = asyncHandler(async (req, res) => {
    const {gymID, classID, userID } = req.body;
    if(!classID || !gymID){
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
        if(!user.isGymOwner){
            return res.status(400).json({
                msg: 'User unauthorized'
            });
        }

        if (user.gymID.toString() !== gymID) {
            return res.status(401).json({
                msg: "Not authorized"
            });
        }
        const deletedClass = await Class.findByIdAndDelete(classID);
        if (!deletedClass) {
            return res.status(404).json({
                msg: 'Class not found'
            });
        }
        return res.status(200).json({
            msg: 'Class deleted'
        });
    }catch{
        return res.status(400).json({
            msg: 'Server error:  deleting class'
        })
    }
});

// @desc    update class
// @route   PUT /api/class/updateClass/
// @access  Private
const updateClass = asyncHandler(async (req, res) => {
    const { name, startTime, endTime, days, trainerName, gymID, classID, userID } = req.body;
    if (!name || !startTime || !endTime || !days || !trainerName || !classID) {
        return res.status(400).json({
            msg: 'Invalid input'
        });
    }
    try {
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
        const updatedClass = await Class.findByIdAndUpdate(classID, {
            name,
            startTime,
            endTime,
            days,
            trainerName
        }, { new: true });
        if (!updatedClass) {
            return res.status(404).json({
                msg: 'Class not found'
            });
        }
        return res.status(200).json(updatedClass);
    } catch (error) {
        console.error(error); 
        return res.status(500).json({
            msg: 'Server error: updating class'
        });
    }
});





module.exports = {createClass, getGymClasses, deleteClass, updateClass, getClass}