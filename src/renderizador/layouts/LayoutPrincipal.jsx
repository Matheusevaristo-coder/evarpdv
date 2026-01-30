import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaHome, FaShoppingCart, FaBox, FaCog, FaSignOutAlt } from 'react-icons/fa';
import '../estilos/Layout.css'; // <--- Importa o CSS novo

export default function LayoutPrincipal({ children }) {
  const location = useLocation(); // Para saber em qual página estamos
  const navigate = useNavigate();

  const handleSair = () => {
    // Aqui você pode limpar dados de sessão se precisar
    navigate('/');
  };

  // Função auxiliar para verificar se o link é o atual
  const linkAtivo = (caminho) => location.pathname === caminho ? 'ativo' : '';

  return (
    <div className="layout-container">
      
      {/* --- COLUNA ESQUERDA: MENU --- */}
      <aside className="menu-lateral">
        <div className="logo-area">
          <h2>EvarPDV</h2>
        </div>

        <nav className="nav-links">
          <Link to="/dashboard" className={linkAtivo('/dashboard')}>
            <FaHome /> Dashboard
          </Link>
          
          <Link to="/vendas" className={linkAtivo('/vendas')}>
            <FaShoppingCart /> Vendas (PDV)
          </Link>
          
          <Link to="/produtos" className={linkAtivo('/produtos')}>
            <FaBox /> Produtos
          </Link>
          
          <Link to="/configuracoes" className={linkAtivo('/configuracoes')}>
            <FaCog /> Configurações
          </Link>
        </nav>

        <div className="btn-sair">
          <button onClick={handleSair}>
            <FaSignOutAlt /> Sair
          </button>
        </div>
      </aside>

      {/* --- COLUNA DIREITA: CONTEÚDO --- */}
      <main className="conteudo-principal">
        {/* Wrapper para dar margem interna nas páginas */}
        <div className="pagina-wrapper">
          {children}
        </div>
      </main>

    </div>
  );
}