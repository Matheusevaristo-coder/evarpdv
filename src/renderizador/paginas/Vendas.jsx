import React, { useState, useEffect, useRef } from 'react';
import LayoutPrincipal from '../layouts/LayoutPrincipal';
import { FaTrash, FaShoppingCart, FaMoneyBillWave, FaTimes, FaCheckCircle, FaPrint } from 'react-icons/fa';
import '../estilos/Vendas.css';
import CupomFiscal from '../componentes/CupomFiscal'; // <--- 1. IMPORTAR O CUPOM

export default function Vendas() {
  // --- ESTADOS DO SISTEMA ---
  const [catalogo, setCatalogo] = useState([]);
  const [lojaConfig, setLojaConfig] = useState({}); // <--- 2. ESTADO PARA DADOS DA LOJA
  
  // --- ESTADOS DA VENDA ---
  const [busca, setBusca] = useState('');
  const [carrinho, setCarrinho] = useState([]);
  const [total, setTotal] = useState(0);

  // --- ESTADOS DOS MODAIS ---
  const [modalAberto, setModalAberto] = useState(false);
  
  // Estado para controlar a tela de sucesso E guardar dados para o cupom
  const [vendaConcluida, setVendaConcluida] = useState(null); 

  const [formaPagamento, setFormaPagamento] = useState('DINHEIRO'); 
  const [valorRecebido, setValorRecebido] = useState('');
  const [troco, setTroco] = useState(0);

  const inputBuscaRef = useRef(null); 
  const inputPagamentoRef = useRef(null); 
  const btnNovaVendaRef = useRef(null);

  // 1. Carrega produtos E configurações da loja
  useEffect(() => {
    async function carregar() {
      // Carrega Produtos
      const produtos = await window.apiEvaristo.produtos.listar();
      setCatalogo(produtos);

      // Carrega Configurações (Nome da Loja, CNPJ, etc)
      const config = await window.apiEvaristo.configuracoes.obter();
      setLojaConfig(config || {}); // Salva no estado para passar pro cupom

      inputBuscaRef.current?.focus();
    }
    carregar();
  }, []);

  // 2. Recalcula Total
  useEffect(() => {
    const novoTotal = carrinho.reduce((acc, item) => acc + item.preco, 0);
    setTotal(novoTotal);
  }, [carrinho]);

  // 3. Calcula Troco
  useEffect(() => {
    if (formaPagamento === 'DINHEIRO') {
      const recebido = parseFloat(valorRecebido.replace(',', '.')) || 0;
      setTroco(recebido - total);
    } else {
      setTroco(0);
      setValorRecebido(total.toFixed(2));
    }
  }, [valorRecebido, formaPagamento, total]);

  // --- FUNÇÕES ---

  const handleBuscar = (e) => {
    if (e.key === 'Enter') {
      if (!busca.trim()) return;
      const termo = busca.toLowerCase();
      
      const produto = catalogo.find(p => 
        (p.codigo_barras && p.codigo_barras === busca) || 
        p.nome.toLowerCase().includes(termo)
      );

      if (produto) {
        adicionarAoCarrinho(produto);
        setBusca('');
      } else {
        console.log('Produto não encontrado');
        setBusca('');
      }
    }
  };

  const adicionarAoCarrinho = (produto) => {
    const novoItem = { ...produto, uuid: Date.now() }; 
    setCarrinho([...carrinho, novoItem]);
  };

  const removerDoCarrinho = (uuid) => {
    setCarrinho(carrinho.filter(item => item.uuid !== uuid));
  };

  const abrirModal = () => {
    if (carrinho.length === 0) return;
    setModalAberto(true);
    setFormaPagamento('DINHEIRO');
    setValorRecebido('');
    setTimeout(() => inputPagamentoRef.current?.focus(), 100);
  };

  const fecharModal = () => {
    setModalAberto(false);
    inputBuscaRef.current?.focus();
  };

  const confirmarVenda = async () => {
    if (formaPagamento === 'DINHEIRO') {
        const recebido = parseFloat(valorRecebido.replace(',', '.')) || 0;
        if (recebido < total) return alert('Valor menor que o total!');
    }

    const vendaBanco = {
      total: total,
      pagamento: formaPagamento,
      itens: carrinho.map(item => ({ id: item.id, nome: item.nome, preco: item.preco, quantidade: 1 }))
    };

    try {
      const resultado = await window.apiEvaristo.vendas.criar(vendaBanco);
      if (resultado.sucesso) {
        setModalAberto(false);
        
        // --- PREPARA DADOS PARA O CUPOM ---
        // Precisamos passar o carrinho completo (com nomes) para o cupom, 
        // pois o retorno do banco às vezes só traz o ID.
        setVendaConcluida({
            id: resultado.id_venda,
            troco: troco,
            total: total,
            pagamento: formaPagamento,
            itens: carrinho 
        });

        setTimeout(() => btnNovaVendaRef.current?.focus(), 100);
      }
    } catch (erro) {
      console.error(erro);
    }
  };

  const iniciarNovaVenda = () => {
    setCarrinho([]);
    setVendaConcluida(null);
    setBusca('');
    inputBuscaRef.current?.focus();
  };

  // 4. FUNÇÃO DE IMPRESSÃO
  const handleImprimir = () => {
    window.print(); // O CSS @media print fará a mágica de esconder o site e mostrar só o cupom
  };

  // Atalhos de Teclado
  const handleKeyDownGlobal = (e) => {
    // F1 para Imprimir (só se venda concluída)
    if (e.key === 'F1' && vendaConcluida) {
        e.preventDefault();
        handleImprimir();
    }
    // F5 para Pagar
    if (e.key === 'F5' && !modalAberto && !vendaConcluida) {
        e.preventDefault();
        abrirModal();
    }
    // Esc para Sair/Nova Venda
    if (e.key === 'Escape') {
        if (vendaConcluida) iniciarNovaVenda();
        else if (modalAberto) fecharModal();
    }
  };

  return (
    <LayoutPrincipal>
      <div className="container-vendas" onKeyDown={handleKeyDownGlobal}>
        
        {/* ESQUERDA */}
        <div className="area-esquerda">
          <div className="barra-busca">
            <input 
              ref={inputBuscaRef}
              autoFocus
              placeholder="DIGITE O NOME OU CÓDIGO DE BARRAS..."
              value={busca}
              onChange={e => setBusca(e.target.value)}
              onKeyDown={handleBuscar}
              disabled={modalAberto || vendaConcluida} 
            />
          </div>
          <div className="lista-carrinho">
            {carrinho.map((item, index) => (
              <div key={item.uuid} className="item-carrinho">
                <div style={{ flex: 1 }}>
                    <div style={{fontSize: '0.8rem', color: '#94a3b8'}}>ITEM {index + 1}</div>
                    <strong>{item.nome}</strong>
                </div>
                <div className="item-preco">R$ {item.preco.toFixed(2)}</div>
                <button className="btn-remover" onClick={() => removerDoCarrinho(item.uuid)}>
                  <FaTrash />
                </button>
              </div>
            ))}
            {carrinho.length === 0 && (
                <div style={{ textAlign: 'center', padding: '50px', color: '#cbd5e1' }}>
                    <FaShoppingCart size={40} />
                    <p>Caixa Livre</p>
                </div>
            )}
          </div>
        </div>

        {/* DIREITA */}
        <div className="area-direita">
          <div>
            <div className="resumo-titulo">Resumo</div>
            <p style={{textAlign: 'right'}}>{carrinho.length} itens</p>
          </div>
          <div className="display-total">
            <div className="label-total">Total a Pagar</div>
            <div className="valor-total">R$ {total.toFixed(2)}</div>
          </div>
          <button className="btn-finalizar" onClick={abrirModal}>PAGAMENTO (F5)</button>
        </div>

        {/* MODAL PAGAMENTO */}
        {modalAberto && (
          <div className="modal-overlay">
            <div className="modal-conteudo">
              <div className="modal-header">
                <h2><FaMoneyBillWave /> Pagamento</h2>
                <button onClick={fecharModal} className="btn-fechar-modal"><FaTimes /></button>
              </div>
              <div className="opcoes-pagamento">
                {['DINHEIRO', 'PIX', 'CREDITO', 'DEBITO'].map(tipo => (
                    <button 
                        key={tipo}
                        className={`btn-opcao ${formaPagamento === tipo ? 'selecionado' : ''}`}
                        onClick={() => setFormaPagamento(tipo)}
                    >
                        {tipo}
                    </button>
                ))}
              </div>
              {formaPagamento === 'DINHEIRO' && (
                <div className="area-valores">
                  <div className="grupo-input">
                    <label>Valor Recebido</label>
                    <input 
                      ref={inputPagamentoRef}
                      type="number"
                      placeholder="0.00"
                      value={valorRecebido}
                      onChange={e => setValorRecebido(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && confirmarVenda()}
                    />
                  </div>
                  <div className="info-troco">
                    <span>Troco:</span>
                    <span className="valor-troco" style={{color: troco < 0 ? '#ef4444' : '#10b981'}}>
                        R$ {troco.toFixed(2)}
                    </span>
                  </div>
                </div>
              )}
              <div className="modal-footer">
                <button className="btn-cancelar" onClick={fecharModal}>Cancelar</button>
                <button className="btn-confirmar" onClick={confirmarVenda}>CONFIRMAR (ENTER)</button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL SUCESSO (Com Impressão) */}
        {vendaConcluida && (
            <div className="modal-overlay">
                <div className="modal-conteudo sucesso">
                    <div style={{textAlign: 'center', marginBottom: '20px'}}>
                        <FaCheckCircle size={80} color="#10b981" />
                        <h2 style={{fontSize: '2rem', color: '#064e3b', margin: '10px 0'}}>Venda Realizada!</h2>
                        <p style={{color: '#64748b'}}>ID da Venda: #{vendaConcluida.id}</p>
                    </div>

                    <div className="area-troco-sucesso">
                        <span>TROCO</span>
                        <div className="valor-gigante">R$ {vendaConcluida.troco.toFixed(2)}</div>
                    </div>

                    <div className="modal-footer">
                        {/* 5. BOTÃO IMPRIMIR AGORA FUNCIONA */}
                        <button 
                            className="btn-cancelar" 
                            style={{background: '#3b82f6', color: 'white'}}
                            onClick={handleImprimir}
                        >
                             <FaPrint /> Imprimir (F1)
                        </button>
                        <button 
                            ref={btnNovaVendaRef}
                            className="btn-confirmar" 
                            onClick={iniciarNovaVenda}
                            onKeyDown={e => e.key === 'Enter' && iniciarNovaVenda()}
                        >
                            NOVA VENDA (ESC)
                        </button>
                    </div>
                </div>
                
                {/* 6. COMPONENTE INVISÍVEL DE CUPOM FISCAL */}
                {/* Ele fica aqui quietinho, esperando o window.print() */}
                <CupomFiscal venda={vendaConcluida} loja={lojaConfig} />
            </div>
        )}

      </div>
    </LayoutPrincipal>
  );
}