const mongoose = require('mongoose');

const ApprovedGymOwnerModel = mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
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
});

module.exports = mongoose.model('ApprovedGymOwner', ApprovedGymOwnerModel);
