// ===== API BASE URL =====
const API_BASE_URL = 'http://localhost:3000';

// ===== GLOBAL VARIABLES =====
let usuarioLogado = null;
let todosOsGames = [];
let favoritos = [];

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', () => {
  recuperarUsuarioLogado();
  atualizarMenu();
  
  // Se estiver na página de índice
  if (document.getElementById('carousel')) {
    carregarGames();
    inicializarCarrossel();
    inicializarPesquisa();
  }
  
  // Se estiver na página de detalhes
  if (document.getElementById('detailsContainer')) {
    carregarDetalhesDoItem();
  }
  
  // Se estiver na página de favoritos
  if (document.getElementById('favoritosContainer')) {
    carregarFavoritos();
  }
  
  // Se estiver na página de cadastro de itens
  if (document.getElementById('crudForm')) {
    verificarAdministrador();
    carregarTodosOsGames();
    inicializarFormularioCRUD();
  }
});

// ===== AUTENTICAÇÃO E SESSÃO =====
function recuperarUsuarioLogado() {
  const usuarioJSON = sessionStorage.getItem('usuarioLogado');
  if (usuarioJSON) {
    usuarioLogado = JSON.parse(usuarioJSON);
    console.log('Usuário recuperado:', usuarioLogado);
  }
}

function atualizarMenu() {
  const loginBtn = document.getElementById('loginBtn');
  const logoutBtn = document.getElementById('logoutBtn');
  const favoritosLink = document.getElementById('favoritosLink');
  const cadastroLink = document.getElementById('cadastroLink');
  const userNameSpan = document.getElementById('userName');

  if (usuarioLogado) {
    if (loginBtn) loginBtn.style.display = 'none';
    if (logoutBtn) logoutBtn.style.display = 'inline-block';
    if (favoritosLink) favoritosLink.style.display = 'inline-block';
    if (userNameSpan) userNameSpan.textContent = usuarioLogado.nome;
    
    // Mostrar cadastro só para administradores
    if (usuarioLogado.admin && cadastroLink) {
      cadastroLink.style.display = 'inline-block';
    }
  } else {
    if (loginBtn) loginBtn.style.display = 'inline-block';
    if (logoutBtn) logoutBtn.style.display = 'none';
    if (favoritosLink) favoritosLink.style.display = 'none';
    if (cadastroLink) cadastroLink.style.display = 'none';
  }
}

function fazerLogout() {
  usuarioLogado = null;
  sessionStorage.removeItem('usuarioLogado');
  atualizarMenu();
  window.location.href = 'index.html';
  mostrarNotificacao('Logout realizado com sucesso!', 'success');
}

// ===== CARREGAMENTO DE DADOS =====
async function carregarGames() {
  try {
    const response = await fetch(`${API_BASE_URL}/games`);
    todosOsGames = await response.json();
    
    // Carregar favoritos do usuário
    if (usuarioLogado) {
      const favResponse = await fetch(`${API_BASE_URL}/favoritos?usuarioId=${usuarioLogado.id}`);
      favoritos = await favResponse.json();
    }
    
    exibirGames(todosOsGames);
  } catch (error) {
    console.error('Erro ao carregar games:', error);
    mostrarNotificacao('Erro ao carregar dados do servidor', 'error');
  }
}

async function carregarTodosOsGames() {
  try {
    const response = await fetch(`${API_BASE_URL}/games`);
    todosOsGames = await response.json();
    listarGamesNaTabelaCRUD();
  } catch (error) {
    console.error('Erro ao carregar games:', error);
    mostrarNotificacao('Erro ao carregar games', 'error');
  }
}

async function carregarFavoritos() {
  try {
    if (!usuarioLogado) {
      document.getElementById('favoritosContainer').innerHTML = 
        '<div class="empty-state"><div class="empty-state-icon">❌</div><p>Você precisa estar logado para ver seus favoritos</p></div>';
      return;
    }

    const response = await fetch(`${API_BASE_URL}/favoritos?usuarioId=${usuarioLogado.id}`);
    const favoritos = await response.json();
    
    if (favoritos.length === 0) {
      document.getElementById('favoritosContainer').innerHTML = 
        '<div class="empty-state"><div class="empty-state-icon">♥️</div><p>Você ainda não tem favoritos marcados</p></div>';
      return;
    }

    // Buscar dados completos dos games favoritos
    const gamesFavoritosIds = favoritos.map(f => f.gameId);
    const gamesResponse = await fetch(`${API_BASE_URL}/games`);
    const todosGames = await gamesResponse.json();
    const gamesFavoritos = todosGames.filter(g => gamesFavoritosIds.includes(g.id));

    exibirGamesFavoritos(gamesFavoritos);
  } catch (error) {
    console.error('Erro ao carregar favoritos:', error);
    mostrarNotificacao('Erro ao carregar favoritos', 'error');
  }
}

// ===== EXIBIÇÃO DE DADOS =====
function exibirGames(games) {
  const container = document.getElementById('gamesContainer');
  container.innerHTML = '';

  if (games.length === 0) {
    container.innerHTML = '<div class="empty-state"><p>Nenhum jogo encontrado</p></div>';
    return;
  }

  games.forEach(game => {
    const isFavorited = verificarSeFavorito(game.id);
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <img src="assets/img/${game.imagem}" alt="${game.nome}" class="card-image">
      <div class="card-body">
        <h3 class="card-title">${game.nome}</h3>
        <p class="card-description">${game.descricao}</p>
        <p class="card-year">${game.ano} • ${game.console}</p>
        <div class="card-footer">
          <span class="card-rating">⭐ ${game.classificacao}</span>
          ${usuarioLogado ? `
            <button class="favorite-btn ${isFavorited ? 'favorited' : ''}" 
                    onclick="toggleFavorito(event, ${game.id})">
              ${isFavorited ? '❤️' : '🤍'}
            </button>
          ` : '<span class="favorite-btn" title="Faça login para marcar favoritos">🤍</span>'}
        </div>
      </div>
    `;
    
    card.style.cursor = 'pointer';
    card.addEventListener('click', (e) => {
      if (e.target.className !== 'favorite-btn' && 
          !e.target.classList.contains('favorite-btn')) {
        irParaDetalhes(game.id);
      }
    });
    
    container.appendChild(card);
  });
}

function exibirGamesFavoritos(games) {
  const container = document.getElementById('favoritosContainer');
  container.innerHTML = '';

  games.forEach(game => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <img src="assets/img/${game.imagem}" alt="${game.nome}" class="card-image">
      <div class="card-body">
        <h3 class="card-title">${game.nome}</h3>
        <p class="card-description">${game.descricao}</p>
        <p class="card-year">${game.ano} • ${game.console}</p>
        <div class="card-footer">
          <span class="card-rating">⭐ ${game.classificacao}</span>
          <button class="favorite-btn favorited" 
                  onclick="removerFavorito(event, ${game.id})">
            ❤️
          </button>
        </div>
      </div>
    `;
    
    card.style.cursor = 'pointer';
    card.addEventListener('click', (e) => {
      if (e.target.className !== 'favorite-btn' && 
          !e.target.classList.contains('favorite-btn')) {
        irParaDetalhes(game.id);
      }
    });
    
    container.appendChild(card);
  });
}

// ===== FAVORITOS =====
function verificarSeFavorito(gameId) {
  return favoritos.some(f => f.gameId === gameId);
}

async function toggleFavorito(event, gameId) {
  event.stopPropagation();
  
  if (!usuarioLogado) {
    window.location.href = 'login.html';
    return;
  }

  const isFavorited = verificarSeFavorito(gameId);

  if (isFavorited) {
    removerFavorito(event, gameId);
  } else {
    adicionarFavorito(gameId);
  }
}

async function adicionarFavorito(gameId) {
  try {
    const response = await fetch(`${API_BASE_URL}/favoritos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        usuarioId: usuarioLogado.id,
        gameId: gameId
      })
    });

    if (response.ok) {
      await carregarGames();
      mostrarNotificacao('Adicionado aos favoritos!', 'success');
    }
  } catch (error) {
    console.error('Erro ao adicionar favorito:', error);
    mostrarNotificacao('Erro ao adicionar favorito', 'error');
  }
}

async function removerFavorito(event, gameId) {
  try {
    const favorito = favoritos.find(f => f.gameId === gameId && f.usuarioId === usuarioLogado.id);
    
    if (!favorito) {
      console.error('Favorito não encontrado');
      return;
    }

    const response = await fetch(`${API_BASE_URL}/favoritos/${favorito.id}`, {
      method: 'DELETE'
    });

    if (response.ok) {
      await carregarGames();
      mostrarNotificacao('Removido dos favoritos!', 'success');
    }
  } catch (error) {
    console.error('Erro ao remover favorito:', error);
    mostrarNotificacao('Erro ao remover favorito', 'error');
  }
}

// ===== PESQUISA =====
function inicializarPesquisa() {
  const searchInput = document.getElementById('searchInput');
  const searchBtn = document.getElementById('searchBtn');

  if (searchInput) {
    searchInput.addEventListener('input', realizarPesquisa);
    searchBtn?.addEventListener('click', realizarPesquisa);
  }
}

function realizarPesquisa() {
  const termo = document.getElementById('searchInput').value.toLowerCase();

  if (termo.trim() === '') {
    exibirGames(todosOsGames);
    return;
  }

  const gamesFiltrados = todosOsGames.filter(game =>
    game.nome.toLowerCase().includes(termo) ||
    game.descricao.toLowerCase().includes(termo) ||
    game.detalhes.toLowerCase().includes(termo)
  );

  exibirGames(gamesFiltrados);
}

// ===== CARROSSEL =====
let indiceCarrossel = 0;

function inicializarCarrossel() {
  const gamesDessaque = todosOsGames.filter(g => g.destaque);
  
  if (gamesDessaque.length === 0) {
    document.getElementById('carousel').innerHTML = '<p>Nenhum jogo em destaque</p>';
    return;
  }

  exibirSlideCarrossel(gamesDessaque, 0);
  
  document.getElementById('prevBtn')?.addEventListener('click', () => {
    indiceCarrossel = (indiceCarrossel - 1 + gamesDessaque.length) % gamesDessaque.length;
    exibirSlideCarrossel(gamesDessaque, indiceCarrossel);
  });

  document.getElementById('nextBtn')?.addEventListener('click', () => {
    indiceCarrossel = (indiceCarrossel + 1) % gamesDessaque.length;
    exibirSlideCarrossel(gamesDessaque, indiceCarrossel);
  });
}

function exibirSlideCarrossel(games, indice) {
  const game = games[indice];
  const carousel = document.getElementById('carousel');
  
  if (!carousel) return;
  
  carousel.style.backgroundImage = `url('assets/img/${game.imagem}')`;
  carousel.style.backgroundSize = 'cover';
  carousel.style.backgroundPosition = 'center';
  
  const content = carousel.querySelector('.carousel-content');
  if (content) {
    content.innerHTML = `
      <h2>${game.nome}</h2>
      <p>${game.descricao}</p>
      <button class="btn btn-primary" onclick="irParaDetalhes(${game.id})">Ver Detalhes</button>
    `;
  }

  // Atualizar indicadores
  const indicators = document.querySelectorAll('.carousel-indicator');
  indicators.forEach((ind, i) => {
    ind.classList.toggle('active', i === indice);
  });

  if (indicators.length === 0) {
    // Criar indicadores se não existirem
    const indicatorsContainer = carousel.querySelector('.carousel-indicators');
    if (indicatorsContainer) {
      indicatorsContainer.innerHTML = games.map((_, i) => 
        `<div class="carousel-indicator ${i === indice ? 'active' : ''}" 
              onclick="document.querySelectorAll('#carousel')[0].dataset.slide = ${i}"></div>`
      ).join('');
    }
  }
}

// ===== DETALHES DO ITEM =====
async function carregarDetalhesDoItem() {
  const params = new URLSearchParams(window.location.search);
  const gameId = parseInt(params.get('id'));

  if (!gameId) {
    window.location.href = 'index.html';
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/games/${gameId}`);
    const game = await response.json();

    if (!game) {
      window.location.href = 'index.html';
      return;
    }

    // Carregar favoritos
    if (usuarioLogado) {
      const favResponse = await fetch(`${API_BASE_URL}/favoritos?usuarioId=${usuarioLogado.id}`);
      favoritos = await favResponse.json();
    }

    exibirDetalhesDoItem(game);
  } catch (error) {
    console.error('Erro ao carregar detalhes:', error);
    window.location.href = 'index.html';
  }
}

function exibirDetalhesDoItem(game) {
  const container = document.getElementById('detailsContainer');
  const isFavorited = verificarSeFavorito(game.id);

  container.innerHTML = `
    <div class="details-header">
      <img src="assets/img/${game.imagem}" alt="${game.nome}" class="details-image">
    </div>
    <div class="details-body">
      <div class="details-title">
        <div>
          <h1>${game.nome}</h1>
        </div>
        ${usuarioLogado ? `
          <button class="favorite-btn ${isFavorited ? 'favorited' : ''}" 
                  onclick="toggleFavorito(event, ${game.id})"
                  style="font-size: 2rem; margin-top: 1rem;">
            ${isFavorited ? '❤️' : '🤍'}
          </button>
        ` : ''}
      </div>
      
      <div class="details-meta">
        <div class="meta-item">
          <div class="meta-label">ANO</div>
          <div class="meta-value">${game.ano}</div>
        </div>
        <div class="meta-item">
          <div class="meta-label">CONSOLE</div>
          <div class="meta-value">${game.console}</div>
        </div>
        <div class="meta-item">
          <div class="meta-label">GÊNERO</div>
          <div class="meta-value">${game.genero}</div>
        </div>
        <div class="meta-item">
          <div class="meta-label">CRIADOR</div>
          <div class="meta-value">${game.criador}</div>
        </div>
        <div class="meta-item">
          <div class="meta-label">CLASSIFICAÇÃO</div>
          <div class="meta-value">⭐ ${game.classificacao}</div>
        </div>
      </div>

      <h3 style="color: var(--primary-color); margin-top: 2rem; margin-bottom: 1rem;">Descrição</h3>
      <p class="details-description">${game.descricao}</p>

      <h3 style="color: var(--primary-color); margin-bottom: 1rem;">Detalhes Completos</h3>
      <p class="details-description">${game.detalhes}</p>

      <div class="details-actions">
        <button class="btn btn-secondary" onclick="window.history.back()">← Voltar</button>
        <a href="index.html" class="btn btn-primary">Ir para Home</a>
      </div>
    </div>
  `;
}

function irParaDetalhes(gameId) {
  window.location.href = `detalhes.html?id=${gameId}`;
}

// ===== GRÁFICO/VISUALIZAÇÃO =====
function renderizarGrafico() {
  const container = document.getElementById('chartContainer');
  
  if (!container) return;

  // Criar gráfico simples com canvas
  const canvas = document.createElement('canvas');
  canvas.id = 'gameChart';
  container.innerHTML = '';
  container.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  const gastos = todosOsGames.reduce((acc, game) => {
    acc[game.console] = (acc[game.console] || 0) + 1;
    return acc;
  }, {});

  const labels = Object.keys(gastos);
  const data = Object.values(gastos);

  // Desenhar gráfico de barras simples
  const barWidth = 50;
  const spacing = 20;
  const maxValue = Math.max(...data);
  const scaleFactor = 300 / maxValue;

  canvas.width = (barWidth + spacing) * labels.length + 40;
  canvas.height = 400;

  // Desenhar background
  ctx.fillStyle = '#f8f9fa';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Desenhar grid
  ctx.strokeStyle = '#ddd';
  ctx.lineWidth = 1;
  for (let i = 0; i <= 5; i++) {
    const y = 50 + (canvas.height - 100) * (i / 5);
    ctx.beginPath();
    ctx.moveTo(30, y);
    ctx.lineTo(canvas.width - 10, y);
    ctx.stroke();
  }

  // Desenhar barras
  labels.forEach((label, index) => {
    const x = 40 + index * (barWidth + spacing);
    const barHeight = data[index] * scaleFactor;
    const y = canvas.height - 50 - barHeight;

    // Cor da barra
    ctx.fillStyle = '#9b59b6';
    ctx.fillRect(x, y, barWidth, barHeight);

    // Valor no topo
    ctx.fillStyle = '#333';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(data[index], x + barWidth / 2, y - 10);

    // Label
    ctx.fillStyle = '#666';
    ctx.font = '12px Arial';
    ctx.fillText(label, x + barWidth / 2, canvas.height - 20);
  });
}

// ===== CRUD DE GAMES =====
function verificarAdministrador() {
  if (!usuarioLogado || !usuarioLogado.admin) {
    document.body.innerHTML = '<div class="empty-state" style="padding: 5rem;"><p>❌ Acesso negado. Apenas administradores podem acessar essa página.</p><a href="index.html" class="btn btn-primary">Voltar para Home</a></div>';
  }
}

function inicializarFormularioCRUD() {
  const form = document.getElementById('crudForm');
  if (form) {
    form.addEventListener('submit', adicionarNovoGame);
  }

  listarGamesNaTabelaCRUD();
}

function listarGamesNaTabelaCRUD() {
  const tbody = document.getElementById('gamesTableBody');
  
  if (!tbody) return;

  tbody.innerHTML = '';

  todosOsGames.forEach(game => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${game.nome}</td>
      <td>${game.ano}</td>
      <td>${game.console}</td>
      <td>${game.genero}</td>
      <td>
        <button class="btn btn-secondary btn-sm" onclick="editarGame(${game.id})">Editar</button>
        <button class="btn btn-danger btn-sm" onclick="deletarGame(${game.id})">Deletar</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

async function adicionarNovoGame(event) {
  event.preventDefault();

  const nome = document.getElementById('nome').value;
  const descricao = document.getElementById('descricao').value;
  const detalhes = document.getElementById('detalhes').value;
  const ano = parseInt(document.getElementById('ano').value);
  const console = document.getElementById('console').value;
  const genero = document.getElementById('genero').value;
  const imagem = document.getElementById('imagem').value;
  const criador = document.getElementById('criador').value;
  const classificacao = parseFloat(document.getElementById('classificacao').value);
  const destaque = document.getElementById('destaque').checked;

  try {
    const response = await fetch(`${API_BASE_URL}/games`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        nome,
        descricao,
        detalhes,
        ano,
        console,
        genero,
        imagem,
        criador,
        classificacao,
        destaque
      })
    });

    if (response.ok) {
      document.getElementById('crudForm').reset();
      await carregarTodosOsGames();
      mostrarNotificacao('Game adicionado com sucesso!', 'success');
    }
  } catch (error) {
    console.error('Erro ao adicionar game:', error);
    mostrarNotificacao('Erro ao adicionar game', 'error');
  }
}

async function deletarGame(gameId) {
  if (!confirm('Tem certeza que deseja deletar este game?')) {
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/games/${gameId}`, {
      method: 'DELETE'
    });

    if (response.ok) {
      await carregarTodosOsGames();
      mostrarNotificacao('Game deletado com sucesso!', 'success');
    }
  } catch (error) {
    console.error('Erro ao deletar game:', error);
    mostrarNotificacao('Erro ao deletar game', 'error');
  }
}

function editarGame(gameId) {
  alert('Funcionalidade de edição em desenvolvimento');
  // Implementar edição
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
function irParaLogin() {
  window.location.href = 'login.html';
}

function irParaCadastro() {
  window.location.href = 'login.html?mode=cadastro';
}

function irParaCadastroItens() {
  if (usuarioLogado && usuarioLogado.admin) {
    window.location.href = 'cadastro_itens.html';
  } else {
    mostrarNotificacao('Acesso negado', 'error');
  }
}

function irParaFavoritos() {
  window.location.href = 'favoritos.html';
}
