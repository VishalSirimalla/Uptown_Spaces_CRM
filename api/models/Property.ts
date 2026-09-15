import mongoose, { Schema } from "mongoose";

const propertySchema = new Schema({
  title: { type: String, required: true, trim: true },
  location: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 1000 },
  propertyType: { type: String, required: true, trim: true },
  bedrooms: { type: Number, min: 0, default: 0 },
  area: { type: Number, min: 0, default: 0 },
  status: { type: String, enum: ["Available", "Reserved", "Sold"], default: "Available" },
  description: { type: String, default: "" },
  amenities: { type: [String], default: [] },
}, { timestamps: true });

export const Property = mongoose.models.Property || mongoose.model("Property", propertySchema);