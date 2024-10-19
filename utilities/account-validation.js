/* Week 4 - Learning Activity 2 - Step 3 */
const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}
const accountModel = require("../models/account-model")

/* ***************************
*  Set loggedIn value
*  Assignment 5 - Task 1
* ************************** */
validate.checkAuthentication = (req, res, next) => {
    res.locals.loggedIn = req.session.loggedIn || false
    res.locals.accountData = req.session.accountData || {}
    next()
}

/* ***************************
*  Registration Data Validation Rules
* ************************** */
validate.registrationRules = () => {
    return [
        // firstname is required and must be string
        body("account_firstname")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 1 })
            .withMessage("Please provide a first name."), // on error this message is sent.

        // lastname is required and must be string
        body("account_lastname")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 2 })
            .withMessage("Please provide a last name."), // on error this message is sent.

        // valid email is required and cannot already exist in the DB
        body("account_email")
            .trim()
            .escape()
            .notEmpty()
            .isEmail()
            .normalizeEmail() // refer to validator.js docs
            .withMessage("A valid email is required.")
            .custom(async (account_email) => { // Week 4 - Team Activity - Step 1
                const emailExists = await accountModel.checkExistingEmail(account_email)
                if (emailExists) {
                    throw new Error("Email exists. Please log in or use different email")
                }
            }),

        // password is required and must be strong password
        body("account_password")
            .trim()
            .notEmpty()
            .isStrongPassword({
                minLength: 12,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 1,
            })
            .withMessage("Password does not meet requirements."),
    ]
}

/* ***************************
*  Check data and return errors or continue to Registration
* ************************** */
validate.checkRegData = async (req, res, next) => {
    const { account_firstname, account_lastname, account_email } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("account/register", {
            errors,
            title: "Registration",
            nav,
            account_firstname,
            account_lastname,
            account_email,
        })
        return
    }
    next()
}

/* ***************************
*  Login Data Validation Rules
*  Week 4 - Team Activity - Step 4
* ************************** */
validate.loginRules = () => {
    return [
        // valid email is required
        body("account_email")
            .trim()
            .escape()
            .notEmpty()
            .isEmail()
            .normalizeEmail() // refer to validator.js docs
            .withMessage("Please provide a valid email address.")
            .custom(async (account_email) => {
                const emailExists = await accountModel.checkExistingEmail(account_email)
                if (!emailExists){
                    throw new Error("No account found. Please register or use different email")
                }
            }),

        // valid password is required
        body("account_password")
            .trim()
            .notEmpty()
            .isStrongPassword({
                minLength: 12,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 1,
            })
        .withMessage("Password is incorrect."),
    ]
}

/* ***************************
*  Check data and return errors or continue to login
*  Week 4 - Team Activity - Step 4
* ************************** */
validate.checkLoginData = async (req, res, next) => {
    const { account_email } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("account/login", {
            errors,
            title: "Login",
            nav,
            account_email,
        })
        return
    }
    next()
}

/* ***************************
*  Update Account Validation Rules
*  Assignment 5 - Step 4
* ************************** */
validate.updateRules = () => {
    return [
        // firstname is required and must be string
        body("account_firstname")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 1 })
            .withMessage("Please provide a first name."), // on error this message is sent.

        // lastname is required and must be string
        body("account_lastname")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 2 })
            .withMessage("Please provide a last name."), // on error this message is sent.

        // valid email is required
        body("account_email")
            .trim()
            .escape()
            .notEmpty()
            .isEmail()
            .normalizeEmail() // refer to validator.js docs
            .withMessage("Please provide a valid email address."),
    ]
}

/* ***************************
*  Check data and return errors or continue update
*  Assignment 5 - Task 4
* ************************** */
validate.checkUpdateData = async (req, res, next) => {
    const { account_firstname, account_lastname, account_email } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("account/update", {
            errors,
            title: "Update Account Information",
            nav,
            account_firstname,
            account_lastname,
            account_email,
        })
        return
    }
    next()
}

/* ***************************
*  Update Password Validation Rules
*  Assignment 5 - Step 4
* ************************** */
validate.updatePasswordRules = () => {
    return [
        // password is required and must be strong password
        body("account_password")
            .trim()
            .notEmpty()
            .isStrongPassword({
                minLength: 12,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 1,
            })
            .withMessage("Password does not meet requirements."),
    ]
}

/* ***************************
*  Check data and return errors or continue password update
*  Assignment 5 - Task 4
* ************************** */
validate.checkUpdatePasswordData = async (req, res, next) => {
    const { account_password } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("account/update", {
            errors,
            title: "Update Account Information",
            nav,
            account_password,
        })
        return
    }
    next()
}

module.exports = validate
