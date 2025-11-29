const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const Document = require('../models/Document');

// @route   POST api/documents
// @desc    Guardar un nuevo tokenId de documento
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { tokenId } = req.body;
    const newDocument = new Document({
      tokenId,
      owner: req.user.id,
    });

    const document = await newDocument.save();
    res.json(document);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
});

// @route   GET api/documents
// @desc    Obtener todos los documentos del usuario autenticado
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const documents = await Document.find({ owner: req.user.id }).sort({ mintedAt: -1 });
    res.json(documents);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
});

module.exports = router;
