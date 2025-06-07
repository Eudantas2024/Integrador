import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Cadastro.css'; // ✅ Reutilizando o CSS do Cadastro

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mensagem, setMensagem] = useState('');
  const [mensagemCor, setMensagemCor] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:3005/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), senha: senha.trim() }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("adminToken", data.token);
        setMensagem("Login realizado com sucesso! Redirecionando...");
        setMensagemCor("green");

        setTimeout(() => {
          navigate("/paineladmin");
        }, 1500);
      } else {
        setMensagem(data.error || "Erro no login.");
        setMensagemCor("red");
      }
    } catch (err) {
      setMensagem("Erro na conexão com o servidor.");
      setMensagemCor("red");
    }
  };

  return (
    <div className="cadastro-container2">
      <h2>🔐 Login do Administrador</h2>

      {mensagem && (
        <p className={`mensagem ${mensagemCor === 'green' ? 'sucesso' : 'erro'}`}>
          {mensagem}
        </p>
      )}

      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email:</label>
        <input
          id="email"
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="admin@email.com"
        />

        <label htmlFor="senha">Senha:</label>
        <div className="senha-container2">
          <input
            id="senha"
            type={mostrarSenha ? 'text' : 'password'}
            name="senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            placeholder="Digite sua senha"
          />
          <button
            type="button"
            className="mostrar-senha-btn"
            onClick={() => setMostrarSenha(!mostrarSenha)}
            aria-label={mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'}
          >
            {mostrarSenha ? '🙈' : '👁️'}
          </button>
        </div>

        <button type="submit" className="btn-entrar">Entrar</button>
      </form>
    </div>
  );
};

export default AdminLogin;
