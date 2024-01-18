const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs')
const User = require('../models/userModel');


// @desc    Register a user 
// @route   POST /api/users
// @access  Public
const registerUser =  asyncHandler(async(req, res) => {
    const {name, email, password} = req.body;
    if(!name || !email || !password){
        res.status(400);
        throw new Error('Please add all fields');
    }
    //Check if user exist
    const userExist = await User.findOne({email})
    if(userExist){
        res.status(400)
        throw new Error('User already exist')
    }
    //Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedpassword = await bcrypt.hash(password, salt);
    //Create user
    const user = await User.create({
        name,
        email,
        password: hashedpassword
    });

    if(user){
        res.status(201).json({
            _id: user.id,
            name: user.name,
            email : user.email,
            token: generateToken(user._id)
        });
    }else{
        res.status(400);
        throw new Error('Invalid user data')
    }
});

// @desc    Authenticate a user
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async(req, res) => {
    console.log("ss");
    console.log(req.body);
    const {email, password} = req.body;
    //Check for user email
    const userExist = await User.findOne({email})
    if(userExist && (await bcrypt.compare(password, userExist.password))){
        res.status(201).json({
            _id: userExist.id,
            name: userExist.name,
            email : userExist.email,
            token: generateToken(userExist._id)
        });
    }else{
        res.status(400);
        throw new Error('Invalid email and password')
    }
});

// @desc    Get user data
// @route   GET /api/users/me
// @access  Private
const getUser = asyncHandler(async(req, res) => {
    const {_id, name, email} = await User.findById(req.user.id)
    res.status(200).json({
        _id,
        name,
        email
    });
});

const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: '30d',
    })
}



module.exports = {
    registerUser,
    loginUser,
    getUser
}