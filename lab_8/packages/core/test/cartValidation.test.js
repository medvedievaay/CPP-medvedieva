import test from "node:test";
import assert from "node:assert/strict";
import { validateQuantity, MAX_ITEM_QTY, ERROR_TOO_MANY, ERROR_NOT_INTEGER, ERROR_NEGATIVE } from "../index.js";

test("коректна кількість проходить перевірку", () => {
    assert.deepEqual(validateQuantity(3), { isValid: true, error: null });
});

test("нуль допустимий (видалення товару)", () => {
    assert.equal(validateQuantity(0).isValid, true);
});

test("межа MAX_ITEM_QTY допустима", () => {
    assert.equal(validateQuantity(MAX_ITEM_QTY).isValid, true);
});

test("MAX_ITEM_QTY + 1 відхиляється", () => {
    assert.deepEqual(validateQuantity(MAX_ITEM_QTY + 1), { isValid: false, error: ERROR_TOO_MANY });
});

test("дробове число та не число відхиляються", () => {
    assert.equal(validateQuantity(1.5).error, ERROR_NOT_INTEGER);
    assert.equal(validateQuantity("2").error, ERROR_NOT_INTEGER);
});

test("від’ємна кількість відхиляється", () => {
    assert.equal(validateQuantity(-1).error, ERROR_NEGATIVE);
});
