const Rack = require(`../models/rackModel`);
// const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');


exports.createRack = factory.createOne(Rack)
