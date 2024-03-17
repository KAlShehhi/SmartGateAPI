const asyncHandler = require('express-async-handler');
const Gym = require('../models/gymModel');
const User = require('../models/userModel');
const { default: mongoose } = require('mongoose');
// @desc    Get gyms
// @route   GET /api/gyms
// @access  Private
const getUserGyms = asyncHandler(async (req, res) => {
    const gyms = await Gym.find({user: req.user.id});
    res.status(200).json(gyms);
});

// @desc    Create gym
// @route   POST /api/gym/createGym
// @access  Private
const createGym = asyncHandler (async (req, res) => {
    const {name, phoneNumber, allowedGenders, workingHours, fullCapacity, emirate, googleMapsLink, lat , lng, swimmingPool, crossfit, cafe, restaurant, sauna, lockers, changingRooms, coaches, freeCoaches, description, ownerID } = req.body;   
    if (!name || !phoneNumber || !allowedGenders || !workingHours || !fullCapacity || 
        !emirate || !googleMapsLink || lat === undefined || lng === undefined || 
        swimmingPool === undefined || crossfit === undefined || cafe === undefined || 
        restaurant === undefined || sauna === undefined || lockers === undefined || 
        changingRooms === undefined || coaches === undefined || freeCoaches === undefined || 
        !description, !ownerID) {
        return res.status(400).json({ message: 'Please enter all fields' });
    }
    try{
        const user = await User.findById(ownerID);
        if(user){
            if(user.isGymOwner){
                const gym = await Gym.create({
                    ownerID,
                    name,
                    phoneNumber,
                    allowedGenders,
                    workingHours,
                    fullCapacity,
                    emirate,
                    googleMapsLink,
                    lat,
                    lng,
                    swimmingPool,
                    crossfit,
                    cafe,
                    restaurant,
                    sauna,
                    lockers,
                    changingRooms,
                    coaches,
                    freeCoaches,
                    description,
                });
                if(gym){
                    await User.findByIdAndUpdate({_id: ownerID}, {gymID: gym._id}, {new: true});
                    return res.status(201).json(gym)
                }
                return res.status(400).json({ 
                    msg: 'Error creating gym' 
                });
            }
            return res.status(401 ).json({ 
                msg: 'User not unauthorized' 
            });
        }
        return res.status(400).json({ 
            msg: 'User does not exist' 
        });
    }catch{
        return res.status(400).json({ 
            msg: 'Error creating gym, invalid input' 
        })
    }
});


// @desc    Checks if the user have created a gym
// @route   POST /api/gym/hasGym
// @access  Private
const hasGym = asyncHandler(async (req, res) => {
    const {ownerID} = req.body; 
    try{
        const gym = await Gym.find({ownerID: ownerID});
        if(gym){
            return res.status(200).json(true);
        }else{
            return res.status(200).json(false);
        }
    }catch{
        return es.status(400);
    }
});


// @desc    Update gym
// @route   PUT /api/gym/:id
// @access  Private
const updateGym = asyncHandler (async (req, res) => {
    const {name, phoneNumber, allowedGenders, workingHours, fullCapacity, emirate, googleMapsLink, lat , lng, swimmingPool, crossfit, cafe, restaurant, sauna, lockers, changingRooms, coaches, freeCoaches, description, ownerID } = req.body;   
    if (!name || !phoneNumber || !allowedGenders || !workingHours || !fullCapacity || 
        !emirate || !googleMapsLink || lat === undefined || lng === undefined || 
        swimmingPool === undefined || crossfit === undefined || cafe === undefined || 
        restaurant === undefined || sauna === undefined || lockers === undefined || 
        changingRooms === undefined || coaches === undefined || freeCoaches === undefined || 
        !description, !ownerID) {
        return res.status(400).json({ message: 'Please enter all fields' });
    
    }
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
// @route   DELETE /api/gym/:id
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


// @desc    Get a gym
// @route   GET /api/gym/getGym/:id
// @access  Public
const getGym = asyncHandler(async (req, res) => {
    if(!(mongoose.isValidObjectId(req.params.id))){
        res.status(400);
        throw new Error('Invalid id');
    }
    const gym = await Gym.findById(req.params.id);
    if(!gym){
        res.status(400);
        throw new Error('Gym not found!');
    }
    res.status(200).json(gym);
});


module.exports = {
    getUserGyms, 
    createGym,
    updateGym,
    deleteGym,
    hasGym,
    getGym
}