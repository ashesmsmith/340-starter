const errCont = {}

// Create Error
// Week 3 - Assignment 3 Task 3
errCont.throwError = async function (req, res, next) {
    try {
        brokenFunction();
    }
    catch (error){
        next(error)
    }
}

module.exports = errCont