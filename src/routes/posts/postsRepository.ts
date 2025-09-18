import { getDb, persist } from "../../db/sqljs.js";

export interface posts {
  id: number;
  user_id: number;
  title: string;
  body?: string;
  published: boolean;
}
export function getAllposts(): posts[] {
  const db = getDb();
  const stmt = db.prepare("SELECT id, user_id, title, body, published FROM posts");
  const out: posts[] = [];
  while (stmt.step()) {
    const r = stmt.getAsObject() as any;
    out.push({ id: r.id, user_id: r.user_id, title: r.title, body: r.body, published: !!r.published });
  }
  stmt.free();
  return out;
}
export function getpostsById(id: number): posts | null {
  const db = getDb();
  const stmt = db.prepare("SELECT id, user_id, title, body, published FROM posts WHERE id = ?");
  stmt.bind([id]);
  const r = stmt.step() ? (stmt.getAsObject() as any) : null;
  stmt.free();
  return r ? { id: r.id, user_id: r.user_id, title: r.title, body: r.body, published: !!r.published } : null;
}
export function addposts(user_id: number, title: string, body: string, published: boolean): number {
  const db = getDb();
  const stmt = db.prepare("INSERT INTO posts (user_id, title, body, published) VALUES (?, ?, ?, ?)");
  stmt.run([user_id, title, body, (published ? 1 : 0)]);
  stmt.free();

  const idStmt = db.prepare("SELECT last_insert_rowid()");
  idStmt.step();
  const id = idStmt.get()[0] as number;
  idStmt.free();

  persist();
  return id;
}
export function updateposts(id: number, user_id: number, title: string, body: string, published: boolean): boolean {
  const db = getDb();
  const stmt = db.prepare("UPDATE posts SET user_id = ?, title = ?, body = ?, published = ? WHERE id = ?");
  stmt.run([user_id, title, body, (published ? 1 : 0), id]);
  stmt.free();

  const changed = db.getRowsModified();
  if (changed > 0) persist();
  return changed > 0;
}
export function deleteposts(id: number): boolean {
  const db = getDb();
  const stmt = db.prepare("DELETE FROM posts WHERE id = ?");
  stmt.run([id]);
  stmt.free();

  const changed = db.getRowsModified();
  if (changed > 0) persist();
  return changed > 0;
}