const bcrypt = require("bcrypt");
const Empresa = require("../models/Empresa");
const enviarEmail = require("../utils/enviarEmail");
const { gerarTokenEmpresa } = require("../config/jwtConfig");

// Registrar nova Empresa 
const registrarEmpresa = async (req, res) => {
  const { username, email, senha } = req.body;

  if (!username || !email || !senha) {
    return res.status(400).json({ error: "Preencha todos os campos." });
  }

  try {
    const existente = await Empresa.findOne({ email });
    if (existente) {
      return res.status(400).json({ error: "E-mail já cadastrado." });
    }

    const hashedSenha = await bcrypt.hash(senha, 10);
    const novaEmpresa = new Empresa({ username, email, senha: hashedSenha });
    await novaEmpresa.save();

    await enviarEmail(
      email,
      "Bem-vindo ao Opina +",
      `<h2>Olá ${username},</h2>
      <p>Seu cadastro com Empresa Parceira foi realizado com sucesso no <strong>Opina +</strong>!</p>
      <p>Agora você pode fazer login e verificar os Feedbacks que os clientes deixram para você com facilidade.</p>
      <hr/>
      <p style="font-size: 12px; color: #888;">Este é um e-mail automático. Por favor, não responda.</p>`
    );

    res.status(201).json({ message: "Cadastro realizado com sucesso! Verifique seu e-mail." });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: "Usuário ou e-mail já cadastrado." });
    }
    console.error("Erro ao cadastrar empresa:", error);
    res.status(500).json({ error: "Erro ao cadastrar empresa." });
  }
};

// Login da Empresa
const loginEmpresa = async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ error: "Preencha todos os campos." });
  }

  try {
    const empresa = await Empresa.findOne({ email });
    if (empresa && await bcrypt.compare(senha, empresa.senha)) {
      const token = gerarTokenEmpresa(empresa._id, empresa.email);
      res.json({ message: "Login bem-sucedido!", token });
    } else {
      res.status(401).json({ error: "Email ou senha incorretos." });
    }
  } catch (error) {
    console.error("Erro no login:", error);
    res.status(500).json({ error: "Erro no login." });
  }
};

// Obter perfil da Empresa 
const getPerfilEmpresa = async (req, res) => {
  try {
    const empresa = await Empresa.findById(req.userId).select("-senha");
    if (!empresa) {
      return res.status(404).json({ error: "Empresa não encontrada" });
    }

    res.json({
      username: empresa.username,
      email: empresa.email,
    });
  } catch (err) {
    console.error("Erro ao buscar perfil:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

module.exports = {
  registrarEmpresa,
  loginEmpresa,
  getPerfilEmpresa,
};
