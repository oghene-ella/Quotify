const mongoose = require("mongoose")
require("dotenv").config()

const connectToDataBase = ()=>{
    mongoose.connect(process.env.MONGO_URL)

    mongoose.connection.on("connected", ()=>{
        console.log("connection was successful")
    })

    mongoose.connection.on("error", (err)=>{
        console.log("connection unsuccessful", err.message)
    })
}

module.exports = {connectToDataBase}