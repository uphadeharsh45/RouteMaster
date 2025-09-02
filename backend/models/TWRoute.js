const mongoose = require('mongoose')

const locationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    latitude: {
        type: Number,
        required: true
    },
    longitude: {
        type: Number,
        required: true
    },
    startTime: String,
    endTime: String,
    phoneNumber: String,
});

const twrouteSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    locations: [locationSchema],
});

const TWRoute = mongoose.model('twroute', twrouteSchema);

module.exports = TWRoute;

