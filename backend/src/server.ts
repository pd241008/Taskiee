import dotenv from "dotenv";
import app from "./app";
// 1. Import your newly created connectDB function!
// (Make sure this path matches where you saved the file, e.g., "../utils/db" or "./utils/db")
import { connectDB } from "./utils/db/db";

dotenv.config();

const PORT = process.env.PORT || 5000;

// 2. Fire the database connection FIRST
connectDB().then(() => {
  // 3. Only start the Express server if the database connects successfully
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
});
