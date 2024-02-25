const express = require("express")
const middleware = require("./middleware")
const controller = require("./controller")


const userRouter = express.Router()

userRouter.get("/createUser",(req, res)=>{
    const message = req.flash("messageKey")
    res.render("create_user", {message})
})
userRouter.post("/createUser", middleware.validateUserInput, controller.createUser)

module.exports = userRouter