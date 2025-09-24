import express from "express";
import { upload } from "../middlewares/multer.js";
import WasteReport from "../Models/WasteReportModel.js";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";

const router = express.Router();

// Cloudinary configuration using environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// POST /api/waste
router.post("/", upload.single("photo"), async (req, res) => {
  try {
    let photoUrl;

    // Check if file exists and get its path
    if (req.file) {
      // Use absolute path for Cloudinary upload
      const filePath = path.resolve(req.file.path);

      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(filePath, {
        folder: "waste_reports",
      });
      photoUrl = result.secure_url;

      // Remove local file after upload
      fs.unlinkSync(filePath);
    }

    // Extract fields from request body
    const { name, email, phone, location, wasteType, description } = req.body;

    // Create new waste report document
    const newReport = new WasteReport({
      name,
      email,
      phone,
      location,
      wasteType,
      description,
      photo: photoUrl,
    });

    await newReport.save();

    res.status(201).json({ message: "Waste report submitted", report: newReport });
  } catch (err) {
    console.error("Error in /api/waste POST:", err);
    res.status(500).json({ error: "Failed to submit waste report" });
  }
});

export default router;
