const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const mongoose = require("mongoose"); 
const path = require("path");

// Імпорт маршрутів
const linesRoutes = require("./lines");
const productsRoutes = require("./products");

const app = express();

// Middleware для обробки JSON
app.use(express.json());

// Middleware для безпеки
app.use(helmet());
app.use(cors({ origin: ["https://kondordevice.com", "https://vps-kondordevice.onrender.com"] }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

// Підключення до MongoDB
const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb+srv://kondor-device:vps-kondor@cluster0.ia6yx.mongodb.net/?retryWrites=true&w=majority";

  mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("Підключено до MongoDB"))
.catch((error) => {
    console.error("Помилка підключення до MongoDB:", error);
    process.exit(1); // Завершити процес, якщо не вдалося підключитися
});


// Маршрути
app.use("/api/lines", linesRoutes);
app.use("/api/products", productsRoutes);

// Головний маршрут
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Запуск сервера
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Сервер запущено на порту ${PORT}`));
