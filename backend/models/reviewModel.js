const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema({
    userID:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    gymID:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Gym'
    },
    review:{
        type: String,
        required: true,
    },
    rating:{
        type: String,
        required: true,
    }
}, {timestamps: true});

module.exports = mongoose.model('Review', reviewSchema);