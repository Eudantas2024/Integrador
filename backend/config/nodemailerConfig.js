const nodemailer = require("nodemailer");

// Criar o transporter com configuração segura
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Função para enviar e-mail
async function enviarEmail(destinatario, assunto, html, textoSimples = "") {
  const mailOptions = {
    from: `"Opina +" <${process.env.EMAIL_USER}>`,
    to: destinatario,
    subject: assunto,
    html: html,                // conteúdo HTML para clientes que suportam
    text: textoSimples || html.replace(/<[^>]*>?/gm, ''), // fallback texto simples removendo tags
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("E-mail enviado: ", info.response);
  } catch (error) {
    console.error("Erro ao enviar e-mail:", error);
    throw error; // Propaga o erro para ser tratado no controller
  }
}

module.exports = { enviarEmail };
