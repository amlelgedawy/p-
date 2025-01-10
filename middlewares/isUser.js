const jwt = require("jsonwebtoken");
const { User } = require("../models/User");

async function UserPrivileges(req, res, next) {
  try {
    if (!res.locals.user.token) {
      // return res.status(401).json("FORBIDDEN");
      return res.redirect("/");
    }
    const token = res.locals.user.token;
    const decoded = jwt.verify(token, process.env.JWT_USER_SECRET);
    const user = await User.findById(decoded._id)
      .select("-password")
      .populate("cart")
      .populate("wishlist")
      .populate("orders");
    if (!user) {
      // return res.status(401).json("FORBIDDEN");
      return res.redirect("/");
    }
    req.user = user;
    res.locals.user = {
      token: req.cookies.token,
      ...user,
    };
    next();
  } catch (error) {
    // return res.status(401).json("FORBIDDEN");
    return res.redirect("/");
  }
}

module.exports = UserPrivileges;
