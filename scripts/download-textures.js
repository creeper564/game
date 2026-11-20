// Télécharge les textures du wiki Minecraft dans img/items/ (optionnel, Node >= 18).
// Usage : node scripts/download-textures.js
// Puis commit le dossier img/items/ : le site n'appellera plus le wiki.
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.join(__dirname, "..");
const ctx = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(root, "js", "crafts-data.js"), "utf8"), ctx);
const out = path.join(root, "img", "items");
fs.mkdirSync(out, { recursive: true });

(async () => {
  const files = [...new Set(Object.values(ctx.window.GK_ITEMS).map((i) => i.wiki).filter(Boolean))];
  for (const f of files) {
    const name = f.startsWith("Invicon_") ? f : "Invicon_" + f;
    try {
      const res = await fetch("https://minecraft.wiki/w/Special:FilePath/" + encodeURIComponent(name), {
        headers: { "User-Agent": "GameKnightSMP/1.0 (texture download)" },
      });
      if (!res.ok) throw new Error(res.status);
      fs.writeFileSync(path.join(out, name), Buffer.from(await res.arrayBuffer()));
      console.log("OK  ", name);
    } catch (e) {
      console.log("FAIL", name, e.message);
    }
  }
})();
