# Teste SCTEC - API de Empreendimentos

## 📋 Índice

- [Descrição](#descrição)
- [Tecnologias](#tecnologias)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Instalação](#instalação)
- [Como Usar](#como-usar)
- [API Reference](#api-reference)
- [Arquitetura e Padrões](#arquitetura-e-padrões)
- [Testes](#testes)
- [Contribuição](#contribuição)

## 🎯 Descrição

**Teste SCTEC** é uma aplicação REST API desenvolvida para gerenciar dados de empreendimentos. A aplicação implementa operações CRUD (Create, Read, Update, Delete) com validação de dados robusta, segue boas práticas de desenvolvimento e inclui testes unitários abrangentes.

A arquitetura segue o padrão **Separation of Concerns (SoC)**, onde as validações são centralizadas no camada de Service, mantendo o Controller limpo e focado apenas em orquestração das requisições HTTP.

### Características Principais

- ✅ **CRUD Completo** - Criar, ler, atualizar e deletar empreendimentos
- ✅ **Validação Centralizada** - Validações implementadas no Service (não no Controller)
- ✅ **Testes Unitários** - Cobertura de testes para Controller, Service e Validações (40 testes)
- ✅ **TypeScript** - Tipagem estática para maior segurança
- ✅ **Persistência com JSON Server** - Simulação simplificada de banco de dados
- ✅ **API REST** - Seguindo padrões RESTful

## 🛠 Tecnologias

| Tecnologia | Versão | Propósito |
|-----------|--------|----------|
| Node.js | - | Runtime JavaScript |
| TypeScript | ^5.3.3 | Linguagem tipada |
| Express | ^4.18.2 | Framework Web/API |
| Jest | ^29.7.0 | Framework de Testes |
| JSON Server | ^0.17.4 | Database simulado |
| ts-node | ^10.9.1 | Execução de TypeScript |

## 📁 Estrutura do Projeto

```
teste_sctec/
├── src/
│   ├── index.ts                 # Entrada da aplicação
│   ├── controllers/
│   │   └── EmpreendimentoController.ts   # Controlador de requisições
│   ├── services/
│   │   └── EmpreendimentoService.ts      # Lógica de negócio e validação
│   ├── model/
│   │   └── empreendimentoModel.ts        # Camada de dados
│   ├── routes/
│   │   └── empreendimentos.ts            # Definição de rotas
│   ├── types/
│   │   └── Empreendimento.ts             # Tipos TypeScript
│   └── utils/
│       ├── geradorId.ts                  # Gerador de IDs
│       └── validarEmpreendimento.ts      # Funções de validação
├── __tests__/
│   ├── controller.test.ts        # Testes do Controller
│   ├── service.test.ts           # Testes do Service
│   └── validation.test.ts        # Testes de Validação
├── db.json                        # Database JSON Server
├── package.json
├── tsconfig.json
└── jest.config.cjs
```

## 🚀 Instalação

### Pré-requisitos

- Node.js (v18 ou superior)
- npm (v9 ou superior)

### Passos

1. **Clone o repositório**
```bash
git clone <repository-url>
cd teste_faculdade
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure a variável de ambiente (opcional)**
```bash
# Criar arquivo .env
JSON_SERVER_URL=http://localhost:4000
```

4. **Inicie o JSON Server**
```bash
# Em um terminal
npm run server:db
```

5. **Inicie a aplicação**
```bash
# Em outro terminal
npm run dev
```

A API estará disponível em `http://localhost:3000`

## 💻 Como Usar

### Iniciar o Servidor

```bash
# Modo desenvolvimento (com auto-reload)
npm run dev

# Modo produção
npm run build
npm start
```

### Executar Testes

```bash
# Executar todos os testes
npm test

# Com coverage
npm test -- --coverage

# Modo watch
npm test -- --watch
```

### Estrutura de Dados - Empreendimento

```typescript
interface Empreendimento {
  id: string;                    // UUID único
  nomeEmpreendimento: string;    // Obrigatório, não vazio
  nomeEmpreendedor: string;      // Obrigatório, não vazio
  municipioSC: string;           // Obrigatório, não vazio
  segmentoAtuacao: SegmentoAtuacao;  // Obrigatório, enum validado
  contatoEmail: string;          // Obrigatório, validação de email
  status: Status;                // Obrigatório, ATIVO ou INATIVO
  dataCriacao: Date;             // Automático
  dataAtualizacao: Date;         // Automático
}

// Enum de Status
enum Status {
  ATIVO = "ATIVO",
  INATIVO = "INATIVO"
}

// Enum de Segmento de Atuação
enum SegmentoAtuacao {
  TECNOLOGIA = "TECNOLOGIA",
  COMÉRCIO = "COMÉRCIO",
  INDÚSTRIA = "INDÚSTRIA",
  SERVIÇOS = "SERVIÇOS",
  AGRICULTURA = "AGRICULTURA"
}
```

## 📡 API Reference

### Base URL
```
http://localhost:3000/api
```

### 1. Criar Empreendimento

**Endpoint:** `POST /empreendimentos`

**Request Body:**
```json
{
  "nomeEmpreendimento": "Tech Solutions",
  "nomeEmpreendedor": "João Silva",
  "municipioSC": "Florianópolis",
  "segmentoAtuacao": "TECNOLOGIA",
  "contatoEmail": "joao@example.com",
  "status": "ATIVO"
}
```

**Response (201 Created):**
```json
{
  "sucesso": true,
  "mensagem": "Empreendimento criado com sucesso",
  "dados": {
    "id": "uuid-123",
    "nomeEmpreendimento": "Tech Solutions",
    "nomeEmpreendedor": "João Silva",
    "municipioSC": "Florianópolis",
    "segmentoAtuacao": "TECNOLOGIA",
    "contatoEmail": "joao@example.com",
    "status": "ATIVO",
    "dataCriacao": "2024-03-08T10:30:00Z",
    "dataAtualizacao": "2024-03-08T10:30:00Z"
  }
}
```

**Erros:**
- `400 Bad Request` - Validação falhou
- `500 Internal Server Error` - Erro do servidor

---

### 2. Listar Todos os Empreendimentos

**Endpoint:** `GET /empreendimentos`

**Response (200 OK):**
```json
{
  "sucesso": true,
  "dados": [
    {
      "id": "uuid-123",
      "nomeEmpreendimento": "Tech Solutions",
      ...
    }
  ],
  "total": 1
}
```

---

### 3. Obter Empreendimento por ID

**Endpoint:** `GET /empreendimentos/:id`

**Response (200 OK):**
```json
{
  "sucesso": true,
  "dados": {
    "id": "uuid-123",
    "nomeEmpreendimento": "Tech Solutions",
    ...
  }
}
```

**Erros:**
- `404 Not Found` - Empreendimento não encontrado

---

### 4. Atualizar Empreendimento

**Endpoint:** `PUT /empreendimentos/:id`

**Request Body:**
```json
{
  "nomeEmpreendimento": "Tech Solutions Updated",
  "status": "INATIVO"
}
```

**Response (200 OK):**
```json
{
  "sucesso": true,
  "mensagem": "Empreendimento atualizado com sucesso",
  "dados": {
    "id": "uuid-123",
    "nomeEmpreendimento": "Tech Solutions Updated",
    ...
    "dataAtualizacao": "2024-03-08T11:00:00Z"
  }
}
```

**Erros:**
- `400 Bad Request` - Nenhum dado fornecido
- `404 Not Found` - Empreendimento não encontrado
- `500 Internal Server Error` - Erro do servidor

---

### 5. Deletar Empreendimento

**Endpoint:** `DELETE /empreendimentos/:id`

**Response (204 No Content):**
```
(sem corpo)
```

**Erros:**
- `500 Internal Server Error` - Erro ao deletar

---

## 🏗 Arquitetura e Padrões

### Padrão de Arquitetura - MVC com Service Layer

```
Request HTTP
     ↓
[Controller] - Orquestração, tratamento de status HTTP
     ↓
[Service] - Lógica de negócio, validações
     ↓
[Model] - Acesso aos dados (JSON Server)
     ↓
Response HTTP
```

### Separation of Concerns (SoC)

A aplicação implementa a divisão clara de responsabilidades:

- **Controller** (`EmpreendimentoController.ts`)
  - Recebe requisições HTTP
  - Orquestra chamadas ao Service
  - Retorna respostas HTTP apropriadas
  - Nunca faz validações diretas

- **Service** (`EmpreendimentoService.ts`)
  - Contém toda lógica de negócio
  - Realiza validações de dados
  - Lança erros com mensagens claras
  - Gerencia datas de criação/atualização

- **Model** (`empreendimentoModel.ts`)
  - Acesso à persistência (JSON Server)
  - Wrapper da chamada HTTP/REST

### Validações

Todas as validações são centralizadas em `EmpreendimentoService`:

```typescript
private static validarDados(dados): void {
  const erros = validarEmpreendimento(dados);
  if (erros.length > 0) {
    throw new Error(`Erro na validação: ${erros.map(e => e.message).join(', ')}`);
  }
}
```

**Regras de Validação:**
- `nomeEmpreendimento` - Não pode ser vazio
- `nomeEmpreendedor` - Não pode ser vazio
- `municipioSC` - Não pode ser vazio
- `segmentoAtuacao` - Deve ser um dos valores enum
- `contatoEmail` - Não pode ser vazio e deve ser email válido
- `status` - Deve ser ATIVO ou INATIVO

## 🧪 Testes

### Cobertura de Testes

A aplicação possui **40 testes unitários** distribuídos em 3 suites:

#### 1. Controller Tests (`controller.test.ts`)
- ✅ Criar empreendimento com sucesso
- ✅ Erro de validação ao criar (400)
- ✅ Erro do servidor ao criar (500)
- ✅ Listar todos os empreendimentos
- ✅ Erro ao listar
- ✅ Obter por ID com sucesso
- ✅ Erro 404 quando não encontrado
- ✅ Atualizar com sucesso
- ✅ Erro 400 quando sem dados
- ✅ Erro 404 na atualização
- ✅ Erro 500 na atualização
- ✅ Deletar com sucesso
- ✅ Erro 500 ao deletar

#### 2. Service Tests (`service.test.ts`)
- ✅ Criar com dados válidos
- ✅ Erro de validação em cada campo
- ✅ Listar todos
- ✅ Obter por ID
- ✅ Retorna undefined se não existir
- ✅ Atualizar com sucesso
- ✅ Erro sem dados para atualizar
- ✅ Erro se não encontrado
- ✅ Atualização de dataAtualizacao
- ✅ Deletar com sucesso
- ✅ Erro ao deletar
- ✅ Verificação de endpoint correto

#### 3. Validation Tests (`validation.test.ts`)
- ✅ Validação de email correto
- ✅ Email sem @
- ✅ Email sem domínio
- ✅ Empreendimento com dados válidos
- ✅ Rejeita sem nome
- ✅ Rejeita sem empreendedor
- ✅ Rejeita sem município
- ✅ Rejeita segmento inválido
- ✅ Rejeita sem email
- ✅ Rejeita email inválido
- ✅ Rejeita status inválido

### Executar Testes

```bash
# Todos os testes
npm test

# Modo watch
npm test -- --watch

# Com coverage
npm test -- --coverage

# Teste específico
npm test -- controller.test.ts
```

## 📝 Contribuição

### Padrões de Código

1. **TypeScript** - Código totalmente tipado
2. **Naming Conventions** - Usar camelCase para variáveis/métodos, PascalCase para classes
3. **Error Handling** - Sempre capturar e tratar erros de forma consistente
4. **Testing** - Implementar testes para toda nova funcionalidade
5. **Documentation** - Comentários JSDoc para métodos públicos

### Fluxo de Contribuição

1. Criar branch: `git checkout -b feat/feature-name`
2. Implementar feature seguindo os padrões
3. Criar/atualizar testes: `npm test`
4. Validar TypeScript: `npm run build`
5. Commit: `git commit -m "feat: descrição clara da feature"`
6. Push: `git push origin feat/feature-name`
7. Abrir Pull Request

### Exemplo de Commit

```
feat: adicionar método de busca por município
- Implementa filtro de empreendimentos por município
- Adiciona validação de entrada
- Inclui testes unitários

Relates to: #123
```

## 📚 Recursos Adicionais

- [Express Documentation](https://expressjs.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Jest Testing Guide](https://jestjs.io/docs/getting-started)
- [JSON Server](https://github.com/typicode/json-server)

## 📄 Licença

Este projeto é fornecido para fins educacionais.

---
