// ===== API BASE URL =====
const API_BASE_URL = 'http://localhost:3000';

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const mode = params.get('mode');

  if (mode === 'cadastro') {
    mostrarFormularioCadastro();
  } else {
    mostrarFormularioLogin();
  }
});

// ===== MODO LOGIN/CADASTRO =====
function mostrarFormularioLogin() {
  const container = document.getElementById('authContainer');
  container.innerHTML = `
    <div class="form-container">
      <h2 style="text-align: center; color: var(--primary-color); margin-bottom: 2rem;">Login</h2>
      
      <form id="loginForm">
        <div class="form-group">
          <label for="loginInput">Login:</label>
          <input type="text" id="loginInput" placeholder="Digite seu login" required>
        </div>
        
        <div class="form-group">
          <label for="senhaInput">Senha:</label>
          <input type="password" id="senhaInput" placeholder="Digite sua senha" required>
        </div>
        
        <div class="form-actions">
          <button type="submit" class="btn btn-primary">Entrar</button>
          <button type="button" class="btn btn-secondary" onclick="mostrarFormularioCadastro()">Cadastrar</button>
        </div>

        <div class="form-link">
          <a href="index.html">← Voltar para Home</a>
        </div>
      </form>
    </div>
  `;

  document.getElementById('loginForm').addEventListener('submit', fazerLogin);
}

function mostrarFormularioCadastro() {
  const container = document.getElementById('authContainer');
  container.innerHTML = `
    <div class="form-container">
      <h2 style="text-align: center; color: var(--primary-color); margin-bottom: 2rem;">Cadastrar</h2>
      
      <form id="cadastroForm">
        <div class="form-group">
          <label for="nomeInput">Nome Completo:</label>
          <input type="text" id="nomeInput" placeholder="Digite seu nome completo" required>
        </div>
        
        <div class="form-group">
          <label for="emailInput">Email:</label>
          <input type="email" id="emailInput" placeholder="Digite seu email" required>
        </div>
        
        <div class="form-group">
          <label for="loginCadastroInput">Login:</label>
          <input type="text" id="loginCadastroInput" placeholder="Escolha um login" required>
        </div>
        
        <div class="form-group">
          <label for="senhaCadastroInput">Senha:</label>
          <input type="password" id="senhaCadastroInput" placeholder="Escolha uma senha" required>
        </div>
        
        <div class="form-group">
          <label for="confirmaSenhaInput">Confirmar Senha:</label>
          <input type="password" id="confirmaSenhaInput" placeholder="Confirme sua senha" required>
        </div>
        
        <div class="form-actions">
          <button type="submit" class="btn btn-primary">Cadastrar</button>
          <button type="button" class="btn btn-secondary" onclick="mostrarFormularioLogin()">Voltar</button>
        </div>

        <div class="form-link">
          <a href="index.html">← Voltar para Home</a>
        </div>
      </form>
    </div>
  `;

  document.getElementById('cadastroForm').addEventListener('submit', fazerCadastro);
}

// ===== FUNÇÕES DE AUTENTICAÇÃO =====
async function fazerLogin(event) {
  event.preventDefault();

  const login = document.getElementById('loginInput').value;
  const senha = document.getElementById('senhaInput').value;

  try {
    const response = await fetch(`${API_BASE_URL}/usuarios?login=${login}`);
    const usuarios = await response.json();

    if (usuarios.length === 0) {
      mostrarNotificacao('Login não encontrado', 'error');
      return;
    }

    const usuario = usuarios[0];

    if (usuario.senha !== senha) {
      mostrarNotificacao('Senha incorreta', 'error');
      return;
    }

    // Salvar usuário na sessionStorage
    sessionStorage.setItem('usuarioLogado', JSON.stringify(usuario));
    mostrarNotificacao(`Bem-vindo, ${usuario.nome}!`, 'success');

    // Redirecionar para home após 1.5s
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1500);
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    mostrarNotificacao('Erro ao conectar com o servidor', 'error');
  }
}

async function fazerCadastro(event) {
  event.preventDefault();

  const nome = document.getElementById('nomeInput').value;
  const email = document.getElementById('emailInput').value;
  const login = document.getElementById('loginCadastroInput').value;
  const senha = document.getElementById('senhaCadastroInput').value;
  const confirmaSenha = document.getElementById('confirmaSenhaInput').value;

  // Validações
  if (senha !== confirmaSenha) {
    mostrarNotificacao('As senhas não conferem', 'error');
    return;
  }

  if (senha.length < 3) {
    mostrarNotificacao('A senha deve ter no mínimo 3 caracteres', 'error');
    return;
  }

  try {
    // Verificar se login já existe
    const checkResponse = await fetch(`${API_BASE_URL}/usuarios?login=${login}`);
    const usuariosExistentes = await checkResponse.json();

    if (usuariosExistentes.length > 0) {
      mostrarNotificacao('Este login já está em uso', 'error');
      return;
    }

    // Criar novo usuário
    const novoUsuario = {
      id: gerarUUID(),
      login,
      senha,
      nome,
      email,
      admin: false
    };

    const response = await fetch(`${API_BASE_URL}/usuarios`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(novoUsuario)
    });

    if (response.ok) {
      mostrarNotificacao('Cadastro realizado com sucesso! Faça login agora.', 'success');
      
      setTimeout(() => {
        mostrarFormularioLogin();
      }, 1500);
    } else {
      mostrarNotificacao('Erro ao realizar cadastro', 'error');
    }
  } catch (error) {
    console.error('Erro ao cadastrar:', error);
    mostrarNotificacao('Erro ao conectar com o servidor', 'error');
  }
}

// ===== NOTIFICAÇÕES =====
function mostrarNotificacao(mensagem, tipo = 'info') {
  const alertDiv = document.createElement('div');
  alertDiv.className = `alert alert-${tipo}`;
  alertDiv.textContent = mensagem;
  alertDiv.style.position = 'fixed';
  alertDiv.style.top = '80px';
  alertDiv.style.right = '20px';
  alertDiv.style.zIndex = '10000';
  alertDiv.style.minWidth = '300px';

  document.body.appendChild(alertDiv);

  setTimeout(() => {
    alertDiv.remove();
  }, 3000);
}

// ===== UTILITÁRIOS =====
function gerarUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
