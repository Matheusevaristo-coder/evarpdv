const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('apiEvaristo', {
  // Dados do Sistema
  sistema: {
    versao: process.versions.electron,
    plataforma: process.platform
  },
  
  // Módulo de Autenticação
  autenticacao: {
    login: (email, senha) => ipcRenderer.invoke('autenticacao:login', { email, senha })
  },

  // --- MÓDULO DE PRODUTOS (ADICIONADO AGORA) ---
  produtos: {
    // Lista todos os itens do banco
    listar: () => ipcRenderer.invoke('produtos:listar'),
    
    // Cria um novo item (recebe objeto { nome, preco, ... })
    criar: (dados) => ipcRenderer.invoke('produtos:criar', dados),
    
    // Deleta pelo ID
    excluir: (id) => ipcRenderer.invoke('produtos:excluir', id)
  }
});