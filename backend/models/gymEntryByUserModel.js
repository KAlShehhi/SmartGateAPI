const mongoose = require('mongoose');

const gymEntryByUserSchema = mongoose.Schema({
    userID:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    subID:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Subscription'
    },
    enteredAt:{
        type: Date,
        required: true,
    },
    hasExisted: {
        type: Boolean,
        required: true,
        default: false
    }
});

module.exports = mongoose.model('UserEntry', gymEntryByUserSchema);