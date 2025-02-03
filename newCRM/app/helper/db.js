import mongoose from "mongoose";

export const connectDb = async () => {
    try {
        const { connection } = await mongoose.connect(process.env.MONGO_URI, {
            dbName: process.env.DB_NAME,
        });

        if (connection.readyState === 1) {
            console.log("✅ Database connection successful");
        } else {
            console.log("⚠️ Database connection in progress or disconnected");
        }
    } catch (error) {
        console.log("❌ Database connection failed");
        console.error(error.message); // Log detailed error for debugging
    }
};
