import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';

// Importando as páginas
import TelaLogin from './paginas/TelaLogin';
import Dashboard from './paginas/Dashboard';

// Importando estilos globais
import './estilos/App.css';

function App() {
  return (
    // Usamos HashRouter pois é o mais compatível com Electron (arquivos locais)
    <HashRouter>
      <Routes>
        <Route path="/" element={<TelaLogin />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </HashRouter>
  );
}

export default App;