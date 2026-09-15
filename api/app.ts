import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { connectDB, databaseStatus } from "./db";
import { Lead, LEAD_STATUSES, LEAD_SOURCES, PROPERTY_TYPES } from "./models/Lead";
import { Property } from "./models/Property";
import { User } from "./models/User";
import { FollowUp } from "./models/FollowUp";
import { scoreLead } from "./services/leadScoring";
import { matchProperties } from "./services/propertyMatching";

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: "1mb" }));

const asyncRoute = (handler: (req: Request, res: Response, next: NextFunction) => Promise<void>) =>
  (req: Request, res: Response, next: NextFunction) => handler(req, res, next).catch(next);

const requireDatabase = asyncRoute(async (_req, res, next) => {
  if (!(await connectDB())) {
    res.status(503).json({ error: "MongoDB is not configured. Set MONGODB_URI to use this operation." });
    return;
  }
  next();
});

const validId = (id: string) => /^[a-f\d]{24}$/i.test(id);
const publicUser = (user: { _id: unknown; name: string; email: string; role: string }) => ({ id: String(user._id), name: user.name, email: user.email, role: user.role });
const cookieName = "uptown_session";
const cookieOptions = { httpOnly: true, sameSite: "lax" as const, secure: process.env.NODE_ENV === "production", maxAge: 8 * 60 * 60 * 1000, path: "/" };
const authSecret = () => process.env.JWT_SECRET || "development-only-secret";

function getCookie(request: Request, name: string) {
  const cookies = request.headers.cookie?.split(";").map((part) => part.trim()) || [];
  const value = cookies.find((part) => part.startsWith(`${name}=`));
  return value ? decodeURIComponent(value.slice(name.length + 1)) : undefined;
}

const requireAuth = asyncRoute(async (req, res, next) => {
  if (!(await connectDB())) {
    res.status(503).json({ error: "MongoDB is not configured. Set MONGODB_URI to use this operation." });
    return;
  }
  const token = getCookie(req, cookieName);
  if (!token) { res.status(401).json({ error: "Authentication required." }); return; }
  try {
    const payload = jwt.verify(token, authSecret()) as jwt.JwtPayload;
    const user = await User.findById(payload.sub);
    if (!user) { res.status(401).json({ error: "Authentication session is invalid." }); return; }
    (req as Request & { authUser?: typeof user }).authUser = user;
    next();
  } catch {
    res.status(401).json({ error: "Authentication session is invalid or expired." });
  }
});

app.get("/api/health", asyncRoute(async (_req, res) => {
  res.json({ status: "ok", service: "Uptown CRM Backend", database: databaseStatus() });
}));

app.post("/api/auth/register", requireDatabase, asyncRoute(async (req, res) => {
  const { name, email, password, role = "Agent" } = req.body || {};
  if (!name || !email || typeof password !== "string" || password.length < 8) {
    res.status(400).json({ error: "Name, email, and a password of at least 8 characters are required." }); return;
  }
  if (await User.exists({ email: String(email).toLowerCase() })) { res.status(409).json({ error: "An account with this email already exists." }); return; }
  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({ name, email, passwordHash, role: ["Admin", "Manager", "Agent"].includes(role) ? role : "Agent" });
  const token = jwt.sign({ sub: String(user._id), role: user.role }, authSecret(), { expiresIn: "8h" });
  res.cookie(cookieName, token, cookieOptions);
  res.status(201).json({ user: publicUser(user) });
}));

app.post("/api/auth/login", requireDatabase, asyncRoute(async (req, res) => {
  const { email, password } = req.body || {};
  const user = await User.findOne({ email: String(email || "").toLowerCase() });
  const passwordMatches = user ? await bcrypt.compare(String(password || ""), user.passwordHash) : false;
  if (!user || !passwordMatches) { res.status(401).json({ error: "Invalid email or password." }); return; }
  const token = jwt.sign({ sub: String(user._id), role: user.role }, authSecret(), { expiresIn: "8h" });
  res.cookie(cookieName, token, cookieOptions);
  res.json({ user: publicUser(user) });
}));
app.post("/api/auth/logout", (_req, res) => { res.clearCookie(cookieName, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/" }); res.json({ ok: true }); });
app.get("/api/auth/me", requireAuth, asyncRoute(async (req, res) => {
  const user = (req as Request & { authUser?: { _id: unknown; name: string; email: string; role: string } }).authUser;
  if (!user) { res.status(401).json({ error: "Authentication session not found." }); return; }
  res.json({ user: publicUser(user) });
}));

app.get("/api/leads", requireAuth, asyncRoute(async (req, res) => {
  const { status, source, location, propertyType, assignedAgent, search } = req.query;
  const filter: Record<string, unknown> = {};
  if (status) filter.status = status;
  if (source) filter.source = source;
  if (location) filter.location = new RegExp(String(location), "i");
  if (propertyType) filter.propertyType = propertyType;
  if (assignedAgent && validId(String(assignedAgent))) filter.assignedAgent = assignedAgent;
  if (search) filter.$or = ["name", "email", "phone", "location"].map((field) => ({ [field]: new RegExp(String(search), "i") }));
  const leads = await Lead.find(filter).populate("assignedAgent", "name email role").sort({ createdAt: -1 });
  res.json(leads);
}));

app.get("/api/leads/:id", requireAuth, asyncRoute(async (req, res) => {
  if (!validId(req.params.id)) { res.status(400).json({ error: "Invalid lead id." }); return; }
  const lead = await Lead.findById(req.params.id).populate("assignedAgent", "name email role");
  if (!lead) { res.status(404).json({ error: "Lead not found." }); return; }
  res.json({ lead, intelligence: scoreLead(lead) });
}));

app.post("/api/leads", requireAuth, asyncRoute(async (req, res) => {
  const body = req.body || {};
  if (!body.name || !body.phone || !body.email || !body.budget || !body.location || !PROPERTY_TYPES.includes(body.propertyType) || !LEAD_SOURCES.includes(body.source)) {
    res.status(400).json({ error: "Name, phone, email, budget, location, property type, and source are required." }); return;
  }
  const lead = await Lead.create({ ...body, status: body.status && LEAD_STATUSES.includes(body.status) ? body.status : "New" });
  res.status(201).json(lead);
}));

app.patch("/api/leads/:id", requireAuth, asyncRoute(async (req, res) => {
  if (!validId(req.params.id)) { res.status(400).json({ error: "Invalid lead id." }); return; }
  const updates = { ...req.body };
  if (updates.status && !LEAD_STATUSES.includes(updates.status)) { res.status(400).json({ error: "Invalid lead status." }); return; }
  if (updates.addNote) { updates.$push = { notes: { content: updates.addNote.content, author: updates.addNote.author || "Agent" } }; delete updates.addNote; }
  const lead = await Lead.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true }).populate("assignedAgent", "name email role");
  if (!lead) { res.status(404).json({ error: "Lead not found." }); return; }
  res.json(lead);
}));

app.delete("/api/leads/:id", requireAuth, asyncRoute(async (req, res) => {
  if (!validId(req.params.id)) { res.status(400).json({ error: "Invalid lead id." }); return; }
  const lead = await Lead.findByIdAndDelete(req.params.id);
  if (!lead) { res.status(404).json({ error: "Lead not found." }); return; }
  await FollowUp.deleteMany({ lead: req.params.id });
  res.status(204).send();
}));

app.get("/api/properties", requireAuth, asyncRoute(async (_req, res) => { res.json(await Property.find().sort({ createdAt: -1 })); }));
app.post("/api/properties", requireAuth, asyncRoute(async (req, res) => { res.status(201).json(await Property.create(req.body)); }));
app.patch("/api/properties/:id", requireAuth, asyncRoute(async (req, res) => {
  if (!validId(req.params.id)) { res.status(400).json({ error: "Invalid property id." }); return; }
  const property = await Property.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!property) { res.status(404).json({ error: "Property not found." }); return; }
  res.json(property);
}));
app.delete("/api/properties/:id", requireAuth, asyncRoute(async (req, res) => {
  if (!validId(req.params.id)) { res.status(400).json({ error: "Invalid property id." }); return; }
  await Property.findByIdAndDelete(req.params.id); res.status(204).send();
}));
app.get("/api/leads/:id/matches", requireAuth, asyncRoute(async (req, res) => {
  if (!validId(req.params.id)) { res.status(400).json({ error: "Invalid lead id." }); return; }
  const lead = await Lead.findById(req.params.id); if (!lead) { res.status(404).json({ error: "Lead not found." }); return; }
  res.json(matchProperties(lead, await Property.find().lean()));
}));

app.get("/api/follow-ups", requireAuth, asyncRoute(async (req, res) => {
  const filter = req.query.lead && validId(String(req.query.lead)) ? { lead: req.query.lead } : {};
  res.json(await FollowUp.find(filter).populate("lead", "name phone").sort({ date: 1, time: 1 }));
}));
app.post("/api/follow-ups", requireAuth, asyncRoute(async (req, res) => res.status(201).json(await FollowUp.create(req.body))));
app.patch("/api/follow-ups/:id", requireAuth, asyncRoute(async (req, res) => {
  if (!validId(req.params.id)) { res.status(400).json({ error: "Invalid follow-up id." }); return; }
  const item = await FollowUp.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!item) { res.status(404).json({ error: "Follow-up not found." }); return; } res.json(item);
}));

app.get("/api/analytics", requireAuth, asyncRoute(async (_req, res) => {
  const [leads, followUps] = await Promise.all([Lead.find().lean(), FollowUp.find().lean()]);
  const count = (key: string) => leads.reduce<Record<string, number>>((result, lead) => { const value = String(lead[key as keyof typeof lead] || "Unknown"); result[value] = (result[value] || 0) + 1; return result; }, {});
  const won = leads.filter((lead) => lead.status === "Won").length;
  const due = followUps.filter((item) => item.status === "Pending" && item.date <= new Date().toISOString().slice(0, 10)).length;
  res.json({ totalLeads: leads.length, conversionRate: leads.length ? Number(((won / leads.length) * 100).toFixed(1)) : 0, siteVisits: leads.filter((lead) => lead.status === "Site Visit").length, wonDeals: won, pipelineValue: leads.filter((lead) => !["Won", "Lost"].includes(lead.status)).reduce((sum, lead) => sum + lead.budget, 0), hotLeads: leads.filter((lead) => scoreLead(lead).temperature === "HOT").length, followUpsDue: due, leadsByStatus: Object.entries(count("status")).map(([name, value]) => ({ name, value })), leadsBySource: Object.entries(count("source")).map(([name, value]) => ({ name, value })) });
}));

app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error(error);
  if (error instanceof Error && error.name === "ValidationError") { res.status(400).json({ error: error.message }); return; }
  res.status(500).json({ error: "An unexpected server error occurred." });
});

export default app;