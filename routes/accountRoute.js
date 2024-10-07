// Week 4 - Learning Activity 1 - Step 2
const express = require("express")
const router =  new express.Router
const utilities = require("../utilities")
const acctController = require("../controllers/acctController")

router.get("/login", utilities.handleErrors(acctController.buildLogin));

module.exports = router;
