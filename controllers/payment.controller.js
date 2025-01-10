const { Order } = require("../models/Order");
const { User } = require("../models/User");

async function checkoutController(req, res) {
  try {
    console.log(req);
    const user = req.user;
    const userObj = await User.findById(user._id).populate("cart");
    const totalPrice = userObj.cart.reduce((acc, item) => acc + item.price, 0);
    const cart = {
      products: userObj.cart,
      total: totalPrice,
    };
    const paymobAuth = await fetch(`${process.env.PAYMOB_AUTH_URL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: `${process.env.PAYMOB_USERNAME}`,
        password: `${process.env.PAYMOB_PASSWORD}`,
      }),
    });
    if (!paymobAuth.ok) {
      return res.json({ success: false, message: "UNAUTHORIZED" });
    }
    const paymobAuthJson = await paymobAuth.json();
    const paymobAuthAccessToken = paymobAuthJson.token;
    if (!paymobAuthAccessToken) {
      return res.json({ success: false, message: "UNAUTHORIZED" });
    }
    const input = {
      amount_cents: cart.total * 100,
      expires_at: new Date("2025-12-31"),
      full_name: user.name,
      email: user.email,
    };
    const paymentLink = await fetch(`${process.env.PAYMOB_QUICK_LINK_URL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${paymobAuthAccessToken}`,
      },
      body: JSON.stringify({
        ...input,
        is_live: process.env.PAYMOB_STATUS === "LIVE" ? true : false,
        payment_methods: [Number(process.env.PAYMOB_INTEGRATION_ID)],
      }),
    });
    if (!paymentLink.ok) {
      return res.json({ success: false, message: "BAD_REQUEST" });
    }
    const paymentRes = await paymentLink.json();
    console.log(paymentRes);
    const order = new Order({
      products: userObj.cart,
      user: user._id,
      total: cart.total,
      shippingAddress: req.body.shippingAddress,
      transactionId: paymentRes.order.toString(),
    });
    await order.save();
    userObj.cart = [];
    userObj.orders.push(order._id);
    await userObj.save();
    paymentRes.success = true;
    return res.status(200).json(paymentRes);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "INTERNAL SERVER ERROR",
    });
  }
}

async function webhookController(req, res) {
  try {
    console.log(req);
    let order = await Order.findOne({
      transactionId: req.body.obj.order.id.toString(),
    });
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "ORDER NOT FOUND",
      });
    }
    console.log(order);
    order.paymentStatus = "paid";
    await order.save();
    console.log(order);
    return res
      .status(200)
      .json({ success: true, message: "PAYMENT SUCCESSFUL" });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "INTERNAL SERVER ERROR",
    });
  }
}

module.exports = { checkoutController, webhookController };
