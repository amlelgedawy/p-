const { Product } = require("../models/Product");
const { User } = require("../models/User");

async function wishlistController(req, res) {
  try {
    let user = req.user;
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    if (user.wishlist.includes(product._id)) {
      user.wishlist = user.wishlist.filter(
        (item) => item.toString() !== product._id.toString()
      );
      await user.save();
      return res.status(200).json({
        success: true,
        message: "Product removed from wishlist",
      });
    }
    user.wishlist.push(product._id);
    await user.save();
    return res.status(200).json({
      success: true,
      message: "Product added to wishlist",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "INTERNAL SERVER ERROR",
    });
  }
}

async function getWishlistController(req, res) {
  try {
    const user = req.user;
    const products = await User.findById(user._id).populate("wishlist");
    return res.status(200).json(products);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "INTERNAL SERVER ERROR",
    });
  }
}

async function cartController(req, res) {
  try {
    let user = req.user;
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    if (user.cart.includes(product._id)) {
      user.cart = user.cart.filter(
        (item) => item.toString() !== product._id.toString()
      );
      await user.save();
      return res.status(200).json({
        success: true,
        message: "Product removed from cart",
      });
    }
    user.cart.push(product._id);
    await user.save();
    return res.status(200).json({
      success: true,
      message: "Product added to cart",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "INTERNAL SERVER ERROR",
    });
  }
}

async function getCartController(req, res) {
  try {
    const user = req.user;
    const products = await User.findById(user._id).populate("cart");
    const totalPrice = products.cart.reduce((acc, item) => acc + item.price, 0);
    const cart = {
      products: products.cart,
      total: totalPrice,
    };
    return res.status(200).json(cart);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "INTERNAL SERVER ERROR",
    });
  }
}

module.exports = {
  wishlistController,
  getWishlistController,
  cartController,
  getCartController,
};
