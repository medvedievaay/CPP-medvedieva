import test from "node:test";
import assert from "node:assert/strict";
import {
    PRODUCTS, formatPrice, calculateTotal, countItems,
    filterProductsByQuery, sortByName, sanitizeCart, MAX_ITEM_QTY,
} from "../index.js";

test("formatPrice форматує ціну з двома знаками", () => {
    assert.equal(formatPrice(54.99), "54.99 грн");
    assert.equal(formatPrice(32.5), "32.50 грн");
});

test("formatPrice для некоректного значення повертає порожній рядок", () => {
    assert.equal(formatPrice("abc"), "");
    assert.equal(formatPrice(NaN), "");
});

test("calculateTotal і countItems рахують суму та кількість", () => {
    const lines = [{ price: 54.99, qty: 2 }, { price: 32.5, qty: 1 }];
    assert.equal(calculateTotal(lines), 142.48);
    assert.equal(countItems(lines), 3);
});

test("filterProductsByQuery шукає без урахування регістру", () => {
    const found = filterProductsByQuery(PRODUCTS, "МОЛОКО");
    assert.equal(found.length, 1);
    assert.equal(found[0].id, 1);
});

test("filterProductsByQuery з порожнім запитом повертає всі товари", () => {
    assert.equal(filterProductsByQuery(PRODUCTS, "  ").length, PRODUCTS.length);
});

test("sortByName не змінює вихідний масив", () => {
    const copy = PRODUCTS.map((p) => p.id);
    const sorted = sortByName(PRODUCTS);
    assert.deepEqual(PRODUCTS.map((p) => p.id), copy);
    assert.equal(sorted.length, PRODUCTS.length);
});

test("sanitizeCart відкидає некоректні записи й дублікати", () => {
    const raw = [
        { id: 1, qty: 2 },
        { id: 1, qty: 3 },
        { id: 999, qty: 1 },
        { id: 2, qty: 0 },
        { id: 3, qty: MAX_ITEM_QTY + 1 },
        null,
        "рядок",
    ];
    assert.deepEqual(sanitizeCart(raw, PRODUCTS), [{ id: 1, qty: 2 }]);
    assert.deepEqual(sanitizeCart("не масив", PRODUCTS), []);
});
