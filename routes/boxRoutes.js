const express = require('express');
const boxController = require('../controllers/boxController');

const router = express.Router();

router.get('/', boxController.getAllBoxes)

// INBOUND CREATE BOX WITH PRODUCT DATA FROM API
router.post('/inbound/product/:productCode/station/:station', boxController.inbound)
router.patch('/outbound/product/:productCode/station/:station', boxController.outbound)

module.exports = router;
