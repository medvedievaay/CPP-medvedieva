import test from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import { createServer, resolveRequest } from "../server.js";

function request(port, path) {
    return new Promise((resolve, reject) => {
        http.get({ port, path, host: "127.0.0.1" }, (res) => {
            res.resume();
            res.on("end", () => resolve(res.statusCode));
        }).on("error", reject);
    });
}

test("resolveRequest дозволяє файли веб-клієнта та модулі ядра", () => {
    assert.notEqual(resolveRequest("/"), null);
    assert.notEqual(resolveRequest("/script.js"), null);
    assert.notEqual(resolveRequest("/node_modules/@august/core/index.js"), null);
});

test("resolveRequest забороняє сторонні файли та вихід за межі теки", () => {
    assert.equal(resolveRequest("/server.js"), null);
    assert.equal(resolveRequest("/package.json"), null);
    assert.equal(resolveRequest("/node_modules/@august/core/package.json"), null);
    assert.equal(resolveRequest("/node_modules/@august/core/../../package.json"), null);
});

test("сервер відповідає 200 для дозволених і 404 для заборонених шляхів", async () => {
    const server = createServer();
    await new Promise((resolve) => server.listen(0, resolve));
    const { port } = server.address();
    try {
        assert.equal(await request(port, "/"), 200);
        assert.equal(await request(port, "/node_modules/@august/core/index.js"), 200);
        assert.equal(await request(port, "/server.js"), 404);
        assert.equal(await request(port, "/node_modules/@august/core/../../package.json"), 404);
    } finally {
        server.close();
    }
});
