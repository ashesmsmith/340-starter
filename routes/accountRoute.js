// Needed Resources
// Week 4 - Learning Activity 1 - Step 2
const express = require("express")
const router =  new express.Router()
const utilities = require("../utilities/index")
const acctController = require("../controllers/acctController")
const regValidate = require("../utilities/account-validation")

// Login Route
router.get("/login", utilities.handleErrors(acctController.buildLogin));

// Registration Route
// Week 4 - Learning Activity 1 - Step 3
router.get("/register", utilities.handleErrors(acctController.buildRegister));

// Account Management Route
// Week 5 - Learning Activity 1 - Step 2
router.get("/", utilities.checkLogin, utilities.handleErrors(acctController.buildAccountManagement));

// Registration POST
// Week 4 - Learning Activity 1 - Step 4
// Week 4 - Learning Activity 2 - Step 3
router.post("/register", 
    regValidate.registrationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(acctController.registerAccount));

// Login POST - Process the login attempt - Temporary Use Only
// Week 4 - Team Activity - Step 4
// Week 5 - Learning Activity 1 - Step 2
router.post("/login",
    regValidate.loginRules(),
    regValidate.checkLoginData,
    utilities.handleErrors(acctController.accountLogin));

module.exports = router;
