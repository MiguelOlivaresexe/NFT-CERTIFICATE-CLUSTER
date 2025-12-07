const express = require("express");
const router = express.Router();
const FakeSmartContract = require("../models/FakeSmartContract");

// @route   POST api/fake-smart-contracts
// @desc    Crear un nuevo contrato inteligente ficticio
// @access  Public (para propósitos de demo)
router.post("/", async (req, res, next) => {
  try {
    const { tokenId, cid, documentHash, owner } = req.body;
    const newContract = new FakeSmartContract({
      tokenId,
      cid,
      documentHash,
      owner,
    });
    const contract = await newContract.save();
    res.status(201).json(contract);
  } catch (err) {
    next(err);
  }
});

// @route   GET api/fake-smart-contracts
// @desc    Obtener todos los contratos inteligentes ficticios
// @access  Public (para propósitos de demo)
router.get("/", async (req, res, next) => {
  try {
    const contracts = await FakeSmartContract.find({});
    res.json(contracts);
  } catch (err) {
    next(err);
  }
});

// @route   GET api/fake-smart-contracts/:tokenId
// @desc    Obtener un contrato inteligente ficticio por tokenId
// @access  Public (para propósitos de demo)
router.get("/:tokenId", async (req, res, next) => {
  try {
    const contract = await FakeSmartContract.findOne({ tokenId: req.params.tokenId });
    if (!contract) {
      return res.status(404).json({ msg: "Contrato no encontrado" });
    }
    res.json(contract);
  } catch (err) {
    next(err);
  }
});

// @route   PUT api/fake-smart-contracts/:tokenId
// @desc    Actualizar un contrato inteligente ficticio por tokenId
// @access  Public (para propósitos de demo)
router.put("/:tokenId", async (req, res, next) => {
  try {
    const { cid, documentHash, owner, burned } = req.body;
    const updatedContract = await FakeSmartContract.findOneAndUpdate(
      { tokenId: req.params.tokenId },
      { cid, documentHash, owner, burned },
      { new: true }
    );
    if (!updatedContract) {
      return res.status(404).json({ msg: "Contrato no encontrado" });
    }
    res.json(updatedContract);
  } catch (err) {
    next(err);
  }
});

// @route   DELETE api/fake-smart-contracts/:tokenId
// @desc    Eliminar un contrato inteligente ficticio por tokenId
// @access  Public (para propósitos de demo)
router.delete("/:tokenId", async (req, res, next) => {
  try {
    const deletedContract = await FakeSmartContract.findOneAndDelete({ tokenId: req.params.tokenId });
    if (!deletedContract) {
      return res.status(404).json({ msg: "Contrato no encontrado" });
    }
    res.json({ msg: "Contrato eliminado" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
