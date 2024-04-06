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
    phoneNumber:{
        type: String,
        required: [true, 'Please add a phone number']
    },
    allowedGenders:{
        type: String, //M or F or MI
        required: [true, 'Please specify allowed genders']
    },
    workingHours:{
        type: String, //{OPEN TIME}/{CLOSETIME}/{DAYS} EG: 0700AM/1130PM/OOOOOCO if(247 == 24/7)
        required: [true, 'Please specify working hours']
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
    emirate:{
        type: String,
        required : [true, "Please add an emirate"]
    },
    googleMapsLink:{
        type: String,
        required: [true, 'Please add a link']
    },
    lat:{
        type: String,
        required: [true, "Please specify the gym's location"]
    },
    lng:{
        type: String,
        required: [true, "Please specify the gym's location"]
    },
    swimmingPool:{
        type: Boolean,
        required: false,
        default: false,
    },
    crossfit:{
        type: Boolean,
        required: false,
        default: false,
    },
    cafe:{
        type: Boolean,
        required: false,
        default: false,
    },
    restaurant:{
        type: Boolean,
        required: false,
        default: false,
    },
    sauna:{
        type: Boolean,
        required: false,
        default: false,
    },
    icebath:{
        type: Boolean,
        required: false,
        default: false,
    },
    lockers:{
        type: Boolean,
        required: false,
        default: false,
    },
    changingRooms:{
        type: Boolean,
        required: false,
        default: false,
    },
    coaches:{
        type: Boolean,
        required: false,
        default: false,
    },
    freeCoaches:{
        type: Boolean,
        required: false,
        default: false,
    },
    description:{
        type:String,
        required: true,
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
}, {
    timestamps: true
});


module.exports = mongoose.model('Gym', gymSchema);