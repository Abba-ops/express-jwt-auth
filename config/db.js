const mongoose = require("mongoose");

async function connectDB() {
  try {
    const db = await mongoose.connect(process.env.MONGO_URI);
    console.log(`Connected to ${db.connection.host}`.blue.underline.bold);
  } catch (error) {
    console.error(`Error connecting to MongoDB`.red.bold);
    console.error(`Error: ${error.message}`.red.bold);
    process.exit(1);
  }
}

module.exports = connectDB;
