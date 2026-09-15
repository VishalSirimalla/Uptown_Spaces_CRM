import "dotenv/config";
import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import app from "./api/app";
import { connectDB } from "./api/db";

async function startServer() {
  const PORT = Number(process.env.PORT || 3002);

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  await connectDB().catch((error) => console.error("MongoDB unavailable:", error.message));
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Uptown CRM running on http://localhost:${PORT}`);
  });
}

startServer();
