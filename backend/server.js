import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import postRoutes from "./routes/posts.routes.js";
import userRoutes from "./routes/user.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());

app.use(express.json());
app.use(postRoutes);
app.use(userRoutes);
app.use(express.static("uploads"));

const start = async () => {
  const connectDB = await mongoose.connect(
    "mongodb+srv://praveenkumarprakash8_db_user:Praveen123@linkedinclone.ffrmk0w.mongodb.net/?appName=LinkedinClone",
  );

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

start();
