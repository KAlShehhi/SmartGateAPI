const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// @desc    Gets the existing token from the user and validated it
// @route   POST /api/app/users/validate
// @access  Private
const validateExistingToken = asyncHandler(async(req, res) => {
    const token = req.body;
    //Check token
    jwt.verify(token, process.env.JWT_SECRET, function(err, decoded){
        if(err){
            res.status(400);
            throw new Error('Invalid token');
        }else{
            res.status(201).json({
                isAuthed: true
            });
        }
    });
});



// @desc    Sends the hashed password to the app to compare
// @route   POST /api/app/users/check
// @access  Public
const checkPassword = asyncHandler(async(req, res) => {
    const {email} = req.body;
    //Check for user email
    const userExist = await User.findOne({email})
    if(userExist){
        res.status(201).json({
            token: generateToken(email),
            password: userExist.password
        });
    }else{
        res.status(400);
        throw new Error('Invalid email and password')
    }
});


// @desc    Authenticate a user
// @route   POST /api/app/users/login
// @access  Public
const loginUser = asyncHandler(async(req, res) => {
    const {email, token, isAuthed} = req.body;
    //console.log(req.body);
    //Check for user email
    const userExist = await User.findOne({email})
    console.log(token);
    jwt.verify(token, process.env.JWT_SECRET, function(err, decoded){
        if(err){
            res.status(400);
            throw new Error('Invalid email and password')
        }else{
            if(userExist && isAuthed){
                res.status(201).json({
                    _id: userExist.id,
                    name: userExist.name,
                    email : userExist.email,
                    token: generateToken(userExist._id)
                })
            }else{
                res.status(400);
                throw new Error('Invalid email and password')
            }
        }
    })
});


// @desc    Register a user 
// @route   POST /api/app/users
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

    //Create user
    const user = await User.create({
        name,
        email,
        password
    });

    if(user){
        console.log(`User created (${user.id}) at ${new Date(8.64e15).toString()}`);
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


//Generate JWT token for user login
const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: '30d',
    })
}




module.exports = {
    checkPassword,
    loginUser,
    registerUser,
    validateExistingToken
}