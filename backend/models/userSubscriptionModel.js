const mongoose = require('mongoose');

const userSubModel = mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    gymID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Gym'
    }, 
    subID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Subscription'
    },
    startDate: {
        type: Date,
        require:true
    },
    endDate: {
        type: Date,
        require:true
    }
});


module.exports = mongoose.model('UserSubscription', userSubModel);;
