const mongoose = require("mongoose");

const mongoUrl = process.env.MONGO_URI;

const ConnectDB = async () => {
    try {
        await mongoose.connect(mongoUrl);
        console.log("MongoDB connected");
    } catch (error) {
        console.error("Database connection error:", error.message);
        process.exit(1);
    }
};

module.exports = ConnectDB;
