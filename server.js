require("dotenv").config();

const express = require("express");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const colors = require("colors");
const path = require("path");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const { requireAuth, checkUser } = require("./middleware/authMiddleware");

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

app.use(morgan("dev"));

app.set("view engine", "ejs");

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.get("*", checkUser);
app.get("/", (req, res) => res.render("home"));
app.get("/smoothies", requireAuth, (req, res) => res.render("smoothies"));

app.use(authRoutes);

app.listen(PORT, () => {
  console.log(`Listening on ${PORT} on ${process.env.NODE_ENV}`.yellow.bold);
});
