import "dotenv/config";
import { connectDB } from "./api/db";
import { Lead } from "./api/models/Lead";
import { Property } from "./api/models/Property";
import { FollowUp } from "./api/models/FollowUp";

const properties = [
  ["Harbour Heights 3 BHK", "Navi Mumbai", 14500000, "3 BHK", 3, 1480], ["Thane Green Residences", "Thane", 9800000, "2 BHK", 2, 1120], ["Kalyan Central Villa", "Kalyan", 18500000, "Villa", 4, 2400], ["Dombivli Garden Homes", "Dombivli", 7200000, "2 BHK", 2, 980], ["Bhiwandi Logistics Plot", "Bhiwandi", 12500000, "Plot", 0, 3600], ["Belapur Sky Penthouse", "Navi Mumbai", 32500000, "Penthouse", 4, 2900], ["Worli View Apartments", "Mumbai", 28000000, "3 BHK", 3, 1750], ["Panvel Palm Enclave", "Panvel", 8600000, "Villa", 3, 2100],
].map(([title, location, price, propertyType, bedrooms, area]) => ({ title, location, price, propertyType, bedrooms, area, status: "Available", description: "Verified inventory with clear title and dedicated parking.", amenities: ["Parking", "Security", "Power backup"] }));
const leads = [
  ["Aarav Mehta", "+91 9876543210", "aarav@example.com", 15000000, "Navi Mumbai", "3 BHK", "Referral", "Qualified"], ["Isha Shah", "+91 9988776655", "isha@example.com", 9000000, "Thane", "2 BHK", "Google", "Contacted"], ["Rohan Kulkarni", "+91 9000100020", "rohan@example.com", 20000000, "Kalyan", "Villa", "Website", "Site Visit"], ["Neha Patil", "+91 9123456780", "neha@example.com", 7500000, "Dombivli", "2 BHK", "Facebook", "New"], ["Kabir Joshi", "+91 9345678123", "kabir@example.com", 13000000, "Bhiwandi", "Plot", "Realtor", "Negotiation"], ["Meera Nair", "+91 9456781234", "meera@example.com", 30000000, "Navi Mumbai", "Penthouse", "Referral", "Won"], ["Vivek Rao", "+91 9567812345", "vivek@example.com", 28000000, "Mumbai", "3 BHK", "Google", "Qualified"], ["Sana Khan", "+91 9678123456", "sana@example.com", 8500000, "Panvel", "Villa", "Walk-in", "New"], ["Dev Desai", "+91 9781234567", "dev@example.com", 11000000, "Thane", "2 BHK", "Website", "Lost"], ["Ananya Iyer", "+91 9891234567", "ananya@example.com", 16000000, "Navi Mumbai", "3 BHK", "Zillow", "Contacted"], ["Manish Gupta", "+91 9012345678", "manish@example.com", 12000000, "Kalyan", "2 BHK", "Referral", "New"], ["Tara Menon", "+91 9234567890", "tara@example.com", 32000000, "Mumbai", "Penthouse", "Google", "Won"],
].map(([name, phone, email, budget, location, propertyType, source, status]) => ({ name, phone, email, budget, location, propertyType, source, status, notes: [{ content: "Demo lead imported for pipeline review.", author: "System" }] }));

async function seed() {
  if (!(await connectDB())) throw new Error("Set MONGODB_URI before running the seed command.");
  await Promise.all([Lead.deleteMany({}), Property.deleteMany({}), FollowUp.deleteMany({})]);
  const insertedLeads = await Lead.insertMany(leads);
  await Property.insertMany(properties);
  await FollowUp.insertMany(insertedLeads.slice(0, 6).map((lead, index) => ({ lead: lead._id, date: new Date(Date.now() + (index - 2) * 86400000).toISOString().slice(0, 10), time: "11:00", type: index % 2 ? "Meeting" : "Call", notes: "Discuss matching inventory and next steps.", status: index < 2 ? "Pending" : "Completed" })));
  console.log(`Seeded ${insertedLeads.length} leads, ${properties.length} properties, and 6 follow-ups.`);
  process.exit(0);
}
seed().catch((error) => { console.error(error); process.exit(1); });