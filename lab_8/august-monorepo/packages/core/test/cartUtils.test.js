import test from "node:test";
import assert from "node:assert/strict";
import {
    formatPrice,
    createCartItem,
    countItems,
    calcTotal,
    sortItemsByAdded,
    filterByQuery,
    sanitizeItems,
} from "../cartUtils.js";

test("formatPrice показує дві цифри після крапки та гривню", () => {
    assert.equal(formatPrice(54.99), "54.99 грн");
    assert.equal(formatPrice(68), "68.00 грн");
});

test("createCartItem обрізає пробіли, ставить кількість 1 і час додавання", () => {
    const now = new Date("2026-11-06T12:00:00Z");
    const item = createCartItem({ name: "  Сік  ", price: "45,5", category: "Напої" }, 7, now);
    assert.equal(item.name, "Сік");
    assert.equal(item.price, 45.5);
    assert.equal(item.qty, 1);
    assert.equal(item.id, 7);
    assert.equal(item.addedAt, "2026-11-06T12:00:00.000Z");
});

test("calcTotal і countItems рахують суму та кількість", () => {
    const items = [
        { price: 10.1, qty: 3 },
        { price: 0.2, qty: 1 },
    ];
    assert.equal(calcTotal(items), 30.5);
    assert.equal(countItems(items), 4);
    assert.equal(calcTotal([]), 0);
});

test("sortItemsByAdded ставить раніше додані першими й не змінює вихідний масив", () => {
    const items = [
        { id: 2, addedAt: "2026-11-06T12:00:00Z" },
        { id: 1, addedAt: "2026-11-06T13:00:00Z" },
    ];
    const sorted = sortItemsByAdded(items);
    assert.deepEqual(sorted.map((i) => i.id), [2, 1]);
    assert.deepEqual(items.map((i) => i.id), [2, 1]);
    assert.notEqual(sorted, items);
});

test("sortItemsByAdded підтримує записи без addedAt (за id)", () => {
    const sorted = sortItemsByAdded([{ id: 3 }, { id: 1 }]);
    assert.deepEqual(sorted.map((i) => i.id), [1, 3]);
});

test("filterByQuery шукає без урахування регістру; порожній запит повертає все", () => {
    const list = [{ name: "Молоко 2.5%" }, { name: "Сир твердий" }];
    assert.deepEqual(filterByQuery(list, "МОЛ"), [{ name: "Молоко 2.5%" }]);
    assert.equal(filterByQuery(list, "").length, 2);
    assert.equal(filterByQuery(list, "xyz").length, 0);
});

test("sanitizeItems відкидає некоректні записи", () => {
    const raw = [
        { id: 1, name: "Сік", price: 10, qty: 2 },
        { id: 2, name: "", price: 10, qty: 1 },
        { id: 3, name: "Хліб", price: -1, qty: 1 },
        { id: 4, name: "Вода", price: 5, qty: 0 },
        null,
    ];
    const clean = sanitizeItems(raw);
    assert.equal(clean.length, 1);
    assert.equal(clean[0].category, "Інше");
    assert.deepEqual(sanitizeItems("рядок"), []);
});
