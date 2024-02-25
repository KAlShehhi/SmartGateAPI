const asyncHandler = require('express-async-handler');
const Gym = require('../models/gymModel');
const User = require('../models/userModel');
// @desc    Get gyms
// @route   GET /api/gyms
// @access  Private
const getGyms = asyncHandler(async (req, res) => {
    const gyms = await Gym.find({user: req.user.id});
    res.status(200).json(gyms);
});

// @desc    Create gym
// @route   POST /api/gyms
// @access  Private
const createGym = asyncHandler (async (req, res) => {
     const {name, allowedGenders, workingHours, isOpenAllDay, fullCapacity} = req.body;   
    if(!name || !allowedGenders || !fullCapacity){
        res.status(400)
        throw new Error('Please enter all fields');
    }
    const gym = await Gym.create({
        name: req.body.name,
        user: req.user.id,
    });
    res.status(201).json(gym)
});

// @desc    Update gym
// @route   PUT /api/gyms/:id
// @access  Private
const updateGym = asyncHandler (async (req, res) => {
    const gym = await Gym.findById(req.params.id);
    if(!gym){
        res.status(400);
        throw new Error('Gym not found!');
    }
    const user = await User.findById(req.user.id);
    //check auth
    if(!user){
        res.status(401)
        throw new Error('User not found');
    }
    //check if user is the one who created the gym
    if(gym.user.toString() !== user.id){
        res.status(401)
        throw new Error('User not authorized');
    }
    const updatedGym = await Gym.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
    });
    res.status(200).json({message : `Update Gym ${req.params.id}`, updatedGym});
});

// @desc    Delete gym
// @route   DELETE /api/gyms/:id
// @access  Private
const deleteGym = asyncHandler(async (req, res) => {
    const gym = await Gym.findById(req.params.id);
    if(!gym){
        res.status(400);
        throw new Error('Gym not found!');
    }
    const user = await User.findById(req.user.id);
    //check auth
    if(!user){
        res.status(401)
        throw new Error('User not found');
    }
    //check if user is the one who created the gym
    if(gym.user.toString() !== user.id){
        res.status(401)
        throw new Error('User not authorized');
    }
    const deletedGym = await Gym.findByIdAndDelete(req.params.id);
    res.status(200).json({message : `Delete Gym ${req.params.id}`})
});


module.exports = {
    getGyms, 
    createGym,
    updateGym,
    deleteGym
}