require("dotenv").config();
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
const expressLayouts = require("express-ejs-layouts");
const { checkUser } = require("./middlewares/auth.middleware");

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var paymentsRouter = require("./routes/payments");

var app = express();
app.use(cors());

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(expressLayouts);
app.set("layout", "layouts/layout");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static("public"));

app.use(checkUser);
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/payments", paymentsRouter);

// Middleware to handle errors
app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

// Error handling middleware
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Something went wrong";
  const description =
    status === 404
      ? "The page you are looking for does not exist."
      : "There was an error processing your request.";

  res.status(status).render("error", {
    errorStatus: status,
    errorMessage: message,
    errorDescription: description,
  });
});

module.exports = app;
