const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

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
      res.json({ token });
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
      res.json({ token });
    },
  );
});

module.exports = router;
