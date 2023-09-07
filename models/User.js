const mongoose = require("mongoose");
const { isEmail } = require("validator");
const { Schema, model } = mongoose;
const bcrypt = require("bcryptjs");

const userSchema = new Schema({
  email: {
    type: String,
    unique: true,
    lowercase: true,
    required: [true, "Please enter an email"],
    validate: [isEmail, "Please enter a valid email"],
  },
  password: {
    type: String,
    required: [true, "Please enter a password"],
    minlength: [6, "Please enter at least six characters"],
  },
});

userSchema.pre("save", function (next) {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(this.password, salt);
  this.password = hash;
  next();
});

userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw Error("Invalid password");
  }
  throw Error("Invalid email");
};

module.exports = model("User", userSchema);
