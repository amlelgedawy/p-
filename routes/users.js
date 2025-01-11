var express = require("express");
const {
  cartController,
  getCartController,
  wishlistController,
  getWishlistController,
} = require("../controllers/user.controller");
const UserPrivileges = require("../middlewares/isUser");
var router = express.Router();

router.post("/cart/:id", UserPrivileges, cartController);
router.get("/cart", UserPrivileges, getCartController);
router.post("/wishlist/:id", UserPrivileges, wishlistController);
router.get("/wishlist", UserPrivileges, getWishlistController);

module.exports = router;
