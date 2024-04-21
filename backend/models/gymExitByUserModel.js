const mongoose = require('mongoose');

const gymExistByUserSchema = mongoose.Schema({
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
    entryID:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'UserEntry'
    },
    exitedAt:{
        type: Date,
        required: true,
    }
});

module.exports = mongoose.model('UserExit', gymExistByUserSchema);