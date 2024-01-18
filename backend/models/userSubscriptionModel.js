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
    startDate: {
        type: Date,
        require:true
    }

});


module.exports = mongoose.model('UserSubscription', userSubModel);;
