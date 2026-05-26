const http = require("http");
const fs = require("fs");
const path = require("path");

const root = __dirname;
const levelsDir = path.join(root, "assets", "levels");
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
};

http
  .createServer((req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
      res.writeHead(204);
      res.end();
      return;
    }

    const apiMatch = req.url.match(/^\/api\/levels\/(\d+)$/);
    if (apiMatch && req.method === "POST") {
      const levelNumber = Math.max(1, Math.min(10, Number(apiMatch[1]) || 1));
      let body = "";
      req.setEncoding("utf8");
      req.on("data", (chunk) => {
        body += chunk;
        if (body.length > 30 * 1024 * 1024) req.destroy();
      });
      req.on("end", () => {
        try {
          const parsed = JSON.parse(body);
          fs.mkdirSync(levelsDir, { recursive: true });
          fs.writeFileSync(path.join(levelsDir, `level-${levelNumber}.json`), JSON.stringify(parsed, null, 2));
          res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
          res.end(JSON.stringify({ ok: true, file: `assets/levels/level-${levelNumber}.json` }));
        } catch (error) {
          res.writeHead(400, { "Content-Type": "application/json; charset=utf-8" });
          res.end(JSON.stringify({ ok: false, error: error.message }));
        }
      });
      return;
    }

    const requestPath = req.url === "/" ? "/index.html" : req.url.split("?")[0];
    const file = path.normalize(path.join(root, decodeURIComponent(requestPath)));

    if (!file.startsWith(root)) {
      res.writeHead(403);
      res.end("Forbidden");
      return;
    }

    fs.readFile(file, (error, data) => {
      if (error) {
        res.writeHead(404);
        res.end("Not found");
        return;
      }

      res.writeHead(200, { "Content-Type": types[path.extname(file)] || "application/octet-stream" });
      res.end(data);
    });
  })
  .listen(4173, "127.0.0.1", () => {
    console.log("Demo server running at http://127.0.0.1:4173/");
  });
