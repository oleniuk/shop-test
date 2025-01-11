const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// Схема для продуктів
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  price: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  discountedPrice: { type: Number, default: 0 },
  lineId: { type: mongoose.Schema.Types.ObjectId, ref: "Line", required: true },
});

const Product = mongoose.models.Product || mongoose.model("Product", productSchema);

// Отримання всіх продуктів
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().populate("lineId", "name");
    res.json(products);
  } catch (error) {
    console.error("Помилка отримання продуктів:", error);
    res.status(500).json({ message: "Помилка сервера" });
  }
});

// Отримання одного продукту за ID
router.get("/:id", async (req, res) => {
  try {
      const product = await Product.findById(req.params.id).populate("lineId", "name");
      if (!product) {
          return res.status(404).json({ message: "Продукт не знайдено" });
      }
      res.json(product);
  } catch (error) {
      console.error("Помилка отримання продукту:", error);
      res.status(500).json({ message: "Помилка сервера" });
  }
});


// Створення нового продукту
router.post("/", async (req, res) => {
  try {
    const { name, type, price, discount, lineId } = req.body;

    const discountedPrice = price - (price * (discount || 0)) / 100;

    const newProduct = new Product({
      name,
      type,
      price,
      discount,
      discountedPrice,
      lineId,
    });

    await newProduct.save();
    res.status(201).json({ message: "Продукт створено", product: newProduct });
  } catch (error) {
    console.error("Помилка створення продукту:", error);
    res.status(500).json({ message: "Помилка сервера" });
  }
});

// Оновлення продукту
router.put("/:id", async (req, res) => {
  try {
      const { name, type, price, discount, lineId, specs, bundle } = req.body;

      // Перевірка наявності лінійки
      if (lineId && !(await mongoose.model("Line").findById(lineId))) {
          return res.status(400).json({ message: "Лінійка з таким ID не знайдена" });
      }

      const discountedPrice = price - (price * (discount || 0)) / 100;

      const updatedProduct = await Product.findByIdAndUpdate(
          req.params.id,
          { name, type, price, discount, discountedPrice, lineId, specs, bundle },
          { new: true, runValidators: true }
      );

      if (!updatedProduct) {
          return res.status(404).json({ message: "Продукт не знайдено" });
      }

      res.json({ message: "Продукт оновлено", product: updatedProduct });
  } catch (error) {
      console.error("Помилка оновлення продукту:", error);
      res.status(500).json({ message: "Помилка сервера" });
  }
});


// Видалення продукту
router.delete("/:id", async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Продукт не знайдено" });
    }

    res.json({ message: "Продукт видалено" });
  } catch (error) {
    console.error("Помилка видалення продукту:", error);
    res.status(500).json({ message: "Помилка сервера" });
  }
});

module.exports = router;
