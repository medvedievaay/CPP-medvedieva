import test from "node:test";
import assert from "node:assert/strict";
import {
    MAX_NAME_LENGTH,
    ERROR_EMPTY_NAME,
    ERROR_TOO_LONG,
    ERROR_PRICE,
    ERROR_CATEGORY,
    validateItem,
    parsePrice,
} from "../itemValidation.js";

const valid = { name: "Сік яблучний", price: 45, category: "Напої" };

test("коректний товар проходить перевірку", () => {
    assert.deepEqual(validateItem(valid), { isValid: true, error: "" });
});

test("порожня назва і самі пробіли не проходять перевірку", () => {
    assert.deepEqual(validateItem({ ...valid, name: "" }), { isValid: false, error: ERROR_EMPTY_NAME });
    assert.equal(validateItem({ ...valid, name: "   " }).error, ERROR_EMPTY_NAME);
});

test("назва не рядок не проходить перевірку", () => {
    assert.equal(validateItem({ ...valid, name: 42 }).error, ERROR_EMPTY_NAME);
    assert.equal(validateItem(null).error, ERROR_EMPTY_NAME);
});

test("межа довжини: рівно MAX_NAME_LENGTH символів допустимо, на один більше — ні", () => {
    assert.equal(validateItem({ ...valid, name: "a".repeat(MAX_NAME_LENGTH) }).isValid, true);
    assert.deepEqual(validateItem({ ...valid, name: "a".repeat(MAX_NAME_LENGTH + 1) }), {
        isValid: false,
        error: ERROR_TOO_LONG,
    });
});

test("довжина вимірюється після видалення зайвих пробілів", () => {
    const padded = "  " + "a".repeat(MAX_NAME_LENGTH) + "  ";
    assert.equal(validateItem({ ...valid, name: padded }).isValid, true);
});

test("ціна має бути більшою за нуль; кома як роздільник допускається", () => {
    assert.equal(validateItem({ ...valid, price: 0 }).error, ERROR_PRICE);
    assert.equal(validateItem({ ...valid, price: -5 }).error, ERROR_PRICE);
    assert.equal(validateItem({ ...valid, price: "abc" }).error, ERROR_PRICE);
    assert.equal(validateItem({ ...valid, price: "12,5" }).isValid, true);
    assert.equal(parsePrice("12,5"), 12.5);
});

test("категорія має бути зі списку", () => {
    assert.equal(validateItem({ ...valid, category: "" }).error, ERROR_CATEGORY);
    assert.equal(validateItem({ ...valid, category: "Невідома" }).error, ERROR_CATEGORY);
});
