import mongoose from "mongoose";

let isConnected = false;

export const connectDb = async () => {
  if (isConnected) return;

  try {
    const db = await mongoose.connect(process.env.MONGO_URI, {
      dbName: process.env.DB_NAME,
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    });

    isConnected = true;

    if (db.connection.readyState === 1) {
      console.log("✅ Database connection successful");
    } else {
      console.log("⚠️ Database connection in progress or disconnected");
    }
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    throw new Error("DB_CONNECTION_FAILED");
  }
};
