const mongoose = require('mongoose');

const classModel = mongoose.Schema({
    gymID:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Gym'
    },
    name: {
        type: String,
        required: [true, 'Please add a name']
    },
    startTime:{
        type: String,
        required: [true, "Please add a start time to the class"]
    },
    classDuration: {
        type: String,
        required: [true, 'Please add the clas duration']
    },
    days:{
        type: String,
        required: [true, 'Please specify the days that the class would be scheduled at']
    },
    trainerName:{
        type: String,
        required: [false]
    }
});