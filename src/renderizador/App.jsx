import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';

// Importando as páginas
import TelaLogin from './paginas/TelaLogin';
import Dashboard from './paginas/Dashboard';
import Produtos from './paginas/Produtos';
import Vendas from './paginas/Vendas'; // <--- 1. IMPORT NOVO (Adicionado)

import './estilos/App.css';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<TelaLogin />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/produtos" element={<Produtos />} />
        
        {/* 2. ROTA NOVA (Adicionado) */}
        <Route path="/vendas" element={<Vendas />} /> 
      </Routes>
    </HashRouter>
  );
}

export default App;