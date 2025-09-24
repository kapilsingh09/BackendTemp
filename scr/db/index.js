import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect("mongodb://127.0.0.1:27017/WasteReportDataBase", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${connectionInstance.connection.host}`);

  } catch (error) {
    console.error(`❌ Error: ${error.message}    `);
    process.exit(1);
  }
};

export default connectDB;