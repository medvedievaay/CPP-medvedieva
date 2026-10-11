import dns from "node:dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./services/db.js";
import productRoutes from "./routes/productRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Логування кожного запиту
app.use((req, res, next) => {
  console.log(req.method, req.originalUrl);
  next();
});

// Тестовий маршрут
app.get("/", (req, res) => {
  res.send("Сервер August працює!");
});

app.use("/api/products", productRoutes);

try {
  await connectDB(process.env.MONGO_URI);
  app.listen(PORT, () => {
    console.log(`Сервер запущено на порті ${PORT}`);
  });
} catch (error) {
  console.error("Помилка підключення до MongoDB:", error.message);
  process.exit(1);
}
