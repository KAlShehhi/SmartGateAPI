const mongoose = require('mongoose');

const gymStatisticsSchema = mongoose.Schema({
    gymID:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Gym'
    },
    currentPeople:{
        type: String,
        required: false
    },
    totalVistisToday:{
        type: String,
        required: false,
    },
    totalVistis:{
        type: String,
        required: false
    }
});

module.exports = mongoose.model('GymStatistics', gymStatisticsSchema);