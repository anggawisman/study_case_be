const Box = require(`../models/boxModel`);
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');
const axios = require("axios")


exports.createBox = factory.createOne(Box)
exports.getAllBoxs = factory.getAll(Box)


exports.scanBarcode = catchAsync(async (req, res, next) => {
    // Because in the API the identifier is boxCode so here I use boxCode for productCode
    // if (!req.body.boxCode) req.body.boxCode = req.params.productCode;

    const productCode = await axios.get(`http://172.16.101.213:9073/datapart/barcode?barcode=${req.params.productCode}`)

    console.log(productCode)
    res.status(200).json({
        status: 'success',
        data: {
            productCode,
        },
    });
})