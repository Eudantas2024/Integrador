const mongoose = require("mongoose");

const reclamacaoSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Consumidor",
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  titulo: {
    type: String,
    required: false,
  },
  tipoFeedback: {
    type: String,
    enum: ["sugestao", "problema", "elogio", "duvida", "outros"],
    required: true,
  },
  mensagem: {
    type: String,
    required: true,
  },
  anexos: [
    {
      filename: { type: String, required: true },
      mimetype: { type: String, required: true },
      content: { type: String, required: true }, // Base64
    }
  ],
  publicada: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true // Adiciona createdAt e updatedAt automaticamente
});

module.exports = mongoose.model("Reclamacao", reclamacaoSchema);
