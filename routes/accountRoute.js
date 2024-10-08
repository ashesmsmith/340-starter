// Week 4 - Learning Activity 1 - Step 2
const express = require("express")
const router =  new express.Router
const utilities = require("../utilities")
const acctController = require("../controllers/acctController")

// Login Route
router.get("/login", utilities.handleErrors(acctController.buildLogin));

// Registration Route
// Week 4 - Learning Activity 1 - Step 3
router.get("/register", utilities.handleErrors(acctController.buildRegister));

module.exports = router;
