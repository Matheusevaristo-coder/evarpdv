import React from 'react';
import LayoutPrincipal from '../layouts/LayoutPrincipal';

export default function Dashboard() {
const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');

return (
<LayoutPrincipal>
    <h1>Dashboard Gerencial</h1>
    <p>Bem-vindo de volta, <strong>{usuario.nome}</strong>.</p>
    
    <div style={{ marginTop: '20px', display: 'flex', gap: '20px' }}>
    {/* Exemplo de Card de Resumo */}
    <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', flex: 1 }}>
        <h3>Vendas Hoje</h3>
        <p style={{ fontSize: '2rem', color: '#10b981' }}>R$ 0,00</p>
    </div>

    <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', flex: 1 }}>
        <h3>Produtos Cadastrados</h3>
        <p style={{ fontSize: '2rem', color: '#3b82f6' }}>0</p>
    </div>
    </div>
</LayoutPrincipal>
);
}