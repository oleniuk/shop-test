const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// Схема для лінійок
const lineSchema = new mongoose.Schema({
  name: { type: String, required: true },
});

// Перевірка, чи модель вже існує
const Line = mongoose.models.Line || mongoose.model("Line", lineSchema);

// Отримання всіх лінійок
router.get("/", async (req, res) => {
  try {
    const lines = await Line.find();
    res.json(lines);
  } catch (error) {
    console.error("Помилка отримання лінійок:", error);
    res.status(500).json({ message: "Помилка сервера" });
  }
});

// Створення нової лінійки
router.post("/", async (req, res) => {
  try {
    const { name } = req.body;
    const newLine = new Line({ name });
    await newLine.save();
    res.status(201).json({ message: "Лінійку створено", line: newLine });
  } catch (error) {
    console.error("Помилка створення лінійки:", error);
    res.status(500).json({ message: "Помилка сервера" });
  }
});

// Оновлення лінійки
router.put("/:id", async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Назва лінійки є обов'язковою" });
    }

    const updatedLine = await Line.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true }
    );

    if (!updatedLine) {
      return res.status(404).json({ message: "Лінійку не знайдено" });
    }

    res.json({ message: "Лінійку оновлено", line: updatedLine });
  } catch (error) {
    console.error("Помилка оновлення лінійки:", error);
    res.status(500).json({ message: "Помилка сервера" });
  }
});

// Видалення лінійки
router.delete("/:id", async (req, res) => {
  try {
    const deletedLine = await Line.findByIdAndDelete(req.params.id);

    if (!deletedLine) {
      return res.status(404).json({ message: "Лінійку не знайдено" });
    }

    res.json({ message: "Лінійку видалено" });
  } catch (error) {
    console.error("Помилка видалення лінійки:", error);
    res.status(500).json({ message: "Помилка сервера" });
  }
});

module.exports = router;
