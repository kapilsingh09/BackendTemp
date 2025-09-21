import express, { urlencoded } from "express";
const app = express();
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import wasteRoutes from "./Routes/WasteRoutes.js";
import connectDB from "./db/index.js";
import RegistrationRoute from './Routes/RegistrationRoutes.js'
import path from "path";
import { error } from "console";




dotenv.config();
app.use(cors({
  credentials:true
}));

app.use(express.json({limit:"19kb"}));
app.use(express.urlencoded({extended:true,limit:'19kb'}))
app.use(express.static("public"))
// app.use(cokkieParser())
// app.use()

// Routes
app.use("/api",RegistrationRoute);

app.use("/api/waste", wasteRoutes);

app.get("/", (req, res) => {
  res.send("APP  is running...");
});

const PORT = process.env.PORT || 5000;
// const PORT = 3000;
connectDB()
.then(()=>{
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  })
}).catch((err)=>{
  console.error("MONGO db connection failed !! ",err)
})