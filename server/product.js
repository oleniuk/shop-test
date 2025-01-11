const express = require("express");
const router = express.Router();

// Отримати конкретний товар
router.get("/:id", (req, res) => {
  const { id } = req.params;
  res.json({ message: `Товар з ID ${id}` });
});

module.exports = router;
