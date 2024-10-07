// Needed Resources
// Week 3 - Learning Activity 1 Step 3
const express = require("express")
const router = new express.Router()
const utilities = require("../utilities")
const invController = require("../controllers/invController")

// Route to build inventory by classification_id - classification view
// Week 3 - Learning Activity 1 Step 3
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build inventory by inv_id - single view
// Assignment 3 Task 1- #2 > #1
// URL path found in utilities/index > buildClassificationGrid
router.get("/detail/:inv_id", utilities.handleErrors(invController.buildByInvId));

module.exports = router;
