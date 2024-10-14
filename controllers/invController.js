const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")
const invCont = {}

/* ***************************
*  Classification View - Build by Classification Id
*  Week 3 - Learning Activity 1 - Step 3
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
*  Single View - Build by Inventory Id
*  Assignment 3 - Task 1
* ************************** */
invCont.buildByInvId = async function (req, res, next) {
    const inv_id = req.params.inv_id
    const data = await invModel.getInventoryByInvId(inv_id)
    const singleView = await utilities.buildSingleView(data)
    let nav = await utilities.getNav()
    const vehicleName = `${data.inv_year} ${data.inv_make} ${data.inv_model}`
    res.render("./inventory/single", {
        title: vehicleName,
        nav,
        singleView,
    })
}

/* ***************************
*  Management View
*  Assignment 4 - Task 1
*  Week 5 - Learning Activity 2 - Step 1
* ************************** */
invCont.buildManagementView = async function (req, res, next) {
    try {
        let nav = await utilities.getNav()
        const classificationSelect = await utilities.buildClassificationList()
        res.render("./inventory/management", {
            title: "Inventory Management",
            nav,
            classificationSelect,
            errors: null,
        })
    }
    catch (error) {
        console.error("buildManagementView error" + error)
    }
}

/* ***************************
*  Add New Classification View
*  Assignment 4 - Task 2
* ************************** */
invCont.buildAddClassificationView = async function (req, res, next) {
    try {
        let nav = await utilities.getNav()
        res.render("./inventory/add-classification", {
            title: "Add New Classification",
            nav,
            errors: null,
        })
    }
    catch (error) {
        console.error("buildAddClassificationView error" + error)
    }
}

/* ***************************
*  Process Add New Classification
*  Assignment 4 - Task 2
* ************************** */
invCont.addNewClassification = async function (req, res) {
    const { classification_name } = req.body
    const result = await invModel.addClassification(classification_name)
    let nav = await utilities.getNav()

    if (result) {
        req.flash("notice", `${classification_name} has been successfully added!`)
    }
    else {
        req.flash("notice", `${classification_name} was not added. Please try again.`)
    }

    res.render("./inventory/management", {
        title: "Inventory Management",
        nav,
        errors: null,
    })
}

/* ***************************
*  Add New Inventory View
*  Assignment 4 - Task 3
* ************************** */
invCont.buildAddInventoryView = async function (req, res, next) {
    try {
        let nav = await utilities.getNav()
        let classificationList = await utilities.buildClassificationList()
        res.render("./inventory/add-inventory", {
            title: "Add New Inventory",
            nav,
            classificationList,
            errors: null,
        })
    }
    catch (error) {
        console.error("buildAddInventoryView error" + error)
    }
}

/* ***************************
*  Process Add New Inventory
*  Assignment 4 - Task 3
* ************************** */
invCont.addNewInventory = async function (req, res) {
    const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, 
        inv_price, inv_miles, inv_color, classification_id } = req.body
    
    const result = await invModel.addInventory(inv_make, inv_model, inv_year, 
        inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, 
        classification_id)

    let nav = await utilities.getNav()

    if (result) {
        req.flash("notice", `${inv_year} ${inv_make} ${inv_model} has been successfully added!`)
    }
    else {
        req.flash("notice", `${inv_year} ${inv_make} ${inv_model} was not added. Please try again.`)
    }

    res.render("./inventory/management", {
        title: "Inventory Management",
        nav,
        errors: null,
    })
}

/* ***************************
*  Return Inventory by Classification as JSON
*  Week 5 - Learning Activity 2 - Step 1
* ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
    const classification_id = parseInt(req.params.classification_id)
    const invData = await invModel.getInventoryByClassificationId(classification_id)
    if (invData[0].inv_id) {
        return res.json(invData)
    } 
    else {
        next(new Error("No data returned"))
    }
}

module.exports = invCont
