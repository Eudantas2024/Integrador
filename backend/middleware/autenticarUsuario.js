// middlewares/autenticarUsuario.js
const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;

function autenticarUsuario(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Token de autenticação não fornecido." });
  }

  jwt.verify(token, jwtSecret, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: "Token inválido ou expirado." });
    }

    req.userId = decoded.id || null;
    next();
  });
}

module.exports = autenticarUsuario;
