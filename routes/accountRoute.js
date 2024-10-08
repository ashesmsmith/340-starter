// Week 4 - Learning Activity 1 - Step 2
const express = require("express")
const router =  new express.Router
const utilities = require("../utilities")
const acctController = require("../controllers/acctController")
const regValidate = require("../utilities/account-validation")

// Login Route
router.get("/login", utilities.handleErrors(acctController.buildLogin));

// Registration Route
// Week 4 - Learning Activity 1 - Step 3
router.get("/register", utilities.handleErrors(acctController.buildRegister));


// Registration POST
// Week 4 - Learning Activity 1 - Step 4
// Week 4 - Learning Activity 2 - Step 3
router.post("/register", 
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(acctController.registerAccount));

module.exports = router;
