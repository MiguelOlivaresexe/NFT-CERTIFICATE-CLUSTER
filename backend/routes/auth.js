const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

// Ruta de registro
router.post("/register", async (req, res, next) => {
  const { username, password } = req.body;

  let user = await User.findOne({ username });
  if (user) {
    return res.status(400).json({ msg: "El usuario ya existe" });
  }

  user = new User({
    username,
    password,
  });

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(password, salt);

  await user.save();

  const payload = {
    user: {
      id: user.id,
    },
  };

  jwt.sign(
    payload,
    process.env.JWT_SECRET,
    { expiresIn: "1h" },
    (err, token) => {
      if (err) next(err);
      res.json({ token, role: user.role });
    },
  );
});

// Ruta de login
router.post("/login", async (req, res, next) => {
  const { username, password } = req.body;

  let user = await User.findOne({ username });
  if (!user) {
    return res.status(400).json({ msg: "Credenciales inválidas" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ msg: "Credenciales inválidas" });
  }

  const payload = {
    user: {
      id: user.id,
    },
  };

  jwt.sign(
    payload,
    process.env.JWT_SECRET,
    { expiresIn: "1h" },
    (err, token) => {
      if (err) next(err);
      res.json({ token, role: user.role });
    },
  );
});

module.exports = router;

// Endpoint para obtener info del usuario actual (username + role)
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ msg: 'Usuario no encontrado' });
    res.json({ username: user.username, role: user.role });
  } catch (e) {
    console.error('Error en /api/auth/me:', e);
    res.status(500).json({ msg: 'Error del servidor' });
  }
});
