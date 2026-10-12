// Тимчасове сховище в оперативній пам'яті (без бази даних).
// Після перезапуску сервера дані зникають.
export const users = [];
export const products = [];

let nextUserId = 1;
let nextProductId = 1;

// Повертає черговий унікальний id користувача (рядок)
export function getNextUserId() {
  return String(nextUserId++);
}

// Повертає черговий унікальний id товару (рядок)
export function getNextProductId() {
  return String(nextProductId++);
}
