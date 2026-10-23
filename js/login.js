/* ===== Say Kids — Lógica de Login (front-end / mock) =====
   Autenticação simulada no navegador. Quando houver back-end,
   basta trocar a função autenticar() por uma chamada à API.        */

// Base de usuários de teste (temporária — substituir por API/servidor).
const USUARIOS = [
  { email: "admin@saykids.com", senha: "admin123", nome: "Administrador", perfil: "admin" }
];

/* Semente de usuários de teste: garante que os logins de Secretaria, Professor
   e Auxiliar funcionem já no primeiro acesso (caso ainda não existam no navegador). */
function seedUsuariosTeste() {
  function seedSe(chave, dados) {
    if (localStorage.getItem(chave) === null) {
      try { localStorage.setItem(chave, JSON.stringify(dados)); } catch (e) {}
    }
  }
  seedSe("saykids_secretarias", [
    { nome: "Marina Costa", cpf: "123.456.789-00", email: "marina@saykids.com", telefone: "(11) 98888-4001", cep: "01310-000", rua: "Av. Paulista", bairro: "Bela Vista", numero: "1000", complemento: "", foto: "" },
    { nome: "Rafael Souza", cpf: "987.654.321-00", email: "rafael@saykids.com", telefone: "(11) 98888-4002", cep: "04567-010", rua: "Rua das Flores", bairro: "Vila Mariana", numero: "245", complemento: "Sala 2", foto: "" },
    { nome: "Beatriz Lima", cpf: "456.789.123-00", email: "beatriz@saykids.com", telefone: "(11) 98888-4003", cep: "02020-030", rua: "Rua Verde", bairro: "Santana", numero: "58", complemento: "", foto: "" },
  ]);
  seedSe("saykids_professores", [
    { nome: "Juliana Alves", cpf: "444.555.666-77", email: "juliana@saykids.com", telefone: "(11) 99999-1001", cep: "01000-000", rua: "Rua das Palmeiras", bairro: "Centro", numero: "100", complemento: "", turmas: ["Berçário II"], foto: "" },
    { nome: "Fernanda Dias", cpf: "555.666.777-88", email: "fernanda@saykids.com", telefone: "(11) 99999-1002", cep: "02000-000", rua: "Rua Azul", bairro: "Santana", numero: "200", complemento: "Bloco B", turmas: ["Maternal I"], foto: "" },
    { nome: "Camila Prado", cpf: "666.777.888-99", email: "camila@saykids.com", telefone: "(11) 99999-1004", cep: "03000-000", rua: "Rua Verde", bairro: "Tatuapé", numero: "40", complemento: "", turmas: ["Jardim I", "Jardim II"], foto: "" },
  ]);
  seedSe("saykids_colaboradores", [
    { nome: "Ana Beatriz Souza", cpf: "111.222.333-44", email: "ana@saykids.com", telefone: "(11) 99999-3001", cep: "01000-000", rua: "Rua A", bairro: "Centro", numero: "10", complemento: "", funcao: "Auxiliar", turmas: ["Maternal I"], foto: "" },
    { nome: "Roberto Alves", cpf: "222.333.444-55", email: "roberto@saykids.com", telefone: "(11) 99999-3002", cep: "02000-000", rua: "Rua B", bairro: "Santana", numero: "20", complemento: "", funcao: "Porteiro", turmas: [], foto: "" },
    { nome: "Márcia Gomes", cpf: "333.444.555-66", email: "marcia@saykids.com", telefone: "(11) 99999-3003", cep: "03000-000", rua: "Rua C", bairro: "Tatuapé", numero: "30", complemento: "", funcao: "Almoxarife", turmas: [], foto: "" },
  ]);
}

/* Função de autenticação: valida e-mail e senha e retorna o usuário (ou null). */
function autenticar(email, senha) {
  const e = email.toLowerCase();
  // 1) Administrador (usuário fixo)
  const admin = USUARIOS.find((u) => u.email.toLowerCase() === e && u.senha === senha);
  if (admin) return { nome: admin.nome, email: admin.email, perfil: admin.perfil };

  // 2) Secretaria (cadastrada como secretaria; senha padrão de acesso)
  let secs = [];
  try { secs = JSON.parse(localStorage.getItem("saykids_secretarias") || "[]"); } catch (err) { secs = []; }
  const sec = secs.find((s) => (s.email || "").toLowerCase() === e);
  if (sec && senha === "secretaria123") return { nome: sec.nome, email: sec.email, perfil: "secretaria" };

  // 3) Professor
  let profs = [];
  try { profs = JSON.parse(localStorage.getItem("saykids_professores") || "[]"); } catch (err) { profs = []; }
  const prof = profs.find((p) => (p.email || "").toLowerCase() === e);
  if (prof && senha === "professor123") return { nome: prof.nome, email: prof.email, perfil: "professor" };

  // 4) Auxiliar / 5) Porteiro / Almoxarife (colaboradores; senha padrão por função)
  let cols = [];
  try { cols = JSON.parse(localStorage.getItem("saykids_colaboradores") || "[]"); } catch (err) { cols = []; }
  const aux = cols.find((c) => (c.email || "").toLowerCase() === e && c.funcao === "Auxiliar");
  if (aux && senha === "auxiliar123") return { nome: aux.nome, email: aux.email, perfil: "auxiliar" };
  const porteiro = cols.find((c) => (c.email || "").toLowerCase() === e && c.funcao === "Porteiro");
  if (porteiro && senha === "porteiro123") return { nome: porteiro.nome, email: porteiro.email, perfil: "porteiro" };
  const almox = cols.find((c) => (c.email || "").toLowerCase() === e && c.funcao === "Almoxarife");
  if (almox && senha === "almoxarife123") return { nome: almox.nome, email: almox.email, perfil: "almoxarife" };

  // 6) Responsável
  let resps = [];
  try { resps = JSON.parse(localStorage.getItem("saykids_responsaveis") || "[]"); } catch (err) { resps = []; }
  const resp = resps.find((r) => (r.email || "").toLowerCase() === e);
  if (resp && senha === "responsavel123") return { nome: resp.nome, email: resp.email, perfil: "responsavel" };

  return null;
}

/* ===== Interface: executa apenas no navegador, na tela de login ===== */
if (typeof document !== "undefined" && document.getElementById("form-login")) {
  seedUsuariosTeste(); // cria os usuários de teste ao abrir a tela de login

  const form = document.getElementById("form-login");
  const inputEmail = document.getElementById("email");
  const inputSenha = document.getElementById("senha");
  const inputLembrar = document.getElementById("lembrar");
  const boxErro = document.getElementById("erro");
  const toggleEye = document.getElementById("toggle-eye");
  const linkEsqueci = document.getElementById("link-esqueci");

  // Preenche o e-mail se ficou salvo do "Lembrar de mim".
  const emailSalvo = localStorage.getItem("saykids_email");
  if (emailSalvo) inputEmail.value = emailSalvo;

  // Mostrar / ocultar senha (troca o ícone de olho).
  const OLHO_ABERTO =
    '<svg viewBox="0 0 24 24" fill="none" stroke="#9aa7b8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>';
  const OLHO_FECHADO =
    '<svg viewBox="0 0 24 24" fill="none" stroke="#9aa7b8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/><path d="M3 3l18 18"/></svg>';
  toggleEye.addEventListener("click", () => {
    const oculto = inputSenha.type === "password";
    inputSenha.type = oculto ? "text" : "password";
    toggleEye.innerHTML = oculto ? OLHO_ABERTO : OLHO_FECHADO;
  });

  function mostrarErro(msg) { boxErro.textContent = msg; boxErro.classList.add("show"); }
  function limparErro() { boxErro.classList.remove("show"); }

  form.addEventListener("submit", (ev) => {
    ev.preventDefault();
    limparErro();

    const email = inputEmail.value.trim();
    const senha = inputSenha.value;

    if (!email || !senha) { mostrarErro("Preencha e-mail e senha."); return; }

    const usuario = autenticar(email, senha);
    if (!usuario) {
      mostrarErro("E-mail ou senha incorretos. Tente novamente.");
      inputSenha.value = "";
      inputSenha.focus();
      return;
    }

    // Sessão por aba: cada login recebe um ID único guardado na URL do painel.
    const sessao = { nome: usuario.nome, email: usuario.email, perfil: usuario.perfil };
    const sid = "s" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
    localStorage.setItem("saykids_sess_" + sid, JSON.stringify(sessao));
    sessionStorage.setItem("saykids_sessao", JSON.stringify(sessao));

    if (inputLembrar.checked) localStorage.setItem("saykids_email", email);
    else localStorage.removeItem("saykids_email");

    window.location.href = "painel.html#" + sid;
  });

  linkEsqueci.addEventListener("click", (ev) => {
    ev.preventDefault();
    popupLogin(
      "Recuperação de senha",
      "Entre em contato com a coordenação da escola para redefinir sua senha."
    );
  });
}

/* Pop-up padronizado da tela de login (mesmo estilo do sistema) */
function popupLogin(titulo, mensagem) {
  const div = document.createElement("div");
  div.className = "lg-popup-overlay";
  div.innerHTML =
    '<div class="lg-popup">' +
      '<div class="lg-popup-ico">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 7h.01"/></svg>' +
      '</div>' +
      '<div class="lg-popup-titulo">' + titulo + '</div>' +
      '<div class="lg-popup-msg">' + mensagem + '</div>' +
      '<button type="button" class="lg-popup-btn" data-fechar>OK</button>' +
    '</div>';
  document.body.appendChild(div);
  const fechar = () => { if (div.parentNode) div.remove(); };
  div.addEventListener("click", (e) => { if (e.target === div || e.target.closest("[data-fechar]")) fechar(); });
  const bt = div.querySelector("[data-fechar]"); if (bt) bt.focus();
}

/* ===== Exporta a lógica para os testes automatizados (Jest / Node) ===== */
if (typeof module !== "undefined" && module.exports) {
  module.exports = { autenticar, seedUsuariosTeste };
}
