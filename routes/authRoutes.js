const { Router } = require("express");
const router = Router();
const {
  login_get,
  signup_get,
  logout_get,
  login_post,
  signup_post,
} = require("../controllers/authController");

router.route("/signup").get(signup_get).post(signup_post);
router.route("/login").get(login_get).post(login_post);
router.get("/logout", logout_get);

module.exports = router;
