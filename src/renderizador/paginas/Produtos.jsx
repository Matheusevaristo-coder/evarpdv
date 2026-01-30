import React, { useState, useEffect } from 'react';
import LayoutPrincipal from '../layouts/LayoutPrincipal';
import '../estilos/Produtos.css';

export default function Produtos() {
const [listaProdutos, setListaProdutos] = useState([]);

// Estados do Formulário
const [nome, setNome] = useState('');
const [preco, setPreco] = useState('');
const [estoque, setEstoque] = useState('');
const [codigo, setCodigo] = useState('');

// 1. Carregar produtos ao abrir a tela
useEffect(() => {
carregarProdutos();
}, []);

const carregarProdutos = async () => {
try {
    const produtos = await window.apiEvaristo.produtos.listar();
    setListaProdutos(produtos);
} catch (error) {
    console.error("Erro ao listar:", error);
}
};

// 2. Salvar novo produto
const handleSalvar = async (e) => {
e.preventDefault();
if (!nome || !preco) return alert("Nome e Preço são obrigatórios");

const novoProduto = {
    nome,
    preco: parseFloat(preco), // Garante que seja número para cálculo
    estoque: parseInt(estoque) || 0,
    codigo
};

try {
    await window.apiEvaristo.produtos.criar(novoProduto);
    
    // Limpar formulário após sucesso
    setNome('');
    setPreco('');
    setEstoque('');
    setCodigo('');
    
    // Atualizar a tabela
    carregarProdutos();
} catch (error) {
    alert('Erro ao salvar. Verifique se o código já existe.');
}
};

// 3. Excluir produto
const handleExcluir = async (id) => {
if (window.confirm('Tem certeza que deseja excluir este item?')) {
    await window.apiEvaristo.produtos.excluir(id);
    carregarProdutos();
}
};

return (
<LayoutPrincipal>
    <div className="container-produtos">
    <h1>Gestão de Estoque</h1>

    {/* Formulário de Cadastro */}
    <form className="card-formulario" onSubmit={handleSalvar}>
        <div className="input-group" style={{ flex: 2 }}>
        <label>Nome do Produto</label>
        <input 
            value={nome} 
            onChange={e => setNome(e.target.value)} 
            placeholder="Ex: Coca-Cola Lata" 
            autoFocus
        />
        </div>

        <div className="input-group">
        <label>Preço (R$)</label>
        <input 
            type="number" 
            step="0.01" 
            value={preco} 
            onChange={e => setPreco(e.target.value)} 
            placeholder="0.00" 
        />
        </div>

        <div className="input-group">
        <label>Estoque</label>
        <input 
            type="number" 
            value={estoque} 
            onChange={e => setEstoque(e.target.value)} 
            placeholder="0" 
        />
        </div>

        <div className="input-group">
        <label>Código (Opcional)</label>
        <input 
            value={codigo} 
            onChange={e => setCodigo(e.target.value)} 
            placeholder="SKU ou EAN" 
        />
        </div>

        <button type="submit" className="btn-salvar">
        + Cadastrar
        </button>
    </form>

    {/* Tabela de Listagem */}
    <div className="tabela-container">
        <table className="tabela-produtos">
        <thead>
            <tr>
            <th style={{ width: '50px' }}>ID</th>
            <th>Nome</th>
            <th style={{ width: '120px' }}>Preço</th>
            <th style={{ width: '100px' }}>Estoque</th>
            <th>Código</th>
            <th style={{ width: '100px', textAlign: 'center' }}>Ações</th>
            </tr>
        </thead>
        <tbody>
            {listaProdutos.map((prod) => (
            <tr key={prod.id}>
                <td>{prod.id}</td>
                <td>{prod.nome}</td>
                <td style={{ color: '#10b981', fontWeight: 'bold' }}>
                R$ {prod.preco.toFixed(2)}
                </td>
                <td>{prod.estoque} un</td>
                <td style={{ fontSize: '0.85rem', color: '#64748b' }}>
                {prod.codigo || '-'}
                </td>
                <td style={{ textAlign: 'center' }}>
                <button className="btn-excluir" onClick={() => handleExcluir(prod.id)}>
                    Excluir
                </button>
                </td>
            </tr>
            ))}
            
            {listaProdutos.length === 0 && (
            <tr>
                <td colSpan="6" style={{textAlign: 'center', padding: '2rem', color: '#94a3b8'}}>
                Nenhum produto cadastrado ainda.
                </td>
            </tr>
            )}
        </tbody>
        </table>
    </div>
    </div>
</LayoutPrincipal>
);
}