// const path = require('path');
const UserModel = require("../model/user");

const createUser = async (req, res) => {
    try {
        const { username, email, dob } = req.body;

        // Basic validation
        if (!username || !email || !dob) {
            return res.status(400).render("error", { error: "Missing required fields." });
        }

        // Check if the user already exists
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(400).render("birthday", { error: "Hey, You already exist.", 
            passage: "An email will be sent to you, on your special day! Once again, 'Happy Birthday'" });
        }

        // Create a new user
        const newUser = await UserModel.create({ username, email, dob });
        return res.status(201).render("birthday", { error: `Congratulations ${newUser.username}`, 
        passage: "An email will be sent to you, on your special day! Once again, 'Happy Birthday'" })
    } 
    catch (error) {
        console.error("Error creating user:", error);
        return res.status(500).render("error", { error: "Something went wrong. Please try again later." });
    }
};

module.exports = { createUser };