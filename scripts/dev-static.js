const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const { URL } = require("node:url");

const root = path.resolve(__dirname, "..");
const port = Number(process.env.PORT || 3000);
const host = process.env.HOST || "127.0.0.1";

const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".pdf": "application/pdf",
};

function resolveRequest(requestUrl) {
  const url = new URL(requestUrl, `http://${host}:${port}`);
  const decoded = decodeURIComponent(url.pathname);
  const normalized = path.normalize(decoded).replace(/^([/\\])+/, "");
  let filePath = path.join(root, normalized);

  if (!filePath.startsWith(root)) return null;

  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, "index.html");
  }

  if (!fs.existsSync(filePath) && !path.extname(filePath)) {
    filePath = path.join(root, normalized, "index.html");
  }

  if (!fs.existsSync(filePath)) return null;
  return filePath;
}

const server = http.createServer((req, res) => {
  if (!req.url || req.method !== "GET") {
    res.writeHead(405);
    res.end("Method not allowed");
    return;
  }

  const filePath = resolveRequest(req.url);
  if (!filePath) {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Not found");
    return;
  }

  const ext = path.extname(filePath).toLowerCase();
  res.writeHead(200, {
    "Content-Type": types[ext] || "application/octet-stream",
    "Cache-Control": "no-store",
  });
  fs.createReadStream(filePath).pipe(res);
});

server.listen(port, host, () => {
  console.log(`ICC Topografia static dev server`);
  console.log(`Local: http://${host}:${port}`);
  console.log(`Serving: ${root}`);
});
