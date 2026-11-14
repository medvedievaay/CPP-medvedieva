// Мінімальний статичний сервер веб-клієнта (без зовнішніх залежностей)
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const webDir = path.dirname(fileURLToPath(import.meta.url));
// Тека пакета ядра: шлях знаходимо за ім'ям пакета (через символьне посилання workspaces)
const coreDir = path.dirname(fileURLToPath(import.meta.resolve("@august/core")));

// Білий список файлів веб-клієнта
const WEB_FILES = new Set(["index.html", "script.js", "style.css", "localStorageAdapter.js"]);
const CORE_PREFIX = "/node_modules/@august/core/";

const TYPES = {
    ".html": "text/html; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".css": "text/css; charset=utf-8",
};

/*
  resolveFilePath повертає шлях до дозволеного файлу або null (відповідь 404).
  Файли ядра віддаються лише з кореня пакета (без вкладених тек і ../).
*/
export function resolveFilePath(urlPath) {
    let pathname;
    try {
        pathname = decodeURIComponent(urlPath.split("?")[0]);
    } catch (error) {
        return null;
    }

    if (pathname === "/") {
        pathname = "/index.html";
    }

    if (pathname.startsWith(CORE_PREFIX)) {
        const name = pathname.slice(CORE_PREFIX.length);
        return /^[A-Za-z]+\.js$/.test(name) ? path.join(coreDir, name) : null;
    }

    const name = pathname.slice(1);
    return WEB_FILES.has(name) ? path.join(webDir, name) : null;
}

export function createServer() {
    return http.createServer(function (request, response) {
        const filePath = resolveFilePath(request.url);

        if (!filePath || !fs.existsSync(filePath)) {
            response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
            response.end("Не знайдено");
            return;
        }

        response.writeHead(200, { "Content-Type": TYPES[path.extname(filePath)] });
        fs.createReadStream(filePath).pipe(response);
    });
}

// Запуск лише коли файл виконано напряму (не під час імпорту в тестах)
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
    const port = process.env.PORT || 3000;
    createServer().listen(port, function () {
        console.log("August Web: http://localhost:" + port);
    });
}
