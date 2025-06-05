const nodemailer = require("nodemailer");
require("dotenv").config(); // ✅ Garante acesso às variáveis de ambiente

const transporter = nodemailer.createTransport({
  service: "gmail", // Pode ser alterado para outro provedor
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function enviarEmail(destinatario, assunto, html) {
  const mailOptions = {
    from: `"Opina +" <${process.env.EMAIL_USER}>`,
    to: destinatario,
    subject: assunto,
    html: html,  // envia conteúdo com tags HTML
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Email enviado com sucesso para ${destinatario}`);
  } catch (err) {
    console.error("❌ Erro ao enviar e-mail:", err.message);
  }
}

module.exports = enviarEmail;
