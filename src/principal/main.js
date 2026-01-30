const { app, BrowserWindow, ipcMain } = require('electron'); // <--- Adicionado ipcMain
const path = require('path');

// --- INICIALIZAÇÃO DO BANCO ---
// Importamos o repositório para que ele rode a lógica de criação
const UsuarioRepositorio = require('../banco-dados/queries/usuarios');
// Forçamos a verificação imediata
UsuarioRepositorio.inicializar();
// ------------------------------

// Garante que a variável da janela não seja limpa da memória
let janelaPrincipal;

function criarJanela() {
  janelaPrincipal = new BrowserWindow({
    width: 1200,
    height: 800,
    title: "EvarPDV - Sistema Integrado",
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
}

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
// CANAIS DE COMUNICAÇÃO (IPC)
// O React chama esses canais via preload.js
// ---------------------------------------------------------

ipcMain.handle('autenticacao:login', async (evento, { email, senha }) => {
  try {
    // Chama a função pura do repositório que criamos
    const resultado = await UsuarioRepositorio.login(email, senha);
    return resultado;
  } catch (erro) {
    console.error('Erro fatal no IPC de login:', erro);
    return { sucesso: false, mensagem: 'Erro crítico no processo de login.' };
  }
});