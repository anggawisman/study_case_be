const express = require('express');
const rackController = require('../controllers/rackController');


const router = express.Router();



router.route('/').post(rackController.createRack).get(rackController.getAllRacks)

module.exports = router;
