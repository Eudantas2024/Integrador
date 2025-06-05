const bcrypt = require("bcrypt");
const Consumidor = require("../models/Consumidor");
const enviarEmail = require("../utils/enviarEmail");
const { gerarTokenConsumidor } = require("../config/jwtConfig");

// Registrar novo consumidor
const registrarConsumidor = async (req, res) => {
  const { username, email, senha } = req.body;

  if (!username || !email || !senha) {
    return res.status(400).json({ error: "Preencha todos os campos." });
  }

  try {
    const existente = await Consumidor.findOne({ email });
    if (existente) {
      return res.status(400).json({ error: "E-mail já cadastrado." });
    }

    const hashedSenha = await bcrypt.hash(senha, 10);
    const novoConsumidor = new Consumidor({ username, email, senha: hashedSenha });
    await novoConsumidor.save();

    await enviarEmail(
      email,
      "Bem-vindo ao Opina +",
      `<h2>Olá ${username},</h2>
      <p>Seu cadastro foi realizado com sucesso no <strong>Opina +</strong>!</p>
      <p>Agora você pode fazer login e enviar suas reclamações com facilidade.</p>
      <hr/>
      <p style="font-size: 12px; color: #888;">Este é um e-mail automático. Por favor, não responda.</p>`
    );

    res.status(201).json({ message: "Cadastro realizado com sucesso! Verifique seu e-mail." });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: "Usuário ou e-mail já cadastrado." });
    }
    console.error("Erro ao cadastrar consumidor:", error);
    res.status(500).json({ error: "Erro ao cadastrar consumidor." });
  }
};

// Login do consumidor
const loginConsumidor = async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ error: "Preencha todos os campos." });
  }

  try {
    const consumidor = await Consumidor.findOne({ email });
    if (consumidor && await bcrypt.compare(senha, consumidor.senha)) {
      const token = gerarTokenConsumidor(consumidor._id, consumidor.email);
      res.json({ message: "Login bem-sucedido!", token });
    } else {
      res.status(401).json({ error: "Email ou senha incorretos." });
    }
  } catch (error) {
    console.error("Erro no login:", error);
    res.status(500).json({ error: "Erro no login." });
  }
};

// Obter perfil do consumidor (rota protegida)
const getPerfilConsumidor = async (req, res) => {
  try {
    const consumidor = await Consumidor.findById(req.userId).select("-senha");
    if (!consumidor) {
      return res.status(404).json({ error: "Consumidor não encontrado" });
    }

    res.json({
      username: consumidor.username,
      email: consumidor.email,
    });
  } catch (err) {
    console.error("Erro ao buscar perfil:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

module.exports = {
  registrarConsumidor,
  loginConsumidor,
  getPerfilConsumidor,
};
