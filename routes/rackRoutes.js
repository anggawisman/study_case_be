const express = require("express");
const rackController = require("../controllers/rackController");
const authController = require("../controllers/authController");

const router = express.Router();

// router.use('/:rack/reviews', reviewRouter);

router.route("/").post(authController.protect, authController.restrictTo("admin"), rackController.createRack).get(authController.protect, rackController.getAllRacks);

router.route("/empty").get(rackController.viewAllEmptyRacks);
router.route("/filled").get(rackController.viewAllEmptyRacks);

module.exports = router;
