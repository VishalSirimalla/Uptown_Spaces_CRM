import mongoose, { Schema } from "mongoose";

export const LEAD_STATUSES = ["New", "Contacted", "Qualified", "Site Visit", "Negotiation", "Won", "Lost"] as const;
export const LEAD_SOURCES = ["Facebook", "Google", "Referral", "Zillow", "Realtor", "Website", "Walk-in"] as const;
export const PROPERTY_TYPES = ["1 BHK", "2 BHK", "3 BHK", "Plot", "Penthouse", "Villa"] as const;

const noteSchema = new Schema({
  content: { type: String, required: true, trim: true, maxlength: 2000 },
  author: { type: String, required: true, trim: true },
  createdAt: { type: Date, default: Date.now },
}, { _id: true });

const leadSchema = new Schema({
  name: { type: String, required: true, trim: true, minlength: 2 },
  phone: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  budget: { type: Number, required: true, min: 1000 },
  location: { type: String, required: true, trim: true },
  propertyType: { type: String, enum: PROPERTY_TYPES, required: true },
  source: { type: String, enum: LEAD_SOURCES, required: true },
  status: { type: String, enum: LEAD_STATUSES, default: "New" },
  notes: { type: [noteSchema], default: [] },
  assignedAgent: { type: Schema.Types.ObjectId, ref: "User", default: null },
}, { timestamps: true });

export const Lead = mongoose.models.Lead || mongoose.model("Lead", leadSchema);