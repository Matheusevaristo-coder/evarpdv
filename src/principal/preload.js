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

  // Módulo de Produtos
  produtos: {
    listar: () => ipcRenderer.invoke('produtos:listar'),
    criar: (dados) => ipcRenderer.invoke('produtos:criar', dados),
    excluir: (id) => ipcRenderer.invoke('produtos:excluir', id)
  },

  // Módulo de Vendas
  vendas: {
    criar: (venda) => ipcRenderer.invoke('vendas:criar', venda),
    listarRecentes: () => ipcRenderer.invoke('vendas:listar-recentes')
  },

  // --- MÓDULO DE CONFIGURAÇÕES (NOVO) ---
  configuracoes: {
    obter: () => ipcRenderer.invoke('config:obter'),
    salvar: (dados) => ipcRenderer.invoke('config:salvar', dados)
  }
});