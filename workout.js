var mongoose = require('mongoose');

var Workout = mongoose.model('Workout', {
    workoutId: {
        type: String,
        required: true,
    },
    user: {
        type: String,
        required: true,
    },
    datetime: {
        type: Date,
        required: true,
    },
    length: {
        type: Number,
        required: true,
    },
    work: {
        type: Number,
        required: true,
    },


});

module.exports = {Workout};
