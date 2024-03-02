const mongoose = require('mongoose');

const classSchema = mongoose.Schema({
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
    endTime: {
        type: String,
        required: [true, 'Please add a end time to the class']
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

module.exports = mongoose.model('Class', classSchema);