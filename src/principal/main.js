const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

// ---------------------------------------------------------
// 1. INICIALIZAÇÃO DO BANCO DE DADOS
// ---------------------------------------------------------
// Importamos os repositórios
const UsuarioRepositorio = require('../banco-dados/queries/usuarios');
const ProdutoRepositorio = require('../banco-dados/queries/produtos');

// Forçamos a verificação das tabelas ao iniciar
UsuarioRepositorio.inicializar();
ProdutoRepositorio.inicializar();


// ---------------------------------------------------------
// 2. CONFIGURAÇÃO DA JANELA PRINCIPAL
// ---------------------------------------------------------
let janelaPrincipal;

function criarJanela() {
  janelaPrincipal = new BrowserWindow({
    width: 1200,
    height: 800,
    title: "EvarPDV - Sistema Integrado",
    show: false, // Começa escondida para não piscar antes de maximizar
    webPreferences: {
      nodeIntegration: false, // Segurança: Front não acessa o sistema direto
      contextIsolation: true, // Segurança: Exige uso de preload
      preload: path.join(__dirname, 'preload.js') // Conecta a ponte
    }
  });

  // Em DEV, carrega a URL do Vite.
  const urlDesenvolvimento = 'http://localhost:5173';
  janelaPrincipal.loadURL(urlDesenvolvimento);

  // Abre o DevTools (F12) automaticamente para ajudar no debug
  janelaPrincipal.webContents.openDevTools();

  // Quando estiver pronta, maximiza e mostra
  janelaPrincipal.once('ready-to-show', () => {
    janelaPrincipal.maximize();
    janelaPrincipal.show();
  });
}

// ---------------------------------------------------------
// 3. CICLO DE VIDA DO APLICATIVO
// ---------------------------------------------------------
app.whenReady().then(() => {
  criarJanela();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) criarJanela();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});


// ---------------------------------------------------------
// 4. CANAIS DE COMUNICAÇÃO (IPC)
// O React chama esses canais via preload.js
// ---------------------------------------------------------

// --- MÓDULO: AUTENTICAÇÃO ---
ipcMain.handle('autenticacao:login', async (evento, { email, senha }) => {
  try {
    const resultado = await UsuarioRepositorio.login(email, senha);
    return resultado;
  } catch (erro) {
    console.error('Erro fatal no IPC de login:', erro);
    return { sucesso: false, mensagem: 'Erro crítico no processo de login.' };
  }
});

// --- MÓDULO: PRODUTOS ---
ipcMain.handle('produtos:listar', async () => {
  return await ProdutoRepositorio.listar();
});

ipcMain.handle('produtos:criar', async (evento, dados) => {
  return await ProdutoRepositorio.criar(dados);
});

ipcMain.handle('produtos:excluir', async (evento, id) => {
  return await ProdutoRepositorio.excluir(id);
});