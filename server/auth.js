const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const router = express.Router();

const admins = [
  {
    username: "admin",
    password: bcrypt.hashSync("adminpassword", 10), // Попередньо захешований пароль
  },
];

// Авторизація
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  const admin = admins.find((a) => a.username === username);
  if (!admin) return res.status(404).json({ message: "Адмін не знайдений" });

  const isPasswordValid = bcrypt.compareSync(password, admin.password);
  if (!isPasswordValid) return res.status(401).json({ message: "Неправильний пароль" });

  const token = jwt.sign({ username }, "secretkey", { expiresIn: "1h" });
  res.json({ token });
});

module.exports = router;
