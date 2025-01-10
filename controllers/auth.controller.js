const { User } = require("../models/User");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

async function loginController(req, res) {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: "user not found" 
            });
        }
        if (!bcrypt.compare(req.body.password, user.password)) {
            return res.status(401).json({ 
                success: false, 
                message: "wrong email or password" 
            });
        }
        const token = jwt.sign(
            { _id: user._id, email: user.email },
            process.env.JWT_USER_SECRET,
            {
                expiresIn: process.env.JWT_USER_EXPIRATION,
            }
        );
        const userWithoutPassword = { ...user };
        delete userWithoutPassword._doc.password;
        return res.status(200).json({ 
            success: true,
            user: userWithoutPassword._doc, 
            token: token 
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ 
            success: false, 
            message: "INTERNAL SERVER ERROR" 
        });
    }
}

async function registerController(req, res) {
    try {
        const { email, password } = req.body;
        
        if(!email || !password) {
            return res.status(400).json({ success: false, message: "email and password are required" });
        }
        const user = await User.findOne({ email: email });
        if (user) {
            return res.status(400).json({ success: false, message: "user already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        req.body.password = hashedPassword;
        const newUser = await User.create(req.body);
        const token = jwt.sign(
          { _id: newUser._id, email: newUser.email },
          process.env.JWT_USER_SECRET,
          {
            expiresIn: process.env.JWT_USER_EXPIRATION,
          }
        );
        const userWithoutPassword = { ...newUser };
        delete userWithoutPassword._doc.password;
        return res.status(201).json({ user: userWithoutPassword._doc, token: token });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "INTERNAL SERVER ERROR" });
    }
}

module.exports = { loginController, registerController };
