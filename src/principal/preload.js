const { contextBridge, ipcRenderer } = require('electron');

// Expõe uma API segura para o React usar
contextBridge.exposeInMainWorld('apiEvaristo', {
  sistema: {
    versao: process.versions.electron,
    plataforma: process.platform
  },
  
  // --- ADICIONADO: Módulo de Autenticação ---
  autenticacao: {
    // O React chama esta função, que envia um sinal para o Electron (main.js)
    login: (email, senha) => ipcRenderer.invoke('autenticacao:login', { email, senha })
  }
});