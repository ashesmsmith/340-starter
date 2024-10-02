const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 *  Week 3 - Learning Activity 1 Step 3
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)
    const grid = await utilities.buildClassificationGrid(data)
    let nav = await utilities.getNav()
    const className = data[0].classification_name
    res.render("./inventory/classification", {
        title: className + " vehicles",
        nav,
        grid,
    })
}

/* ***************************
 *  Build inventory by single view
 *  Assignment 3 Task 1 - #2 > #2
 * ************************** */
invCont.buildBySingleView = async function (req, res, next) {
    const inv_id = req.params.inv_id
    const data = await invModel.getInventoryByInvId(inv_id)
    const singleView = await utilities.buildSingleView(data)
    let nav = await utilities.getNav()
    const vehicleName = `${data[0].inv_year} ${data[0].inv_make} ${data[0].inv_model}`
    res.render("./inventory/inv_id", {
        title: vehicleName,
        nav,
        singleView,
    })
}

module.exports = invCont