import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

export const db = async () => {
  try {
    await mongoose.connect(process.env.MONGOURI);
    console.log("connected with db");
  } catch (error) {
    console.log(error);
  }
};
