const bcrypt = require("bcrypt");
const { gerarTokenAdmin } = require("../config/jwtConfig");

async function loginAdmin(req, res) {
    const { email, senha } = req.body;

    console.log("Email enviado:", email);
    console.log("Email esperado:", process.env.ADMIN_EMAIL);

    // Verifica se o email confere com o do admin configurado
    if (email !== process.env.ADMIN_EMAIL) {
        console.log("❌ Email não confere");
        return res.status(401).json({ error: "Credenciais inválidas." });
    }

    try {
        // Compara senha enviada com o hash do admin armazenado na variável de ambiente
        const senhaCorreta = await bcrypt.compare(senha, process.env.ADMIN_PASSWORD_HASH);
        console.log("✅ Senha correta?", senhaCorreta);

        if (!senhaCorreta) {
            return res.status(401).json({ error: "Credenciais inválidas." });
        }

        const token = gerarTokenAdmin();
        return res.json({ message: "Login bem-sucedido!", token });

    } catch (error) {
        console.error("Erro durante login admin:", error);
        return res.status(500).json({ error: "Erro interno do servidor." });
    }
}

module.exports = { loginAdmin };
