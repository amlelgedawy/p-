var express = require("express");
const {
	cartController,
	getCartController,
	wishlistController,
	getWishlistController,
	getProfile,
	updateProfile,
	getOrders,
	updateOrder,
	deleteOrder,
} = require("../controllers/user.controller");
const UserPrivileges = require("../middlewares/isUser");
var router = express.Router();

router.post("/cart/:id", UserPrivileges, cartController);
router.get("/cart", UserPrivileges, getCartController);
router.post("/wishlist/:id", UserPrivileges, wishlistController);
router.get("/wishlist", UserPrivileges, getWishlistController);

router.get("/profile", UserPrivileges, getProfile);
router.post("/profile/update", UserPrivileges, updateProfile);
router.get("/orders", UserPrivileges, getOrders);
router.post("/orders/:id/edit", UserPrivileges, updateOrder);
router.post("/orders/:id/delete", UserPrivileges, deleteOrder);

module.exports = router;
