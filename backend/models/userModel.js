const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    firstName: {
        type : String,
        required: [true, 'Please add a first name']
    },
    lastName: {
        type : String,
        required: [true, 'Please add a last name']
    },
    email: {
        type : String,
        required: [true, 'Please add a email']
    },
    phoneNumber: {
        type : String,
        required: [true, 'Please add a phone number']
    },
    DateOfBirth:{
        type: Date,
        required: [true, 'Please add a date of birth'],
        trim: true
    },
    isMale:{
        type: Boolean,
        required: [true, 'Please add a gender'],
    },
    emirate: {
        type : String,
        required: [true, 'Please add an emirate']
    },
    isAdmin:{
        type: Boolean,
        required: false
    },
    isGymOwner:{
        type: Boolean,
        required: false
    },
    gymID:{
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: 'Gym'
    },
    lastEntry:{
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: 'UserEntry'
    },
    email: {
        type : String,
        unique : true,
        required : [true, 'Please add a email']
    },
    password: {
        type : String,
        required: [true, 'Please add a password']
    },
    //0=not applied, 1=applied but not yet approved, 2=applied and rejected, 3=approved
    applytoGymStatus:{
        type: String,
        required: false,
        default: "0"
    }  
},{
    timestamps: true
});

module.exports = mongoose.model('User', UserSchema);

