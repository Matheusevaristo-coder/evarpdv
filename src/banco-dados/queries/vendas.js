// src/banco-dados/queries/vendas.js
const db = require('../conexao');

const VendasRepositorio = {
  inicializar: () => {
    // 1. Tabela da Venda (Cabeçalho)
    db.run(`
      CREATE TABLE IF NOT EXISTS vendas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        valor_total REAL NOT NULL,
        forma_pagamento TEXT NOT NULL, -- 'dinheiro', 'pix', 'cartao'
        data_venda DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 2. Tabela dos Itens da Venda (Relacionamento)
    db.run(`
      CREATE TABLE IF NOT EXISTS vendas_itens (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        venda_id INTEGER,
        produto_id INTEGER,
        quantidade INTEGER,
        preco_unitario REAL,
        FOREIGN KEY(venda_id) REFERENCES vendas(id),
        FOREIGN KEY(produto_id) REFERENCES produtos(id)
      )
    `, (erro) => {
      if (!erro) console.log('💰 Tabelas de "vendas" verificadas.');
    });
  },

  // Registrar uma nova venda (Complexo: Usa Transação)
  criar: (venda) => {
    return new Promise((resolve, reject) => {
      // Começa a transação (tudo ou nada)
      db.serialize(() => {
        db.run("BEGIN TRANSACTION");

        // 1. Insere a Venda
        const sqlVenda = `INSERT INTO vendas (valor_total, forma_pagamento) VALUES (?, ?)`;
        
        db.run(sqlVenda, [venda.total, venda.pagamento], function(erro) {
          if (erro) {
            db.run("ROLLBACK"); // Cancela tudo se der erro
            return reject(erro);
          }

          const vendaId = this.lastID;

          // 2. Insere os Itens
          const sqlItem = `INSERT INTO vendas_itens (venda_id, produto_id, quantidade, preco_unitario) VALUES (?, ?, ?, ?)`;
          const stmt = db.prepare(sqlItem);

          venda.itens.forEach(item => {
            stmt.run([vendaId, item.id, item.quantidade, item.preco]);
            
            // Opcional: Aqui poderíamos abater o estoque
            db.run(`UPDATE produtos SET estoque = estoque - ? WHERE id = ?`, [item.quantidade, item.id]);
          });

          stmt.finalize();

          db.run("COMMIT", (err) => {
            if (err) reject(err);
            else resolve({ sucesso: true, id_venda: vendaId });
          });
        });
      });
    });
  },

  // Listar vendas recentes (para o Dashboard)
  listarRecentes: () => {
    return new Promise((resolve, reject) => {
      db.all("SELECT * FROM vendas ORDER BY id DESC LIMIT 10", (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }
};

module.exports = VendasRepositorio;