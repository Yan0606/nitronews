# 📝 NitroNews - Aplicativo de Microblog

Um aplicativo de microblog semelhante ao Twitter, desenvolvido com Laravel (backend) e React (frontend), com autenticação de usuários, criação de postagens e visibilidade de postagens públicas/privadas.

## 🚀 Recursos

### ✅ Recursos Implementados

- **Autenticação de Usuário**
- Registro de usuário com validação de e-mail
- Funcionalidade de login/logout seguro
- Requisitos de senha (8+ caracteres, caracteres especiais, números)
- Autenticação baseada em token JWT com Laravel Sanctum

- **Gerenciamento de Usuários**
- Integração com Gravatar para fotos de perfil
- Exibição de informações do perfil do usuário

- **Sistema de Postagens**
- Criação de postagens com limite de 280 caracteres
- Visibilidade de postagens públicas e privadas
- Edição e exclusão apenas das próprias postagens
- Contador de caracteres em tempo real
- Carimbos de data/hora das postagens com exibição de tempo relativo

- **Segurança**
- Rotas de API protegidas
- Autorização do usuário para operações de postagem
- Proteção contra injeção de XSS e SQL
- Configuração de CORS

- **UI/UX**
- Tema escuro compatível com o design fornecido
- Design responsivo
- Componentes React modernos com TypeScript
- CSS Tailwind para estilização

## 🛠️ Tecnologias Utilizadas

### Backend
- **Laravel 12** - Framework PHP
- **Laravel Sanctum** - Autenticação de API
- **PostgreSQL** - Banco de Dados (configurável)
- **SQLite** - Banco de dados padrão para desenvolvimento

### Frontend
- **React 18** com TypeScript
- **React Router** - Roteamento do lado do cliente
- **Axios** - Cliente HTTP
- **Tailwind CSS** - Framework CSS que prioriza utilitários

## 📋 Pré-requisitos

- PHP 8.1 ou superior
- Composer
- Node.js 18+ e npm
- PostgreSQL (opcional, SQLite funciona para desenvolvimento)

## 🚀 Instalação e Configuração

### Início Rápido (Recomendado)

1. **Clone e navegue até o projeto:**
```bash
git clone <url-do-repositório>
cd NitroNews
```

2. **Execute o desenvolvimento Ambiente:**
```bash
# Windows
start-dev.bat

# Linux/Mac
chmod +x start-dev.sh
./start-dev.sh
```

### Configuração Manual

#### Configuração do Backend

1. **Navegue até o diretório do backend:**
```bash
cd backend
```

2. **Instale as dependências do PHP:**
```bash
composer install
```

3. **Configuração do ambiente:**
```bash
cp .env.example .env
php artisan key:generate
```

4. **Configuração do banco de dados:**
```bash
# Para SQLite (padrão)
touch database/database.sqlite

# Ou configure o PostgreSQL em .env:
# DB_CONNECTION=pgsql
# DB_HOST=127.0.0.1
# PORTA_BD=5432
# BANCO_DE_DADOS_BD=nitronews
# NOME_DE_USUÁRIO_BD=seu_nome_de_usuário
# SENHA_BD=sua_senha
```

5. **Execute as migrações:**
```bash
php artisan migrate
```

6. **Inicie o servidor Laravel:**
```bash
php artisan serve
```
A API estará disponível em `http://localhost:8000`

#### Configuração do Frontend

1. **Navegue até o diretório do frontend:**
```bash
cd frontend
```

2. **Instale as dependências:**
```bash
npm install
```

3. **Inicie o servidor de desenvolvimento:**
```bash
npm start
```
A aplicação estará disponível em `http://localhost:3000`

## 🔧 Endpoints da API

### Autenticação
- `POST /api/register` - Registro do usuário
- `POST /api/login` - Login do usuário
- `POST /api/logout` - Logout do usuário (requer autenticação)
- `GET /api/me` - Obtém o usuário atual (requer autenticação)

### Postagens
- `GET /api/posts` - Obtém todas as postagens (público apenas para convidados)
- `POST /api/posts` - Cria uma nova postagem (requer autenticação)
- `PUT /api/posts/{id}` - Atualiza a postagem (requer autenticação, somente suas próprias postagens)
- `DELETE /api/posts/{id}` - Exclui a postagem (requer autenticação, somente suas próprias postagens)

## 🧪 Credenciais de Teste

Você pode criar uma conta de teste registrando-se no aplicativo ou usar estas credenciais de exemplo após criar uma conta:

```
E-mail: test@example.com
Senha: Test123!@#
```

## 📁 Estrutura do Projeto

```
NitroNews/
├── backend/ # API do Laravel
│ ├── app/
│ │ ├── Http/Controllers/Api/
│ │ │ ├── AuthController.php
│ │ │ └── PostController.php
│ │ └── Models/
│ │ ├── User.php
│ │ └── Post.php
│ ├── banco de dados/migrações/
│ └── rotas/api.php
├── frontend/ # Aplicativo React
│ ├── src/
│ │ ├── componentes/
│ │ │ ├── Login.tsx
│ │ │ ├── Register.tsx
│ │ │ ├── Header.tsx
│ │ │ ├── PostForm.tsx
│ │ │ ├── Post.tsx
│ │ │ ├── Feed.tsx
│ │ │ └── ProtectedRoute.tsx
│ │ ├── contexts/
│ │ │ └── AuthContext.tsx
│ │ ├── services/
│ │ │ └── api.ts
│ │ ├── types/
│ │ │ └── index.ts
│ │ └── App.tsx
└── README.md
```

## 🔒 Recursos de Segurança

- **Validação de Senha**: Mínimo de 8 caracteres com caracteres especiais e números
- **Validação de E-mail**: Validação correta do formato de e-mail
- **Proteção de Rota**: Rotas de API protegidas com o Laravel Sanctum
- **Autorização**: Usuários podem editar/excluir apenas suas próprias postagens
- **Configuração CORS**: Configurado corretamente para comunicação front-end-back-end
- **Proteção XSS**: Proteção XSS integrada do Laravel
- **Proteção contra Injeção de SQL**: O Eloquent ORM impede injeção de SQL

## 🎨 Recursos de Design

- **Tema Escuro**: Combina com o design do Figma
- **Layout Responsivo**: Funciona em desktops e dispositivos móveis
- **IU Moderna**: Interface limpa, semelhante à do Twitter
- **Integração com o Gravatar**: Fotos de perfil automáticas
- **Atualizações em Tempo Real**: Contador de Caracteres e Validação de Formulários
- **Estados de Carregamento**: Indicadores de Carregamento Adequados para uma Melhor Experiência do Usuário

## 🚀 Implantação

### Implantação de Backend
1. Configure o banco de dados de produção em `.env`
2. Defina `APP_ENV=production` e `APP_DEBUG=false`
3. Execute `php artisan config:cache`
4. Execute `php artisan route:cache`
5. Implante no seu serviço de hospedagem preferido

### Implantação de Frontend
1. Compile a versão de produção: `npm run build`
2. Implante a pasta `build` no seu serviço de hospedagem
3. Atualize a URL base da API em `src/services/api.ts` se necessário

## 📝 Licença

Este projeto foi criado para fins educacionais como parte de um desafio técnico.

## 🐛 Problemas conhecidos

- Aviso de versão do Node.js (funciona bem com Node 18+)
- Alguns avisos de auditoria do NPM (não críticos)

