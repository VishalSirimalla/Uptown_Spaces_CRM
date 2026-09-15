import mongoose, { Schema } from "mongoose";

const followUpSchema = new Schema({
  lead: { type: Schema.Types.ObjectId, ref: "Lead", required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  type: { type: String, enum: ["Call", "Meeting", "Email", "Site Visit", "WhatsApp"], required: true },
  notes: { type: String, default: "" },
  status: { type: String, enum: ["Pending", "Completed", "Missed"], default: "Pending" },
}, { timestamps: true });

export const FollowUp = mongoose.models.FollowUp || mongoose.model("FollowUp", followUpSchema);