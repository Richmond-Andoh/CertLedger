const mongoose = require("mongoose");

// MongoDB connection configuration
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log("✅ MongoDB connected successfully");
    return conn;
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    process.exit(1);
  }
};

// Graceful shutdown
const gracefulShutdown = () => {
  mongoose.connection.close(() => {
    console.log("MongoDB connection closed through app termination");
    process.exit(0);
  });
};

process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);

module.exports = { connectDB };
