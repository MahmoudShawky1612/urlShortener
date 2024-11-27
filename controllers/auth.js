const Auth = require('../models/auth');
const bcrypt = require('bcryptjs');
const generateToken  = require('../utils/generateToken');



const signUp = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ status: "Fail", data: { msg: "All fields are required" } });
        }

        const findUser = await Auth.findOne({ email });
        if (findUser) {
            return res.status(400).json({ status: "Fail", data: { msg: "There's already a user with that email" } });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await Auth.create(
            req.body,
        );
        
        //generate token
        const token = await generateToken({email: user.email, username: user.username})
        user.token = token;
        return res.status(201).json({ 
            msg: "Successfully created an account", 
            data: { user }, 
            success: true 
        });

    } catch (error) {
        console.error("Error during signup:", error);
        return res.status(500).json({ status: "Fail", data: { msg: "Internal server error" } });
    }
};

const signIn = 
    async (req, res) => {
        const { email, password } = req.body;

        const findUser = await Auth.findOne({ email: email });

        if (!findUser) {
            return res.status(400).json({ status: "Fail", data: { msg: "Check your email and password" } });

        }
        const isMatch = await bcrypt.compare(password, findUser.password);

        if (!isMatch) {
            return res.status(400).json({ status: "Fail", data: { msg: "Check your email and password" } });

        }
        const token = await generateToken({email: findUser.email, username: findUser.username})
        findUser.token = token;
        return res.status(201).json({ 
            msg: "Successfully logged in", 
            data: { findUser }, 
            success: true 
        });
    }

module.exports = {
    signUp,
    signIn
};
