// Needed Resources
// Week 3 - Learning Activity 1 - Step 3
const express = require("express")
const router = new express.Router()
const utilities = require("../utilities")
const invController = require("../controllers/invController")
const invValidate = require("../utilities/inventory-validation")

// Route to Classification View - build inventory by classification_id
// Week 3 - Learning Activity 1 - Step 3
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to Single View - build inventory by inv_id
// Assignment 3 - Task 1
router.get("/detail/:inv_id", utilities.handleErrors(invController.buildByInvId));

// Route to Inventory Management View
// Assignment 4 - Task 1
router.get('/', utilities.handleErrors(invController.buildManagementView));

// Route to Add New Classification
// Assignment 4 - Task 2
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassificationView));

// Route to Add New Inventory
// Assignment 4 - Task 3
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventoryView));

// Route to Manage Inventory by Id
// Week 5 - Learning Activity 2 - Step 1
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON));

// Add Classification POST
// Assignment 4 - Task 2
router.post("/add-classification", 
    invValidate.classificationRules(),
    invValidate.checkClassificationData,
    utilities.handleErrors(invController.addNewClassification));

// Add Inventory POST
// Assignment 4 - Task 3
router.post("/add-inventory", 
    invValidate.inventoryRules(),
    invValidate.checkInventoryData,
    utilities.handleErrors(invController.addNewInventory));

module.exports = router;
