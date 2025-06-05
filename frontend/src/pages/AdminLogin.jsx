import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false); // Estado para mostrar/ocultar senha
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
          navigate("/paineladmin"); // Rota protegida no React Router
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
    <div className="container">
      <h2>🔐 Login do Administrador</h2>
      <form onSubmit={handleSubmit}>
        <label  className="email" htmlFor="email">Email:</label><br />
        <input className='email1'
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        /><br /><br />

        <label htmlFor="senha">Senha:</label><br />
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <input className='senha1'
            type={mostrarSenha ? "text" : "password"}
            id="senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
            style={{ paddingRight: '2.5rem' }} // espaço para botão dentro do input
          />
          <button
            type="button"
            className="mostrar-senha-btn"
            onClick={() => setMostrarSenha(!mostrarSenha)}
            style={{
              position: 'absolute',
              right: '5px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1.2rem',
              userSelect: 'none',
            }}
            aria-label={mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'}
          >
            {mostrarSenha ? '🙈' : '👁️'}
          </button>
        </div>
        <br /><br />

        <button type="submit">Entrar</button>
      </form>

      {mensagem && <p style={{ color: mensagemCor }}>{mensagem}</p>}
    </div>
  );
};

export default AdminLogin;
