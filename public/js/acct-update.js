// Assignment 5 - Task 5
const email = document.querySelector("#account_email")

email.addEventListener("change", async function (email) {
    const emailExists = await accountModel.checkExistingEmail(email)
    if (emailExists) {
        throw new Error("Email already exists. Please use different email")
    }
})