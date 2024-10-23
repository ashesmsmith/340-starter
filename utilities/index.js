const invModel = require("../models/inventory-model")
const acctModel = require("../models/account-model")
const Util = {}
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ***************************
*  Constructs the nav HTML unordered list
* ************************** */
Util.getNav = async function (req, res, next) {
    let data = await invModel.getClassifications()
    let list = "<ul>"
    list += '<li><a href="/" title="Home page">Home</a></li>'
    data.rows.forEach((row) => {
        list += "<li>"
        list +=
            '<a href="/inv/type/' +
            row.classification_id +
            '" title="See our inventory of ' +
            row.classification_name +
            ' vehicles">' +
            row.classification_name +
            "</a>"
        list += "</li>"
        })
    list += "</ul>"
    return list
}

/* ***************************
*  Build the classification view HTML
*  Week 3 - Learning Activity 1 - Step 3
* ************************** */
Util.buildClassificationGrid = async function(data) {
    let grid
    if(data.length > 0){
        grid = '<ul id="inv-display">'
        data.forEach(vehicle => { 
            grid += '<li>'
            grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
            + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
            + 'details"><img src="' + vehicle.inv_thumbnail 
            +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
            +' on CSE Motors"></a>'
            grid += '<div class="namePrice">'
            grid += '<h2>'
            grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
            + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
            + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
            grid += '</h2>'
            grid += '<span>$' 
            + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
            grid += '</div>'
            grid += '</li>'
        })
        grid += '</ul>'
    } 
    else { 
        grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
    }
    return grid
}

/* ***************************
*  Build the single view HTML
*  Assignment 3 - Task 1 - #2 > #4
* ************************** */
Util.buildSingleView = async function(vehicle) {
    let singleView = `
    <img class='inv-id-image' src='${vehicle.inv_image}' alt='${vehicle.inv_make} ${vehicle.inv_model}'>
    <div class='inv-id-view'>
        <h2>$${new Intl.NumberFormat('en-US').format(vehicle.inv_price)} USD</h2>
        <h3>${new Intl.NumberFormat('en-US').format(vehicle.inv_miles)} miles</h3>
        <p>${vehicle.inv_description}</p>
    </div>`

    return singleView
}

/* ***************************
*  Build the classification list for add-inventory view
*  Assignment 4 - Task 3
* ************************** */
Util.buildClassificationList = async function (classification_id = null) {
    try {
        let data = await invModel.getClassifications()
        let classificationList =
            '<select name="classification_id" id="classificationList" required>'
        classificationList += "<option value=''>Choose a Classification</option>"
        data.rows.forEach((row) => {
            classificationList += '<option value="' + row.classification_id + '"'
            if (
                classification_id != null &&
                row.classification_id == classification_id
            ) {
                classificationList += " selected "
            }
            classificationList += ">" + row.classification_name + "</option>"
        })
        classificationList += "</select>"
        
        return classificationList
    }
    catch (error) {
        throw error;
    }
}

/* ***************************
*  Middleware For Handling Errors
*  Wrap other function in this for general error handling
* ************************** */
Util.handleErrors = fn => (req, res, next) => 
    Promise.resolve(fn(req, res, next)).catch(next)

/* ***************************
*  Middleware - Check Token Validity
*  Week 5 - Learning Activity 1 - Step 2
* ************************** */
Util.checkJWTToken = (req, res, next) => {
    if (req.cookies.jwt) {
        jwt.verify(
            req.cookies.jwt,
            process.env.ACCESS_TOKEN_SECRET,
            function (err, accountData) {
                if (err) {
                    req.flash("Please log in")
                    res.clearCookie("jwt")
                    return res.redirect("/account/login")
                }
            res.locals.accountData = accountData
            res.locals.loggedIn = true
            next()
        })
    } 
    else {
        next()
    }
}

/* ***************************
*  Middleware - Check Login
*  Week 5 - Learning Activity 1 - Step 3
* ************************** */
Util.checkLogin = (req, res, next) => {
    if (res.locals.loggedIn) {
        next()
    } 
    else {
        req.flash("notice", "Please login.")
        return res.redirect("/account/login")
    }
}

/* ***************************
*  Middleware - Admin or Employee Required
*  Assignment 5 - Task 2
* ************************** */
Util.requireAdminOrEmployee = (req, res, next) => {
    const accountData = req.session.accountData;
    // If the account type is Admin or Employee continue to page
    if (accountData && (accountData.accountType === "Admin" || 
        accountData.account_type === "Employee")) {
        next();
    } 
    // Otherwise deny access
    else {
        req.flash("notice", "Page Access Denied.");
        return res.redirect("/account/login");
    }
}

/* ***************************
*  Build the review section on single view
*  Assignment 6
* ************************** */
Util.buildReviewSection = async function (inv_id) {
    try {
        let data = await invModel.getReviews(inv_id)

        let reviewSection = `<div id="reviews">
            <h3>Reviews</h3>`

        if (data) {
            data.rows.forEach((row) => {
                reviewSection += `<div>
                    <h4>${row.review_title}</h4>
                    <p>${row.review_text}</p>
                    <p><i>${row.review_name}</i></p>
                    </div>`
            })
        }

        reviewSection += `<a href="../add-review/${inv_id}"><button type="submit">Add New Review</button></a>
            </div>`
        
        return reviewSection
    }
    catch (error) {
        throw error;
    }
}

module.exports = Util
