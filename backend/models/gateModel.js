const mongoose = require('mongoose');

const gateSchema = mongoose.Schema({
    gymID:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Gym'
    },
    name:{
        type: String,
        require: true
    },
    isActrive:{
        type: Boolean,
        required: true
    }
}, {timestamps: true});

module.exports = mongoose.model('Gate', gateSchema);