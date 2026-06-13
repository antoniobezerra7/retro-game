# 🚀 Guia de Instalação e Execução - Retro Game

## Pré-requisitos

Certifique-se de que você possui:
- **Node.js** (v14+) e **npm** instalados
  - [Download Node.js](https://nodejs.org/)
  - Verifique com: `node --version` e `npm --version`

## ⚙️ Passo a Passo

### 1️⃣ Clonar/Extrair o Repositório

**Opção A - Via Git:**
```bash
git clone https://github.com/antoniobezerra7/retro-game.git
cd retro-game
```

**Opção B - Via ZIP:**
- Baixe o arquivo ZIP
- Extraia em uma pasta de sua escolha
- Abra o terminal nessa pasta

### 2️⃣ Instalar Dependências

```bash
npm install
```

Isso instalará o `json-server` que é necessário para rodar a aplicação.

### 3️⃣ Iniciar o Servidor

```bash
npm start
```

Você verá uma mensagem como:
```
  ⚠️  Note: if you are using Windows Run `cmd.exe` not PowerShell
  
  Loading db/db.json
  Done
  
  Resources
  http://localhost:3000/games
  http://localhost:3000/usuarios
  http://localhost:3000/favoritos
  
  Home
  http://localhost:3000
```

### 4️⃣ Acessar a Aplicação

Abra seu navegador e acesse: **http://localhost:3000**

## 📝 Primeiros Passos

1. **Faça Login** com uma das contas de teste:
   - **Admin:** login: `admin` | senha: `123`
   - **Usuário:** login: `user` | senha: `123`

2. **Explore os Jogos:**
   - Visualize o carrossel de destaque
   - Busque jogos pela pesquisa
   - Clique em um jogo para ver detalhes

3. **Marque Favoritos:**
   - Clique no coração em qualquer jogo
   - Acesse a página de Favoritos para revisá-los

4. **Se for Admin:**
   - Acesse "➕ Cadastro" no menu
   - Adicione, edite ou delete jogos

## 🐛 Problemas Comuns

### ❌ "npm: comando não encontrado"
- Node.js não está instalado corretamente
- Reinstale do [nodejs.org](https://nodejs.org/)
- Reinicie o terminal após instalar

### ❌ "Porta 3000 já está em uso"
```bash
# Opção 1: Matar processo na porta 3000 (Windows)
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Opção 2: Usar outra porta
npx json-server --watch db/db.json --port 3001 --static public
```

### ❌ "Não consigo fazer login"
- Certifique-se que o servidor está rodando
- Verifique se `db/db.json` existe na pasta
- Abra o console do navegador (F12) e veja se há erros

### ❌ "Imagens não carregam"
- Coloque as imagens dos jogos em `public/assets/img/`
- Use nomes corretos: `zelda.jpg`, `sonic2.jpg`, `mario.jpg`, etc.

## 📦 Estrutura de Pastas Esperada

```
retro-game/
├── db/
│   └── db.json                    ← Banco de dados
├── public/
│   ├── index.html
│   ├── login.html
│   ├── detalhes.html
│   ├── favoritos.html
│   ├── cadastro_itens.html
│   └── assets/
│       ├── css/
│       │   └── styles.css
│       ├── img/                   ← Imagens aqui
│       └── scripts/
│           ├── app.js
│           └── login.js
├── package.json
├── README.md
└── .gitignore
```

## 🔐 Adicionar Novos Usuários Manualmente

Edite `db/db.json` e adicione na array `usuarios`:

```json
{
  "id": "seu-uuid-aqui",
  "login": "novo_usuario",
  "senha": "123",
  "nome": "Nome Completo",
  "email": "email@example.com",
  "admin": false
}
```

## 🎮 Adicionar Novos Jogos

Use a interface do cadastro (se for admin) ou edite manualmente `db/db.json`:

```json
{
  "id": 7,
  "nome": "Nome do Jogo",
  "descricao": "Descrição curta",
  "detalhes": "Descrição completa",
  "ano": 1985,
  "console": "Nintendo NES",
  "genero": "Plataforma",
  "imagem": "nomeDaImagem.jpg",
  "destaque": true,
  "criador": "Criador do Jogo",
  "classificacao": 9.0
}
```

## 📱 Testar Responsividade

No navegador:
1. Abra as DevTools (F12)
2. Clique em "Toggle Device Toolbar" (ou Ctrl+Shift+M)
3. Selecione diferentes dispositivos para testar

## 🛑 Parar o Servidor

No terminal, pressione: **Ctrl + C**

## ✅ Verificação Final

- ✅ Página carrega sem erros
- ✅ Login funciona com as credenciais de teste
- ✅ Pesquisa filtra os jogos
- ✅ Favoritos podem ser marcados/desmarcados
- ✅ Página de detalhes mostra informações completas
- ✅ Admin consegue acessar cadastro de itens
- ✅ Design é responsivo

## 💡 Dicas Úteis

- Limpe o cache do navegador se tiver problemas: Ctrl+Shift+Delete
- Use o Console (F12) para debugar erros JavaScript
- JSON Server valida automaticamente o `db.json`
- A aplicação usa `sessionStorage` (dados perdidos ao fechar a aba)

## 📞 Suporte

Se encontrar problemas:
1. Verifique o console do navegador (F12)
2. Verifique o terminal do servidor
3. Consulte o README.md para mais informações
4. Verifique se todas as dependências foram instaladas

---

**Desenvolvido por Antonio Bezerra - 2025**
