import jwt from "jsonwebtoken";
import { users } from "./data.js";

// У навчальному проєкті секрет зберігається в коді,
// у реальному — лише у змінних середовища
export const JWT_SECRET = "august-lab3-secret";

// Створює токен на основі id користувача (термін дії — 1 година)
export function createToken(user) {
  return jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "1h" });
}

// Перевіряє токен і повертає користувача або null
export function getUserFromToken(token) {
  if (!token) return null;

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    return users.find((user) => user.id === payload.userId) || null;
  } catch (error) {
    return null;
  }
}

// Виділяє токен із заголовка "Authorization: Bearer <token>"
export function getUserFromAuthHeader(authHeader) {
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;

  const token = authHeader.slice("Bearer ".length).trim();
  return getUserFromToken(token);
}
