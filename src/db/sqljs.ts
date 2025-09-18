
import initSqlJs, { Database } from "sql.js";
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "fs";
import path from "path";

let db: Database | null = null;
let SQL: Awaited<ReturnType<typeof initSqlJs>>;

const DB_PATH = path.resolve("data/app.sqlite");

export async function initDb() {
  if (db) return db;

  SQL = await initSqlJs({
    locateFile: (file) => path.resolve("node_modules/sql.js/dist/", file),
  });

  if (existsSync(DB_PATH)) {
    const buf = readFileSync(DB_PATH);
    db = new SQL.Database(new Uint8Array(buf));
  } else {
    db = new SQL.Database();
  }

  return db;
}

export function getDb(): Database {
  if (!db) throw new Error("Database not initialized. Call initDb() first.");
  return db;
}

export function persist() {
  if (!db) return;
  const data = db.export();
  const dir = path.dirname(DB_PATH);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  writeFileSync(DB_PATH, Buffer.from(data));
}
