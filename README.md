# EvarPDV - Sistema de Gestão Comercial

![Electron](https://img.shields.io/badge/Electron-20232A?style=for-the-badge&logo=electron&logoColor=61DAFB)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![SQLite](https://img.shields.io/badge/SQLite-07405E?style=for-the-badge&logo=sqlite&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)

> Sistema de Ponto de Venda (PDV) e Gestão Desktop moderno, construído com tecnologias web.

O **EvarPDV** é uma aplicação desktop desenvolvida para facilitar a gestão de pequenos comércios.  
Focado em agilidade e design moderno, o sistema integra controle de estoque, frente de caixa (PDV) e indicadores gerenciais em uma interface limpa e intuitiva.

---

## 🖼️ Screenshots

### Tela de Vendas (Frente de Caixa)

![Tela de Vendas](./public/screenshots/vendas.png)

### Dashboard Gerencial

![Dashboard](./public/screenshots/dashboard.png)

---

## 🚀 Tecnologias Utilizadas

* **Core:** [Electron](https://www.electronjs.org/) (Integração Desktop)
* **Frontend:** [React](https://reactjs.org/) + [Vite](https://vitejs.dev/)
* **Linguagem:** JavaScript (ES6+)
* **Estilização:** CSS3 Moderno (Flexbox/Grid, Variáveis CSS)
* **Banco de Dados:** [SQLite3](https://www.sqlite.org/) (Local, sem necessidade de servidor externo)
* **Ícones:** React Icons (FontAwesome/Material)

---

## ✨ Funcionalidades

### ✅ Já Implementado

* **Dashboard Gerencial:**
  * Visualização de KPIs (Vendas do Dia, Total de Produtos).
  * Interface moderna com Cards e ícones.
* **Autenticação:**
  * Login seguro com verificação em banco de dados.
* **Gestão de Produtos (CRUD):**
  * Cadastro, Listagem e Exclusão de itens.
  * Controle de preço e estoque.
* **Frente de Caixa (PDV):**
  * Interface otimizada para vendas rápidas.
  * Busca inteligente (Nome ou Código de Barras).
  * Carrinho de compras visual.
  * Cálculo automático de totais.
  * Baixa automática no banco de dados ao finalizar.
* **Arquitetura Segura:**
  * Separação completa entre Processo Principal (Node.js) e Renderizador (React) usando `ContextBridge` e `IPC`.

---

## 📌 Roadmap

* [ ] Tela de Configurações da Loja (usuários, dados fiscais, preferências).
* [ ] Relatórios de Vendas com filtros por período.
* [ ] Edição de Produtos com histórico de alterações.
* [ ] Impressão de Cupom Não Fiscal.
* [ ] Exportação de dados para Excel/CSV.
* [ ] Integração com impressora térmica.

---

## 📂 Estrutura do Projeto

EvarPDV/
├── src/
│   ├── banco-dados/      # Scripts SQL e conexão SQLite
│   ├── principal/        # Processo Main do Electron (Backend)
│   │   ├── main.js        # Janelas e Inicialização
│   │   └── preload.js     # Ponte de Segurança (IPC)
│   └── renderizador/     # Interface React (Frontend)
│       ├── componentes/  # Componentes reutilizáveis
│       ├── estilos/      # Arquivos CSS modulares
│       ├── layouts/      # Estrutura das páginas (Menu Lateral)
│       └── paginas/      # Telas (Dashboard, Vendas, Produtos)
├── public/               # Assets estáticos
└── package.json           # Dependências e Scripts

---

## 🔧 Como Rodar o Projeto

### Pré-requisitos

* [Node.js](https://nodejs.org/) instalado.

### Passo a Passo

1. **Clone o repositório:**

```bash
git clone https://github.com/seu-usuario/evarpdv.git
cd evarpdv
