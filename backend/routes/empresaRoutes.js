const express = require("express");
const router = express.Router();
const autenticarToken = require("../middleware/autenticarToken");

const {
  registrarEmpresa,
  loginEmpresa,
  getPerfilEmpresa,
} = require("../controllers/empresaController");

// Registro de novo consumidor
router.post("/register", registrarEmpresa);

// Login do consumidor
router.post("/login", loginEmpresa);

// Perfil do consumidor (rota protegida)
router.get('/perfil', autenticarToken('empresa'), getPerfilEmpresa);

module.exports = router;
