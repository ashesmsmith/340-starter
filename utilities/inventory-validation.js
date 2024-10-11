// Assignment 4 - Task 2
const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}
const invModel = require("../models/inventory-model")

/* **********************************
*  Add New Classification Name Validation Rules
* ********************************* */
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

/* ******************************
*  Check data and return errors or continue to add Classification Name
* ***************************** */
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

module.exports = validate
