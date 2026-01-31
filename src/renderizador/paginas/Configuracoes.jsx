import React, { useState, useEffect } from 'react';
import LayoutPrincipal from '../layouts/LayoutPrincipal';
import { FaStore, FaSave, FaCheckCircle } from 'react-icons/fa';
import '../estilos/Configuracoes.css';

export default function Configuracoes() {
  const [dados, setDados] = useState({
    nome_loja: '',
    cnpj_cpf: '',
    endereco: '',
    telefone: '',
    mensagem_rodape: 'Obrigado pela preferência!'
  });

  // Carregar dados ao abrir
  useEffect(() => {
    async function carregar() {
      const config = await window.apiEvaristo.configuracoes.obter();
      if (config) {
        setDados(prev => ({ ...prev, ...config }));
      }
    }
    carregar();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDados(prev => ({ ...prev, [name]: value }));
  };

  const handleSalvar = async (e) => {
    e.preventDefault();
    try {
      await window.apiEvaristo.configuracoes.salvar(dados);
      alert('Configurações salvas com sucesso!');
    } catch (error) {
      console.error(error);
      alert('Erro ao salvar configurações.');
    }
  };

  return (
    <LayoutPrincipal>
      <div className="container-config">
        
        <div className="cabecalho-config">
          <h1>Configurações da Loja</h1>
          <p>Personalize os dados que aparecerão nos seus relatórios e cupons.</p>
        </div>

        <form onSubmit={handleSalvar}>
          {/* Seção 1: Dados Básicos */}
          <div className="secao-config">
            <h2><FaStore /> Identidade do Negócio</h2>
            
            <div className="form-grid">
              <div className="campo-form full-width">
                <label>Nome Fantasia da Loja</label>
                <input 
                  name="nome_loja"
                  value={dados.nome_loja}
                  onChange={handleChange}
                  placeholder="Ex: Mercadinho do Bairro"
                  required
                />
              </div>

              <div className="campo-form">
                <label>CNPJ ou CPF</label>
                <input 
                  name="cnpj_cpf"
                  value={dados.cnpj_cpf}
                  onChange={handleChange}
                  placeholder="00.000.000/0000-00"
                />
              </div>

              <div className="campo-form">
                <label>Telefone / WhatsApp</label>
                <input 
                  name="telefone"
                  value={dados.telefone}
                  onChange={handleChange}
                  placeholder="(00) 00000-0000"
                />
              </div>

              <div className="campo-form full-width">
                <label>Endereço Completo</label>
                <input 
                  name="endereco"
                  value={dados.endereco}
                  onChange={handleChange}
                  placeholder="Rua, Número, Bairro, Cidade - UF"
                />
              </div>
            </div>
          </div>

          {/* Seção 2: Cupom */}
          <div className="secao-config">
            <h2>📜 Rodapé do Cupom</h2>
            <div className="campo-form full-width">
              <label>Mensagem de Agradecimento</label>
              <textarea 
                name="mensagem_rodape"
                value={dados.mensagem_rodape}
                onChange={handleChange}
                rows="3"
                placeholder="Ex: Volte sempre! Trocas somente em 7 dias."
              />
            </div>
          </div>

          <div className="barra-acoes">
            <button type="submit" className="btn-salvar-config">
              <FaSave /> Salvar Alterações
            </button>
          </div>
        </form>

      </div>
    </LayoutPrincipal>
  );
}