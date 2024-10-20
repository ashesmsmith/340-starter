// Assignment 5 - Task 5
const accountModel = require("../../models/account-model")
const email = document.querySelector("#account_email")

email.addEventListener("change", function () {
    const emailExists = accountModel.checkExistingEmail(email)
    if (emailExists) {
        throw new Error("Email already exists.")
    }
})
