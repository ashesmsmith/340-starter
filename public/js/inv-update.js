// Week 5 - Learning Activity 2 - Step 3
const form = document.querySelector("#updateForm")
    
form.addEventListener("change", function () {
    const updateBtn = document.querySelector("button")
    updateBtn.removeAttribute("disabled")
})
