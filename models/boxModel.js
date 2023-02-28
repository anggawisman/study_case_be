const mongoose = require('mongoose');


const boxSchema = new mongoose.Schema({
    boxCode: {
        type: String,
        unique: true,
        required: [true, 'A box must have a code'],
    },
    product: {
        // ref from the other DB boxCode
        // required: [true, 'A box must have a product'],
        productCode: String,
        modelName: String,
        nameComponent: String,
        material: String,
    },
    scan_dt: { type: Date, default: Date.now },
    in_station: String,
    release_dt: [Date],
    out_station: String,
    status: {
        type: String,
        required: [true, 'A box must have a status'],
        enum: {
            values: ['process', 'in_storage', 'out'],
            message: 'Status is either: process, in_storage, or out',
        },
    },
    lastCallBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Review must belong to a user.'],
    }
})



const Box = mongoose.model('Box', boxSchema);
module.exports = Box;