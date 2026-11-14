import test from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { resolveFilePath, createServer } from "../server.js";

test("resolveFilePath: головна сторінка та файли ядра дозволені", () => {
    assert.ok(resolveFilePath("/").endsWith("index.html"));
    assert.ok(resolveFilePath("/script.js").endsWith("script.js"));
    const core = resolveFilePath("/node_modules/@august/core/index.js");
    assert.equal(path.basename(core), "index.js");
    assert.ok(resolveFilePath("/node_modules/@august/core/cartService.js"));
});

test("resolveFilePath: вихід за межі теки та серверні файли заборонені", () => {
    assert.equal(resolveFilePath("/server.js"), null);
    assert.equal(resolveFilePath("/package.json"), null);
    assert.equal(resolveFilePath("/node_modules/@august/core/../package.json"), null);
    assert.equal(resolveFilePath("/node_modules/@august/core/test/cartService.test.js"), null);
    assert.equal(resolveFilePath("/%2e%2e/package.json"), null);
});

test("сервер віддає index.html і модуль ядра з правильними типами, а server.js — 404", async () => {
    const server = createServer();
    await new Promise((resolve) => server.listen(0, resolve));
    const base = "http://localhost:" + server.address().port;
    try {
        const page = await fetch(base + "/");
        assert.equal(page.status, 200);
        assert.match(page.headers.get("content-type"), /text\/html/);

        const core = await fetch(base + "/node_modules/@august/core/index.js");
        assert.equal(core.status, 200);
        assert.match(core.headers.get("content-type"), /text\/javascript/);

        assert.equal((await fetch(base + "/server.js")).status, 404);
        assert.equal((await fetch(base + "/package.json")).status, 404);
    } finally {
        server.close();
    }
});
