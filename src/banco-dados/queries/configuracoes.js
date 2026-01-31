const db = require('../conexao');

const ConfiguracoesRepositorio = {
  inicializar: () => {
    db.run(`
      CREATE TABLE IF NOT EXISTS configuracoes (
        id INTEGER PRIMARY KEY,
        nome_loja TEXT,
        cnpj_cpf TEXT,
        endereco TEXT,
        telefone TEXT,
        mensagem_rodape TEXT
      )
    `, (err) => {
      if (!err) {
        // Garante que existe pelo menos uma linha vazia (ID 1) para podermos editar
        db.run(`INSERT OR IGNORE INTO configuracoes (id, nome_loja) VALUES (1, 'Minha Loja')`);
        console.log('⚙️ Tabela de "configuracoes" verificada.');
      }
    });
  },

  // Busca os dados da loja
  obter: () => {
    return new Promise((resolve, reject) => {
      db.get(`SELECT * FROM configuracoes WHERE id = 1`, (err, row) => {
        if (err) reject(err);
        else resolve(row || {});
      });
    });
  },

  // Atualiza os dados
  salvar: (dados) => {
    return new Promise((resolve, reject) => {
      const sql = `
        UPDATE configuracoes 
        SET nome_loja = ?, cnpj_cpf = ?, endereco = ?, telefone = ?, mensagem_rodape = ?
        WHERE id = 1
      `;
      const params = [
        dados.nome_loja, 
        dados.cnpj_cpf, 
        dados.endereco, 
        dados.telefone, 
        dados.mensagem_rodape
      ];

      db.run(sql, params, function(err) {
        if (err) reject(err);
        else resolve({ sucesso: true });
      });
    });
  }
};

module.exports = ConfiguracoesRepositorio;