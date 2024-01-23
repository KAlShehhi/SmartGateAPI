const mongoose = require('mongoose');

const capacityHistorySchema = mongoose.Schema({
    gymID:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Gym'
    },
    currentPeopleCount:{
        type: String,
        require: true
    }
}, {timestamps: true});

module.exports = mongoose.model('CapacityHistory', capacityHistorySchema);