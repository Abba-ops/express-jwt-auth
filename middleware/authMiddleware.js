const jwt = require("jsonwebtoken");
const User = require("../models/User");

const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt_token;
  if (token) {
    jwt.verify(token, process.env.SECRET, (err, decodedToken) => {
      if (err) {
        return res.redirect("/login");
      } else {
        next();
      }
    });
  } else {
    return res.redirect("/login");
  }
};

const checkUser = (req, res, next) => {
  const token = req.cookies.jwt_token;
  if (token) {
    jwt.verify(token, process.env.SECRET, async (err, decodedToken) => {
      if (err) {
        res.locals.user = null;
        next();
      } else {
        let user = await User.findById(decodedToken.id);
        res.locals.user = user;
        next();
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};

module.exports = {
  checkUser,
  requireAuth,
};
