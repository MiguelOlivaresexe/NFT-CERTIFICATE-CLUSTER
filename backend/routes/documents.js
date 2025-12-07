const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const Document = require("../models/Document");
const sendEmail = require("../utils/emailService");

// @route   POST api/documents
// @desc    Guardar un nuevo tokenId de documento
// @access  Private
router.post("/", auth, async (req, res, next) => {
  try {
    const { tokenId, cid, recipientEmail, name } = req.body;
    const newDocument = new Document({
      tokenId,
      cid,
      owner: req.user.id,
    });

    const document = await newDocument.save();

    if (recipientEmail) {
      const ipfsLink = cid ? `https://ipfs.io/ipfs/${cid}` : "";
      const subject = "Nuevo certificado generado";
      const text = `Se ha generado un nuevo certificado.\nNombre: ${name || "Documento"}\nToken ID: ${tokenId}\nCID: ${cid || "N/A"}\nEnlace IPFS: ${ipfsLink}`;
      const html = `<h1>Nuevo certificado generado</h1><p><strong>Nombre:</strong> ${name || "Documento"}</p><p><strong>Token ID:</strong> ${tokenId}</p><p><strong>CID:</strong> ${cid || "N/A"}</p>${ipfsLink ? `<p><a href="${ipfsLink}" target="_blank" rel="noopener">Ver en IPFS</a></p>` : ""}`;
      try {
        await sendEmail(recipientEmail, subject, text, html);
      } catch (err) {
        console.error("Error enviando correo del certificado:", err);
        // No fallar toda la request si el correo falla; continuar
      }
    }

    res.json(document);
  } catch (err) {
    next(err);
  }
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
