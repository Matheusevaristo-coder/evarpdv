import React from 'react';
import MenuLateral from '../componentes/MenuLateral';
import '../estilos/Layout.css';

// children representa a tela que será exibida no meio (Dashboard, Vendas, etc)
export default function LayoutPrincipal({ children }) {
return (
<div className="layout-principal">
    <MenuLateral />
    <main className="conteudo-principal">
    {children}
    </main>
</div>
);
}