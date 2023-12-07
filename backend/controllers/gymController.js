const asyncHandler = require('express-async-handler');
const Gym = require('../models/gymModel');
// @desc    Get gyms
// @route   GET /api/gyms
// @access  Private
const getGyms = asyncHandler(async (req, res) => {
    const gyms = await Gym.find();
    res.status(200).json(gyms);
});

// @desc    Create gym
// @route   POST /api/gyms
// @access  Private
const createGym = asyncHandler (async (req, res) => {
    if(!req.body.name){
        res.status(400)
        throw new Error('Please add a name field');
    }
    const gym = await Gym.create({
        name: req.body.name
    });
    res.status(200).json(gym)
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
    const deletedGym = await Gym.findByIdAndDelete(req.params.id);
    res.status(200).json({message : `Delete Gym ${req.params.id}`})
});


module.exports = {
    getGyms, 
    createGym,
    updateGym,
    deleteGym
}