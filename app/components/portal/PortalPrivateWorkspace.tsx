"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import styles from "./PortalPrivateWorkspace.module.css";

type Note = { id: string; kind: "SIMPLE" | "SECURE"; title: string | null; body: string | null; securePayload: string | null };
type StoredFile = { id: string; userId: string; title: string; fileName: string; contentType: string; size: number; visibility: "PRIVATE" | "WORKSPACE"; category: string; projectName?: string | null };

const encoder = new TextEncoder();
const decoder = new TextDecoder();
const iterations = 310000;
function b64(bytes: Uint8Array) { let binary = ""; bytes.forEach((byte) => { binary += String.fromCharCode(byte); }); return btoa(binary); }
function bytes(value: string) { return Uint8Array.from(atob(value), (character) => character.charCodeAt(0)); }
async function key(passphrase: string, salt: Uint8Array, uses: KeyUsage[]) { const material = await crypto.subtle.importKey("raw", encoder.encode(passphrase), "PBKDF2", false, ["deriveKey"]); return crypto.subtle.deriveKey({ name: "PBKDF2", hash: "SHA-256", salt: salt as BufferSource, iterations }, material, { name: "AES-GCM", length: 256 }, false, uses); }
async function encrypt(passphrase: string, value: { title: string; body: string }) { const salt = crypto.getRandomValues(new Uint8Array(16)); const iv = crypto.getRandomValues(new Uint8Array(12)); const cipher = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, await key(passphrase, salt, ["encrypt"]), encoder.encode(JSON.stringify(value))); return JSON.stringify({ version: 1, algorithm: "AES-GCM", iterations, salt: b64(salt), iv: b64(iv), ciphertext: b64(new Uint8Array(cipher)) }); }
async function decrypt(passphrase: string, payload: string) { const value = JSON.parse(payload); const plain = await crypto.subtle.decrypt({ name: "AES-GCM", iv: bytes(value.iv) }, await key(passphrase, bytes(value.salt), ["decrypt"]), bytes(value.ciphertext)); return JSON.parse(decoder.decode(plain)) as { title: string; body: string }; }

export function PortalPrivateWorkspace({ userId }: { userId: string }) {
  const [tab, setTab] = useState<"notes" | "files">("notes");
  const [notes, setNotes] = useState<Note[]>([]);
  const [files, setFiles] = useState<StoredFile[]>([]);
  const [unlocked, setUnlocked] = useState<Record<string, { title: string; body: string }>>({});
  const [status, setStatus] = useState("");

  const load = useCallback(async () => {
    const [notesResponse, filesResponse] = await Promise.all([fetch("/api/terraqo/portal/notes", { cache: "no-store" }), fetch("/api/terraqo/portal/files", { cache: "no-store" })]);
    const [notesPayload, filesPayload] = await Promise.all([notesResponse.json(), filesResponse.json()]);
    if (notesResponse.ok) setNotes(notesPayload.data || []);
    if (filesResponse.ok) setFiles(filesPayload.data || []);
  }, []);
  useEffect(() => { load().catch(() => setStatus("No pudimos cargar tu espacio privado.")); }, [load]);

  async function saveNote(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); const form = event.currentTarget; const data = new FormData(form); const kind = String(data.get("kind")); const title = String(data.get("title")); const body = String(data.get("body")); const passphrase = String(data.get("passphrase"));
    if (kind === "SECURE" && passphrase.length < 12) return setStatus("La frase segura debe tener al menos 12 caracteres.");
    const securePayload = kind === "SECURE" ? await encrypt(passphrase, { title, body }) : undefined;
    const response = await fetch("/api/terraqo/portal/notes", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ kind, title, body, securePayload }) });
    const payload = await response.json(); if (!response.ok) return setStatus(payload.error?.message || "No pudimos guardar la nota."); form.reset(); setStatus(kind === "SECURE" ? "Nota cifrada. Guarda tu frase: no puede recuperarse." : "Nota guardada."); await load();
  }

  async function openNote(note: Note) { const passphrase = prompt("Ingresa la frase de acceso de esta nota"); if (!passphrase || !note.securePayload) return; try { const value = await decrypt(passphrase, note.securePayload); setUnlocked((current) => ({ ...current, [note.id]: value })); setStatus(""); } catch { setStatus("La frase de acceso es incorrecta."); } }
  async function deleteNote(id: string) { if (!confirm("¿Eliminar esta nota?")) return; await fetch(`/api/terraqo/portal/notes/${id}`, { method: "DELETE" }); await load(); }
  async function saveFile(event: FormEvent<HTMLFormElement>) { event.preventDefault(); const form = event.currentTarget; const response = await fetch("/api/terraqo/portal/files", { method: "POST", body: new FormData(form) }); const payload = await response.json(); if (!response.ok) return setStatus(payload.error?.message || "No pudimos cargar el archivo."); form.reset(); setStatus("Archivo guardado."); await load(); }
  async function deleteFile(id: string) { if (!confirm("¿Eliminar este archivo?")) return; await fetch(`/api/terraqo/portal/files/${id}`, { method: "DELETE" }); await load(); }

  return <section className={styles.workspace} id="espacio-privado">
    <div className={styles.heading}><div><p>Espacio privado Terraqo</p><h2>Notas y archivos de trabajo</h2><span>Organiza información personal y material de cualquier especialidad sin salir del portal.</span></div><div className={styles.tabs}><button className={tab === "notes" ? styles.active : ""} onClick={() => setTab("notes")}>Notas</button><button className={tab === "files" ? styles.active : ""} onClick={() => setTab("files")}>Archivos</button></div></div>
    {status ? <p className={styles.status}>{status}</p> : null}
    {tab === "notes" ? <div className={styles.columns}>
      <form onSubmit={saveNote} className={styles.form}><h3>Nueva nota</h3><select name="kind"><option value="SIMPLE">Nota simple privada</option><option value="SECURE">Nota segura cifrada</option></select><input name="title" required maxLength={140} placeholder="Título" /><textarea name="body" required placeholder="Contenido" /><input name="passphrase" type="password" minLength={12} placeholder="Frase de acceso, solo para notas seguras" /><small>Las notas seguras se cifran antes de salir de tu navegador. Terraqo no conoce ni recupera la frase.</small><button>Guardar nota</button></form>
      <div className={styles.items}>{notes.map((note) => { const content = note.kind === "SIMPLE" ? { title: note.title, body: note.body } : unlocked[note.id]; return <article key={note.id} className={note.kind === "SECURE" ? styles.secure : ""}><span>{note.kind === "SECURE" ? "Cifrada" : "Privada"}</span><h3>{content?.title || "Nota segura"}</h3><p>{content?.body || "El contenido permanece protegido."}</p><div>{note.kind === "SECURE" && !content ? <button onClick={() => openNote(note)}>Abrir</button> : null}<button onClick={() => deleteNote(note.id)}>Eliminar</button></div></article>; })}{!notes.length ? <p className={styles.empty}>Aún no tienes notas.</p> : null}</div>
    </div> : <div className={styles.columns}>
      <form onSubmit={saveFile} className={styles.form}><h3>Agregar archivo</h3><input name="title" required maxLength={160} placeholder="Título" /><select name="category"><option value="PLAN">Planos y archivos técnicos</option><option value="REPORT">Informes y reportes</option><option value="SPREADSHEET">Hojas de cálculo</option><option value="PRESENTATION">Presentaciones</option><option value="IMAGE">Imágenes</option><option value="SOURCE_FILE">Archivos de trabajo</option><option value="CONTRACT">Contratos</option><option value="TEMPLATE">Plantillas</option><option value="OTHER">Otros</option></select><input name="projectName" placeholder="Proyecto o contexto, opcional" /><select name="visibility"><option value="PRIVATE">Solo yo</option><option value="WORKSPACE">Compartir con ICC Topografía</option></select><textarea name="description" placeholder="Descripción, opcional" /><input name="file" type="file" required accept=".pdf,.jpg,.jpeg,.png,.webp,.avif,.txt,.csv,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.dwg,.dxf,.zip" /><small>Máximo 35 MB. No se admiten ejecutables.</small><button>Guardar archivo</button></form>
      <div className={styles.items}>{files.map((file) => <article key={file.id}><span>{file.visibility === "PRIVATE" ? "Solo tú" : "Compartido con ICC"}</span><h3>{file.title}</h3><p>{file.fileName} · {(file.size / 1024 / 1024).toFixed(1)} MB{file.projectName ? ` · ${file.projectName}` : ""}</p><div>{file.contentType.startsWith("image/") || file.contentType === "application/pdf" ? <a href={`/api/terraqo/portal/files/${file.id}?inline=1`} target="_blank">Previsualizar</a> : null}<a href={`/api/terraqo/portal/files/${file.id}`}>Descargar</a>{file.userId === userId ? <button onClick={() => deleteFile(file.id)}>Eliminar</button> : null}</div></article>)}{!files.length ? <p className={styles.empty}>Aún no tienes archivos.</p> : null}</div>
    </div>}
  </section>;
}
