const mongoose = require('mongoose');


const rackSchema = new mongoose.schema(
    {
        rackCode: {
            type: String,
            unique: true,
            required: [true, 'A Rack must have a Code']
        },
        coordinate: {
            required: [true, 'A Rack must have a coordinate'],
            x: {
                type: Number,
                required: [true, 'A Rack must have a coordinate X'],
            },
            Y: {
                type: Number,
                required: [true, 'A Rack must have a coordinate Y'],
            },
        },
        index: Number,
        content: {
            type: mongoose.Schema.ObjectId,
            ref: 'Box',
        },
    }
)




const Rack = mongoose.model('Rack', rackSchema);
module.exports = Rack;
