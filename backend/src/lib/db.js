import mongoose from "mongoose";

export const connectToDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URL);
    console.log(`MongoDB Connected successfully : ${conn.connection.host}`);
  } catch (error) {
    console.log("MongoDB connection error ", error);
  }
};
