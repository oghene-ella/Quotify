const userModel = require("../model/user")

const createUser = async (req,res)=>{
    try{
        const userInfo = {
            userName:req.body.userName,
            email:req.body.email,
            dateOfBirth:req.body.dateOfBirth
        }

        const existingUser = await userModel.findOne({email:userInfo.email})

        if(existingUser){
        const message = "User already exist"
            return res.redirect(`/error/${message}`) 
        }

        const newUser = await userModel.create({
            userName:userInfo.userName,
            email:userInfo.email,
            dateOfBirth:userInfo.dateOfBirth
        })
        
    }
        catch(err){
            return res.redirect(`/error/${err.message}`)
        }
}


module.exports = {createUser}