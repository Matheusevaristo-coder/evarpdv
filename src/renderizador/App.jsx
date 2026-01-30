import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';

// Importando as páginas
import TelaLogin from './paginas/TelaLogin';
import Dashboard from './paginas/Dashboard';
import Produtos from './paginas/Produtos'; // <--- IMPORTANTE

import './estilos/App.css';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<TelaLogin />} />
        <Route path="/dashboard" element={<Dashboard />} />
        {/* Rota para a tela nova */}
        <Route path="/produtos" element={<Produtos />} />
      </Routes>
    </HashRouter>
  );
}

export default App;