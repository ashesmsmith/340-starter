// Needed Resources
// Week 3 - Learning Activity 1 - Step 3
const express = require("express")
const router = new express.Router()
const utilities = require("../utilities")
const invController = require("../controllers/invController")
const invValidate = require("../utilities/inventory-validation")

// Route to Classification View - build inventory by classification_id
// Week 3 - Learning Activity 1 - Step 3
router.get("/type/:classificationId", 
    utilities.handleErrors(invController.buildByClassificationId));

// Route to Single View - build inventory by inv_id
// Assignment 3 - Task 1
router.get("/detail/:inv_id", 
    utilities.handleErrors(invController.buildByInvId));

// Route to Inventory Management View
// Assignment 4 - Task 1
// Assignment 5 - Task 2
router.get('/', 
    utilities.checkLogin, 
    utilities.requireAdminOrEmployee,
    utilities.handleErrors(invController.buildManagementView));

// Route to Add New Classification
// Assignment 4 - Task 2
// Assignment 5 - Task 2
router.get("/add-classification", 
    utilities.checkLogin, 
    utilities.requireAdminOrEmployee,
    utilities.handleErrors(invController.buildAddClassificationView));

// Route to Add New Inventory
// Assignment 4 - Task 3
// Assignment 5 - Task 2
router.get("/add-inventory", 
    utilities.checkLogin, 
    utilities.requireAdminOrEmployee,
    utilities.handleErrors(invController.buildAddInventoryView));

// Route to Manage Inventory by Classification Id
// Week 5 - Learning Activity 2 - Step 1
router.get("/getInventory/:classification_id", 
    utilities.handleErrors(invController.getInventoryJSON));

// Route to Edit Inventory by Inventory Id
// Week 5 - Learning Activity 2 - Step 2
router.get("/edit/:inv_id", 
    utilities.handleErrors(invController.buildInventoryEditorView));

// Route to Delete Inventory by Inventory Id
// Week 5 - Team Activity - Step 1
router.get("/delete/:inv_id", 
    utilities.handleErrors(invController.buildDeleteConfirmationView));

// Route to Add a Review
// Assignment 6
router.get("/add-review/:inv_id",
    utilities.checkLogin,
    utilities.handleErrors(invController.buildAddReviewView));


// Add Classification POST
// Assignment 4 - Task 2
// Assignment 5 - Task 2
router.post("/add-classification", 
    utilities.checkLogin, 
    utilities.requireAdminOrEmployee,
    invValidate.classificationRules(),
    invValidate.checkClassificationData,
    utilities.handleErrors(invController.addNewClassification));

// Add Inventory POST
// Assignment 4 - Task 3
// Assignment 5 - Task 2
router.post("/add-inventory", 
    utilities.checkLogin, 
    utilities.requireAdminOrEmployee,
    invValidate.inventoryRules(),
    invValidate.checkInventoryData,
    utilities.handleErrors(invController.addNewInventory));

// Edit Inventory POST
// Week 5 - Learning Activity 2 - Step 3
// Assignment 5 - Task 2
router.post("/update/",
    utilities.checkLogin, 
    utilities.requireAdminOrEmployee,
    invValidate.inventoryRules(),
    invValidate.checkUpdateData,
    utilities.handleErrors(invController.updateInventory));

// Delete Inventory POST
// Week 5 - Team Activity - Step 1
// Assignment 5 - Task 2
router.post("/delete/", 
    utilities.checkLogin, 
    utilities.requireAdminOrEmployee,
    utilities.handleErrors(invController.deleteInventory));

// Add Review POST
// Assignment 6
router.post("/add-review",
    utilities.checkLogin,
    invValidate.reviewRules(),
    invValidate.checkReviewData,
    utilities.handleErrors(invController.addNewReview));

module.exports = router;
