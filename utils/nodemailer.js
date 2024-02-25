const nodemailer = require("nodemailer")
require("dotenv").config()

const sendEmail = async(option)=>{
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth:{
        user:process.env.USER_EMAIL,
        pass:process.env.USER_PASS
    }
})
    await transporter.sendMail({
      from:process.env.USER_EMAIL,
      to:option.email,
      subject:option.subject,
      html:option.html  
    })
}

module.exports = {sendEmail}