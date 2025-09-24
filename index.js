import express from "express";
const app = express();
import cors from "cors";
import dotenv from "dotenv";
import wasteRoutes from "./scr/Routes/WasteRoutes.js";
import connectDB from "./scr/db/index.js";
import RegistrationRoute from './scr/Routes/RegistrationRoutes.js';
import cookieParser from "cookie-parser";
import { logoutUser, userLogin } from "./scr/controllers/AuthController.js";

// Removed unnecessary imports:
// - mongoose: not used directly here (connection handled in connectDB).
// - path: not used in this file.
// - { error } from "console": not used.
// - { urlencoded } from "express": express.urlencoded is used directly.
// - { userLogin } from "./scr/controllers/AuthController.js": not used as a route handler directly.

dotenv.config();
app.use(cors({
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

// Routes
app.use("/api", RegistrationRoute);
app.use("/api/waste", wasteRoutes);
app.use("/api",logoutUser)
app.use("/api",userLogin)
// Login is handled via POST /api/login in RegistrationRoutes

app.get("/", (req, res) => {
  res.send("APP  is running...");
});

const PORT = process.env.PORT || 5000;
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MONGO db connection failed !! ", err);
  });