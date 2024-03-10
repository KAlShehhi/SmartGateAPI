const mongoose = require("mongoose");

const subscriptionModel = mongoose.Schema({
    gymID:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Gym'
    },
    subName: {
        type : String,
        required: [true, 'Please add a name']
    },
    subType: {
        type : String,
        required: [true, 'Please add a type']
    },
    subPrice: {
        type : String,
        required: [true, 'Please add a type']
    },
});


module.exports = mongoose.model('Subscription', subscriptionModel);;
