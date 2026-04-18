import app from "../app.js";
import { connectDb } from "./config/db.js";

let isConnected = false;

export default async function handler(req, res) {
  try {
    if (!isConnected) {
      await connectDb();
      isConnected = true;
    }

    return app(req, res);
  } catch (error) {
    console.error("Vercel function error:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
}