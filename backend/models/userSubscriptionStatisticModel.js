const mongoose = require('mongoose');

const userSubStatModel = mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    subID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Sub'
    }, 
    totalVistis: {
        type: String,
        require:true
    },
    meanSpentTime: {
        type: String,
        require:true
    }
});


module.exports = mongoose.model('SubscriptionStatistics', userSubStatModel);;
