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
    }
}, {timestamps: true});

module.exports = mongoose.model('UserEntry', gymEntryByUserSchema);