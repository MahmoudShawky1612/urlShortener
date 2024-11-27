const mongoose = require('mongoose');
const validator = require('validator')

const AuthSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Username must not be empty"],
        trim: true,
    },
    email: {
        type: String,
        required: [true, "Email must not be empty",validator.isEmail],
        trim: true,
        validate:[validator.isEmail,"field must be a valid email"]
    },
    password: {
        type: String,
        required: [true, "Password must not be empty"],
        trim: true,
    },
    token:{
        type:String
    }
}, { versionKey: false });

module.exports = mongoose.model('Auth', AuthSchema);
