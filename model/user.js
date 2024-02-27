const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: { type: String },
    email: { type: String },
    dob: {
        type: Date,
    }
});

const UserModel = mongoose.model("users", userSchema);
module.exports = UserModel;
