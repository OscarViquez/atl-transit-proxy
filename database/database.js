const mongoose = require("mongoose");
const CONNECTION_STRING = process.env.DB_STRING;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(CONNECTION_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

module.exports = connectDB;
