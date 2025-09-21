import mongoose, { Schema } from "mongoose";

const wasteReportSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { 
      type: String,
      sparse: true,  // This allows multiple documents with null/undefined phone values
      default: undefined  // Use undefined instead of empty string
    },
    location: { type: String, required: true },
    wasteType: { type: String, required: true },
    description: { type: String },
    photo: { type: String }, // store image URL (you can use Cloudinary / local uploads)
    status: {
      type: String,
      enum: ["Pending", "Collected", "Disposed"],
      default: "Pending",
    },
    //history of
    // history:[
    //   {
    //     type:Schema.Types.ObjectId,
    //     // ref:""
    //   }
    // ],
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
  // Convert empty string to undefined to avoid duplicate key error
  if (this.phone === '') {
    this.phone = undefined;
  }
  next();
});

export default mongoose.model("WasteReport", wasteReportSchema);