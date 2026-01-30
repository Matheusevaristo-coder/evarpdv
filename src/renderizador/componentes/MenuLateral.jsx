import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaHome, FaBoxOpen, FaShoppingCart, FaSignOutAlt, FaCog } from 'react-icons/fa';
import '../estilos/Layout.css';

export default function MenuLateral() {
const navigate = useNavigate();

const handleLogout = () => {
// Removemos o usuário e voltamos pro login
localStorage.removeItem('usuario');
navigate('/');
};

return (
<div className="menu-lateral">
    <div className="menu-logo">
    EvarPDV
    </div>

    <nav style={{ flex: 1 }}>
    <NavLink 
        to="/dashboard" 
        className={({ isActive }) => isActive ? "menu-item ativo" : "menu-item"}
    >
        <FaHome /> Dashboard
    </NavLink>

    <NavLink 
        to="/vendas" 
        className={({ isActive }) => isActive ? "menu-item ativo" : "menu-item"}
    >
        <FaShoppingCart /> Vendas (PDV)
    </NavLink>

    <NavLink 
        to="/produtos" 
        className={({ isActive }) => isActive ? "menu-item ativo" : "menu-item"}
    >
        <FaBoxOpen /> Produtos
    </NavLink>

    <NavLink 
        to="/configuracoes" 
        className={({ isActive }) => isActive ? "menu-item ativo" : "menu-item"}
    >
        <FaCog /> Configurações
    </NavLink>
    </nav>

    <div className="menu-footer">
    <div className="menu-item" onClick={handleLogout} style={{ color: '#ef4444' }}>
        <FaSignOutAlt /> Sair
    </div>
    </div>
</div>
);
}