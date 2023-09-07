const User = require("../models/User");
const jwt = require("jsonwebtoken");

const maxAge = 3 * 24 * 60 * 60;

const handleErrors = (err) => {
  let errors = { email: "", password: "" };
  if (err.message === "Invalid email") {
    errors.email = "That email is invalid";
  }
  if (err.message === "Invalid password") {
    errors.password = "That password is invalid";
  }
  if (err.code === 11000) {
    errors.email = "That email is already registered";
    return errors;
  }
  if (err.message.includes("User validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }
  return errors;
};

const createToken = (id) => {
  return jwt.sign({ id }, process.env.SECRET, { expiresIn: maxAge });
};

const signup_post = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.create({ email, password });
    const token = createToken(user._id);
    res.cookie("jwt_token", token, {
      httpOnly: true,
      maxAge: maxAge * 1000,
    });
    res.json({ user: user._id });
  } catch (e) {
    const errors = handleErrors(e);
    res.status(400).json({ errors });
  }
};

const login_post = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    res.cookie("jwt_token", token, {
      httpOnly: true,
      maxAge: maxAge * 1000,
    });
    res.status(200).json({ user: user._id });
  } catch (error) {
    const errors = handleErrors(error);
    res.status(400).json({ errors });
  }
};

const logout_get = (req, res) => {
  res.clearCookie("jwt_token");
  res.redirect("/");
};

const signup_get = (req, res) => {
  res.render("signup");
};

const login_get = (req, res) => {
  res.render("login");
};

module.exports = {
  login_get,
  signup_get,
  logout_get,
  login_post,
  signup_post,
};
