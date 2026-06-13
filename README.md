# 🎮 Retro Game - Trabalho Prático 2

Aplicação web responsiva para visualização e gerenciamento de clássicos dos videogames, desenvolvida com HTML, CSS, JavaScript vanilla e JSON Server.

## 📋 Funcionalidades

✅ **Autenticação de Usuários**
- Login e cadastro de usuários
- Controle de sessão com sessionStorage
- Perfis de administrador

✅ **Gerenciamento de Jogos**
- Visualização de jogos em home-page
- Página de detalhes com informações completas
- CRUD de jogos (apenas para administradores)
- Carrossel de destaque

✅ **Pesquisa e Favoritos**
- Pesquisa de jogos por título e descrição
- Marcação de favoritos
- Página dedicada para visualizar favoritos

✅ **Visualização Avançada**
- Gráfico de análise de consoles
- Responsividade completa (mobile, tablet, desktop)

✅ **Design Profissional**
- Interface moderna com Bootstrap-like styling
- Cores atrativas e bem estruturadas
- Transições e animações suaves

## 🛠️ Pré-requisitos

- Node.js (v14 ou superior)
- npm ou yarn

## 📦 Instalação

1. **Clone ou extraia o repositório:**
```bash
git clone https://github.com/antoniobezerra7/retro-game.git
cd retro-game
```

2. **Instale as dependências:**
```bash
npm install
```

3. **Inicie o servidor JSON Server:**
```bash
npm start
```

O servidor iniciará em `http://localhost:3000` e servindo a aplicação em `http://localhost:3000`

## 📂 Estrutura do Projeto

```
retro-game/
├── db/
│   └── db.json                    # Banco de dados JSON
├── public/                        # Frontend da aplicação
│   ├── index.html                # Home-page
│   ├── login.html                # Página de login/cadastro
│   ├── detalhes.html             # Detalhes do jogo
│   ├── favoritos.html            # Página de favoritos
│   ├── cadastro_itens.html       # CRUD de jogos
│   └── assets/
│       ├── css/
│       │   └── styles.css        # Estilos globais
│       ├── img/                  # Imagens dos jogos
│       └── scripts/
│           ├── app.js            # Lógica principal
│           └── login.js          # Lógica de autenticação
├── package.json                  # Dependências e scripts
├── .gitignore                    # Arquivo de gitignore
└── README.md                     # Este arquivo
```

## 🔐 Usuários de Teste

### Administrador
- **Login:** admin
- **Senha:** 123

### Usuário Comum
- **Login:** user
- **Senha:** 123

## 🎮 Dados dos Jogos

A aplicação vem pré-carregada com 6 clássicos dos videogames:
- The Legend of Zelda (1986)
- Sonic the Hedgehog 2 (1992)
- Super Mario Bros (1985)
- Pac-Man (1980)
- Donkey Kong (1981)
- Space Invaders (1978)

## 🌐 Endpoints da API

```
GET    /games              # Listar todos os jogos
GET    /games/:id          # Obter jogo específico
POST   /games              # Criar novo jogo
PUT    /games/:id          # Atualizar jogo
DELETE /games/:id          # Deletar jogo

GET    /usuarios           # Listar usuários
POST   /usuarios           # Criar novo usuário
GET    /usuarios/:id       # Obter usuário específico

GET    /favoritos          # Listar favoritos
POST   /favoritos          # Adicionar favorito
DELETE /favoritos/:id      # Remover favorito
```

## 📱 Responsividade

A aplicação é totalmente responsiva e funciona perfeitamente em:
- 📱 Dispositivos móveis (320px e acima)
- 📱 Tablets (768px e acima)
- 🖥️ Desktops (1024px e acima)

## 🎨 Tecnologias Utilizadas

- **Frontend:** HTML5, CSS3, JavaScript (Vanilla)
- **Backend:** JSON Server (Node.js)
- **Armazenamento:** JSON (arquivo local)
- **Controle de Versão:** Git

## 👨‍💻 Autor

**Antonio Bezerra**
- 📧 Email: antonio@example.com
- 💼 Curso: Ciência da Computação
- 🎓 PUC Minas
- 📅 Turma: 2025

## 📝 Notas Importantes

1. **Imagens dos Jogos:** As imagens devem estar na pasta `public/assets/img/`
2. **Dados Persistentes:** Todos os dados são salvos no arquivo `db/db.json`
3. **Segurança:** Esta é uma aplicação educacional. Em produção, implemente autenticação JWT
4. **Navegadores Suportados:** Chrome, Firefox, Safari, Edge (versões recentes)

## 🔄 Fluxo de Uso

1. Acesse `http://localhost:3000`
2. Faça login ou cadastre-se como novo usuário
3. Navegue pelos jogos e veja os detalhes
4. Marque seus favoritos (após fazer login)
5. Se for administrador, acesse o cadastro para gerenciar jogos
6. Use a pesquisa para filtrar jogos

## ⚙️ Configuração Avançada

### Mudar porta do servidor:
```bash
json-server --watch db/db.json --port 3001 --static public
```

### Adicionar CORS (se necessário):
Editar o comando no `package.json` e usar um proxy ou middleware CORS

## 📄 Licença

Este projeto é fornecido para fins educacionais.

## 🤝 Contribuições

Contribuições são bem-vindas! Feel free to fork e submit pull requests.

---

**Desenvolvido com ❤️ por Antonio Bezerra**
