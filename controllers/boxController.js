const Box = require(`../models/boxModel`);
const Rack = require(`../models/rackModel`);
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');
const axios = require("axios")



// COMMON FUNCTION USE FACTORY(handlerFactory)
// Check notes from Sir Irwin to explain how it works
exports.createBox = factory.createOne(Box)
exports.getAllBoxes = factory.getAll(Box)


// CUSTOM FUNCTION LOGIC
// Here custom logic for scan barcode we use the param :productCode from URL to get data from others DB use API
exports.inbound = catchAsync(async (req, res, next) => {
    // const { productCode, station } = req.params;
    const { productCode } = req.params;

    let productDetail = await axios.get(`http://172.16.101.213:9073/datapart/barcode?barcode=${productCode}`)
    productDetail = productDetail.data

    const inboundBox = await Box.create({
        boxCode: `BC${new Date().toISOString()}`,
        product: {
            productCode: productDetail.boxCode,
            modelName: productDetail.modelName,
            nameComponent: productDetail.nameComponent,
            material: productDetail.material
        },
        // in_station: station.split('-').join(" ").toUpperCase(),
        status: "process",

        // CHECK THIS OUT
        lastCallBy: "-"

    })

    res.status(201).json({
        status: 'success',
        data: { inboundBox }
    });

})

exports.callRobot = catchAsync(async (req, res, next) => {
    // DEFINE PARAMS FROM URL
    const { boxCode, stationName, rackCode } = req.params;

    // VARIABLE FOR DATA THAT WILL PASS TO CALL ROBOT
    const location = {
        source: stationName,
        destination: rackCode.toUpperCase(),
        taskCode: `TC${new Date().toISOString()}`
    }

    // CALLING ROBOT: PASS DATA FOR ROBOT TO IDENTIFY SOURCE AND DESTINATION
    const callRobot = await axios.post(`http://172.16.101.213:9073/robot/sendRobotTask`, location).then(response => response.data)

    if (callRobot === "OK") {

        // UPDATE BOX DATA
        const updateBox = await Box.findOneAndUpdate({ boxCode: boxCode, in_station: stationName.split('-').join(" ").toUpperCase() })


        res.status(200).json({
            status: 'success',
            data: { location, Box: updateBox }
        });
    }
})


exports.receiveRobotCallback = catchAsync(async (req, res, next) => {

    // DEFINE PARAMS FROM URL
    const { boxCode, rackCode } = req.params;

    // do {
    //     // VARIABLE TO GET STATUS FROM API SO IF API RES.STATUS 200 WILL NEXT TO OTHERS TASK
    //     const config = {
    //         method: 'head',
    //         url: 'http://172.16.101.213:9073/robot/sendRobotTask'
    //     }

    //     receiveRobotStatus = await axios.get(config)
    // }
    // while (!receiveRobotStatus.status === 200);


    if (req.body.status === "finished") {

        // UPDATE BOX DATA
        const updateBox = await Box.findOneAndUpdate({ boxCode: boxCode, status: "in_storage", })
        // UPDATE RACK DATA
        const updateRack = await Rack.findOneAndUpdate({ rackCode: rackCode.toUpperCase(), content: updateBox._id, })


        res.status(200).json({
            status: 'success',
            data: { updateBox, updateRack }
        });
    }
})




exports.outbound = catchAsync(async (req, res, next) => {
    const { productCode, station } = req.params;

    const outboundBox = await Box.findOneAndUpdate({})
})