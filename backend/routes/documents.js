const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const Document = require("../models/Document");

// @route   POST api/documents
// @desc    Guardar un nuevo tokenId de documento
// @access  Private
router.post("/", auth, async (req, res) => {
  const { tokenId } = req.body;
  const newDocument = new Document({
    tokenId,
    owner: req.user.id,
  });

  const document = await newDocument.save();
  res.json(document);
});

// @route   GET api/documents
// @desc    Obtener todos los documentos del usuario autenticado
// @access  Private
router.get("/", auth, async (req, res) => {
  const documents = await Document.find({ owner: req.user.id }).sort({
    mintedAt: -1,
  });
  res.json(documents);
});

module.exports = router;

// @route   GET api/documents/all
// @desc    Obtener todos los documentos (solo para administradores)
// @access  Private (Admin only)
router.get("/all", auth, async (req, res) => {
  // Verificar si el usuario es administrador (asumiendo que req.user.isAdmin se establece en el middleware de autenticación)
  if (!req.user.isAdmin) {
    return res.status(403).json({ msg: "Acceso denegado. Solo administradores." });
  }

  const documents = await Document.find({}).sort({
    mintedAt: -1,
  });
  res.json(documents);
});
