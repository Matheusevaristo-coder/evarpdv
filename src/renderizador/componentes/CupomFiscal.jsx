import React from 'react';
import '../estilos/Cupom.css';

// Este componente recebe dois objetos:
// 1. venda: contém os itens, total, troco, forma de pagamento
// 2. loja: contém nome, endereço, cnpj (que buscamos nas configurações)
export default function CupomFiscal({ venda, loja }) {
  // Se não tiver venda finalizada, não renderiza nada para evitar erros
  if (!venda || !loja) return null;

  const dataVenda = new Date().toLocaleString('pt-BR');

  return (
    <div className="area-cupom">
      
      {/* --- CABEÇALHO DA LOJA --- */}
      <div className="cupom-cabecalho">
        <div className="cupom-titulo">{loja.nome_loja || 'LOJA SEM NOME'}</div>
        <div>{loja.endereco}</div>
        <div>Tel: {loja.telefone}</div>
        <div>CNPJ: {loja.cnpj_cpf}</div>
        <br />
        <div>--------------------------------</div>
        <div>VENDA #{venda.id}</div>
        <div>{dataVenda}</div>
      </div>

      {/* --- LISTA DE PRODUTOS --- */}
      <table className="cupom-tabela">
        <thead>
          <tr>
            <th>ITEM</th>
            <th>QTD</th>
            <th className="col-preco">VALOR</th>
          </tr>
        </thead>
        <tbody>
          {venda.itens && venda.itens.map((item, index) => (
            <tr key={index}>
              <td colSpan="3">
                {/* Nome do produto na linha de cima */}
                {index + 1}. {item.nome}<br/>
                
                {/* Detalhes na linha de baixo (indentados) */}
                <div style={{display: 'flex', justifyContent: 'space-between', paddingLeft: '10px', fontSize: '11px'}}>
                    <span>1 x R$ {item.preco.toFixed(2)}</span>
                    <span>R$ {item.preco.toFixed(2)}</span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* --- TOTAIS E PAGAMENTO --- */}
      <div className="cupom-totais">
        <div className="linha-total">TOTAL: R$ {venda.total ? venda.total.toFixed(2) : '0.00'}</div>
        
        <div style={{marginTop: '5px'}}>
            Pagamento: {venda.pagamento}
        </div>
        
        {/* Só mostra troco se for dinheiro e tiver troco */}
        {venda.pagamento === 'DINHEIRO' && (
             <div>Troco: R$ {venda.troco ? venda.troco.toFixed(2) : '0.00'}</div>
        )}
      </div>

      {/* --- RODAPÉ --- */}
      <div className="cupom-rodape">
        <p>{loja.mensagem_rodape || 'Obrigado pela preferência!'}</p>
        <br/>
        <p>*** NÃO É DOCUMENTO FISCAL ***</p>
        <p>Sistema EvarPDV</p>
      </div>

    </div>
  );
}