/*  Week 4 - Learning Activity 1 - Step 2, 3 & 4 */
const utilities = require("../utilities")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require ("dotenv").config()

/* ***************************
*  login View
* ************************** */
async function buildLogin (req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/login", {
        title: "Login",
        nav,
        errors: null,
    })
}

/* ***************************
*  Registration View
*  Week 4 - Learning Activity 1 - Step 3
* ************************** */
async function buildRegister (req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/register", {
        title: "Register",
        nav,
        errors: null,
    })
}

/* ***************************
*  Account Management View
*  Week 5 - Learning Activity 1 - Step 2
* ************************** */
async function buildAccountManagement (req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/account-management", {
        title: "Account Management",
        nav,
        errors: null,
    })
}

/* ***************************
*  Process Registration
*  Week 4 - Learning Activity 1 - Step 4
* ************************** */
async function registerAccount (req, res) {
    let nav = await utilities.getNav()
    const { account_firstname, account_lastname, account_email, account_password } = req.body

    // Week 4 - Team Activity - Step 5
    // Hash the password before storing
    let hashedPassword
    try {
        // regular password and cost (salt is generated automatically)
        hashedPassword = await bcrypt.hashSync(account_password, 10)
    } 
    catch (error) {
        req.flash("notice", 'Sorry, there was an error processing the registration.')
        res.status(500).render("account/register", {
        title: "Registration",
        nav,
        errors: null,
        })
    }

    const regResult = await accountModel.registerAccount(
        account_firstname,
        account_lastname,
        account_email,
        hashedPassword,
    )

    if (regResult) {
        req.flash(
            "notice",
            `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
        res.status(201).render("account/login", {
            title: "Login",
            nav,
            errors: null,
        })
    } 
    else {
        req.flash("notice", "Sorry, the registration failed.")
        res.status(501).render("account/register", {
            title: "Registration",
            nav,
            errors: null,
        })
    }
}

/* ***************************
*  Process Login
*  Week 5 - Learning Activity 1 - Step 2
* ************************** */
async function accountLogin (req, res) {
    let nav = await utilities.getNav()
    const { account_email, account_password } = req.body
    const accountData = await accountModel.getAccountByEmail(account_email)

    if (!accountData) {
        req.flash("notice", "Please check your credentials and try again.")
        res.status(400).render("account/login", {
            title: "Login",
            nav,
            errors: null,
            account_email,
        })
        return
    }

    try {
        // compare plain text password and hashed password from db for match
        if (await bcrypt.compare(account_password, accountData.account_password)) {
            //remove password from accountData
            delete accountData.account_password 

            // create JWT token - accountData used as payload - expires in 1hr
            const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, 
                { expiresIn: 3600 })
            
            // if environment (NODE_ENV from .env) is development is true, 
            // new cookie created and named "jwt"
            if(process.env.NODE_ENV === 'development') {
                res.cookie("jwt", accessToken, 
                    { httpOnly: true, maxAge: 3600 * 1000 })
            } 
            // if environment is not development, 
            // cookie can only be passed through secure connection (HTTPS)
            else {
                res.cookie("jwt", accessToken, 
                    { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
            }

            req.session.loggedIn = true; // account is logged in
            req.session.accountData = accountData;
            return res.redirect("/account/")
        }
        else {
            req.flash("notice", "Login Failed. Please check your credentials and try again.")
            return res.status(400).render("account/login", {
                title: "Login",
                nav, 
                errors: null,
                account_email,
            })
        }
    } 
    catch (error) {
        return new Error('Login Failed')
    }
}

/* ***************************
*  Account Update View
*  Assignment 5 - Task 3 
* ************************** */
async function buildAccountUpdate (req, res, next) {
    try {
        const account_id = parseInt(req.params.account_id)
        let nav = await utilities.getNav()
        const accountData = await accountModel.getAccountById(account_id)
        res.render("account/update", {
            title: "Update Account Information",
            nav,
            errors: null,
            account_firstname: accountData.account_firstname,
            account_lastname: accountData.account_lastname,
            account_email: accountData.account_email,
            account_id: accountData.account_id,
        })
    }
    catch (error) {
        console.error("buildAccountUpdate" + error)
    }
}

/* ***************************
*  Process Update Account
*  Assignment 5 - Task 5
* ************************** */
async function updateAccountInformation (req, res) {
    let nav = await utilities.getNav()
    const { account_firstname, account_lastname, account_email, account_id } = req.body
    
    const result = await accountModel.updateAccount(account_firstname, account_lastname,
        account_email, account_id)

    if(result) {
        req.flash("notice", "Account Information was successfully updated!")
        res.render("account/account-management", {
            title: "Account Management",
            nav,
            errors: null,
        })
    }
    else {
        req.flash("notice", "Update Failed. Please try again.")
        res.render("account/update", {
            title: "Update Account Information",
            nav,
            errors: null,
            account_firstname,
            account_lastname,
            account_email,
        })
    }
}

/* ***************************
*  Process Update Password
*  Assignment 5 - Task 5
* ************************** */
async function updateAccountPassword (req, res) {
    let nav = await utilities.getNav()
    const { account_password } = req.body

    let hashedPassword
    try {
        hashedPassword = await bcrypt.hashSync(account_password, 10)
    }
    catch (error) {
        req.flash("notice", 'Sorry, there was an error updating the password.')
        res.status(500).render("account/update", {
        title: "Account Update",
        nav,
        errors: null,
        })
    }

    const result = await accountModel.changePassword(account_password)

    if (result) {
        req.flash("notice", "Password was successfully updated!")
        res.render("account/update", {
            title: "Update Account Information",
            nav,
            errors: null
        })
    }
    else {
        req.flash("notice", "Password update failed.")
        res.render("account/update", {
            title: "Update Account Information",
            nav,
            errors: null
        })
    }
}

/* ***************************
*  Process Account Logout
*  Assignment 5 - Task 6
* ************************** */
async function logout (req, res) {
    try {
        res.clearCookie("jwt")
        res.clearCookie("sessionId")

        let nav = await utilities.getNav()
        res.render("index", {
            title: "Home",
            nav,
            errors: null,
        })
    }
    catch (error) {
        console.error("logout " + error)
    }
}

module.exports = { buildLogin, buildRegister, buildAccountManagement, 
    registerAccount, accountLogin, buildAccountUpdate, updateAccountInformation, 
    updateAccountPassword, logout }
