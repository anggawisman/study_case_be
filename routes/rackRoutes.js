const express = require('express');
const rackController = require('../controllers/rackController');


const router = express.Router();


// router.use('/:rack/reviews', reviewRouter);


router.route('/').post(rackController.createRack).get(rackController.getAllRacks)

router.route('/empty').get(rackController.viewAllEmptyRacks)
router.route('/filled').get(rackController.viewAllEmptyRacks)

module.exports = router;
