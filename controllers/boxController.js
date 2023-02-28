const Box = require(`../models/boxModel`);
const Rack = require(`../models/rackModel`);
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');
const axios = require("axios")




// COMMON FUNCTION
// Check notes from Sir Irwin to explain how it works
exports.createBox = factory.createOne(Box)
exports.getAllBoxes = factory.getAll(Box)




// CUSTOM LOGIC SO CAN NOT USE FACTORY(handlerFactory)
// Here custom logic for scan barcode we use the param :productCode from URL to get data from others DB use API
exports.inbound = catchAsync(async (req, res, next) => {
    const { productCode, station } = req.params;

    let productDetail = await axios.get(`http://172.16.101.213:9073/datapart/barcode?barcode=${productCode}`)
    productDetail = productDetail.data

    const inboundBox = await Box.create({
        boxCode: `BC${Date.now()}`,
        product: {
            productCode: productDetail.boxCode,
            modelName: productDetail.modelName,
            nameComponent: productDetail.nameComponent,
            material: productDetail.material
        },
        in_station: station.split('-').join(" ").toUpperCase(),
        status: "process",

        // CHECK THIS OUT
        lastCallBy: "-"

    })

    res.status(200).json({
        status: 'success',
        data: { inboundBox }
    });

})

exports.generateTask = catchAsync(async (req, res, next) => {

})

exports.outbound = catchAsync(async (req, res, next) => {
    const { productCode, station } = req.params;

    const outboundBox = await Box.findOneAndUpdate({})
})