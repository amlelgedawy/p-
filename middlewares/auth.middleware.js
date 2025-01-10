const checkUser = (req, res, next) => {
  console.log("flag");
  res.locals.user = {
    token: req.cookies.token,
    name: req.cookies.username,
    email: req.cookies.userEmail,
    id: req.cookies.userId,
  };
  next();
};

module.exports = { checkUser };
