import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom'; // IMPORTAÇÃO
import { FaUser, FaEnvelope, FaCommentDots, FaSearch, FaBullhorn, FaUserPlus } from 'react-icons/fa';
import './UltimasReclamacoes.css';


function UltimasReclamacoes() {
  const location = useLocation();

  // Extrai o parâmetro "busca" da query string, ou '' se não existir
  const queryParams = new URLSearchParams(location.search);
  const buscaInicial = queryParams.get('busca') || '';

  const [reclamacoes, setReclamacoes] = useState([]);
  const [erro, setErro] = useState('');
  const [busca, setBusca] = useState(buscaInicial); // Usa busca da URL
  const [mensagemExpandida, setMensagemExpandida] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3005/api/reclamacoes/aprovadas')
      .then((res) => {
        if (!res.ok) {
          throw new Error('Erro ao buscar reclamações.');
        }
        return res.json();
      })
      .then((dados) => {
        setReclamacoes(dados);
      })
      .catch((err) => {
        setErro(err.message);
      });
  }, []);

  // Refiltra as reclamações conforme o estado busca
  const reclamacoesFiltradas = reclamacoes.filter((rec) => {
    const buscaLower = busca.toLowerCase();
    return (
      (rec.titulo && rec.titulo.toLowerCase().includes(buscaLower)) ||
      (rec.mensagem && rec.mensagem.toLowerCase().includes(buscaLower))
    );
  });

  return (
    <div className="container">
      <div className="ultimas-reclamacoes">
        <h2>Feedbacks Publicados</h2>

        <div className="barra-busca">
          <input
            type="text"
            placeholder="Buscar por empresa, assunto ou mensagem..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="input-busca"
          />
          <FaSearch className="icone-busca" />
        </div>

        {erro && <p className="erro">{erro}</p>}

        <div className="lista-reclamacoes">
          {reclamacoesFiltradas.length === 0 ? (
            <div className="cadastreseaqui">
             <p>Em nosso arquivo ainda não consta nenhum Feedback para a empresa citada, gostaria de incluir? 
            Por favor faça um novo registro e ajude outras pessoas com essa avaliação.</p>
            <br />
            <p>Faça login para compartilhar suas experiências ou crie sua conta agora.</p>
          <div className="cta-card-buttons"> {/* Novo div para organizar botões */}
            <Link to="/login" className="btn-cta primary">
              <FaUserPlus /> Fazer Login
            </Link>
            <Link to="/cadastro" className="btn-cta tertiary">
              <FaUserPlus /> Criar Conta Cliente
            </Link>
          </div>
            

            </div>
           
          ) : (
            reclamacoesFiltradas.map((rec) => {
              const mensagemFormatada =
                mensagemExpandida === rec._id
                  ? rec.mensagem
                  : rec.mensagem.length > 500
                  ? rec.mensagem.slice(0, 500) + '...'
                  : rec.mensagem;

              const tiposFeedback = {
                problema: 'Crítica',
                sugestao: 'Sugestão',
                elogio: 'Elogio',
                duvida: 'Dúvida',
                outros: 'Outros',
              };

              return (
                <div key={rec._id} className="card-reclamacao">
                  <p className="feedback">
                    <FaBullhorn className="icone-megafone" />{' '}
                    <strong></strong> {tiposFeedback[rec.tipoFeedback] || rec.tipoFeedback}
                  </p>
                  <p className="cliente">
                    <FaUser className="icone-user" /> <strong>Cliente:</strong> {rec.username}
                  </p>
                  <p className="assunto">
                    <FaEnvelope className="icone-envelope" /> <strong>Assunto:</strong> {rec.titulo}
                  </p>
                  <p className="mensagem-texto">
                    <FaCommentDots className="icone-msg" /> <strong>Mensagem:</strong> <br />
                    <br />
                    {mensagemFormatada}
                  </p>
                  {rec.mensagem.length > 500 && (
                    <button
                      onClick={() =>
                        setMensagemExpandida(mensagemExpandida === rec._id ? null : rec._id)
                      }
                      className="botao-ver-mais"
                    >
                      {mensagemExpandida === rec._id ? 'Ver menos' : 'Ver mais'}
                    </button>
                  )}

                  <div className="data-reclamacao">
                    <strong>Registrado em:</strong>{' '}
                    {rec.createdAt
                      ? new Date(rec.createdAt).toLocaleString('pt-BR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                        })
                      : 'Data não disponível'}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default UltimasReclamacoes;
