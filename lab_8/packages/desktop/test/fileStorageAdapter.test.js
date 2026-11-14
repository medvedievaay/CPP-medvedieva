import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { FileStorageAdapter } from "../fileStorageAdapter.js";

const makeTempDir = async () => fs.mkdtempSync(path.join(os.tmpdir(), "august-"));

test("якщо файлу немає, повертається порожній масив", async () => {
    const dir = await makeTempDir();
    assert.deepEqual(new FileStorageAdapter(path.join(dir, "cart.json")).load(), []);
});

test("запис із наступним читанням", async () => {
    const dir = await makeTempDir();
    const adapter = new FileStorageAdapter(path.join(dir, "cart.json"));
    adapter.save([{ id: 2, qty: 3 }]);
    assert.deepEqual(adapter.load(), [{ id: 2, qty: 3 }]);
});

test("save створює теку, якщо її немає", async () => {
    const dir = await makeTempDir();
    const file = path.join(dir, "nested", "data", "cart.json");
    new FileStorageAdapter(file).save([]);
    assert.equal(fs.existsSync(file), true);
});

test("пошкоджений файл не ламає застосунок", async () => {
    const dir = await makeTempDir();
    const file = path.join(dir, "cart.json");
    fs.writeFileSync(file, "{не json");
    assert.deepEqual(new FileStorageAdapter(file).load(), []);
});
