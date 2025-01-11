var express = require("express");
const {
  createProduct,
  deleteProduct,
} = require("../controllers/products.controller");
const { Product } = require("../models/Product");
const {
  registerController,
  loginController,
} = require("../controllers/auth.controller");
const { User } = require("../models/User");
var router = express.Router();

/* GET home page. */
router.get("/", async function (req, res, next) {
  try {
    const products = await Product.find()
      .sort({ createdAt: -1, rating: 1 })
      .skip(4)
      .limit(4);
    const newCollection = await Product.find()
      .sort({ createdAt: -1, rating: 1 })
      .limit(4);
    const userObj = res.locals.user;
    if (userObj.token) {
      let user = await User.findById(userObj.id)
        .populate("cart")
        .populate("wishlist");
      const totalPrice = user.cart.reduce((acc, item) => acc + item.price, 0);
      const cart = {
        products: user.cart,
        total: totalPrice,
      };
      res.locals.user.cart = cart;
      res.locals.user.wishlist = user.wishlist;
    }
    return res.render("index", {
      products,
      newCollection,
      cart: res.locals.user.cart,
      wishlist: res.locals.user.wishlist,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return res.status(500).render("error", {
      errorStatus: 500,
      errorMessage: error.message,
      errorDescription: "Something went wrong",
    });
  }
});

router.get("/products", async (req, res) => {
  try {
    const userObj = res.locals.user;
    if (userObj.token) {
      let user = await User.findById(userObj.id)
        .populate("cart")
        .populate("wishlist");
      const totalPrice = user.cart.reduce((acc, item) => acc + item.price, 0);
      const cart = {
        products: user.cart,
        total: totalPrice,
      };
      res.locals.user.cart = cart;
      res.locals.user.wishlist = user.wishlist;
    }
    if (req.query.collection) {
      const products = await Product.find({ collection: req.query.collection });
      return res.render("products", {
        products,
        title: req.query.collection,
        cart: res.locals.user.cart,
        wishlist: res.locals.user.wishlist,
      });
    }
    const products = await Product.find();
    return res.render("products", {
      products,
      title: "All Products",
      cart: res.locals.user.cart,
      wishlist: res.locals.user.wishlist,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return res.status(500).render("error", {
      errorStatus: 500,
      errorMessage: error.message,
      errorDescription: "Something went wrong",
    });
  }
});

router.post("/product", createProduct);

router.post("/auth/signup", registerController);
router.post("/auth/login", loginController);

module.exports = router;
