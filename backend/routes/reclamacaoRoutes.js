  const express = require("express");
  const router = express.Router();

  const autenticarUsuario = require("../middleware/autenticarUsuario");
  const autenticarAdmin = require("../middleware/autenticarAdmin");
  const upload = require("../middleware/upload"); // ✅ Usa o middleware centralizado

  const {
    criarReclamacao,
    listarReclamacoesAprovadas,
    listarReclamacoesPendentes,
    aprovarReclamacao,
    excluirReclamacao,
    listarReclamacoesDoUsuario,
  } = require("../controllers/reclamacaoController");

  // Rotas consumidor
  router.post("/upload", autenticarUsuario, upload.array("anexos", 5), criarReclamacao); // Limite de até 5 arquivos
  router.get("/aprovadas", listarReclamacoesAprovadas);
  router.get("/minhas", autenticarUsuario, listarReclamacoesDoUsuario);

  // Rotas admin
  router.get("/pendentes", autenticarAdmin, listarReclamacoesPendentes);
  router.put("/aprovar/:id", autenticarAdmin, aprovarReclamacao);
  router.delete("/:id", autenticarAdmin, excluirReclamacao);

  module.exports = router;
