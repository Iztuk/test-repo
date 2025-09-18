import { getDb, persist } from "../../db/sqljs.js";

export interface users {
  id: number;
  name: string;
  email: string;
  created_at: Date;
}
export function getAllusers(): users[] {
  const db = getDb();
  const stmt = db.prepare("SELECT id, name, email, created_at FROM users");
  const out: users[] = [];
  while (stmt.step()) {
    const r = stmt.getAsObject() as any;
    out.push({ id: r.id, name: r.name, email: r.email, created_at: new Date(r.created_at) });
  }
  stmt.free();
  return out;
}
export function getusersById(id: number): users | null {
  const db = getDb();
  const stmt = db.prepare("SELECT id, name, email, created_at FROM users WHERE id = ?");
  stmt.bind([id]);
  const r = stmt.step() ? (stmt.getAsObject() as any) : null;
  stmt.free();
  return r ? { id: r.id, name: r.name, email: r.email, created_at: new Date(r.created_at) } : null;
}
export function addusers(name: string, email: string, created_at: Date): number {
  const db = getDb();
  const stmt = db.prepare("INSERT INTO users (name, email, created_at) VALUES (?, ?, ?)");
  stmt.run([name, email, (created_at instanceof Date ? created_at.toISOString() : created_at)]);
  stmt.free();

  const idStmt = db.prepare("SELECT last_insert_rowid()");
  idStmt.step();
  const id = idStmt.get()[0] as number;
  idStmt.free();

  persist();
  return id;
}
export function updateusers(id: number, name: string, email: string, created_at: Date): boolean {
  const db = getDb();
  const stmt = db.prepare("UPDATE users SET name = ?, email = ?, created_at = ? WHERE id = ?");
  stmt.run([name, email, (created_at instanceof Date ? created_at.toISOString() : created_at), id]);
  stmt.free();

  const changed = db.getRowsModified();
  if (changed > 0) persist();
  return changed > 0;
}
export function deleteusers(id: number): boolean {
  const db = getDb();
  const stmt = db.prepare("DELETE FROM users WHERE id = ?");
  stmt.run([id]);
  stmt.free();

  const changed = db.getRowsModified();
  if (changed > 0) persist();
  return changed > 0;
}