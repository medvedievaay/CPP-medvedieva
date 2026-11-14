// Мінімальний статичний сервер без зовнішніх залежностей
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const webDir = path.dirname(fileURLToPath(import.meta.url));
// Тека пакета ядра: import.meta.resolve повертає шлях до index.js
const coreDir = path.dirname(fileURLToPath(import.meta.resolve("@august/core")));

// Білий список файлів веб-клієнта
const WEB_FILES = new Set(["/index.html", "/script.js", "/style.css", "/localStorageAdapter.js"]);
const CORE_PREFIX = "/node_modules/@august/core/";

const TYPES = {
    ".html": "text/html; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".css": "text/css; charset=utf-8",
};

// Повертає шлях до файлу на диску або null, якщо запит заборонено
export function resolveRequest(urlPath) {
    const pathname = urlPath.split("?")[0];
    if (pathname.includes("..") || pathname.includes("\\") || pathname.includes("%")) {
        return null;
    }
    const normalized = pathname === "/" ? "/index.html" : pathname;
    if (WEB_FILES.has(normalized)) {
        return path.join(webDir, normalized);
    }
    if (normalized.startsWith(CORE_PREFIX)) {
        const name = normalized.slice(CORE_PREFIX.length);
        // лише модулі ядра безпосередньо в теці пакета (без test/ та package.json)
        if (/^[A-Za-z]+\.js$/.test(name)) {
            return path.join(coreDir, name);
        }
    }
    return null;
}

export function createServer() {
    return http.createServer((req, res) => {
        const filePath = resolveRequest(req.url ?? "/");
        if (filePath === null || !fs.existsSync(filePath)) {
            res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
            res.end("404 Not Found");
            return;
        }
        res.writeHead(200, { "Content-Type": TYPES[path.extname(filePath)] ?? "application/octet-stream" });
        fs.createReadStream(filePath).pipe(res);
    });
}

// Запуск лише коли файл виконується напряму (а не імпортується в тестах)
if (process.argv[1] === fileURLToPath(import.meta.url)) {
    const port = process.env.PORT ?? 3000;
    createServer().listen(port, () => console.log(`August Web: http://localhost:${port}`));
}
