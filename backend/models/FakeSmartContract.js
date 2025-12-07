const mongoose = require("mongoose");

const FakeSmartContractSchema = new mongoose.Schema(
  {
    tokenId: {
      type: Number,
      required: true,
      unique: true,
    },
    cid: {
      type: String,
      required: true,
    },
    documentHash: {
      type: String,
      required: true,
    },
    owner: {
      type: String, // En el mock es una dirección, no un ObjectId de usuario
      required: true,
    },
    burned: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true } // Añade createdAt y updatedAt automáticamente
);

module.exports = mongoose.model("FakeSmartContract", FakeSmartContractSchema);
