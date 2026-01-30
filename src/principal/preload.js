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

  // --- MÓDULO DE VENDAS (ADICIONADO AGORA) ---
  vendas: {
    // Envia o objeto da venda { total, pagamento, itens: [...] }
    criar: (venda) => ipcRenderer.invoke('vendas:criar', venda),
    
    // Busca as últimas vendas para o Dashboard
    listarRecentes: () => ipcRenderer.invoke('vendas:listar-recentes')
  }
});