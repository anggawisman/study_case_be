const mongoose = require('mongoose');


const rackSchema = new mongoose.Schema(
    {
        rackCode: {
            type: String,
            unique: true,
            required: [true, 'A Rack must have a Code']
        },
        coordinate: {
            x: {
                type: Number,
                required: [true, 'A Rack must have a coordinate X'],
            },
            y: {
                type: Number,
                required: [true, 'A Rack must have a coordinate Y'],
            },
        },
        index: Number,
        content: {
            type: mongoose.Schema.ObjectId,
            ref: 'Box',
            // required: [true, 'Box must belong to a Rack.'],

        },
    }
)




const Rack = mongoose.model('Rack', rackSchema);
module.exports = Rack;
