const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const UserRequestGymOwner = require('../models/userRequestGymOwnerModel');
const { use } = require('../routes/adminRoutes');

// @desc    Gets the existing token from the user and validated it
// @route   POST /api/app/users/validate
// @access  Private
const validateExistingToken = asyncHandler(async(req, res) => {
    const {token} = req.body;
    if(!token){
        res.status(400);
        throw new Error('No token');
    }
    //Check token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if(err){
            res.status(400);
            throw new Error('Invalid token');
        }else{
            console.log(`Token verified`.green);
            res.status(200).json({
                Authed: true
            });
        }
    });
});



// @desc    Sends the hashed password to the app to compare
// @route   POST /api/app/users/checkPassword
// @access  Public
const checkPassword = asyncHandler(async(req, res) => {
    const {email} = req.body;
    console.log(email);
    //Check for user email
    const userExist = await User.findOne({email})
    if(userExist){
        res.status(201).json({
            token: generateAuthToken(email),
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
    console.log(req.body);
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
                    userID : userExist._id,
                    firstName: userExist.firstName,
                    lastName: userExist.lastName,
                    email : userExist.email,
                    phoneNumber: userExist.phoneNumber,
                    isMale: userExist.isMale,
                    DateOfBirth: userExist.DateOfBirth,
                    emirate: userExist.emirate,
                    token: generateToken(userExist._id),
                    isAdmin: userExist.isAdmin,
                    isGymOwner: userExist.isGymOwner
                })
            }else{
                res.status(400);
                throw new Error('Invalid email and password')
            }
        }
    })
});


// @desc    Register a user 
// @route   POST /api/app/users/registerUser
// @access  Public
const registerUser =  asyncHandler(async(req, res) => {
    console.log(req.body);
    const {firstName, lastName, email, phoneNumber, isMale, day, month, year, password, emirate} = req.body;
    if(!firstName || !lastName || !email || !phoneNumber || !day || !month || !year|| !emirate){
        res.status(400);
        throw new Error('Please add all fields');
    }
    //Check if user exist
    const userExist = await User.findOne({email})
    if(userExist){
        res.status(409)
        throw new Error('User already exist')
    }

    //Create user
    const user = await User.create({
        firstName,
        lastName,
        email,
        phoneNumber,
        isMale,
        DateOfBirth: new Date(year, month - 1, day),
        password,
        emirate,
        isGymOwner: false,
        isAdmin: false,
        applytoGymStatus:"0"
    });

    if(user){
        console.log(`User created (${user.id}) at ${new Date(8.64e15).toString()}`);
        res.status(201).json({
            userID : user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email : user.email,
            phoneNumber: user.phoneNumber,
            isMale: user.isMale,
            DateOfBirth: user.DateOfBirth,
            emirate: user.emirate,
            token: generateToken(user._id),
            role: "regular"
        });
    }else{
        res.status(400);
        throw new Error('Invalid user data')
    }
});

// @desc    A User can request to change his role to a gym owner
// @route   POST /api/app/users/applyGymOwner
// @access  Public
const applyToBeAGymOwner = asyncHandler(async (req, res) => {
    const { userID } = req.body;
    console.log(req.body);
    
    if (!userID) {
        return res.status(400).json({
            msg: 'No user id'
        });
    }

    try {
        const user = await User.findById(userID);
        
        if (!user) {
            return res.status(400).json({
                msg: 'User not found'
            });
        }

        const newUser = await User.findOneAndUpdate(
            { _id: userID },
            { applytoGymStatus: 1 },
            { new: true }
        );

        const userRequest = await UserRequestGymOwner.create({
            userID: newUser._id,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            email: newUser.email
        });

        return res.status(200).json({
            msg: 'done'
        });
    } catch (err) {
        // Handle any unexpected errors
        console.error(err);
        return res.status(500).json({
            msg: 'Internal server error'
        });
    }
});


// @desc    Check if the user is a gym owner
// @route   POST /api/app/users/checkGymOwner
// @access  Public
const isGymOwnerCheck = asyncHandler(async(req, res) => {
    const { userID } = req.body;
    if (!userID) {
        return res.status(400).json({
            msg: 'No user id'
        });
    }

    try {
        const user = await User.findById(userID);
        if (user) {
            if (user.isGymOwner) {
                return res.status(200).json({
                    msg: 'verified'
                });
            } else {
                return res.status(400).json({
                    msg: 'user not authorized'
                });
            }
        } else {
            return res.status(400).json({
                msg: 'User not found'
            });
        }
    } catch (err) {
        // Handle any unexpected errors
        console.error(err);
        return res.status(500).json({
            msg: 'Internal server error'
        });
    }
});


// @desc    Check if the user is a gym admin
// @route   POST /api/app/users/checkAdmin
// @access  Public
const isAdminCheck = asyncHandler(async(req, res) => {
    const { userID } = req.body;
    if (!userID) {
        return res.status(400).json({
            msg: 'No user id'
        });
    }
    try {
        const user = await User.findById(userID);
        if (user) {
            if (user.isAdmin) {
                return res.status(200).json({
                    msg: 'verified'
                });
            } else {
                return res.status(400).json({
                    msg: 'user not authorized'
                });
            }
        } else {
            return res.status(400).json({
                msg: 'User not found'
            });
        }
    } catch (err) {
        // Handle any unexpected errors
        console.error(err);
        return res.status(500).json({
            msg: 'Internal server error'
        });
    }
});

// @desc    Get the status code of applying to be a gym owner
// @route   POST /api/app/users/getApplyStatus
// @access  Public
const getApplyStatus = asyncHandler(async(req, res) => {
    const { userID } = req.body;
    if (!userID) {
        return res.status(400).json({
            msg: 'No user id'
        });
    }
    try {
        const user = await User.findById(userID);
        if (user) {
            return res.status(200).json({
                applyStatus: user.applytoGymStatus
            });
        } else {
            return res.status(400).json({
                msg: 'User not found'
            });
        }
    } catch (err) {
        // Handle any unexpected errors
        console.error(err);
        return res.status(500).json({
            msg: 'Internal server error'
        });
    }
});


// @desc    Get the status code of applying to be a gym owner
// @route   GET /api/app/users/gymCreated/:id
// @access  Public
const gymCreated = asyncHandler(async(req, res) => {
    if(!req.params.id){
        return res.status(400).json({
            msg: 'No user id'
        });
    }
    const user = await User.findOne({_id: req.params.id});
    if (!user) {
        return res.status(400).json({
            msg: 'No User found'
        });
    }
    try {
        if(user.gymID == "0"){
            res.status(200).json({
                gymID: user.gymID
            });
        }else{
            res.status(200).json({
                gymID: user.gymID
            });
        }
    } catch (err) {
        // Handle any unexpected errors
        console.error(err);
        return res.status(500).json({
            msg: 'Internal server error'
        });
    }
});
//Generate JWT token for user login
const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: '30d',
    })
}


//Generate JWT token for user login
const generateAuthToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: '30d',
    })
}


module.exports = {
    checkPassword,
    loginUser,
    registerUser,
    validateExistingToken,
    isAdminCheck,
    isGymOwnerCheck,
    applyToBeAGymOwner,
    getApplyStatus,
    gymCreated
}