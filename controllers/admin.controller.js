const { Product } = require("../models/Product");
const { User } = require("../models/User");
const { Order } = require("../models/Order");
const bcrypt = require("bcrypt");
const getDashboard = async (req, res) => {
	try {
		const userCount = await User.countDocuments();
		const productCount = await Product.countDocuments();
		const orderCount = await Order.countDocuments();

		res.render("dashboard", {
			userCount,
			productCount,
			orderCount,
			layout: false,
		});
	} catch (error) {
		console.error("Error loading dashboard:", error);
		res.status(500).send("Error loading admin dashboard.");
	}
};

const getUsers = async (req, res) => {
	try {
		const page = parseInt(req.query.page) || 1;

		const limit = 8;

		const skip = (page - 1) * limit;

		const totalUsers = await User.countDocuments();

		const users = await User.find().skip(skip).limit(limit);

		const totalPages = Math.ceil(totalUsers / limit);

		res.render("users", {
			users,
			currentPage: page,
			totalPages,
			layout: false,
		});
	} catch (error) {
		console.error("Error fetching users:", error);
		res.status(500).send("Internal Server Error");
	}
};

const deleteUser = async (req, res) => {
	try {
		const userId = req.params.id;

		const deletedUser = await User.findByIdAndDelete(userId);

		if (!deletedUser) {
			return res.status(404).send("User not found.");
		}

		res.redirect("/admin/users");
	} catch (error) {
		console.error("Error deleting user:", error);
		res.status(500).send("Internal Server Error");
	}
};

const editUserPage = async (req, res) => {
	try {
		const userId = req.params.id;

		const user = await User.findById(userId);

		if (!user) {
			return res.status(404).send("User not found.");
		}

		res.render("editUser", { user, layout: false });
	} catch (error) {
		console.error("Error fetching user details:", error);
		res.status(500).send("Internal Server Error");
	}
};

const updateUser = async (req, res) => {
	try {
		const userId = req.params.id;
		const { name, email, phone, address } = req.body;

		const updatedUser = await User.findByIdAndUpdate(
			userId,
			{ name, email, phone, address },
			{ new: true, runValidators: true }
		);

		if (!updatedUser) {
			return res.status(404).send("User not found.");
		}

		res.redirect("/admin/users");
	} catch (error) {
		console.error("Error updating user:", error);
		res.status(500).send("Internal Server Error");
	}
};

// View all products
const getProducts = async (req, res) => {
	try {
		const products = await Product.find();
		res.render("prodadm", { products, layout: false });
	} catch (error) {
		console.error("Error fetching products:", error);
		res.status(500).send("Internal Server Error");
	}
};

// Render product creation form
const getProductForm = (req, res) => {
	res.render("new-product", { layout: false });
};

const createProduct = async (req, res) => {
	try {
		const { name, price, collection, rating } = req.body;

		const newProduct = new Product({
			name,
			price,
			image: req.file ? `/uploads/${req.file.filename}` : "",
			collection,
			rating: rating || 5,
		});

		await newProduct.save();
		res.redirect("/admin/products");
	} catch (error) {
		console.error("Error creating product:", error);
		res.status(500).send("Internal Server Error");
	}
};

// Render product edit form
const getEditProductForm = async (req, res) => {
	try {
		const product = await Product.findById(req.params.id);

		if (!product) {
			return res.status(404).send("Product not found.");
		}

		res.render("edit-product", { product, layout: false });
	} catch (error) {
		console.error("Error fetching product:", error);
		res.status(500).send("Internal Server Error");
	}
};

const updateProduct = async (req, res) => {
	try {
		const { name, price, description, collection } = req.body;
		let updateFields = { name, price, description, collection };

		if (req.file) {
			updateFields.image = `/uploads/${req.file.filename}`;
		}

		const updatedProduct = await Product.findByIdAndUpdate(
			req.params.id,
			updateFields,
			{ new: true, runValidators: true }
		);

		if (!updatedProduct) {
			return res.status(404).send("Product not found.");
		}

		res.redirect("/admin/products");
	} catch (error) {
		console.error("Error updating product:", error);
		res.status(500).send("Internal Server Error");
	}
};

const deleteProduct = async (req, res) => {
	try {
		const deletedProduct = await Product.findByIdAndDelete(req.params.id);

		if (!deletedProduct) {
			return res.status(404).send("Product not found.");
		}

		res.redirect("/admin/products");
	} catch (error) {
		console.error("Error deleting product:", error);
		res.status(500).send("Internal Server Error");
	}
};

const getOrders = async (req, res) => {
	try {
		const orders = await Order.find()
			.populate("user", "name email")
			.populate("products", "name price");

		const page = parseInt(req.query.page) || 1;
		const limit = 5;
		const totalOrders = await Order.countDocuments();
		const totalPages = Math.ceil(totalOrders / limit);

		const paginatedOrders = await Order.find()
			.populate("user", "name email")
			.populate("products", "name price")
			.skip((page - 1) * limit)
			.limit(limit);
		console.log(orders);
		res.render("orders", {
			orders: paginatedOrders,
			page,
			totalPages,
			layout: false,
		});
	} catch (error) {
		console.error("Error fetching orders:", error);
		res.status(500).send("Internal Server Error");
	}
};

const updateOrderStatus = async (req, res) => {
	try {
		const { orderId } = req.params;
		const { status } = req.body;

		const updatedOrder = await Order.findByIdAndUpdate(
			orderId,
			{ status },
			{ new: true, runValidators: true }
		);

		if (!updatedOrder) {
			return res.status(404).send("Order not found.");
		}

		res.status(200).json({ success: true, message: "Status updated." });
	} catch (error) {
		console.error("Error updating order status:", error);
		res.status(500).json({
			success: false,
			message: "Internal Server Error",
		});
	}
};

// Delete an order
const deleteOrder = async (req, res) => {
	try {
		const deletedOrder = await Order.findByIdAndDelete(req.params.id);

		if (!deletedOrder) {
			return res.status(404).send("Order not found.");
		}

		res.redirect("/admin/orders");
	} catch (error) {
		console.error("Error deleting order:", error);
		res.status(500).send("Internal Server Error");
	}
};

// Create a new order (Page and Submission)
const createOrderPage = async (req, res) => {
	try {
		const products = await Product.find({}, "name _id price");
		const users = await User.find({}, "name email");
		res.render("createOrder", { products, users, layout: false });
	} catch (error) {
		console.error("Error loading create order page:", error);
		res.status(500).send("Internal Server Error");
	}
};

const createOrder = async (req, res) => {
	try {
		const {
			user,
			products,
			total,
			status,
			paymentStatus,
			shippingStatus,
			shippingAddress,
		} = req.body;

		const newOrder = new Order({
			user,
			products,
			total,
			status,
			paymentStatus,
			shippingStatus,
			shippingAddress,
		});

		await newOrder.save();
		res.redirect("/admin/orders");
	} catch (error) {
		console.error("Error creating order:", error);
		res.status(500).send("Internal Server Error");
	}
};

const createUser = async (req, res) => {
	try {
		const { name, email, password, phone, address } = req.body;

		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res.status(400).send("User with this email already exists.");
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		const newUser = new User({
			name,
			email,
			password: hashedPassword,
			phone,
			address,
		});

		await newUser.save();

		res.redirect("/admin/users");
	} catch (error) {
		console.error("Error creating user:", error);
		res.status(500).send("Internal Server Error");
	}
};

module.exports = { createUser };

module.exports = {
	getDashboard,
	deleteUser,
	editUserPage,
	updateUser,
	getUsers,
	getProducts,
	getProductForm,
	createProduct,
	getEditProductForm,
	updateProduct,
	deleteProduct,
	getOrders,
	updateOrderStatus,
	deleteOrder,
	createOrderPage,
	createOrder,
	createUser,
};
