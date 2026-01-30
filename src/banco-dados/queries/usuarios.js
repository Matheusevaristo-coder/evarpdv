// src/banco-dados/queries/usuarios.js
const db = require('../conexao');

const UsuarioRepositorio = {
  // 1. Garante que a tabela existe
  inicializar: () => {
    const sql = `
      CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        senha TEXT NOT NULL,
        cargo TEXT DEFAULT 'vendedor',
        criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;

    db.run(sql, (erro) => {
      if (erro) {
        console.error('❌ Erro ao criar tabela usuarios:', erro.message);
      } else {
        // Se a tabela foi criada/verificada, tenta criar o Admin padrão
        UsuarioRepositorio.criarAdminPadrao();
      }
    });
  },

  // 2. Cria o usuário Admin se o banco estiver vazio (Seed)
  criarAdminPadrao: () => {
    const sqlVerifica = `SELECT count(*) as total FROM usuarios`;

    db.get(sqlVerifica, (erro, linha) => {
      if (erro) return console.error('Erro ao contar usuários:', erro.message);

      if (linha.total === 0) {
        const sqlInsert = `
          INSERT INTO usuarios (nome, email, senha, cargo) 
          VALUES (?, ?, ?, ?)
        `;

        // TODO: Futuramente usar hash na senha (bcrypt)
        const dados = ['Administrador', 'admin@evar.com', '123456', 'admin'];

        db.run(sqlInsert, dados, (err) => {
          if (!err) console.log('👤 Admin padrão criado: admin@evar.com');
        });
      }
    });
  },

  // 3. Verifica credenciais (Login)
  login: (email, senha) => {
    return new Promise((resolve, reject) => {
      const sql = `SELECT id, nome, email, cargo FROM usuarios WHERE email = ? AND senha = ?`;

      db.get(sql, [email, senha], (erro, usuario) => {
        if (erro) {
          console.error('❌ Erro no SQL de login:', erro);
          reject({ sucesso: false, mensagem: 'Erro interno no banco.' });
        } else if (usuario) {
          console.log('✅ Login autorizado:', usuario.nome);
          resolve({ sucesso: true, usuario });
        } else {
          console.warn('⚠️ Tentativa de login falhou:', email);
          resolve({ sucesso: false, mensagem: 'E-mail ou senha incorretos.' });
        }
      });
    });
  }
};

module.exports = UsuarioRepositorio;