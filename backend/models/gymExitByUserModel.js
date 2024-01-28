const mongoose = require('mongoose');

const gymExistByUserSchema = mongoose.Schema({
    entryID:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'UserEntry'
    },
    currentPeopleCount:{
        type: String,
        require: true
    }
}, {timestamps: true});

module.exports = mongoose.model('UserExit', gymExistByUserSchema);