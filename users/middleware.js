const joi = require("joi")

const validateUserInput = (req,res,next)=>{
    try{
        const userSchema = joi.object({
            userName:joi.string().required(),
            email:joi.string().email().required(),
            dateOfBirth:joi.string().required()
        })
    
        userSchema.validate(req.body, {abortEarly:true})

        next()

    }catch(err){
        res.json({
            error:err.message
        })
    }
   
}

module.exports = {validateUserInput}
