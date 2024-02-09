const { string } = require("joi")
const mongoose = require("mongoose")
const bcrypt = require("bcrypt")

const Schema = mongoose.Schema

const verificationSchema = new Schema({
    userId:{type:String},
    uniqueString:{type:String},
    createdAt:{type:Date},
    expiresAt:{type:Date}
})

userVerificationSchema.pre("save", async function(next){
    const hash = await bcrypt.hash(this.uniqueString, 10)
    this.uniqueString = hash
    next()
})

module.exports = mongoose.model("verifications", verificationSchema)