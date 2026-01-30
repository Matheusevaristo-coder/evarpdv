import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../estilos/TelaLogin.css';

export default function TelaLogin() {
const [email, setEmail] = useState('');
const [senha, setSenha] = useState('');
const [erro, setErro] = useState('');
const [carregando, setCarregando] = useState(false);

const navigate = useNavigate();

const handleLogin = async (e) => {
    e.preventDefault(); // Evita recarregar a página
    setErro('');
    setCarregando(true);

    try {
    // Chama a ponte segura que criamos no preload.js
    console.log('Tentando logar com:', email);

    const resposta = await window.apiEvaristo.autenticacao.login(email, senha);

    if (resposta.sucesso) {
        console.log('Login autorizado!', resposta.usuario);
        // Salva dados básicos na sessão (opcional)
        localStorage.setItem('usuario', JSON.stringify(resposta.usuario));
        // Navega para a tela principal (Dashboard)
        navigate('/dashboard');
    } else {
        setErro(resposta.mensagem || 'Falha na autenticação');
    }
    } catch (error) {
    console.error(error);
    setErro('Erro de comunicação com o sistema.');
    } finally {
    setCarregando(false);
    }
};

return (
    <div className="container-login">
    <div className="card-login">
        <h2>EvarPDV</h2>

        {erro && <div className="erro-msg">{erro}</div>}

        <form onSubmit={handleLogin}>
        <div className="grupo-input">
            <label>E-mail</label>
            <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@evar.com"
            required
            />
        </div>

        <div className="grupo-input">
            <label>Senha</label>
            <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            placeholder="123456"
            required
            />
        </div>

        <button
            type="submit"
            className="botao-entrar"
            disabled={carregando}
        >
            {carregando ? 'Verificando...' : 'Entrar no Sistema'}
        </button>
        </form>
    </div>
    </div>
);
}
