const Reclamacao = require("../models/Reclamacao");
const Consumidor = require("../models/Consumidor");
const enviarEmail = require("../utils/enviarEmail");

// Função auxiliar para formatar data em DD/MM/YYYY HH:mm
function formatarData(data) {
  const d = new Date(data);
  const dia = String(d.getDate()).padStart(2, "0");
  const mes = String(d.getMonth() + 1).padStart(2, "0");
  const ano = d.getFullYear();
  const hora = String(d.getHours()).padStart(2, "0");
  const minuto = String(d.getMinutes()).padStart(2, "0");
  return `${dia}/${mes}/${ano} ${hora}:${minuto}`;
}

// Criar reclamação
async function criarReclamacao(req, res) {
  try {
    const { mensagem, tipoFeedback, titulo } = req.body;
    const arquivos = req.files;

    if (!mensagem || mensagem.trim().length < 10)
      return res.status(400).json({ error: "Mensagem inválida ou muito curta." });

    const tiposValidos = ["sugestao", "problema", "elogio", "duvida", "outros"];
    if (!tipoFeedback || !tiposValidos.includes(tipoFeedback))
      return res.status(400).json({ error: "Tipo de feedback inválido." });

    if (!req.userId)
      return res.status(401).json({ error: "Usuário não autenticado." });

    const consumidor = await Consumidor.findById(req.userId);
    if (!consumidor)
      return res.status(404).json({ error: "Usuário não encontrado." });

    // Formatar anexos para base64
    let anexosFormatados = [];
    if (arquivos && Array.isArray(arquivos)) {
      anexosFormatados = arquivos.map((file) => ({
        filename: file.originalname,
        mimetype: file.mimetype,
        content: file.buffer.toString("base64"),
      }));
    }

    const novaReclamacao = new Reclamacao({
      userId: consumidor._id,
      username: consumidor.username,
      email: consumidor.email,
      mensagem,
      tipoFeedback,
      titulo,
      anexos: anexosFormatados,
      publicada: false,
    });

    await novaReclamacao.save();

    res.status(201).json({ message: "Reclamação enviada com sucesso." });
  } catch (error) {
    console.error("Erro ao enviar reclamação:", error);
    res.status(500).json({ error: "Erro ao enviar reclamação." });
  }
}

// Listar reclamações aprovadas
async function listarReclamacoesAprovadas(req, res) {
  try {
    const reclamacoes = await Reclamacao.find({ publicada: true }).sort({ createdAt: -1 });
    res.json(reclamacoes);
  } catch (error) {
    console.error("Erro ao listar reclamações aprovadas:", error);
    res.status(500).json({ error: "Erro ao listar reclamações aprovadas." });
  }
}

// Listar reclamações pendentes (admin)
async function listarReclamacoesPendentes(req, res) {
  try {
    const reclamacoes = await Reclamacao.find({ publicada: false }).sort({ createdAt: -1 });
    res.json(reclamacoes);
  } catch (error) {
    console.error("Erro ao listar reclamações pendentes:", error);
    res.status(500).json({ error: "Erro ao listar reclamações pendentes." });
  }
}

// Aprovar reclamação (admin)
async function aprovarReclamacao(req, res) {
  try {
    const { id } = req.params;
    const reclamacao = await Reclamacao.findById(id);

    if (!reclamacao) {
      return res.status(404).json({ error: "Reclamação não encontrada." });
    }

    reclamacao.publicada = true;
    await reclamacao.save();

    res.json({ message: "Reclamação aprovada com sucesso." });
  } catch (error) {
    console.error("Erro ao aprovar reclamação:", error);
    res.status(500).json({ error: "Erro ao aprovar reclamação." });
  }
}

// Excluir reclamação (admin)
async function excluirReclamacao(req, res) {
  try {
    const { id } = req.params;
    const reclamacao = await Reclamacao.findByIdAndDelete(id);

    if (!reclamacao) {
      return res.status(404).json({ error: "Reclamação não encontrada." });
    }

    res.json({ message: "Reclamação excluída com sucesso." });
  } catch (error) {
    console.error("Erro ao excluir reclamação:", error);
    res.status(500).json({ error: "Erro ao excluir reclamação." });
  }
}

// Listar reclamações do usuário autenticado
async function listarReclamacoesDoUsuario(req, res) {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: "Usuário não autenticado." });
    }

    const reclamacoes = await Reclamacao.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(reclamacoes);
  } catch (error) {
    console.error("Erro ao listar reclamações do usuário:", error);
    res.status(500).json({ error: "Erro ao listar reclamações do usuário." });
  }
}

module.exports = {
  criarReclamacao,
  listarReclamacoesAprovadas,
  listarReclamacoesPendentes,
  aprovarReclamacao,
  excluirReclamacao,
  listarReclamacoesDoUsuario,
};
