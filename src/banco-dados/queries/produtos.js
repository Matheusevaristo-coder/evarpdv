// src/banco-dados/queries/produtos.js
const db = require('../conexao');

const ProdutoRepositorio = {
// 1. Cria a tabela se não existir
inicializar: () => {
const sql = `
    CREATE TABLE IF NOT EXISTS produtos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    preco REAL NOT NULL, -- Armazena valores como 10.50
    estoque INTEGER DEFAULT 0,
    codigo TEXT UNIQUE, -- Código de barras ou SKU
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`;

db.run(sql, (erro) => {
    if (erro) console.error('❌ Erro ao criar tabela produtos:', erro.message);
    else console.log('📦 Tabela "produtos" verificada.');
});
},

// 2. Listar todos os produtos
listar: () => {
return new Promise((resolve, reject) => {
    db.all("SELECT * FROM produtos ORDER BY nome ASC", (erro, linhas) => {
    if (erro) reject(erro);
    else resolve(linhas);
    });
});
},

// 3. Criar novo produto
criar: (produto) => {
return new Promise((resolve, reject) => {
    const sql = `
    INSERT INTO produtos (nome, preco, estoque, codigo)
    VALUES (?, ?, ?, ?)
    `;
    const params = [produto.nome, produto.preco, produto.estoque, produto.codigo];
    
    db.run(sql, params, function(erro) {
    if (erro) {
        console.error('Erro ao criar produto:', erro.message);
        reject(erro);
    } else {
        // 'this.lastID' retorna o ID do item recém criado
        resolve({ id: this.lastID, ...produto });
    }
    });
});
},

// 4. Excluir produto
excluir: (id) => {
return new Promise((resolve, reject) => {
    db.run("DELETE FROM produtos WHERE id = ?", [id], function(erro) {
    if (erro) reject(erro);
    else resolve({ sucesso: true, id_deletado: id });
    });
});
}
};

module.exports = ProdutoRepositorio;