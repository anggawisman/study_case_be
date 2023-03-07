// here we call the Box Model
const Box = require(`../models/boxModel`);
const Rack = require(`../models/rackModel`);
const catchAsync = require("../utils/catchAsync");
const factory = require("./handlerFactory");
const AppError = require("../utils/appError");
const axios = require("axios");

// For know it's not necessary
// exports.setUserIds = (req, res, next) => {
//     // It's allow nested routes
//     if (!req.body.user) req.body.user = req.user.id;

//     // After processing the request, it calls the next function to pass control to the next middleware function in the chain.
//     next();
// }


// COMMON FUNCTION USE FACTORY(handlerFactory)

//To define virtual populate 
exports.getBox = factory.getOne(Box, { path: "racks", select: "rackCode index -content" });
exports.getAllBoxes = factory.getAll(Box);

// CUSTOM FUNCTION LOGIC
// Here custom logic for scan barcode we use the param :productCode from URL to get data from others DB use API
exports.inbound = catchAsync(async (req, res, next) => {
    // const { productCode, station } = req.params;
    const { productCode } = req.params;

    let productDetail = await axios.get(`http://172.16.1.45:9073/datapart/barcode?barcode=${productCode}`);
    productDetail = productDetail.data;

    const inboundBox = await Box.create({
        boxCode: `BC${new Date().toISOString()}`,
        product: {
            productCode: productDetail.boxCode,
            modelName: productDetail.modelName,
            nameComponent: productDetail.nameComponent,
            material: productDetail.material,
        },
        status: "process",
        lastCallBy: req.user.id
    });

    res.status(201).json({
        status: "success",
        data: { inboundBox },
    });
});

exports.callRobotInbound = catchAsync(async (req, res, next) => {
    // DEFINE PARAMS FROM URL
    const { boxCode, stationName } = req.params;

    // DEFINE RACK THAT EMPTY AND THE LOWEST INDEX
    // const rack = await Rack.find({ content: null }).sort({ index: 1 }).limit(1);
    const rack = await Rack.defineRack();

    // PREVENT RACK FULL
    if (!rack.rackCode) { return next(new AppError("All Racks is full", 404)); }

    // VARIABLE FOR DATA THAT WILL PASS TO CALL ROBOT
    const location = {
        source: stationName,
        destination: rack[0].rackCode,
        taskCode: `TC${new Date().toISOString()}`,
    };

    // CALLING ROBOT: PASS DATA FOR ROBOT TO IDENTIFY SOURCE AND DESTINATION
    const callRobot = await axios.post(`http://172.16.1.45:9073/robot/sendRobotTask`, location).then((response) => response.data);

    if (callRobot === "OK") {
        // UPDATE BOX DATA
        const updateBox = await Box.findOneAndUpdate(
            { boxCode: boxCode },
            { in_station: stationName.split("-").join(" ").toUpperCase() },
            {
                // new option to true to return the document after update was applied.
                new: true,
            }
        );

        // Prevent if the
        if (!updateBox) {
            return next(new AppError("No Box found with that Box Code", 404));
        }

        res.status(200).json({
            status: "success",
            data: { robotResponse: callRobot, location, Box: updateBox },
        });
    }
});

exports.callRobotOutbound = catchAsync(async (req, res, next) => {
    // DEFINE PARAMS FROM URL
    const { boxCode, stationName } = req.params;

    const box = await Box.find({ boxCode: boxCode });
    // DEFINE RACK BY
    const rack = await Rack.find({ content: box._id });

    // VARIABLE FOR DATA THAT WILL PASS TO CALL ROBOT
    const location = {
        source: stationName,
        destination: rack.rackCode,
        taskCode: `TC${new Date().toISOString()}`,
    };

    // CALLING ROBOT: PASS DATA FOR ROBOT TO IDENTIFY SOURCE AND DESTINATION
    const callRobot = await axios.post(`http://172.16.1.45:9073/robot/sendRobotTask`, location).then((response) => response.data);

    if (callRobot === "OK") {
        // UPDATE BOX DATA
        const updateBox = await Box.findOneAndUpdate(
            { boxCode: boxCode },
            { out_station: stationName.split("-").join(" ").toUpperCase(), release_dt: new Date().toISOString(), lastCallBy: req.user.id, status: "process" },
            {
                // new option to true to return the document after update was applied.
                new: true,
            }
        );

        // Prevent if the
        if (!updateBox) {
            return next(new AppError("No Box found with that Box Code", 404));
        }

        res.status(200).json({
            status: "success",
            data: { robotResponse: callRobot, location, Box: updateBox },
        });
    }
});

exports.receiveRobotCallback = catchAsync(async (req, res, next) => {
    // DEFINE PARAMS FROM URL
    const { boxCode } = req.params;

    if (req.body.status === "finished" && req.body.activity === "inbound") {
        // DEFINE RACK THAT EMPTY AND THE LOWEST INDEX
        const rack = await Rack.find({ content: null }).sort({ index: 1 }).limit(1);

        // UPDATE BOX DATA
        const updateBox = await Box.findOneAndUpdate(
            { boxCode: boxCode },
            { status: "in_storage" },
            //   new option to true to return the document after update was applied.
            {
                new: true,
            }
        );

        // UPDATE RACK DATA
        const updateRack = await Rack.findOneAndUpdate(
            { rackCode: rack[0].rackCode },
            { content: updateBox._id },
            {
                // new option to true to return the document after update was applied.
                new: true,
            }
        );

        res.status(200).json({
            status: "success",
            data: { updateBox, updateRack },
        });
    } else if (req.body.status === "finished" && req.body.activity === "outbound") {
        // UPDATE BOX DATA
        const updateBox = await Box.findOneAndUpdate(
            { boxCode: boxCode },
            { status: "out" },
            {
                new: true,
            }
        );

        // UPDATE RACK DATA
        const updateRack = await Rack.findOneAndUpdate(
            { content: updateBox._id },
            { content: null },
            {
                // new option to true to return the document after update was applied.
                new: true,
            }
        );

        res.status(200).json({
            status: "success",
            data: { updateBox, updateRack },
        });
    }
});