import test from "node:test";
import assert from "node:assert/strict";
import { CartService, MemoryStorageAdapter, ERROR_EMPTY_NAME, CATEGORIES } from "@august/core";
import { createHandlers, ERROR_BAD_DATA } from "../ipcHandlers.js";

function makeHandlers() {
    return createHandlers(new CartService(new MemoryStorageAdapter()));
}

test("add і summary: товар з'являється з полем priceLabel", async () => {
    const h = makeHandlers();
    const result = await h.add({ name: "Сік", price: "45,5", category: "Напої" });
    assert.equal(result.ok, true);
    const summary = await h.summary();
    assert.equal(summary.items[0].priceLabel, "45.50 грн");
    assert.equal(summary.totalLabel, "45.50 грн");
    assert.equal(summary.count, 1);
});

test("add повертає помилку ядра для порожнього значення та відхиляє некоректний тип", async () => {
    const h = makeHandlers();
    assert.deepEqual(await h.add({ name: "  ", price: 10, category: "Напої" }), {
        ok: false,
        error: ERROR_EMPTY_NAME,
    });
    assert.deepEqual(await h.add("рядок"), { ok: false, error: ERROR_BAD_DATA });
    assert.deepEqual(await h.add({ name: 5, price: 10, category: "Напої" }), { ok: false, error: ERROR_BAD_DATA });
    assert.deepEqual(await h.add(null), { ok: false, error: ERROR_BAD_DATA });
});

test("catalog ігнорує запит неправильного типу, а рядковий запит фільтрує", () => {
    const h = makeHandlers();
    assert.equal(h.catalog(42).length, 6);
    assert.equal(h.catalog("сир").length, 1);
    assert.equal(h.catalog("сир")[0].priceLabel, "119.00 грн");
});

test("addProduct та changeQty перевіряють типи", async () => {
    const h = makeHandlers();
    assert.deepEqual(await h.addProduct(5), { ok: false, error: ERROR_BAD_DATA });
    await h.addProduct("Вода негазована, 1.5 л");
    const id = (await h.summary()).items[0].id;
    assert.deepEqual(await h.changeQty("1", 1), { ok: false, error: ERROR_BAD_DATA });
    assert.deepEqual(await h.changeQty(id, 5), { ok: false, error: ERROR_BAD_DATA });
    assert.equal((await h.changeQty(id, 1)).ok, true);
    assert.equal((await h.summary()).items[0].qty, 2);
});

test("remove видаляє позицію й відхиляє id не числом", async () => {
    const h = makeHandlers();
    await h.addProduct("Вода негазована, 1.5 л");
    const id = (await h.summary()).items[0].id;
    assert.deepEqual(await h.remove("abc"), { ok: false, error: ERROR_BAD_DATA });
    assert.deepEqual(await h.remove(id), { ok: true });
    assert.equal((await h.summary()).count, 0);
});

test("meta повертає категорії ядра", () => {
    assert.deepEqual(makeHandlers().meta().categories, CATEGORIES);
});
