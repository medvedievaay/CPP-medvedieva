import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { CartService } from "@august/core";
import { FileStorageAdapter } from "../fileStorageAdapter.js";

async function tempFile(name = "cart.json") {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), "august-"));
    return path.join(dir, name);
}

test("load повертає [], якщо файлу немає", async () => {
    const adapter = new FileStorageAdapter(await tempFile());
    assert.deepEqual(await adapter.load(), []);
});

test("save створює теку та файл, load читає дані назад", async () => {
    const file = path.join(path.dirname(await tempFile()), "nested", "cart.json");
    const adapter = new FileStorageAdapter(file);
    const items = [{ id: 1, name: "Сік", price: 45, qty: 2 }];
    await adapter.save(items);
    assert.deepEqual(await adapter.load(), items);
});

test("load повертає [] для пошкодженого файлу та для не-масиву", async () => {
    const file = await tempFile();
    await fs.writeFile(file, "{ не json", "utf-8");
    const adapter = new FileStorageAdapter(file);
    assert.deepEqual(await adapter.load(), []);
    await fs.writeFile(file, '{"a":1}', "utf-8");
    assert.deepEqual(await adapter.load(), []);
});

test("адаптер працює зі спільним CartService", async () => {
    const file = await tempFile();
    const service = new CartService(new FileStorageAdapter(file));
    await service.addProduct("Молоко 2.5%, 1 л");
    const second = new CartService(new FileStorageAdapter(file));
    assert.equal((await second.summary()).items.length, 1);
});
