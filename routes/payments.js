const express = require("express");
const {
  checkoutController,
  webhookController,
} = require("../controllers/payment.controller");
const UserPrivileges = require("../middlewares/isUser");
var router = express.Router();

router.get("/checkout", UserPrivileges, (req, res) => {
  const totalPrice = req.user.cart.reduce((acc, item) => acc + item.price, 0);
  res.render("checkout", {user: req.user, cart: req.user.cart, total: totalPrice});
});
router.post("/checkout", UserPrivileges, checkoutController);
router.post("/webhook", webhookController);

module.exports = router;
