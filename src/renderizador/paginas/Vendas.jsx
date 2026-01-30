import React, { useState, useEffect } from 'react';
import LayoutPrincipal from '../layouts/LayoutPrincipal';
import { FaTrash, FaShoppingCart } from 'react-icons/fa'; // Ícones
import '../estilos/Vendas.css';

export default function Vendas() {
// Dados do Banco
const [catalogo, setCatalogo] = useState([]);

// Estado da Venda Atual
const [busca, setBusca] = useState('');
const [carrinho, setCarrinho] = useState([]);
const [total, setTotal] = useState(0);

// 1. Carrega todos os produtos ao abrir
useEffect(() => {
async function carregar() {
    const produtos = await window.apiEvaristo.produtos.listar();
    setCatalogo(produtos);
}
carregar();
}, []);

// 2. Adicionar produto ao pressionar ENTER
const handleBuscar = (e) => {
if (e.key === 'Enter') {
    const termo = busca.toLowerCase();
    
    // Tenta achar por código de barras EXATO ou nome
    const produto = catalogo.find(p => 
    (p.codigo && p.codigo === busca) || 
    p.nome.toLowerCase().includes(termo)
    );

    if (produto) {
    adicionarAoCarrinho(produto);
    setBusca(''); // Limpa o campo para o próximo
    } else {
    alert('Produto não encontrado!');
    }
}
};

const adicionarAoCarrinho = (produto) => {
const novoItem = { ...produto, quantidade: 1, uuid: Date.now() }; // uuid único para lista
const novoCarrinho = [...carrinho, novoItem];
setCarrinho(novoCarrinho);
calcularTotal(novoCarrinho);
};

const removerDoCarrinho = (uuid) => {
const novoCarrinho = carrinho.filter(item => item.uuid !== uuid);
setCarrinho(novoCarrinho);
calcularTotal(novoCarrinho);
};

const calcularTotal = (lista) => {
const soma = lista.reduce((acc, item) => acc + item.preco, 0);
setTotal(soma);
};

// 3. Finalizar Venda e Salvar no Banco
const handleFinalizar = async () => {
if (carrinho.length === 0) return alert('O carrinho está vazio!');

const venda = {
    total: total,
    pagamento: 'dinheiro', // Por enquanto fixo, depois mudamos
    itens: carrinho.map(item => ({
    id: item.id,
    quantidade: 1,
    preco: item.preco
    }))
};

try {
    const resultado = await window.apiEvaristo.vendas.criar(venda);
    if (resultado.sucesso) {
    alert(`Venda realizada! ID: ${resultado.id_venda}`);
    setCarrinho([]);
    setTotal(0);
    }
} catch (erro) {
    console.error(erro);
    alert('Erro ao processar venda.');
}
};

return (
<LayoutPrincipal>
    <div className="container-vendas">
    
    {/* ESQUERDA: Busca e Lista */}
    <div className="area-esquerda">
        <div className="barra-busca">
        <input 
            autoFocus
            placeholder="Digite o nome ou código de barras e dê ENTER..."
            value={busca}
            onChange={e => setBusca(e.target.value)}
            onKeyDown={handleBuscar}
        />
        </div>

        <div className="lista-carrinho">
        {carrinho.map((item, index) => (
            <div key={item.uuid} className="item-carrinho">
            <div style={{ flex: 1 }}>
                <strong>{index + 1}. {item.nome}</strong>
                <div style={{ fontSize: '0.9rem', color: '#64748b' }}>
                {item.codigo || 'S/N'}
                </div>
            </div>
            <div style={{ fontWeight: 'bold', marginRight: '20px' }}>
                R$ {item.preco.toFixed(2)}
            </div>
            <button className="btn-remover" onClick={() => removerDoCarrinho(item.uuid)}>
                <FaTrash />
            </button>
            </div>
        ))}
        {carrinho.length === 0 && (
            <div style={{ textAlign: 'center', padding: '50px', color: '#94a3b8' }}>
            <FaShoppingCart size={50} />
            <p>Caixa Livre. Aguardando itens...</p>
            </div>
        )}
        </div>
    </div>

    {/* DIREITA: Totais */}
    <div className="area-direita">
        <div>
        <div className="resumo-titulo">Resumo do Pedido</div>
        <p>{carrinho.length} itens</p>
        </div>

        <div className="display-total">
        <div className="label-total">Total a Pagar</div>
        <div className="valor-total">
            R$ {total.toFixed(2)}
        </div>
        </div>

        <button className="btn-finalizar" onClick={handleFinalizar}>
        FINALIZAR (F5)
        </button>
    </div>

    </div>
</LayoutPrincipal>
);
}