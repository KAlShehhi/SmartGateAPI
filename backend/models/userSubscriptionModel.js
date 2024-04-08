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
    },
    totalVistis: {
        type: String,
        default: 0,
        require:false
    },
    meanSpentTime: {
        type: String,
        require:false
    }
});


module.exports = mongoose.model('UserSubscription', userSubModel);;
