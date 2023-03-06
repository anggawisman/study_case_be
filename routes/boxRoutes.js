const express = require("express");
const boxController = require("../controllers/boxController");
const authController = require("../controllers/authController");

const router = express.Router();

router.get("/", boxController.getAllBoxes);
router
    .route('/:id')
    .get(boxController.getBox)

router.use(authController.protect);

// INBOUND CREATE BOX WITH PRODUCT DATA FROM API
router.post("/product/:productCode", boxController.inbound);

// API ROBOT CALLING
router.patch("/:boxCode/inbound/station/:stationName", boxController.callRobotInbound);
router.patch("/:boxCode/outbound/station/:stationName", boxController.callRobotOutbound);

// API RECEIVE ROBOT CALLBACK
router.patch("/:boxCode/robot/call-back", boxController.receiveRobotCallback);

// OUTBOUND WITH UPDATE THE PRODUCT

module.exports = router;
