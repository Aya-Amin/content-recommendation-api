import mongoose from "mongoose";

const connectMongo = async () => {
  try {
    const uri = process.env.MONGO_URI || "your-mongo-connection-string-here";
    await mongoose.connect(uri);
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  }
};

export default connectMongo;
