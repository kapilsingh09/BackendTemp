import mongoose, { Schema } from "mongoose";

const wasteReportSchema = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String },
    phone: { 
      type: String,
      sparse: true,  // Allows multiple documents with null/undefined phone
      default: undefined
    },
    location: { type: String },
    wasteType: { type: String },
    description: { type: String },
    photo: { type: String }, // store image URL (Cloudinary / local)
    status: {
      type: String,
      enum: ["Pending", "Collected", "Disposed"],
      default: "Pending",
    },
    collector: { type: String }, // name/id of pickup person
    trackingUpdates: [
      {
        status: String,
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

// Pre-save middleware to handle empty phone strings
wasteReportSchema.pre('save', function(next) {
  if (this.phone === '') {
    this.phone = undefined;
  }
  next();
});

export default mongoose.model("WasteReport", wasteReportSchema);
