const mongoose = require('mongoose');

const gymSchema = mongoose.Schema({
    ownerID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    name: {
        type: String,
        required: [true, 'Please add a name']
    },
    allowedGenders:{
        type: String,
        required: [true, 'Please specify allowed genders']
    },
    workingHours:{
        type: String,
        required: [true, 'Please specify working hours']
    },
    isOpenAllDay:{
        type: Boolean,
        required: [true, 'Please specify if the gym is 24/7']
    },
    rating:{
        type: String,
        required: false,
        default: '0'
    },
    fullCapacity:{
        type: String,
        required: [true, "Please specify the gym's full capacity"]
    },
    lat:{
        type: String,
        required: [true, "Please specify the gym's location"]
    },
    lng:{
        type: String,
        required: [true, "Please specify the gym's location"]
    },

}, {
    timestamps: true
});


module.exports = mongoose.model('Gym', gymSchema);