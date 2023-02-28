const express = require('express');
const rackController = require('../controllers/rackController');


const router = express.Router();



router.route('/scan/:id').get(rackController.getProductDetail)