
import { Router } from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Resolve project root from this file
const projectRoot = path.resolve(__dirname, "../../");

export const pages = Router();

pages.get("/", (_req, res) => {
  res.redirect("/home");
});

pages.get("/:page", (req, res) => {
  const page = req.params.page.replace(/[^a-zA-Z0-9_-]/g, "");
  const filePath = path.join(projectRoot, "views", "pages", `${page}.html`);
  res.sendFile(filePath, (err) => {
    if (err) res.status(404).send("Page not found");
  });
});
