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
            errors: null,
            classificationSelect,
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
*  Add New Classification
*  Assignment 4 - Task 2
* ************************** */
invCont.addNewClassification = async function (req, res) {
    const { classification_name } = req.body
    const result = await invModel.addClassification(classification_name)
    let nav = await utilities.getNav()
    const classificationSelect = await utilities.buildClassificationList()

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
        classificationSelect,
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
            errors: null,
            classificationList,
        })
    }
    catch (error) {
        console.error("buildAddInventoryView error" + error)
    }
}

/* ***************************
*  Add New Inventory
*  Assignment 4 - Task 3
* ************************** */
invCont.addNewInventory = async function (req, res) {
    const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, 
        inv_price, inv_miles, inv_color, classification_id } = req.body
    
    const result = await invModel.addInventory(inv_make, inv_model, inv_year, 
        inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, 
        classification_id)

    let nav = await utilities.getNav()
    const classificationSelect = await utilities.buildClassificationList()

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
        classificationSelect,
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

/* ***************************
*  Inventory Editor View
*  Week 5 - Learning Activity 2 - Step 2
* ************************** */
invCont.buildInventoryEditorView = async function (req, res, next) {
    try {
        const inv_id = parseInt(req.params.inv_id)
        let nav = await utilities.getNav()
        const itemData = await invModel.getInventoryByInvId(inv_id)
        const classificationSelect = await utilities.buildClassificationList(itemData.classification_id)
        const itemName = `${itemData.inv_make} ${itemData.inv_model}`
        res.render("./inventory/edit-inventory", {
            title: "Edit " + itemName,
            nav,
            errors: null,
            classificationSelect: classificationSelect,
            inv_id: itemData.inv_id,
            inv_make: itemData.inv_make,
            inv_model: itemData.inv_model,
            inv_year: itemData.inv_year,
            inv_description: itemData.inv_description,
            inv_image: itemData.inv_image,
            inv_thumbnail: itemData.inv_thumbnail,
            inv_price: itemData.inv_price,
            inv_miles: itemData.inv_miles,
            inv_color: itemData.inv_color,
            classification_id: itemData.classification_id
        })
    }
    catch (error) {
        console.error("buildInventoryEditorView error" + error)
    }
}

/* ***************************
*  Update Inventory
*  Week 5 - Learning Activity 2 - Step 3
* ************************** */
invCont.updateInventory = async function (req, res) {
    const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, 
        inv_price, inv_miles, inv_color, classification_id, inv_id } = req.body
    
    const result = await invModel.updateInventory(inv_make, inv_model, inv_year, 
        inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, 
        classification_id, inv_id)

    let nav = await utilities.getNav()

    if (result) {
        const itemName = result.inv_make + " " + result.inv_model
        req.flash("notice", `${itemName} has been successfully updated!`)
        res.redirect("/inv/")
    }
    else {
        const classificationSelect = await utilities.buildClassificationList(classification_id)
        const itemName = result.inv_make + " " + result.inv_model
        req.flash("notice", `${itemName} update failed.`)
        res.status(501).render("inventory/edit-inventory", {
            title: "Edit " + itemName,
            nav,
            errors: null,
            classificationSelect: classificationSelect,
            inv_make,
            inv_model,
            inv_year,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_miles,
            inv_color,
            classification_id,
            inv_id,
        })
    }
}

module.exports = invCont
