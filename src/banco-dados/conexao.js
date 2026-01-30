// src/banco-dados/conexao.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { app } = require('electron');

// Define o caminho físico do arquivo
const caminhoBanco = app.isPackaged
  ? path.join(app.getPath('userData'), 'evarpdv.db')
  : path.join(__dirname, '../../evarpdv.db');

let dbInstance = null;

function obterConexao() {
  if (!dbInstance) {
    dbInstance = new sqlite3.Database(caminhoBanco, (erro) => {
      if (erro) {
        console.error('❌ Erro fatal no SQLite:', erro.message);
      } else {
        console.log('✅ Conexão SQLite ativa:', caminhoBanco);
        // A lógica de ligar FKs (chaves estrangeiras) é importante no SQLite
        dbInstance.run("PRAGMA foreign_keys = ON");
      }
    });
  }
  return dbInstance;
}

// Exportamos a função que retorna o Singleton
module.exports = obterConexao();