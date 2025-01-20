const { User } = require("../models/User");
const { Admin } = require("../models/Admin");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
//validate
async function loginController(req, res) {
	try {
		const { email, password } = req.body;

		const admin = await Admin.findOne({ email });
		const user = await User.findOne({ email });

		if (!admin && !user) {
			return res.status(404).json({
				success: false,
				message: "User or Admin not found",
			});
		}
               
		const isAdmin = !!admin;
		const account = admin || user;

		let isPasswordValid;
		if (isAdmin) {
			isPasswordValid = password === account.password;
		} else {
			isPasswordValid = await bcrypt.compare(password, account.password);
		}

		if (!isPasswordValid) {
			return res.status(401).json({
				success: false,
				message: "Wrong email or password",
			});
		}

		const tokenSecret = isAdmin
			? process.env.JWT_ADMIN_SECRET
			: process.env.JWT_USER_SECRET;
		const redirectPath = isAdmin ? "/admin/dashboard" : "/users/profile";

		const token = jwt.sign(
			{
				_id: account._id,
				email: account.email,
				role: isAdmin ? "admin" : "user",
			},
			tokenSecret,
			{ expiresIn: process.env.JWT_USER_EXPIRATION }
		);

		return res.status(200).json({
			success: true,
			user: {
				_id: account._id,
				email: account.email,
				name: isAdmin ? null : account.name,
				role: isAdmin ? "admin" : "user",
			},
			token,
			redirect: redirectPath,
		});
	} catch (error) {
		console.error("Login Error:", error);
		return res.status(500).json({
			success: false,
			message: "INTERNAL SERVER ERROR",
		});
	}
}

async function registerController(req, res) {
	try {
		const { email, password, name, phone, address } = req.body;

		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res.status(400).json({
				success: false,
				message: "Email is already in use.",
			});
		}

		const hashedPassword = await bcrypt.hash(password, 10);
		const user = new User({
			email,
			password: hashedPassword,
			name,
			phone,
			address,
		});
		await user.save();

		const token = jwt.sign({ _id: user._id }, process.env.JWT_USER_SECRET, {
			expiresIn: "1h",
		});

		res.status(201).json({
			success: true,
			token,
			user: {
				_id: user._id,
				name: user.name,
				email: user.email,
			},
		});
	} catch (error) {
		console.error("Signup Error:", error);
		res.status(500).json({
			success: false,
			message: "Internal server error.",
		});
	}
}

module.exports = { loginController, registerController };
