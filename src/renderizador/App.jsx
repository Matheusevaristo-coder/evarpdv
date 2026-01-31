import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';

// Importando as páginas
import TelaLogin from './paginas/TelaLogin';
import Dashboard from './paginas/Dashboard';
import Produtos from './paginas/Produtos';
import Vendas from './paginas/Vendas';
import Configuracoes from './paginas/Configuracoes'; // <--- 1. IMPORT NOVO

import './estilos/App.css';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<TelaLogin />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/produtos" element={<Produtos />} />
        <Route path="/vendas" element={<Vendas />} />
        
        {/* 2. ROTA NOVA PARA CONFIGURAÇÕES */}
        <Route path="/configuracoes" element={<Configuracoes />} />
      </Routes>
    </HashRouter>
  );
}

export default App;