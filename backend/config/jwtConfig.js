const jwt = require("jsonwebtoken");

const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
  throw new Error("JWT_SECRET não está definido nas variáveis de ambiente.");
}

/**
 * Gera token JWT para admin com validade padrão de 2 horas.
 */
function gerarTokenAdmin(expiresIn = "2h") {
  return jwt.sign({ tipo: "admin" }, jwtSecret, { expiresIn });
}

/**
 * Gera token JWT para consumidor com validade padrão de 1 hora.
 * @param {string} id - ID do consumidor
 * @param {string} email - Email do consumidor
 * @param {string} expiresIn - Tempo de expiração (opcional)
 */
function gerarTokenConsumidor(id, email, expiresIn = "1h") {
  return jwt.sign({ id, email, tipo: "consumidor" }, jwtSecret, { expiresIn });
}

function gerarTokenEmpresa(id, email, expiresIn = "1h") {
  return jwt.sign({ id, email, tipo: "empresa" }, jwtSecret, { expiresIn });
}
module.exports = { gerarTokenAdmin, gerarTokenConsumidor,gerarTokenEmpresa, jwtSecret };
