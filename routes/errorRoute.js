// Needed Resources
// Week 3 - Assignment 3 Task 3
const express = require("express")
const router = new express.Router()
const errController = require("../controllers/errController")

router.get('/start', errController.throwError);

module.exports = router;
