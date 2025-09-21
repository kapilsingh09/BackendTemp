import express from 'express';
import WasteReport from '../Models/WasteReportModel.js';
import multer from 'multer';
import path from 'path';

const router = express.Router();

// Configure multer for file upload storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Ensure this folder exists
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// 📌 Submit waste report (with optional phone and photo)
router.post('/', upload.single('photo'), async (req, res) => {
  try {
    const { name, email, phone, location, wasteType, description } = req.body;

    // Handle photo file path
    const photo = req.file ? req.file.path : '';

    // Create report object - only include phone if it's not empty
    const reportData = {
      name,
      email,
      location,
      wasteType,
      description,
      photo
    };

    // Only add phone if it exists and is not empty
    if (phone && phone.trim() !== '') {
      reportData.phone = phone.trim();
    }

    const report = new WasteReport(reportData);

    await report.save();
    res.status(201).json({ message: 'Waste report submitted successfully', report });
  } catch (error) {
    console.error('Error saving waste report:', error);
    res.status(500).json({ error: error.message });
  }
});

// 📌 Get all waste reports
router.get('/', async (req, res) => {
  try {
    const reports = await WasteReport.find().sort({ createdAt: -1 });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 📌 Get single waste report
router.get('/:id', async (req, res) => {
  try {
    const report = await WasteReport.findById(req.params.id);
    if (!report) return res.status(404).json({ message: 'Report not found' });
    res.json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 📌 Update waste report status
router.put('/:id/status', async (req, res) => {
  try {
    const { status, collector } = req.body;
    const report = await WasteReport.findById(req.params.id);

    if (!report) return res.status(404).json({ message: 'Report not found' });

    report.status = status;
    if (collector) report.collector = collector;
    report.trackingUpdates.push({ status });

    await report.save();
    res.json({ message: 'Status updated successfully', report });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;