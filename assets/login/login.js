const LOGIN_API_URL = "http://localhost:3000/usuarios";
const FALLBACK_USERS = [
  { id: "1", nome: "Admin", login: "admin", senha: "123", email: "admin@retrogame.com" },
  { id: "2", nome: "User", login: "user", senha: "123", email: "user@retrogame.com" }
];

function isLoginPage() {
  return window.location.pathname.includes("/modulos/login/");
}

function getLoginPageUrl() {
  return isLoginPage() ? "./index.html" : "./modulos/login/index.html";
}

function getHomePageUrl() {
  return isLoginPage() ? "../../index.html" : "./index.html";
}

function getUsuarioCorrente() {
  const raw = sessionStorage.getItem("usuarioCorrente");
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function setUsuarioCorrente(usuario) {
  sessionStorage.setItem("usuarioCorrente", JSON.stringify(usuario));
}

async function carregarUsuarios() {
  try {
    const response = await fetch(LOGIN_API_URL);
    if (!response.ok) throw new Error("Falha ao carregar usuários");
    const data = await response.json();
    return Array.isArray(data) ? data : FALLBACK_USERS;
  } catch {
    return FALLBACK_USERS;
  }
}

async function loginUser(login, senha) {
  const usuarios = await carregarUsuarios();
  const usuario = usuarios.find(item => item.login === login && item.senha === senha);

  if (!usuario) {
    return { success: false, message: "Login ou senha inválidos." };
  }

  const usuarioCorrente = {
    id: usuario.id,
    nome: usuario.nome,
    login: usuario.login,
    senha: usuario.senha,
    email: usuario.email
  };

  setUsuarioCorrente(usuarioCorrente);
  window.location.href = getHomePageUrl();
  return { success: true };
}

function logoutUser() {
  sessionStorage.removeItem("usuarioCorrente");
  window.location.href = getLoginPageUrl();
}

function initLoginApp() {
  const usuario = getUsuarioCorrente();

  if (isLoginPage()) {
    if (usuario) {
      window.location.href = getHomePageUrl();
      return;
    }

    const form = document.getElementById("loginForm");
    const loginInput = document.getElementById("login");
    const senhaInput = document.getElementById("senha");
    const mensagem = document.getElementById("loginMensagem");

    if (!form || !loginInput || !senhaInput || !mensagem) return;

    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      mensagem.textContent = "";
      mensagem.className = "login-message mb-3";

      const login = loginInput.value.trim();
      const senha = senhaInput.value.trim();

      if (!login || !senha) {
        mensagem.textContent = "Preencha login e senha.";
        mensagem.classList.add("error");
        return;
      }

      const resultado = await loginUser(login, senha);

      if (!resultado.success) {
        mensagem.textContent = resultado.message;
        mensagem.classList.add("error");
      }
    });

    return;
  }

  if (!usuario) {
    window.location.href = getLoginPageUrl();
    return;
  }
}

window.loginUser = loginUser;
window.logoutUser = logoutUser;
window.initLoginApp = initLoginApp;
window.getUsuarioCorrente = getUsuarioCorrente;

document.addEventListener("DOMContentLoaded", () => {
  initLoginApp();
});