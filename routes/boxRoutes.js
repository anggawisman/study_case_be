const express = require('express');
const boxController = require('../controllers/boxController');

const router = express.Router();

router.route('/').post(boxController.createBox).get(boxController.getAllBoxs)

// GET PRODUCT FROM API
router.route('/:productCode/scan').get(boxController.scanBarcode)

module.exports = router;
