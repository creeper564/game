const path = require("path");
const express = require("express");

const app = express();
const PORT = Number(process.env.SERVER_PORT || process.env.PORT || 3000);
const PUBLIC_DIR = path.join(__dirname, "public");

const JAVA_HOST = "smp.gameknight.kdns.fr";
const WIKI_UA = "GameKnightSMP/1.0 (wiki invicon proxy; +https://minecraft.wiki/)";

app.disable("x-powered-by");

app.use((_req, res, next) => {
  res.set("X-Content-Type-Options", "nosniff");
  res.set("Referrer-Policy", "strict-origin-when-cross-origin");
  next();
});

app.use(
  express.static(PUBLIC_DIR, {
    extensions: ["html"],
    maxAge: "1h",
  })
);

/* ---------- Proxy des textures du wiki Minecraft ---------- */

const wikiCache = new Map(); // filename -> { type, body } | { missing: true, at }
const MISSING_TTL = 10 * 60 * 1000;

app.get("/api/wiki-item/:file", async (req, res) => {
  const file = String(req.params.file || "");
  if (!/^[A-Za-z0-9][A-Za-z0-9._-]*\.(png|gif|webp)$/i.test(file)) {
    return res.status(400).send("Invalid wiki texture name");
  }

  const filename = file.startsWith("Invicon_") ? file : `Invicon_${file}`;
  const cached = wikiCache.get(filename);

  if (cached && cached.missing && Date.now() - cached.at < MISSING_TTL) {
    return res.status(404).send("Wiki texture not found");
  }
  if (cached && !cached.missing) {
    res.set("Content-Type", cached.type);
    res.set("Cache-Control", "public, max-age=86400");
    return res.send(cached.body);
  }

  try {
    // Special:FilePath redirige vers le vrai chemin (hash) de l'image :
    // l'ancienne URL /images/<fichier> ne fonctionnait pas.
    const response = await fetch(
      `https://minecraft.wiki/w/Special:FilePath/${encodeURIComponent(filename)}`,
      {
        redirect: "follow",
        signal: AbortSignal.timeout(8000),
        headers: {
          "User-Agent": WIKI_UA,
          Accept: "image/png,image/gif,image/webp,image/*;q=0.8",
        },
      }
    );

    const type = response.headers.get("content-type") || "";
    if (!response.ok || !type.startsWith("image/")) {
      wikiCache.set(filename, { missing: true, at: Date.now() });
      return res.status(404).send("Wiki texture not found");
    }

    const body = Buffer.from(await response.arrayBuffer());
    wikiCache.set(filename, { type, body });
    res.set("Content-Type", type);
    res.set("Cache-Control", "public, max-age=86400");
    res.send(body);
  } catch (_error) {
    res.status(502).send("Wiki unavailable");
  }
});

/* ---------- Statut du serveur Java (joueurs en ligne) ---------- */

let statusCache = { at: 0, data: null };
const STATUS_TTL = 30 * 1000;

app.get("/api/status", async (_req, res) => {
  res.set("Cache-Control", "no-store");
  if (statusCache.data && Date.now() - statusCache.at < STATUS_TTL) {
    return res.json(statusCache.data);
  }

  try {
    const response = await fetch(`https://api.mcsrvstat.us/3/${JAVA_HOST}`, {
      signal: AbortSignal.timeout(6000),
      headers: { "User-Agent": WIKI_UA },
    });
    if (!response.ok) throw new Error("status " + response.status);
    const json = await response.json();
    const data = {
      online: Boolean(json.online),
      players: {
        online: (json.players && json.players.online) || 0,
        max: (json.players && json.players.max) || 0,
      },
      version: (json.version && String(json.version)) || null,
    };
    statusCache = { at: Date.now(), data };
    res.json(data);
  } catch (_error) {
    if (statusCache.data) return res.json(statusCache.data);
    res.status(502).json({ online: false, players: { online: 0, max: 0 }, error: true });
  }
});

/* ---------- Pages ---------- */

app.get("/", (_req, res) => {
  res.sendFile(path.join(PUBLIC_DIR, "index.html"));
});

app.get("/crafts", (_req, res) => {
  res.sendFile(path.join(PUBLIC_DIR, "crafts.html"));
});

app.use((_req, res) => {
  res.status(404).sendFile(path.join(PUBLIC_DIR, "404.html"));
});

app.listen(PORT, () => {
  console.log(`GameKnight SMP site listening on port ${PORT}`);
});
