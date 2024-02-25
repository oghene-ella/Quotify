const userModel = require("../model/user");

const createUser = async (req, res) => {
    try {
        const userInfo = {
            username: req.body.username,
            email: req.body.email,
            dob: req.body.dob
        };

        // Basic validation
        if (!userInfo.username || !userInfo.email || !userInfo.dob) {
            throw new Error("Missing required fields.");
        }

        const existingUser = await userModel.findOne({ email: userInfo.email });

        if (existingUser) {
            throw new Error("User already exists.");
        }

        const newUser = await userModel.create(userInfo);
        await newUser.save();
        
        return res.status(201).send({ message: "User created successfully.", user: newUser });
    } 
    catch (err) {
        // Log the error for debugging purposes
        console.error("Error creating user:", err);
        // Respond with a generic error message
        return res.status(500).json({ error: "Something went wrong. Please try again later." });
    }
};

module.exports = { createUser };
