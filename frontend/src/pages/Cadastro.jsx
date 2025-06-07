import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Cadastro.css'

function Cadastro() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    nome: '',
    email: '',
    senha: ''
  })
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [erros, setErros] = useState({})
  const [sucesso, setSucesso] = useState(false)

  const validar = () => {
    const novosErros = {}
    if (!form.nome.trim()) novosErros.nome = 'Nome é obrigatório.'
    if (!form.email.includes('@')) novosErros.email = 'E-mail inválido.'
    if (form.senha.length < 6) novosErros.senha = 'Senha precisa ter 6 ou mais caracteres.'
    setErros(novosErros)
    return Object.keys(novosErros).length === 0
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validar()) return
    console.log("Enviando cadastro:", {
      username: form.nome.trim(),
      email: emailNormalizado,
      senha: form.senha
    });


    // Normalizar email antes do envio
    const emailNormalizado = form.email.trim().toLowerCase()

    fetch("http://localhost:3005/api/consumidor/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: form.nome.trim(),
        email: emailNormalizado,
        senha: form.senha
      })
    })
      .then(res => {
        if (!res.ok) {
          return res.json().then(err => { throw err })
        }
        return res.json()
      })
      .then(data => {
        console.log(data)
        setSucesso(true)
        setErros({})
        setForm({ nome: '', email: '', senha: '' })

        setTimeout(() => {
          navigate('/login')
        }, 1500)
      })
      .catch(error => {
        console.error("Erro no cadastro:", error)

        const erroMsg = error.error || ''

        const mensagensRecarregar = [
          "Usuário ou e-mail já cadastrado.",
          "E-mail já cadastrado."
        ]

        if (mensagensRecarregar.includes(erroMsg)) {
          setErros({ email: erroMsg })
          // Removi o reload para não perder o que o usuário digitou
          // Poderia resetar o formulário se desejar, mas melhor não recarregar a página
        } else if (erroMsg.toLowerCase().includes("email")) {
          setErros({ email: erroMsg })
        } else {
          setErros({ geral: erroMsg || "Erro ao realizar cadastro." })
        }

        setSucesso(false)
      })
  }

  return (
    <div className="cadastro-container">
      <h2>📝 Cadastro de Usuário</h2>

      {sucesso && <p className="mensagem sucesso">Cadastro realizado com sucesso! ✅</p>}
      {erros.geral && <p className="mensagem erro">{erros.geral}</p>}

      <form onSubmit={handleSubmit}>
        <label htmlFor="nome">Nome:</label>
        <input
          id="nome"
          type="text"
          name="nome"
          value={form.nome}
          onChange={handleChange}
          className={erros.nome ? 'input-erro' : ''}
          placeholder="Digite seu nome"
          autoComplete="name"
        />
        {erros.nome && <span className="erro-texto">{erros.nome}</span>}

        <label htmlFor="email">Email:</label>
        <input
          id="email"
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          className={erros.email ? 'input-erro' : ''}
          placeholder="exemplo@email.com"
          autoComplete="email"
        />
        {erros.email && <span className="erro-texto">{erros.email}</span>}

        <label htmlFor="senha">Senha:</label>
        <div className="senha-container">
          <input
            id="senha"
            type={mostrarSenha ? 'text' : 'password'}
            name="senha"
            value={form.senha}
            onChange={handleChange}
            className={erros.senha ? 'input-erro' : ''}
            placeholder="Mínimo 6 caracteres"
            autoComplete="new-password"
          />
          <button
            type="button"
            className="mostrar-senha-btn"
            onClick={() => setMostrarSenha(!mostrarSenha)}
            aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
          >
            {mostrarSenha ? '🙈' : '👁️'}
          </button>
        </div>
        {erros.senha && <span className="erro-texto">{erros.senha}</span>}

        <button type="submit" className="btn-cadastrar">Cadastrar</button>
      </form>
    </div>
  )
}

export default Cadastro
