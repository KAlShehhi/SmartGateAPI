const asyncHandler = require('express-async-handler');
// @desc    Get gyms
// @route   GET /api/gyms
// @access  Private
const getGyms = asyncHandler(async (req, res) => {
    res.status(200).json({message : 'Get Gym'})
});

// @desc    Create gym
// @route   POST /api/gyms
// @access  Private
const createGym = asyncHandler (async (req, res) => {
    if(!req.body.name){
        res.status(400)
        throw new Error('Please add a name field');
    }
    res.status(200).json({message : 'Create Gym'})
});

// @desc    Update gym
// @route   PUT /api/gyms/:id
// @access  Private
const updateGym = asyncHandler (async (req, res) => {
    res.status(200).json({message : `Update Gym ${req.params.id}`})
});

// @desc    Delete gym
// @route   DELETE /api/gyms/:id
// @access  Private
const deleteGym = asyncHandler(async (req, res) => {
    res.status(200).json({message : `Delete Gym ${req.params.id}`})
});


module.exports = {
    getGyms, 
    createGym,
    updateGym,
    deleteGym
}