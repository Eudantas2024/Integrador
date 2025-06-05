const express = require("express");
const router = express.Router();
const autenticarToken = require("../middleware/autenticarToken");

const {
  registrarConsumidor,
  loginConsumidor,
  getPerfilConsumidor,
} = require("../controllers/consumidorController");

// Registro de novo consumidor
router.post("/register", registrarConsumidor);

// Login do consumidor
router.post("/login", loginConsumidor);

// Perfil do consumidor (rota protegida)
router.get("/perfil", autenticarToken("consumidor"), getPerfilConsumidor);


module.exports = router;
