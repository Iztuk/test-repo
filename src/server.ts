import express from "express";
import path from "path";
import helmet from "helmet";
import morgan from "morgan";
import { fileURLToPath } from "url";
import { api } from "./routes/api.js";
import { pages } from "./routes/pages.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(
  helmet({
    frameguard: false,                  // disable X-Frame-Options
    contentSecurityPolicy: false,       // disable CSP entirely (dev only)
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: false,
  })
);
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Static files
app.use(express.static(path.join(__dirname, "../public")));

// Routes
app.use("/api", api);
app.use("/", pages);

// Health check
app.get("/healthz", (_req, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});