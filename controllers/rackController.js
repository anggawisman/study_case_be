const Rack = require(`../models/rackModel`);
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');


exports.createRack = factory.createOne(Rack)


exports.getAllRacks = factory.getAll(Rack)


exports.viewAllEmptyRacks = catchAsync(async (req, res, next) => {
    const rack = await Rack.find({ content: null })


    res.status(200).json({
        status: 'success',
        data: {
            rack,
        },
    });
})
exports.viewAllFilledRacks = catchAsync(async (req, res, next) => {
    const rack = await Rack.find({ content: { $ne: null } })


    res.status(200).json({
        status: 'success',
        data: {
            rack,
        },
    });
})