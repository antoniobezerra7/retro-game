const jogos = [
  {
    id: 1,
    nome: "Resident Evil 2",
    descricao_curta: "O terror psicológico que revolucionou o survival horror.",
    conteudo: "Resident Evil 2 coloca o jogador em Raccoon City, acompanhando Leon S. Kennedy e Claire Redfield em uma fuga cheia de tensão, puzzles e criaturas memoráveis.",
    ano: 1998,
    desenvolvedora: "Capcom",
    genero: "Survival Horror",
    plataforma: "PlayStation",
    destaque: true,
    imagem_principal: "assets/re2.jpg"
  },
  {
    id: 2,
    nome: "Sonic the Hedgehog 2",
    descricao_curta: "Velocidade, fases marcantes e a estreia de Tails.",
    conteudo: "Sonic 2 expandiu tudo o que o primeiro jogo fez, trazendo fases icônicas, trilha sonora marcante e a parceria com Tails.",
    ano: 1992,
    desenvolvedora: "SEGA",
    genero: "Plataforma",
    plataforma: "Mega Drive",
    destaque: true,
    imagem_principal: "assets/sonic2.jpg"
  },
  {
    id: 3,
    nome: "The Legend of Zelda: Ocarina of Time",
    descricao_curta: "A aventura que definiu os jogos 3D.",
    conteudo: "Ocarina of Time levou Link a uma jornada no tempo para impedir Ganondorf. Com exploração e música memorável, virou um clássico histórico.",
    ano: 1998,
    desenvolvedora: "Nintendo",
    genero: "Aventura",
    plataforma: "Nintendo 64",
    destaque: true,
    imagem_principal: "assets/zelda.jpg"
  }
];

function getUsuarioCorrente() {
  const raw = sessionStorage.getItem("usuarioCorrente");
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function getFavoritesKey(userId) {
  return `favoritos_${userId}`;
}

function getFavoritesIds() {
  const user = getUsuarioCorrente();
  if (!user) return [];

  const raw = localStorage.getItem(getFavoritesKey(user.id));
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.map(Number) : [];
  } catch {
    return [];
  }
}

function saveFavoritesIds(ids) {
  const user = getUsuarioCorrente();
  if (!user) return;
  localStorage.setItem(getFavoritesKey(user.id), JSON.stringify(ids));
}

function isFavorite(id) {
  return getFavoritesIds().includes(Number(id));
}

function formatDate(dateString) {
  const date = new Date(dateString + "T00:00:00");
  return date.toLocaleDateString("pt-BR");
}

function renderLoginArea() {
  const area = document.getElementById("loginArea");
  if (!area) return;

  const user = getUsuarioCorrente();

  if (!user) {
    area.innerHTML = `<a href="./modulos/login/index.html" class="login-link">Entrar</a>`;
    return;
  }

  area.innerHTML = `
    <span>Olá, ${user.nome || user.login}</span>
    <span>|</span>
    <button type="button" id="btnSair">Sair</button>
  `;

  const btnSair = document.getElementById("btnSair");
  if (btnSair) {
    btnSair.addEventListener("click", () => {
      if (typeof window.logoutUser === "function") {
        window.logoutUser();
      } else {
        sessionStorage.removeItem("usuarioCorrente");
        window.location.href = "./modulos/login/index.html";
      }
    });
  }
}

function toggleFavorite(id) {
  const user = getUsuarioCorrente();
  if (!user) {
    alert("Você precisa entrar para favoritar um item.");
    window.location.href = "./modulos/login/index.html";
    return;
  }

  const current = getFavoritesIds();
  const numericId = Number(id);
  const index = current.indexOf(numericId);

  if (index >= 0) {
    current.splice(index, 1);
  } else {
    current.push(numericId);
  }

  saveFavoritesIds(current);
  renderEverything();
}

function createGameCard(item) {
  const fav = isFavorite(item.id);

  const col = document.createElement("div");
  col.className = "col-sm-12 col-md-6 col-lg-4";

  col.innerHTML = `
    <div class="card game-card h-100 border-0 ${fav ? "is-favorite" : ""}">
      <img src="${item.imagem_principal}" class="card-img-top game-card-img" alt="${item.nome}">
      <div class="card-body bg-dark-soft d-flex flex-column">
        ${fav ? `<span class="favorite-badge"><i class="bi bi-heart-fill"></i> Favorito</span>` : ""}
        <span class="badge bg-primary mb-2 align-self-start">${item.plataforma}</span>
        <h5 class="card-title text-primary fw-bold">${item.nome}</h5>
        <p class="card-text small text-light flex-grow-1">${item.descricao_curta}</p>
        <div class="d-flex flex-wrap gap-2 align-items-center justify-content-between mt-2">
          <small class="text-muted">${item.desenvolvedora}</small>
          <button type="button" class="favorite-btn ${fav ? "active" : ""}">
            <i class="bi ${fav ? "bi-heart-fill" : "bi-heart"}"></i>
            ${fav ? "Favorito" : "Favoritar"}
          </button>
        </div>
      </div>
    </div>
  `;

  const btn = col.querySelector(".favorite-btn");
  btn.addEventListener("click", (event) => {
    event.stopPropagation();
    toggleFavorite(item.id);
  });

  return col;
}

function renderCarousel() {
  const destaques = jogos.filter(item => item.destaque);
  const inner = document.getElementById("carouselInner");
  const indicators = document.getElementById("carouselIndicators");

  if (!inner || !indicators) return;

  inner.innerHTML = "";
  indicators.innerHTML = "";

  const base = destaques.length > 0 ? destaques : jogos.slice(0, 1);

  base.forEach((item, index) => {
    inner.innerHTML += `
      <div class="carousel-item ${index === 0 ? "active" : ""}">
        <div class="carousel-destaque-img">
          <img src="${item.imagem_principal}" alt="${item.nome}">
        </div>
        <div class="carousel-caption custom-caption">
          <h5>${item.nome}</h5>
          <p>${item.descricao_curta}</p>
        </div>
      </div>
    `;

    indicators.innerHTML += `
      <button type="button" data-bs-target="#carouselDestaques" data-bs-slide-to="${index}" class="${index === 0 ? "active" : ""}" aria-current="${index === 0 ? "true" : "false"}" aria-label="Slide ${index + 1}"></button>
    `;
  });
}

function renderCards() {
  const container = document.getElementById("cardsContainer");
  if (!container) return;

  container.innerHTML = "";

  jogos.forEach(item => {
    container.appendChild(createGameCard(item));
  });
}

function renderFavoritesPage() {
  const container = document.getElementById("favoritesContainer");
  const empty = document.getElementById("favoritesEmpty");

  if (!container || !empty) return;

  const user = getUsuarioCorrente();

  if (!user) {
    container.innerHTML = "";
    empty.classList.remove("d-none");
    empty.innerHTML = `
      <strong>Você ainda não entrou.</strong><br>
      Para ver seus favoritos, faça login primeiro.
      <div class="mt-3">
        <a href="./modulos/login/index.html" class="btn btn-primary">Entrar</a>
      </div>
    `;
    return;
  }

  const favoriteIds = getFavoritesIds();
  const favoritos = jogos.filter(item => favoriteIds.includes(Number(item.id)));

  container.innerHTML = "";

  if (favoritos.length === 0) {
    empty.classList.remove("d-none");
    empty.innerHTML = `
      <strong>Nenhum favorito salvo ainda.</strong><br>
      Volte para a coleção e marque seus jogos preferidos.
    `;
    return;
  }

  empty.classList.add("d-none");

  favoritos.forEach(item => {
    const col = document.createElement("div");
    col.className = "col-sm-12 col-md-6 col-lg-4";

    col.innerHTML = `
      <div class="card favorite-grid-card h-100 border-0 is-favorite">
        <img src="${item.imagem_principal}" class="card-img-top game-card-img" alt="${item.nome}">
        <div class="card-body d-flex flex-column">
          <span class="favorite-badge"><i class="bi bi-heart-fill"></i> Favorito</span>
          <span class="badge bg-primary mb-2 align-self-start">${item.plataforma}</span>
          <h5 class="card-title text-primary fw-bold">${item.nome}</h5>
          <p class="card-text small text-light flex-grow-1">${item.descricao_curta}</p>
          <div class="d-flex justify-content-between align-items-center mt-2">
            <small class="text-muted">${item.desenvolvedora}</small>
            <button type="button" class="favorite-btn active">
              <i class="bi bi-heart-fill"></i>
              Remover
            </button>
          </div>
        </div>
      </div>
    `;

    const btn = col.querySelector(".favorite-btn");
    btn.addEventListener("click", () => toggleFavorite(item.id));

    container.appendChild(col);
  });
}

function renderEverything() {
  renderLoginArea();

  const homeCards = document.getElementById("cardsContainer");
  const favoritesPage = document.getElementById("favoritesContainer");

  if (homeCards) {
    renderCarousel();
    renderCards();
  }

  if (favoritesPage) {
    renderFavoritesPage();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  renderEverything();
});