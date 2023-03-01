const express = require('express');
const boxController = require('../controllers/boxController');

const router = express.Router();

router.get('/', boxController.getAllBoxes)

// INBOUND CREATE BOX WITH PRODUCT DATA FROM API
router.post('/product/:productCode', boxController.inbound)

// API ROBOT CALLING
router.patch('/:boxCode/inbound/station/:stationName/rack/:rackCode', boxController.callRobot)

// API RECEIVE ROBOT CALLBACK
router.patch('/:boxCode/inbound/rack/:rackCode/robot/call-back', boxController.receiveRobotCallback)

// OUTBOUND WITH UPDATE THE PRODUCT
router.patch('/:boxCode/outbound/station/:stationName', boxController.outbound)

module.exports = router;
