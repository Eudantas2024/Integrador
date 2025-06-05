const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;

function autenticarAdmin(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Token de autenticação não fornecido." });
  }

  jwt.verify(token, jwtSecret, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: "Token inválido ou expirado." });
    }

    if (decoded.tipo !== "admin") {
      return res.status(403).json({ error: "Acesso restrito ao administrador." });
    }

    req.userId = decoded.id || null;
    req.role = decoded.tipo;
    next();
  });
}

module.exports = autenticarAdmin;
