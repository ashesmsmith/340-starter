// Assignment 4 - Task 2
const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}
const invModel = require("../models/inventory-model")

/* ***************************
*  Add New Classification Name Validation Rules
* ************************** */
validate.classificationRules = () => {
    return [
        // classification name must be a sting with only letters
        body("classification_name")
            .trim()
            .escape()
            .notEmpty()
            .isAlpha(['en-US'])
            .withMessage("Please provide a valid classification name.")
            .custom(async (classification_name) => {
                const nameExists = await invModel.checkExistingClassification(classification_name)
                if (nameExists) {
                    throw new Error("Classification already exists. Please enter a different name.")
                }
            })
    ]
}

/* ***************************
*  Check data and return errors or continue to Add Classification Name
* ************************** */
validate.checkClassificationData = async (req, res, next) => {
    const { classification_name } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("inventory/add-classification", {
            errors,
            title: "Add New Classification",
            nav,
            classification_name,
        })
        return
    }
    next()
}

/* ***************************
*  Add New Inventory Validation Rules
* ************************** */
validate.inventoryRules = () => {
    return [
        //inv_make letters only
        body("inv_make")
            .trim()
            .escape()
            .notEmpty()
            .isAlpha(['en-US'])
            .withMessage("Please provide a make."),

        //inv_model
        body("inv_model")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("Please provide a model."),
        
        //inv_year numeric 4 digit limit
        body("inv_year")
            .trim()
            .escape()
            .notEmpty()
            .isNumeric()
            .isLength({min: 4, max: 4})
            .withMessage("Please provide a year."),

        //inv_description
        body("inv_description")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("Please provide a description."),

        //inv_image
        body("inv_image")
            .trim()
            .notEmpty()
            .withMessage("Please provide a image path."),

        //inv_thumbnail
        body("inv_thumbnail")
            .trim()
            .notEmpty()
            .withMessage("Please provide a thumbnail path."),

        //inv_price numeric with decimal
        body("inv_price")
            .trim()
            .escape()
            .notEmpty()
            .isNumeric()
            .withMessage("Please provide a price."),

        //inv_miles numeric
        body("inv_miles")
            .trim()
            .escape()
            .notEmpty()
            .isNumeric()
            .withMessage("Please provide the miles."),

        //inv_color letters only
        body("inv_color")
            .trim()
            .escape()
            .notEmpty()
            .isAlpha(['en-US'])
            .withMessage("Please provide a color."),

        //classification_id
        body("classification_id")
            .notEmpty()
            .withMessage("Please provide a classification."),
    ]
}

/* ***************************
*  Check data and return errors or continue to Add Inventory
* ************************** */
validate.checkInventoryData = async (req, res, next) => {
    const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, 
        inv_price, inv_miles, inv_color, classification_id } = req.body;

    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        let classificationList = await utilities.buildClassificationList(classification_id)
        res.render("inventory/add-inventory", {
            errors,
            title: "Add New Inventory",
            nav,
            classificationList,
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
        })
        return
    }
    next()
}

/* ***************************
*  Check data and return errors or continue to Edit Inventory
* ************************** */
validate.checkUpdateData = async (req, res, next) => {
    const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, 
        inv_price, inv_miles, inv_color, classification_id, inv_id } = req.body;

    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        let classificationSelect = await utilities.buildClassificationList(classification_id)
        const itemName = `${inv_make} ${inv_model}`
        res.render("inventory/edit-inventory", {
            errors,
            title: "Edit " + itemName,
            nav,
            classificationSelect,
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
        return
    }
    next()
}

module.exports = validate
