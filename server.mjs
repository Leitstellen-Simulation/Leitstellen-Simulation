import { createReadStream, existsSync, statSync } from "node:fs";
import { mkdir, readdir, readFile, unlink, writeFile } from "node:fs/promises";
import { createServer } from "node:http";
import { dirname, extname, join, normalize, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const port = Number(process.env.PORT || 4173);
const root = dirname(fileURLToPath(import.meta.url));
const mapsDir = join(root, "maps");
const incidentsFile = join(root, "incidents-data.json");
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8"
};

createServer(async (request, response) => {
  const url = new URL(request.url || "/", `http://${request.headers.host}`);
  if (url.pathname.startsWith("/api/maps")) {
    await handleMapsApi(request, response, url);
    return;
  }
  if (url.pathname.startsWith("/api/incidents")) {
    await handleIncidentsApi(request, response);
    return;
  }
  const requestedPath = url.pathname === "/" ? "/index.html" : url.pathname;
  const safePath = normalize(decodeURIComponent(requestedPath))
    .replace(/^[/\\]+/, "")
    .replace(/^(\.\.[/\\])+/, "");
  const filePath = resolve(join(root, safePath));

  if (!filePath.startsWith(root) || !existsSync(filePath) || !statSync(filePath).isFile()) {
    response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    response.end("Not found");
    return;
  }

  response.writeHead(200, {
    "content-type": types[extname(filePath)] || "application/octet-stream"
  });
  createReadStream(filePath).pipe(response);
}).listen(port, "127.0.0.1", () => {
  console.log(`DispatchSim running at http://127.0.0.1:${port}/`);
});

async function handleMapsApi(request, response, url) {
  await mkdir(mapsDir, { recursive: true });
  const id = url.pathname.split("/").filter(Boolean)[2];
  if (request.method === "GET" && !id) {
    const files = (await readdir(mapsDir)).filter((file) => file.endsWith(".json"));
    const maps = await Promise.all(files.map(async (file) => readJsonFile(join(mapsDir, file))));
    sendJson(response, maps.map((map) => ({
      id: map.id,
      name: map.name,
      stations: map.stations?.length || 0,
      hospitals: map.hospitals?.length || 0
    })));
    return;
  }
  if (request.method === "GET" && id) {
    const file = join(mapsDir, `${safeId(id)}.json`);
    if (!existsSync(file)) return notFound(response);
    sendJson(response, await readJsonFile(file));
    return;
  }
  if (request.method === "POST") {
    const body = await readBody(request);
    const map = parseJson(body || "{}");
    map.id = safeId(map.id || map.name || `map-${Date.now()}`);
    await writeFile(join(mapsDir, `${map.id}.json`), JSON.stringify(map, null, 2), "utf8");
    sendJson(response, map);
    return;
  }
  if (request.method === "DELETE" && id) {
    const file = join(mapsDir, `${safeId(id)}.json`);
    if (existsSync(file)) await unlink(file);
    sendJson(response, { ok: true });
    return;
  }
  notFound(response);
}

async function handleIncidentsApi(request, response) {
  if (request.method === "GET") {
    if (!existsSync(incidentsFile)) return sendJson(response, []);
    sendJson(response, await readJsonFile(incidentsFile));
    return;
  }
  if (request.method === "POST") {
    const body = await readBody(request);
    const incidents = parseJson(body || "[]");
    await writeFile(incidentsFile, JSON.stringify(incidents, null, 2), "utf8");
    sendJson(response, incidents);
    return;
  }
  notFound(response);
}

async function readJsonFile(filePath) {
  return parseJson(await readFile(filePath, "utf8"));
}

function parseJson(text) {
  return JSON.parse(String(text).replace(/^\uFEFF/, ""));
}

function readBody(request) {
  return new Promise((resolve, reject) => {
    let body = "";
    request.on("data", (chunk) => {
      body += chunk;
      if (body.length > 2_000_000) request.destroy();
    });
    request.on("end", () => resolve(body));
    request.on("error", reject);
  });
}

function sendJson(response, data) {
  response.writeHead(200, { "content-type": "application/json; charset=utf-8" });
  response.end(JSON.stringify(data));
}

function notFound(response) {
  response.writeHead(404, { "content-type": "application/json; charset=utf-8" });
  response.end(JSON.stringify({ error: "not found" }));
}

function safeId(value) {
  return String(value).toLowerCase().replace(/[^a-z0-9_-]+/g, "-").replace(/^-+|-+$/g, "") || `map-${Date.now()}`;
}
