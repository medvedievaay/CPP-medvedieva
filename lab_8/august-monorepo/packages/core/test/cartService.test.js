import test from "node:test";
import assert from "node:assert/strict";
import { CartService, ERROR_NOT_FOUND } from "../cartService.js";
import { MemoryStorageAdapter, CartStorageAdapter } from "../storageAdapter.js";
import { ERROR_EMPTY_NAME } from "../itemValidation.js";
import { PRODUCTS } from "../catalog.js";

function makeService(initial) {
    const adapter = new MemoryStorageAdapter(initial);
    return { adapter, service: new CartService(adapter) };
}

const juice = { name: "Сік", price: 45, category: "Напої" };

test("базовий адаптер кидає помилку «не реалізовано»", async () => {
    const adapter = new CartStorageAdapter();
    await assert.rejects(() => adapter.load(), /не реалізовано/);
    await assert.rejects(() => adapter.save([]), /не реалізовано/);
});

test("add зберігає товар в адаптері", async () => {
    const { adapter, service } = makeService();
    const result = await service.add(juice);
    assert.equal(result.ok, true);
    assert.equal(adapter.items.length, 1);
    assert.equal(adapter.items[0].name, "Сік");
});

test("add не зберігає некоректний товар і повертає повідомлення про помилку", async () => {
    const { adapter, service } = makeService();
    const result = await service.add({ ...juice, name: "   " });
    assert.deepEqual(result, { ok: false, error: ERROR_EMPTY_NAME });
    assert.equal(adapter.items.length, 0);
});

test("add видає унікальні id навіть за однакового часу", async () => {
    const fixed = new Date("2026-11-06T12:00:00Z");
    const adapter = new MemoryStorageAdapter();
    const service = new CartService(adapter, { now: () => fixed });
    await service.add(juice);
    await service.add({ ...juice, name: "Чай" });
    const ids = adapter.items.map((i) => i.id);
    assert.equal(new Set(ids).size, 2);
});

test("повторне додавання того самого товару збільшує кількість", async () => {
    const { service } = makeService();
    await service.add(juice);
    await service.add({ ...juice, name: "сік" });
    const { items, count } = await service.summary();
    assert.equal(items.length, 1);
    assert.equal(items[0].qty, 2);
    assert.equal(count, 2);
});

test("addProduct додає товар із каталогу, невідомий — повідомляє про помилку", async () => {
    const { service } = makeService();
    const ok = await service.addProduct(PRODUCTS[0].name);
    assert.equal(ok.ok, true);
    assert.deepEqual(await service.addProduct("Немає такого"), { ok: false, error: ERROR_NOT_FOUND });
});

test("changeQty змінює кількість, а на нулі видаляє позицію", async () => {
    const { service } = makeService();
    await service.addProduct(PRODUCTS[0].name);
    const { items } = await service.summary();
    const id = items[0].id;
    assert.deepEqual(await service.changeQty(id, 1), { ok: true, removed: false });
    assert.equal((await service.summary()).items[0].qty, 2);
    await service.changeQty(id, -1);
    assert.deepEqual(await service.changeQty(id, -1), { ok: true, removed: true });
    assert.equal((await service.summary()).items.length, 0);
});

test("remove видаляє товар за id", async () => {
    const { service } = makeService();
    await service.add(juice);
    const { items } = await service.summary();
    assert.deepEqual(await service.remove(items[0].id), { ok: true });
    assert.equal((await service.summary()).items.length, 0);
});

test("remove повідомляє, якщо товару немає", async () => {
    const { service } = makeService();
    assert.deepEqual(await service.remove(999), { ok: false, error: ERROR_NOT_FOUND });
    assert.equal((await service.changeQty(999, 1)).ok, false);
});

test("summary рахує суму та ігнорує пошкоджені записи в сховищі", async () => {
    const { service } = makeService([
        { id: 1, name: "Сік", price: 45, qty: 2, addedAt: "2026-11-06T12:00:00Z" },
        { id: 2, name: "", price: 10, qty: 1 },
        "сміття",
    ]);
    const summary = await service.summary();
    assert.equal(summary.items.length, 1);
    assert.equal(summary.total, 90);
});

test("searchProducts фільтрує каталог без урахування регістру", () => {
    const { service } = makeService();
    assert.equal(service.searchProducts("СИР").length, 1);
    assert.equal(service.searchProducts("").length, PRODUCTS.length);
});
