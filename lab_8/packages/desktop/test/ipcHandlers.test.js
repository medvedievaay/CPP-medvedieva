import test from "node:test";
import assert from "node:assert/strict";
import { CartService, MemoryStorageAdapter, MAX_ITEM_QTY, ERROR_TOO_MANY } from "@august/core";
import { createHandlers } from "../ipcHandlers.js";

const makeHandlers = () => createHandlers(new CartService(new MemoryStorageAdapter()));

test("add додає товар, а state показує підписи цін", () => {
    const handlers = makeHandlers();
    assert.equal(handlers.add(1).ok, true);
    const state = handlers.state("");
    assert.equal(state.count, 1);
    assert.equal(state.totalLabel, "54.99 грн");
    assert.equal(state.items[0].lineTotalLabel, "54.99 грн");
});

test("некоректні дані з рендер-процесу відхиляються", () => {
    const handlers = makeHandlers();
    assert.equal(handlers.add("1").ok, false);
    assert.equal(handlers.setQty(1, "5").ok, false);
    assert.equal(handlers.remove(null).ok, false);
});

test("state фільтрує каталог за запитом", () => {
    const state = makeHandlers().state("сир");
    assert.equal(state.products.length, 1);
    assert.equal(state.products[0].priceLabel, "119.00 грн");
});

test("remove видаляє товар", () => {
    const handlers = makeHandlers();
    handlers.add(2);
    assert.equal(handlers.remove(2).ok, true);
    assert.equal(handlers.state("").count, 0);
});

test("правило ядра діє й у десктопних обробниках", () => {
    const handlers = makeHandlers();
    handlers.setQty(1, MAX_ITEM_QTY);
    assert.deepEqual(handlers.add(1), { ok: false, error: ERROR_TOO_MANY });
});
