// server.js

const express = require("express");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");
const startDatabase = require("./config/database");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3005;

// Conectar ao banco de dados MongoDB
startDatabase();

// Middlewares
app.use(cors());
app.use(express.json()); // Para requisições JSON
app.use(express.urlencoded({ extended: true })); // Para formulários URL encoded
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // Servir arquivos estáticos (uploads)

// Rotas
const adminRoutes = require("./routes/adminRoutes");
const consumidorRoutes = require("./routes/consumidorRoutes");
const empresaRoutes = require("./routes/empresaRoutes");
const reclamacaoRoutes = require("./routes/reclamacaoRoutes");

// Uso das rotas com prefixos
app.use("/api/admin", adminRoutes);
app.use("/api/consumidor", consumidorRoutes);
app.use("/api/empresa", empresaRoutes);
app.use("/api/reclamacoes", reclamacaoRoutes);

// Rota inicial simples para teste
app.get("/", (req, res) => {
  res.send("🟢 API do Opina + está em execução.");
});

// Middleware para rotas não encontradas
app.use((req, res) => {
  res.status(404).json({ error: "Rota não encontrada." });
});

// Middleware para tratamento de erros globais
app.use((err, req, res, next) => {
  console.error(err.stack);
  if (err.name === "MulterError") {
    return res.status(400).json({ error: err.message });
  }
  res.status(500).json({ error: "Erro interno do servidor." });
});

// Inicialização do servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
