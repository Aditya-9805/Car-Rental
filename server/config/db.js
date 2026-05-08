import mongoose from "mongoose";

const connectDB = async () => {
  try {

    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB Connected:", mongoose.connection.host);

  } catch (error) {

    console.log("MongoDB Connection Error:", error.message);

  }
};

export default connectDB;