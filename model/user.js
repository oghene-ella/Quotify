const mongoose = require("mongoose")

const Schema = mongoose.Schema

const userSchema = new Schema({
    fullName:{type:String},
    email:{type:String},
    dateOfBirth:{type:Date}
})

module.exports = mongoose.model("users", userSchema)