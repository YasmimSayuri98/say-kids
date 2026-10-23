/* ===== Say Kids — Painel do Administrador =====
   Navegação por seções (SPA simples) + proteção de sessão.
   Cadastro de Secretaria persistido no navegador (localStorage).   */

// --- Proteção: exige login (sessão por aba, identificada na URL) ---
const SID = location.hash.replace(/^#/, "");
let sessao = null;
if (SID) { try { sessao = JSON.parse(localStorage.getItem("saykids_sess_" + SID) || "null"); } catch (e) { sessao = null; } }
// Compatibilidade: se não veio ID na URL, tenta a sessão da própria aba
if (!sessao) { try { sessao = JSON.parse(sessionStorage.getItem("saykids_sessao") || "null"); } catch (e) { sessao = null; } }
if (!sessao) window.location.href = "index.html";

// --- Ícones SVG (sem emojis) ---
const PATHS = {
  users: '<circle cx="9" cy="8" r="3"/><path d="M3 20c0-3.3 2.7-5 6-5s6 1.7 6 5"/><path d="M16 6a3 3 0 0 1 0 6M17 15c2.5 0 5 1.3 5 5"/>',
  check: '<circle cx="12" cy="12" r="9"/><path d="M8 12l3 3 5-6"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 9h18M8 3v4M16 3v4"/>',
  doc: '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4"/><path d="M9 13h6M9 17h6"/>',
  school: '<path d="M3 21h18"/><path d="M5 21V9l7-4 7 4v12"/><path d="M9 21v-4h6v4"/><path d="M9 12h.01M15 12h.01"/>',
  cap: '<path d="M22 10 12 5 2 10l10 5 10-5z"/><path d="M6 12v5c0 1 2.7 3 6 3s6-2 6-3v-5"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  child: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-6 8-6s8 2 8 6"/>',
  arrow: '<path d="M4 12h14M13 6l6 6-6 6"/>',
  arrowUp: '<path d="M12 19V6M6 12l6-6 6 6"/>',
  arrowLeft: '<path d="M20 12H6M11 6l-5 6 5 6"/>',
  userline: '<circle cx="12" cy="8" r="3.5"/><path d="M5 20c0-3.5 3-5.5 7-5.5s7 2 7 5.5"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
  phone: '<path d="M5 4h4l2 5-3 2a12 12 0 0 0 5 5l2-3 5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>',
  idcard: '<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="8" cy="11" r="2"/><path d="M5 16c0-1.7 1.3-2.5 3-2.5s3 .8 3 2.5"/><path d="M14 10h4M14 13.5h4"/>',
  location: '<path d="M12 21s7-6 7-11a7 7 0 1 0-14 0c0 5 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/>',
  map: '<path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2z"/><path d="M9 4v14M15 6v14"/>',
  building: '<rect x="4" y="3" width="16" height="18" rx="1.5"/><path d="M8 7h2M14 7h2M8 11h2M14 11h2M8 15h2M14 15h2"/>',
  hash: '<path d="M5 9h14M5 15h14M9 4l-2 16M17 4l-2 16"/>',
  note: '<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/>',
  camera: '<path d="M4 8h3l2-2h6l2 2h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>',
  x: '<circle cx="12" cy="12" r="9"/><path d="M9 9l6 6M15 9l-6 6"/>',
  save: '<path d="M5 3h11l3 3v15H5z"/><path d="M8 3v6h7V3M8 21v-6h8v6"/>',
  bulb: '<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-4 10.5c.7.7 1 1.3 1 2.5h6c0-1.2.3-1.8 1-2.5A6 6 0 0 0 12 3z"/>',
  shieldCheck: '<path d="M12 3l8 3v5c0 5-3 8-8 10-5-2-8-5-8-10V6z"/><path d="M9 12l2 2 4-4"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  trash: '<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>',
  edit: '<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M13 6l4 4"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="M21 21l-4-4"/>',
  times: '<path d="M6 6l12 12M18 6L6 18"/>',
  door: '<path d="M6 21V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v17M4 21h16"/><circle cx="14" cy="12" r="1"/>',
  tag: '<path d="M3 12l9-9h8v8l-9 9z"/><circle cx="16" cy="8" r="1.4"/>',
  filter: '<path d="M4 5h16l-6 8v6l-4-2v-4z"/>',
  history: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  home: '<path d="M3 11 12 3l9 8"/><path d="M5 9.5V20h14V9.5"/>',
  userplus: '<circle cx="9" cy="8" r="3.2"/><path d="M3.5 20c0-3.3 2.6-5 5.5-5s5.5 1.7 5.5 5"/><path d="M18 8v6M15 11h6"/>',
  apple: '<path d="M12 8c-1-2-3.5-2.5-5-1-2 2-1.5 6 0 8.5C8 17.5 9.5 19 12 19s4-1.5 5-3.5c1.5-2.5 2-6.5 0-8.5-1.5-1.5-4-1-5 1z"/><path d="M12 8c0-2 1-3.5 3-4"/>',
  clipboard: '<rect x="7" y="4" width="10" height="17" rx="2"/><path d="M9 4a3 3 0 0 1 6 0"/><path d="M9.5 12l1.5 1.5 3-3"/>',
  printer: '<path d="M7 9V4h10v5"/><rect x="5" y="9" width="14" height="7" rx="2"/><rect x="8" y="15" width="8" height="5"/><circle cx="17" cy="12" r="0.6"/>',
  filePlus: '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4"/><path d="M12 11v6M9 14h6"/>',
  box: '<path d="M3 8l9-5 9 5v8l-9 5-9-5z"/><path d="M3 8l9 5 9-5M12 13v8"/>',
  arrowDown: '<path d="M12 5v14M6 13l6 6 6-6"/>',
  alignLeft: '<path d="M4 6h16M4 12h10M4 18h13"/>',
  alignCenter: '<path d="M4 6h16M7 12h10M6 18h12"/>',
  alignRight: '<path d="M4 6h16M10 12h10M7 18h13"/>',
  alerta: '<path d="M12 3 2 20h20L12 3z"/><path d="M12 10v5M12 18h.01"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 7h.01"/>',
  sign: '<path d="M3 17c3 0 3-6 6-6s3 8 6 8 3-6 6-6"/><path d="M3 21h18"/>',
};
function esc(s) { return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;"); }
function ic(nome, cor) {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="${cor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${PATHS[nome]}</svg>`;
}
const COR = { azul: "#2563eb", verde: "#22a06b", laranja: "#f97316", roxo: "#7c5cdb", vermelho: "#e2536e" };

// --- Data de hoje no cabeçalho ---
(function () {
  const hoje = new Date();
  const data = hoje.toLocaleDateString("pt-BR", { day: "numeric", month: "long", year: "numeric" });
  const dia = hoje.toLocaleDateString("pt-BR", { weekday: "long" });
  document.getElementById("data-hoje").textContent = data;
  document.getElementById("dia-hoje").textContent = dia.charAt(0).toUpperCase() + dia.slice(1);
})();

// --- Sair (remove só a sessão desta aba) ---
document.getElementById("btn-sair").addEventListener("click", () => {
  confirmar("Deseja sair do sistema?", () => {
    if (SID) localStorage.removeItem("saykids_sess_" + SID);
    sessionStorage.removeItem("saykids_sessao");
    window.location.href = "index.html";
  }, { titulo: "Sair do sistema", confirmar: "Sair" });
});

// --- Menu mobile ---
const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("overlay");
document.getElementById("btn-menu").addEventListener("click", () => {
  sidebar.classList.add("open");
  overlay.classList.add("show");
});
overlay.addEventListener("click", () => {
  sidebar.classList.remove("open");
  overlay.classList.remove("show");
});

/* ===== Armazenamento de secretarias (localStorage) ===== */
const SECRETARIAS_PADRAO = [
  { nome: "Marina Costa", cpf: "123.456.789-00", email: "marina@saykids.com", telefone: "(11) 98888-4001", cep: "01310-000", rua: "Av. Paulista", bairro: "Bela Vista", numero: "1000", complemento: "", foto: "" },
  { nome: "Rafael Souza", cpf: "987.654.321-00", email: "rafael@saykids.com", telefone: "(11) 98888-4002", cep: "04567-010", rua: "Rua das Flores", bairro: "Vila Mariana", numero: "245", complemento: "Sala 2", foto: "" },
  { nome: "Beatriz Lima", cpf: "456.789.123-00", email: "beatriz@saykids.com", telefone: "(11) 98888-4003", cep: "02020-030", rua: "Rua Verde", bairro: "Santana", numero: "58", complemento: "", foto: "" },
];
function getSecretarias() {
  const s = localStorage.getItem("saykids_secretarias");
  if (s === null) { localStorage.setItem("saykids_secretarias", JSON.stringify(SECRETARIAS_PADRAO)); return [...SECRETARIAS_PADRAO]; }
  try { return JSON.parse(s); } catch (e) { return [...SECRETARIAS_PADRAO]; }
}
function setSecretarias(arr) { localStorage.setItem("saykids_secretarias", JSON.stringify(arr)); }
function iniciais(nome) { return nome.trim().split(/\s+/).slice(0, 2).map((p) => p[0]).join("").toUpperCase(); }

const MAX_TURMAS_AUXILIAR = 2;

/* Regras de período das turmas (professor / auxiliar):
   - as turmas selecionadas devem ter períodos diferentes;
   - turma de período Integral só pode ser escolhida sozinha. */
function validarTurmasPeriodo(nomesTurmas) {
  return Regras.validarTurmasPeriodo(getTurmas().filter((t) => nomesTurmas.includes(t.nome)));
}
function checarTurmasLive(selector, alvo, max) {
  const marcadas = [...document.querySelectorAll(selector + ":checked")];
  if (marcadas.length > max) { alvo.checked = false; aviso(`No máximo ${max} turma(s).`); return; }
  const msg = validarTurmasPeriodo(marcadas.map((c) => c.value));
  if (msg) { alvo.checked = false; aviso(msg); }
}

/* ===== Armazenamento de turmas (localStorage) ===== */
const TURMAS_PADRAO = [
  { nome: "Berçário II", periodo: "Integral", faixa: "0 a 1 ano", capacidade: 8, sala: "Sala Azul", alunos: ["Ana Beatriz Souza", "Bernardo Lima"] },
  { nome: "Maternal I", periodo: "Matutino", faixa: "2 anos", capacidade: 12, sala: "Sala Verde", alunos: ["Cecília Rocha"] },
  { nome: "Maternal II A", periodo: "Vespertino", faixa: "3 anos", capacidade: 14, sala: "Sala Amarela", alunos: [] },
  { nome: "Jardim I", periodo: "Integral", faixa: "4 anos", capacidade: 16, sala: "Sala Laranja", alunos: ["Helena Martins", "Davi Fernandes"] },
  { nome: "Jardim II", periodo: "Matutino", faixa: "5 anos", capacidade: 15, sala: "Sala Vermelha", alunos: [] },
];
function getTurmas() {
  const s = localStorage.getItem("saykids_turmas");
  if (s === null) { localStorage.setItem("saykids_turmas", JSON.stringify(TURMAS_PADRAO)); return [...TURMAS_PADRAO]; }
  try { return JSON.parse(s); } catch (e) { return [...TURMAS_PADRAO]; }
}
function setTurmas(arr) { localStorage.setItem("saykids_turmas", JSON.stringify(arr)); }
/* Nomes das turmas cadastradas (para associar professores e auxiliares) */
function turmasDisponiveis() { return getTurmas().map((t) => t.nome); }

/* ===== Histórico de movimentações (localStorage) ===== */
const TIPOS_MOV = [
  "Cadastro de alunos", "Cadastro de professores", "Cadastro de colaboradores",
  "Cadastro de responsáveis", "Registro de frequência", "Cadastro de cardápio",
  "Cadastro de almoxarifado",
];
const MOVIMENTACOES_PADRAO = [
  { tipo: "Cadastro de alunos", descricao: "Novo aluno cadastrado: Lucas Pereira da Silva", data: "16/08/2025 10:30", usuario: "Administrador" },
  { tipo: "Cadastro de colaboradores", descricao: "Colaborador cadastrado: Ana Beatriz Souza (Auxiliar)", data: "16/08/2025 09:15", usuario: "Administrador" },
  { tipo: "Cadastro de professores", descricao: "Professor cadastrado: Juliana Alves", data: "15/08/2025 17:00", usuario: "Administrador" },
  { tipo: "Registro de frequência", descricao: "Frequência registrada — Maternal I", data: "15/08/2025 16:45", usuario: "Administrador" },
  { tipo: "Cadastro de cardápio", descricao: "Cardápio da semana atualizado", data: "15/08/2025 14:20", usuario: "Administrador" },
  { tipo: "Cadastro de responsáveis", descricao: "Responsável cadastrado: Maria Souza", data: "14/08/2025 11:10", usuario: "Administrador" },
  { tipo: "Cadastro de almoxarifado", descricao: "Item adicionado ao almoxarifado: Papel A4", data: "14/08/2025 09:00", usuario: "Administrador" },
];
function getMovimentacoes() {
  const s = localStorage.getItem("saykids_movimentacoes");
  if (s === null) { localStorage.setItem("saykids_movimentacoes", JSON.stringify(MOVIMENTACOES_PADRAO)); return [...MOVIMENTACOES_PADRAO]; }
  try { return JSON.parse(s); } catch (e) { return [...MOVIMENTACOES_PADRAO]; }
}
function setMovimentacoes(arr) { localStorage.setItem("saykids_movimentacoes", JSON.stringify(arr)); }

/* ===== Armazenamento de responsáveis (localStorage) ===== */
const RESPONSAVEIS_PADRAO = [
  { nome: "Maria Souza", cpf: "101.202.303-40", email: "maria@email.com", telefone: "(11) 98888-2001", cep: "01000-000", rua: "Rua das Acácias", bairro: "Centro", numero: "10", complemento: "" },
  { nome: "João Lima", cpf: "202.303.404-50", email: "joao@email.com", telefone: "(11) 98888-2002", cep: "02000-000", rua: "Rua Azul", bairro: "Santana", numero: "20", complemento: "Ap 12" },
  { nome: "Paula Rocha", cpf: "303.404.505-60", email: "paula@email.com", telefone: "(11) 98888-2003", cep: "03000-000", rua: "Rua Verde", bairro: "Tatuapé", numero: "30", complemento: "" },
  { nome: "Carla Fernandes", cpf: "404.505.606-70", email: "carla@email.com", telefone: "(11) 98888-2004", cep: "04000-000", rua: "Rua Amarela", bairro: "Mooca", numero: "40", complemento: "" },
  { nome: "Rafael Martins", cpf: "505.606.707-80", email: "rafael@email.com", telefone: "(11) 98888-2005", cep: "05000-000", rua: "Rua Branca", bairro: "Lapa", numero: "50", complemento: "Casa 2" },
  { nome: "Ana Paula Dias", cpf: "606.707.808-90", email: "anapaula@email.com", telefone: "(11) 98888-2006", cep: "06000-000", rua: "Rua Rosa", bairro: "Pinheiros", numero: "60", complemento: "" },
];
function getResponsaveis() {
  const s = localStorage.getItem("saykids_responsaveis");
  if (s === null) { localStorage.setItem("saykids_responsaveis", JSON.stringify(RESPONSAVEIS_PADRAO)); return [...RESPONSAVEIS_PADRAO]; }
  try { return JSON.parse(s); } catch (e) { return [...RESPONSAVEIS_PADRAO]; }
}
function setResponsaveis(arr) { localStorage.setItem("saykids_responsaveis", JSON.stringify(arr)); }
function responsaveisNomes() { return getResponsaveis().map((r) => r.nome); }

/* ===== Documentos e emissões (localStorage) ===== */
const DOCUMENTOS_PADRAO = [
  { nome: "Declaração de Matrícula", descricao: "Comprova a matrícula do aluno na escola." },
  { nome: "Declaração de Frequência", descricao: "Comprova a frequência do aluno." },
  { nome: "Ficha do Aluno", descricao: "Ficha com os dados cadastrais do aluno." },
];
function getDocumentos() {
  const s = localStorage.getItem("saykids_documentos");
  if (s === null) { localStorage.setItem("saykids_documentos", JSON.stringify(DOCUMENTOS_PADRAO)); return [...DOCUMENTOS_PADRAO]; }
  try { return JSON.parse(s); } catch (e) { return [...DOCUMENTOS_PADRAO]; }
}
function setDocumentos(arr) { localStorage.setItem("saykids_documentos", JSON.stringify(arr)); }
function documentosNomes() { return getDocumentos().map((d) => d.nome); }
function getEmissoes() {
  const s = localStorage.getItem("saykids_emissoes");
  try { return s ? JSON.parse(s) : []; } catch (e) { return []; }
}
function setEmissoes(arr) { localStorage.setItem("saykids_emissoes", JSON.stringify(arr)); }

/* ===== Agenda diária dos alunos (localStorage) ===== */
function getAgenda() {
  const s = localStorage.getItem("saykids_agenda");
  try { return s ? JSON.parse(s) : {}; } catch (e) { return {}; }
}
function setAgenda(obj) { localStorage.setItem("saykids_agenda", JSON.stringify(obj)); }
function chaveAgenda(aluno, data) { return aluno + "||" + data; }
/* Turmas do usuário logado (professor ou auxiliar) */
function turmasDoUsuario() {
  const email = ((sessao && sessao.email) || "").toLowerCase();
  if (sessao && sessao.perfil === "professor") {
    const p = getProfessores().find((x) => (x.email || "").toLowerCase() === email);
    return p ? (p.turmas || []) : turmasDisponiveis();
  }
  if (sessao && sessao.perfil === "auxiliar") {
    const c = getColaboradores().find((x) => (x.email || "").toLowerCase() === email && x.funcao === "Auxiliar");
    return c ? (c.turmas || []) : turmasDisponiveis();
  }
  return turmasDisponiveis();
}
function alunosDasTurmas(turmasNomes) {
  const alunos = [];
  getTurmas().filter((t) => turmasNomes.includes(t.nome)).forEach((t) => {
    (t.alunos || []).forEach((a) => { if (!alunos.includes(a)) alunos.push(a); });
  });
  return alunos;
}

/* ===== Estoque (almoxarife) ===== */
const ESTOQUE_PADRAO = [
  { nome: "Arroz", categoria: "Alimento", quantidade: 20, unidade: "kg", validade: "2026-12-31" },
  { nome: "Leite", categoria: "Alimento", quantidade: 30, unidade: "L", validade: "2026-09-30" },
  { nome: "Papel toalha", categoria: "Higiene", quantidade: 50, unidade: "un", validade: "" },
];
function getEstoque() {
  const s = localStorage.getItem("saykids_estoque");
  if (s === null) { localStorage.setItem("saykids_estoque", JSON.stringify(ESTOQUE_PADRAO)); return [...ESTOQUE_PADRAO]; }
  try { return JSON.parse(s); } catch (e) { return [...ESTOQUE_PADRAO]; }
}
function setEstoque(arr) { localStorage.setItem("saykids_estoque", JSON.stringify(arr)); }
function getRetiradas() {
  const s = localStorage.getItem("saykids_retiradas");
  try { return s ? JSON.parse(s) : []; } catch (e) { return []; }
}
function setRetiradas(arr) { localStorage.setItem("saykids_retiradas", JSON.stringify(arr)); }

/* ===== Frequência (porteiro / QR Code) ===== */
function getFrequencia() {
  const s = localStorage.getItem("saykids_frequencia");
  try { return s ? JSON.parse(s) : []; } catch (e) { return []; }
}
function setFrequencia(arr) { localStorage.setItem("saykids_frequencia", JSON.stringify(arr)); }
function getNotificacoes() { const s = localStorage.getItem("saykids_notificacoes"); try { return s ? JSON.parse(s) : []; } catch (e) { return []; } }
function setNotificacoes(arr) { localStorage.setItem("saykids_notificacoes", JSON.stringify(arr)); }
/* Recados: o responsável escreve e aparece para professor/auxiliar (sem resposta) */
function getRecados() { const s = localStorage.getItem("saykids_recados"); try { return s ? JSON.parse(s) : []; } catch (e) { return []; } }
function setRecados(arr) { localStorage.setItem("saykids_recados", JSON.stringify(arr)); }
function recadosDoAluno(nome) { return getRecados().filter((r) => r.aluno === nome); }

/* ---------------------------------------------------------------------
   Renomear SEM perder vínculos: quando o nome de um aluno, responsável
   ou turma muda, atualiza TODOS os lugares que apontam para aquele nome.
   Assim nenhum vínculo (filhos, turmas, agenda, recados, etc.) se perde.
   --------------------------------------------------------------------- */
function renomearVinculos(tipo, antigo, novo) {
  if (!antigo || !novo || antigo === novo) return;
  var trocar = function (arr) { return arr.map(function (n) { return n === antigo ? novo : n; }); };

  if (tipo === "aluno") {
    var turmas = getTurmas(), m = false;
    turmas.forEach(function (t) { if (t.alunos && t.alunos.indexOf(antigo) > -1) { t.alunos = trocar(t.alunos); m = true; } });
    if (m) setTurmas(turmas);

    var rec = getRecados(), m2 = false;
    rec.forEach(function (r) { if (r.aluno === antigo) { r.aluno = novo; m2 = true; } });
    if (m2) setRecados(rec);

    var fr = getFrequencia(), m3 = false;
    fr.forEach(function (f) { if (f.pessoa === antigo) { f.pessoa = novo; m3 = true; } });
    if (m3) setFrequencia(fr);

    var em = getEmissoes(), m4 = false;
    em.forEach(function (x) { if (x.aluno === antigo) { x.aluno = novo; m4 = true; } });
    if (m4) setEmissoes(em);

    var nt = getNotificacoes(), m5 = false;
    nt.forEach(function (n) { if (n.aluno === antigo) { n.aluno = novo; m5 = true; } });
    if (m5) setNotificacoes(nt);

    // Agenda é indexada por "aluno||data" -> renomeia essas chaves
    var ag = getAgenda(), m6 = false;
    Object.keys(ag).forEach(function (k) {
      var sep = k.indexOf("||");
      if (sep > -1 && k.slice(0, sep) === antigo) { ag[novo + k.slice(sep)] = ag[k]; delete ag[k]; m6 = true; }
    });
    if (m6) setAgenda(ag);
  }

  else if (tipo === "responsavel") {
    var alunos = getAlunos(), r1 = false;
    alunos.forEach(function (a) { if (a.responsaveis && a.responsaveis.indexOf(antigo) > -1) { a.responsaveis = trocar(a.responsaveis); r1 = true; } });
    if (r1) setAlunos(alunos);

    var rc = getRecados(), r2 = false;
    rc.forEach(function (r) { if (r.autor === antigo) { r.autor = novo; r2 = true; } });
    if (r2) setRecados(rc);

    var n2 = getNotificacoes(), r3 = false;
    n2.forEach(function (n) { if (n.responsavel === antigo) { n.responsavel = novo; r3 = true; } });
    if (r3) setNotificacoes(n2);
  }

  else if (tipo === "turma") {
    var profs = getProfessores(), t1 = false;
    profs.forEach(function (p) { if (p.turmas && p.turmas.indexOf(antigo) > -1) { p.turmas = trocar(p.turmas); t1 = true; } });
    if (t1) setProfessores(profs);

    var cols = getColaboradores(), t2 = false;
    cols.forEach(function (c) { if (c.turmas && c.turmas.indexOf(antigo) > -1) { c.turmas = trocar(c.turmas); t2 = true; } });
    if (t2) setColaboradores(cols);

    var cds = getCardapios(), t3 = false;
    cds.forEach(function (c) { if (c.turma === antigo) { c.turma = novo; t3 = true; } });
    if (t3) setCardapios(cds);
  }
}
/* Data do recado em formato ISO (AAAA-MM-DD), a partir do dataISO ou da data BR */
function recadoISO(r) { return Regras.recadoISO(r); }
/* RF-09: cria notificação aos responsáveis do aluno ao registrar entrada/saída */
function notificarResponsaveis(alunoNome, tipo, hora, data) {
  const aluno = getAlunos().find((a) => a.nome === alunoNome);
  if (!aluno || !aluno.responsaveis || !aluno.responsaveis.length) return;
  const notis = getNotificacoes();
  aluno.responsaveis.forEach((resp) => {
    notis.unshift({ responsavel: resp, aluno: alunoNome, tipo, data, hora,
      mensagem: `${tipo} de ${alunoNome} registrada às ${hora}.`, status: "enviada" });
  });
  setNotificacoes(notis);
}

/* ===== Cardápios (localStorage) ===== */
const MESES = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
const DIAS_SEMANA = ["SEGUNDA", "TERÇA", "QUARTA", "QUINTA", "SEXTA"];
const CARDAPIO_DIA_PADRAO = "Lanche:&nbsp;<br>Almoço / Jantar:&nbsp;";
function getCardapios() {
  const s = localStorage.getItem("saykids_cardapios");
  try { return s ? JSON.parse(s) : []; } catch (e) { return []; }
}
function setCardapios(arr) { localStorage.setItem("saykids_cardapios", JSON.stringify(arr)); }
function getListaCompra() { const s = localStorage.getItem("saykids_listacompra"); try { return s ? JSON.parse(s) : []; } catch (e) { return []; } }
function setListaCompra(arr) { localStorage.setItem("saykids_listacompra", JSON.stringify(arr)); }
function getAlertas() { const s = localStorage.getItem("saykids_alertas"); try { return s ? JSON.parse(s) : []; } catch (e) { return []; } }
function setAlertas(arr) { localStorage.setItem("saykids_alertas", JSON.stringify(arr)); }
function getReposicoes() { const s = localStorage.getItem("saykids_reposicoes"); try { return s ? JSON.parse(s) : []; } catch (e) { return []; } }
function setReposicoes(arr) { localStorage.setItem("saykids_reposicoes", JSON.stringify(arr)); }
/* Repõe o estoque a partir de um item da lista de compra */
function reporEstoque(i, qtd, entrada, venc) {
  const lista = getListaCompra();
  const item = lista[i];
  if (!item) return;
  const estoque = getEstoque();
  const it = estoque.find((e) => e.nome.toLowerCase() === (item.alimento || "").toLowerCase());
  if (it) { it.quantidade = (Number(it.quantidade) || 0) + qtd; if (venc) it.validade = venc; }
  else { estoque.push({ nome: item.alimento, categoria: "Alimento", quantidade: qtd, unidade: item.unidade || "", validade: venc || "" }); }
  setEstoque(estoque);
  const reps = getReposicoes();
  reps.unshift({ item: item.alimento, quantidade: qtd, unidade: item.unidade || "", data_entrada: entrada, data_vencimento: venc || "", data_registro: new Date().toLocaleDateString("pt-BR") });
  setReposicoes(reps);
  item.status = "Reposto";
  setListaCompra(lista);
}

/* RF-15: verifica restrições dos alunos da turma contra os alimentos do cardápio */
function verificarRestricoes(turmaNome, itens) {
  const alunos = getAlunos().filter((a) => turmaDoAluno(a.nome) === turmaNome)
    .map((a) => ({ nome: a.nome, restricoes: restricoesLista(a) }));
  return Regras.verificarRestricoes(alunos, itens);
}
/* RF-14: verifica se há estoque suficiente para os alimentos do cardápio */
function verificarEstoque(itens) {
  return Regras.verificarEstoque(itens, getEstoque());
}
function alimentosEstoqueNomes() { return getEstoque().map((e) => e.nome); }
/* Texto "limpo" (sem tags/nbsp) para comparar conteúdo de dias */
function textoLimpo(html) {
  return (html || "").replace(/<[^>]*>/g, " ").replace(/&nbsp;/gi, " ").replace(/\s+/g, " ").trim();
}
const CARDAPIO_PADRAO_LIMPO = "Lanche: Almoço / Jantar:";
function diaPreenchido(html) {
  const t = textoLimpo(html);
  return t !== "" && t !== CARDAPIO_PADRAO_LIMPO;
}

/* Catálogo de campos automáticos: define "de onde cada etiqueta puxa" */
function turmaDoAluno(nome) {
  const t = getTurmas().find((x) => (x.alunos || []).includes(nome));
  return t ? t.nome : "";
}
function respDoAluno(a) {
  const nome = (a.responsaveis && a.responsaveis[0]) || "";
  return getResponsaveis().find((x) => x.nome === nome) || {};
}
const CATALOGO_CAMPOS = [
  { etiqueta: "Nome do aluno", valor: (a) => a.nome || "" },
  { etiqueta: "Número de matrícula", valor: (a) => a.matricula || "" },
  { etiqueta: "RA do aluno", valor: (a) => a.ra || "" },
  { etiqueta: "CPF do aluno", valor: (a) => a.cpf || "" },
  { etiqueta: "Data de nascimento do aluno", valor: (a) => a.data_nascimento ? dataBR(a.data_nascimento) : "" },
  { etiqueta: "Endereço do aluno", valor: (a) => [a.rua, a.numero, a.bairro].filter(Boolean).join(", ") },
  { etiqueta: "Rua do aluno", valor: (a) => a.rua || "" },
  { etiqueta: "Bairro do aluno", valor: (a) => a.bairro || "" },
  { etiqueta: "Número do aluno", valor: (a) => a.numero || "" },
  { etiqueta: "Complemento do aluno", valor: (a) => a.complemento || "" },
  { etiqueta: "CEP do aluno", valor: (a) => a.cep || "" },
  { etiqueta: "Turma", valor: (a) => turmaDoAluno(a.nome) },
  { etiqueta: "Período da turma", valor: (a) => { const t = getTurmas().find((x) => x.nome === turmaDoAluno(a.nome)); return t ? (t.periodo || "") : ""; } },
  { etiqueta: "Nome do responsável", valor: (a) => respDoAluno(a).nome || "" },
  { etiqueta: "Documento do responsável", valor: (a) => respDoAluno(a).cpf || "" },
  { etiqueta: "Telefone do responsável", valor: (a) => respDoAluno(a).telefone || "" },
  { etiqueta: "Restrições alimentares", valor: (a) => restricoesTexto(a) },
  { etiqueta: "Data de hoje", valor: () => new Date().toLocaleDateString("pt-BR") },
  { etiqueta: "Nome da escola", valor: () => "Say Kids" },
];
function preencherTexto(texto, aluno, manuais) {
  manuais = manuais || {};
  return (texto || "").replace(/<<\s*([^>]+?)\s*>>/g, (m, nome) => {
    const chave = nome.trim();
    const c = CATALOGO_CAMPOS.find((x) => x.etiqueta.toLowerCase() === chave.toLowerCase());
    if (c) return c.valor(aluno) || "";
    const k = chave.toLowerCase();
    if (Object.prototype.hasOwnProperty.call(manuais, k)) return manuais[k] || "";
    return m; // campo não reconhecido e não preenchido: mantém a etiqueta
  });
}
/* Campos que NÃO estão no catálogo (serão preenchidos à mão na emissão) */
function camposDesconhecidos(texto) {
  const tags = [...(texto || "").matchAll(/<<\s*([^>]+?)\s*>>/g)].map((x) => x[1].trim());
  const catalogo = CATALOGO_CAMPOS.map((c) => c.etiqueta.toLowerCase());
  const vistos = new Set();
  const out = [];
  for (const t of tags) {
    const kl = t.toLowerCase();
    if (!catalogo.includes(kl) && !vistos.has(kl)) { vistos.add(kl); out.push(t); }
  }
  return out;
}

/* ===== Armazenamento de alunos (localStorage) ===== */
const NOMES_ALUNOS = [
  "Ana Beatriz Souza", "Bernardo Lima", "Cecília Rocha", "Davi Fernandes",
  "Helena Martins", "Lucas Pereira da Silva", "Sophia Andrade", "Cauã Ribeiro",
  "Isabella Gomes", "Miguel Santos", "Laura Cardoso", "Théo Nogueira",
  "Manuela Freitas", "Heitor Barbosa", "Alice Monteiro", "Enzo Carvalho",
];
function alunoVazio(nome) {
  return { nome, cpf: "", data_nascimento: "", ra: "", matricula: "", cep: "", rua: "", bairro: "", numero: "", complemento: "", responsaveis: [], restricoes: [], informacoes_medicas: "", emergencia: [], autorizados: [], qr_code: "" };
}
/* Restrições podem vir como texto (dados antigos) ou lista [{alimento,gravidade}] */
function restricoesLista(a) {
  if (Array.isArray(a.restricoes)) return a.restricoes;
  if (a.restricoes && String(a.restricoes).trim()) return String(a.restricoes).split(",").map((s) => ({ alimento: s.trim(), gravidade: "" })).filter((r) => r.alimento);
  return [];
}
function restricoesTexto(a) { return restricoesLista(a).map((r) => r.alimento).filter(Boolean).join(", "); }
function alunoTemRestricao(a) { return restricoesTexto(a).trim().length > 0; }
function gerarQRCode() { return "SK-" + Date.now().toString(36).toUpperCase() + "-" + Math.floor(1000 + Math.random() * 9000); }
function gerarMatricula() { return String(new Date().getFullYear()) + String(Date.now()).slice(-6); }
function getAlunos() {
  const s = localStorage.getItem("saykids_alunos");
  if (s === null) {
    const padrao = NOMES_ALUNOS.map(alunoVazio);
    localStorage.setItem("saykids_alunos", JSON.stringify(padrao));
    return padrao;
  }
  try { return JSON.parse(s); } catch (e) { return NOMES_ALUNOS.map(alunoVazio); }
}
function setAlunos(arr) { localStorage.setItem("saykids_alunos", JSON.stringify(arr)); }
function alunosNomes() { return getAlunos().map((a) => a.nome); }

/* ===== Busca fonética (aproxima nomes que soam parecido) ===== */
function fonKey(w) {
  w = w.replace(/ph/g, "f");
  w = w.replace(/qu/g, "k").replace(/gu(?=[ei])/g, "g");
  w = w.replace(/ch/g, "x");
  w = w.replace(/lh/g, "l").replace(/nh/g, "n");
  w = w.replace(/c(?=[eiy])/g, "s").replace(/ç/g, "s").replace(/c/g, "k");
  w = w.replace(/g(?=[ei])/g, "j");
  w = w.replace(/ss/g, "s").replace(/sc/g, "s").replace(/z/g, "s");
  w = w.replace(/y/g, "i").replace(/w/g, "v").replace(/h/g, "");
  w = w.replace(/(.)\1+/g, "$1");
  return w;
}
function fonetica(s) {
  s = (s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  s = s.replace(/[^a-z\s]/g, "").replace(/\s+/g, " ").trim();
  return s.split(" ").map(fonKey).join("");
}
function buscaFonetica(fonte, query, jaAssociados) {
  const qk = fonetica(query);
  if (!qk) return [];
  return fonte.filter((n) => !jaAssociados.includes(n) && fonetica(n).includes(qk));
}
function alunosEncontrados(query, ja) { return buscaFonetica(alunosNomes(), query, ja); }
function responsaveisEncontrados(query, ja) { return buscaFonetica(responsaveisNomes(), query, ja); }

/* ===== Armazenamento de colaboradores (localStorage) ===== */
const COLABORADORES_PADRAO = [
  { nome: "Ana Beatriz Souza", cpf: "111.222.333-44", email: "ana@saykids.com", telefone: "(11) 99999-3001", cep: "01000-000", rua: "Rua A", bairro: "Centro", numero: "10", complemento: "", funcao: "Auxiliar", turmas: ["Maternal I"], foto: "" },
  { nome: "Roberto Alves", cpf: "222.333.444-55", email: "roberto@saykids.com", telefone: "(11) 99999-3002", cep: "02000-000", rua: "Rua B", bairro: "Santana", numero: "20", complemento: "", funcao: "Porteiro", turmas: [], foto: "" },
  { nome: "Márcia Gomes", cpf: "333.444.555-66", email: "marcia@saykids.com", telefone: "(11) 99999-3003", cep: "03000-000", rua: "Rua C", bairro: "Tatuapé", numero: "30", complemento: "", funcao: "Almoxarife", turmas: [], foto: "" },
];
function getColaboradores() {
  const s = localStorage.getItem("saykids_colaboradores");
  if (s === null) { localStorage.setItem("saykids_colaboradores", JSON.stringify(COLABORADORES_PADRAO)); return [...COLABORADORES_PADRAO]; }
  try { return JSON.parse(s); } catch (e) { return [...COLABORADORES_PADRAO]; }
}
function setColaboradores(arr) { localStorage.setItem("saykids_colaboradores", JSON.stringify(arr)); }

/* ===== Armazenamento de professores (localStorage) ===== */
const PROFESSORES_PADRAO = [
  { nome: "Juliana Alves", cpf: "444.555.666-77", email: "juliana@saykids.com", telefone: "(11) 99999-1001", cep: "01000-000", rua: "Rua das Palmeiras", bairro: "Centro", numero: "100", complemento: "", turmas: ["Berçário II"], foto: "" },
  { nome: "Fernanda Dias", cpf: "555.666.777-88", email: "fernanda@saykids.com", telefone: "(11) 99999-1002", cep: "02000-000", rua: "Rua Azul", bairro: "Santana", numero: "200", complemento: "Bloco B", turmas: ["Maternal I"], foto: "" },
  { nome: "Camila Prado", cpf: "666.777.888-99", email: "camila@saykids.com", telefone: "(11) 99999-1004", cep: "03000-000", rua: "Rua Verde", bairro: "Tatuapé", numero: "40", complemento: "", turmas: ["Jardim I", "Jardim II"], foto: "" },
];
function getProfessores() {
  const s = localStorage.getItem("saykids_professores");
  if (s === null) { localStorage.setItem("saykids_professores", JSON.stringify(PROFESSORES_PADRAO)); return [...PROFESSORES_PADRAO]; }
  try { return JSON.parse(s); } catch (e) { return [...PROFESSORES_PADRAO]; }
}
function setProfessores(arr) { localStorage.setItem("saykids_professores", JSON.stringify(arr)); }

/* ===== Páginas ===== */
function tabela(cabecalhos, linhas) {
  const ths = cabecalhos.map((c) => `<th>${c}</th>`).join("");
  const trs = linhas.map((l) => `<tr>${l.map((v) => `<td>${v}</td>`).join("")}</tr>`).join("");
  return `<table><thead><tr>${ths}</tr></thead><tbody>${trs}</tbody></table>`;
}
function paginaLista(titulo, botao, cabecalhos, linhas) {
  return `
    <div class="panel">
      <div class="lista-head">
        <h2>${titulo}</h2>
        <button class="btn" onclick="aviso('Formulário de cadastro — a ser integrado ao servidor.')">+ ${botao}</button>
      </div>
      ${tabela(cabecalhos, linhas)}
    </div>`;
}

/* ----- Secretaria: LISTA ----- */
function paginaSecretaria() {
  const lista = getSecretarias();
  const linhas = lista.map((s, i) => `
    <tr>
      <td><div class="cell-nome">
        <span class="sec-avatar">${s.foto ? `<img src="${s.foto}" alt="">` : iniciais(s.nome)}</span>
        ${s.nome}
      </div></td>
      <td>${s.cpf}</td>
      <td>${s.email}</td>
      <td>${s.telefone}</td>
      <td><div class="acoes-cell">
        <button class="btn-icone editar" data-edit="${i}" data-store="sec" title="Editar">${ic("edit", COR.azul)}</button>
        <button class="btn-icone" data-del="${i}" data-store="sec" title="Excluir">${ic("trash", "#ef4444")}</button>
      </div></td>
    </tr>`).join("");

  const corpo = lista.length
    ? `<table><thead><tr><th>Nome</th><th>CPF</th><th>E-mail</th><th>Telefone</th><th></th></tr></thead><tbody>${linhas}</tbody></table>`
    : `<div class="empty"><div class="big">${ic("school", "#9aa7b8")}</div><h2>Nenhuma secretaria cadastrada</h2><p style="margin-top:8px">Clique em "Cadastrar secretaria" para adicionar o primeiro acesso.</p></div>`;

  return `
    <div class="page-head">
      <div class="ph-left">
        <div><div class="ph-title">Secretaria</div><div class="ph-sub">Usuários com acesso de login da secretaria</div></div>
      </div>
      <button class="btn-laranja" data-form="secretaria">${ic("plus", "#fff")} Cadastrar secretaria</button>
    </div>
    <div class="panel">${corpo}</div>`;
}

/* ----- Secretaria: FORMULÁRIO ----- */
function campo(label, obrig, icone, tipo, id, placeholder, value) {
  return `
    <div class="campo">
      <label for="${id}">${label}${obrig ? '<span class="obrig">*</span>' : ""}</label>
      <div class="inp">${ic(icone, "#9aa7b8")}
        <input type="${tipo}" id="${id}" name="${id}" placeholder="${placeholder}" value="${esc(value)}" ${obrig ? "required" : ""} />
      </div>
    </div>`;
}
function campoSelect(label, obrig, icone, id, opcoes, selecionado) {
  const ops = [`<option value="" disabled ${selecionado ? "" : "selected"}>Selecione</option>`]
    .concat(opcoes.map((o) => `<option value="${o}" ${o === selecionado ? "selected" : ""}>${o}</option>`)).join("");
  return `
    <div class="campo">
      <label for="${id}">${label}${obrig ? '<span class="obrig">*</span>' : ""}</label>
      <div class="inp">${ic(icone, "#9aa7b8")}
        <select id="${id}" name="${id}" ${obrig ? "required" : ""}>${ops}</select>
      </div>
    </div>`;
}
function fotoCol(titulo, fotoExistente) {
  const inner = fotoExistente
    ? `<img class="preview" src="${fotoExistente}" alt="Foto">`
    : `<div class="foto-cam">${ic("camera", COR.azul)}</div>
       <div class="fb-main">Clique para adicionar foto</div>
       <div class="fb-sub">PNG, JPG ou JPEG<br>até 2MB</div>`;
  return `
    <div class="foto-col">
      <div class="bloco-titulo">${titulo}</div>
      <div class="foto-box" id="foto-box" data-foto-trigger>
        <div id="foto-conteudo">${inner}</div>
      </div>
      <input type="file" id="foto-input" accept="image/png,image/jpeg" hidden />
    </div>`;
}

function formSecretaria() {
  const editando = editSecIdx != null;
  const d = editando ? getSecretarias()[editSecIdx] : {};
  fotoDataUrl = d.foto || "";
  return `
    <div class="page-head">
      <div class="ph-left">
        <button class="back-btn" data-goto="${voltar("secretaria")}" title="Voltar">${ic("arrowLeft", COR.azul)}</button>
        <div><div class="ph-title">${editando ? "Editar" : "Cadastrar"} Secretaria</div><div class="ph-sub">${editando ? "Altere os dados do usuário da secretaria." : "Preencha os dados para cadastrar um novo usuário da secretaria."}</div></div>
      </div>
    </div>

    <form id="form-secretaria">
      <div class="form-solo">
        <div class="form-card">
          <div class="form-grid">
            ${fotoCol("Foto da secretaria", d.foto)}
            <div class="campos">
              <div class="bloco-titulo">Dados pessoais</div>
              <div class="linha c3">
                ${campo("Nome", true, "userline", "text", "f-nome", "Digite o nome completo", d.nome)}
                ${campo("CPF", true, "idcard", "text", "f-cpf", "000.000.000-00", d.cpf)}
                ${campo("E-mail", true, "mail", "email", "f-email", "exemplo@email.com", d.email)}
              </div>
              <div class="linha c2">
                ${campo("Telefone", true, "phone", "text", "f-telefone", "(00) 00000-0000", d.telefone)}
                ${campo("CEP", true, "location", "text", "f-cep", "00000-000", d.cep)}
              </div>
              <div class="linha">
                ${campo("Rua", true, "map", "text", "f-rua", "Digite o nome da rua", d.rua)}
              </div>
              <div class="linha c2">
                ${campo("Bairro", true, "building", "text", "f-bairro", "Digite o bairro", d.bairro)}
                ${campo("Número", true, "hash", "text", "f-numero", "Digite o número", d.numero)}
              </div>
              <div class="linha">
                ${campo("Complemento", false, "note", "text", "f-complemento", "Digite o complemento (opcional)", d.complemento)}
              </div>
            </div>
          </div>

          <div class="form-actions">
            <button type="button" class="btn-cancelar" data-goto="${voltar("secretaria")}">${ic("x", "currentColor")} Cancelar</button>
            <button type="submit" class="btn-salvar">${ic("save", "#fff")} Salvar secretaria</button>
          </div>
        </div>
      </div>
    </form>`;
}

/* ----- Colaboradores: LISTA ----- */
function paginaColaboradores() {
  const lista = getColaboradores();
  const linhas = lista.map((c, i) => `
    <tr>
      <td><div class="cell-nome">
        <span class="sec-avatar">${c.foto ? `<img src="${c.foto}" alt="">` : iniciais(c.nome)}</span>
        ${c.nome}
      </div></td>
      <td>${c.cpf}</td>
      <td><span class="tag-funcao ${c.funcao.toLowerCase()}">${c.funcao}</span></td>
      <td>${c.funcao === "Auxiliar" && c.turmas && c.turmas.length ? c.turmas.join(", ") : "—"}</td>
      <td>${c.email}</td>
      <td>${c.telefone}</td>
      <td><div class="acoes-cell">
        <button class="btn-icone editar" data-edit="${i}" data-store="col" title="Editar">${ic("edit", COR.azul)}</button>
        <button class="btn-icone" data-del="${i}" data-store="col" title="Excluir">${ic("trash", "#ef4444")}</button>
      </div></td>
    </tr>`).join("");

  const corpo = lista.length
    ? `<table><thead><tr><th>Nome</th><th>CPF</th><th>Função</th><th>Turmas</th><th>E-mail</th><th>Telefone</th><th></th></tr></thead><tbody>${linhas}</tbody></table>`
    : `<div class="empty"><div class="big">${ic("users", "#9aa7b8")}</div><h2>Nenhum colaborador cadastrado</h2><p style="margin-top:8px">Clique em "Cadastrar colaborador" para adicionar o primeiro acesso.</p></div>`;

  return `
    <div class="page-head">
      <div class="ph-left">
        <div><div class="ph-title">Colaboradores</div><div class="ph-sub">Usuários com acesso de login de colaborador</div></div>
      </div>
      <button class="btn-laranja" data-form="colaborador">${ic("plus", "#fff")} Cadastrar colaborador</button>
    </div>
    <div class="panel">${corpo}</div>`;
}

/* ----- Colaboradores: FORMULÁRIO ----- */
function formColaborador() {
  const editando = editColIdx != null;
  const d = editando ? getColaboradores()[editColIdx] : {};
  fotoDataUrl = d.foto || "";
  const turmasSel = d.turmas || [];
  const auxiliar = d.funcao === "Auxiliar";
  const chips = getTurmas().map((t) =>
    `<label class="turma-chip"><input type="checkbox" name="turma" value="${t.nome}" ${turmasSel.includes(t.nome) ? "checked" : ""}><span>${t.nome} <small style="opacity:.65">(${t.periodo || "—"})</small></span></label>`).join("");
  return `
    <div class="page-head">
      <div class="ph-left">
        <button class="back-btn" data-goto="${voltar("colaboradores")}" title="Voltar">${ic("arrowLeft", COR.azul)}</button>
        <div><div class="ph-title">${editando ? "Editar" : "Cadastrar"} Colaborador</div><div class="ph-sub">${editando ? "Altere os dados do colaborador." : "Preencha os dados para cadastrar um novo colaborador."}</div></div>
      </div>
    </div>

    <form id="form-colaborador">
      <div class="form-solo">
        <div class="form-card">
          <div class="form-grid">
            ${fotoCol("Foto do colaborador", d.foto)}
            <div class="campos">
              <div class="bloco-titulo">Dados pessoais</div>
              <div class="linha c3">
                ${campo("Nome", true, "userline", "text", "f-nome", "Digite o nome completo", d.nome)}
                ${campo("CPF", true, "idcard", "text", "f-cpf", "000.000.000-00", d.cpf)}
                ${campo("E-mail", true, "mail", "email", "f-email", "exemplo@email.com", d.email)}
              </div>
              <div class="linha c2">
                ${campo("Telefone", true, "phone", "text", "f-telefone", "(00) 00000-0000", d.telefone)}
                ${campo("CEP", true, "location", "text", "f-cep", "00000-000", d.cep)}
              </div>
              <div class="linha">
                ${campo("Rua", true, "map", "text", "f-rua", "Digite o nome da rua", d.rua)}
              </div>
              <div class="linha c2">
                ${campo("Bairro", true, "building", "text", "f-bairro", "Digite o bairro", d.bairro)}
                ${campo("Número", true, "hash", "text", "f-numero", "Digite o número", d.numero)}
              </div>
              <div class="linha c2">
                ${campo("Complemento", false, "note", "text", "f-complemento", "Digite o complemento (opcional)", d.complemento)}
                ${campoSelect("Função", true, "users", "f-funcao", ["Porteiro", "Auxiliar", "Almoxarife"], d.funcao)}
              </div>

              <div class="linha" id="bloco-turmas" style="display:${auxiliar ? "" : "none"}">
                <div class="campo">
                  <label>Turmas do auxiliar <span class="obrig">*</span> <span class="hint-max">(máx. ${MAX_TURMAS_AUXILIAR}, períodos diferentes; Integral só sozinha)</span></label>
                  <div class="turmas-grid">${chips}</div>
                </div>
              </div>
            </div>
          </div>

          <div class="form-actions">
            <button type="button" class="btn-cancelar" data-goto="${voltar("colaboradores")}">${ic("x", "currentColor")} Cancelar</button>
            <button type="submit" class="btn-salvar">${ic("save", "#fff")} Salvar colaborador</button>
          </div>
        </div>
      </div>
    </form>`;
}

/* ----- Professores: LISTA ----- */
function paginaProfessores() {
  const lista = getProfessores();
  const linhas = lista.map((p, i) => `
    <tr>
      <td><div class="cell-nome">
        <span class="sec-avatar">${p.foto ? `<img src="${p.foto}" alt="">` : iniciais(p.nome)}</span>
        ${p.nome}
      </div></td>
      <td>${p.cpf}</td>
      <td>${p.turmas && p.turmas.length ? p.turmas.join(", ") : "—"}</td>
      <td>${p.email}</td>
      <td>${p.telefone}</td>
      <td><div class="acoes-cell">
        <button class="btn-icone editar" data-edit="${i}" data-store="prof" title="Editar">${ic("edit", COR.azul)}</button>
        <button class="btn-icone" data-del="${i}" data-store="prof" title="Excluir">${ic("trash", "#ef4444")}</button>
      </div></td>
    </tr>`).join("");

  const corpo = lista.length
    ? `<table><thead><tr><th>Nome</th><th>CPF</th><th>Turmas</th><th>E-mail</th><th>Telefone</th><th></th></tr></thead><tbody>${linhas}</tbody></table>`
    : `<div class="empty"><div class="big">${ic("cap", "#9aa7b8")}</div><h2>Nenhum professor cadastrado</h2><p style="margin-top:8px">Clique em "Cadastrar professor" para adicionar o primeiro acesso.</p></div>`;

  return `
    <div class="page-head">
      <div class="ph-left">
        <div><div class="ph-title">Professores</div><div class="ph-sub">Usuários com acesso de login de professor</div></div>
      </div>
      <button class="btn-laranja" data-form="professor">${ic("plus", "#fff")} Cadastrar professor</button>
    </div>
    <div class="panel">${corpo}</div>`;
}

/* ----- Professores: FORMULÁRIO ----- */
function formProfessor() {
  const editando = editProfIdx != null;
  const d = editando ? getProfessores()[editProfIdx] : {};
  fotoDataUrl = d.foto || "";
  const turmasSel = d.turmas || [];
  const chips = getTurmas().map((t) =>
    `<label class="turma-chip"><input type="checkbox" name="turma-prof" value="${t.nome}" ${turmasSel.includes(t.nome) ? "checked" : ""}><span>${t.nome} <small style="opacity:.65">(${t.periodo || "—"})</small></span></label>`).join("");
  return `
    <div class="page-head">
      <div class="ph-left">
        <button class="back-btn" data-goto="${voltar("professores")}" title="Voltar">${ic("arrowLeft", COR.azul)}</button>
        <div><div class="ph-title">${editando ? "Editar" : "Cadastrar"} Professor</div><div class="ph-sub">${editando ? "Altere os dados do professor." : "Preencha os dados para cadastrar um novo professor."}</div></div>
      </div>
    </div>

    <form id="form-professor">
      <div class="form-solo">
        <div class="form-card">
          <div class="form-grid">
            ${fotoCol("Foto do professor", d.foto)}
            <div class="campos">
              <div class="bloco-titulo">Dados pessoais</div>
              <div class="linha c3">
                ${campo("Nome", true, "userline", "text", "f-nome", "Digite o nome completo", d.nome)}
                ${campo("CPF", true, "idcard", "text", "f-cpf", "000.000.000-00", d.cpf)}
                ${campo("E-mail", true, "mail", "email", "f-email", "exemplo@email.com", d.email)}
              </div>
              <div class="linha c2">
                ${campo("Telefone", true, "phone", "text", "f-telefone", "(00) 00000-0000", d.telefone)}
                ${campo("CEP", true, "location", "text", "f-cep", "00000-000", d.cep)}
              </div>
              <div class="linha">
                ${campo("Rua", true, "map", "text", "f-rua", "Digite o nome da rua", d.rua)}
              </div>
              <div class="linha c2">
                ${campo("Bairro", true, "building", "text", "f-bairro", "Digite o bairro", d.bairro)}
                ${campo("Número", true, "hash", "text", "f-numero", "Digite o número", d.numero)}
              </div>
              <div class="linha">
                ${campo("Complemento", false, "note", "text", "f-complemento", "Digite o complemento (opcional)", d.complemento)}
              </div>
              <div class="linha">
                <div class="campo">
                  <label>Turmas <span class="obrig">*</span> <span class="hint-max">(máx. 2, períodos diferentes; Integral só sozinha)</span></label>
                  <div class="turmas-grid">${chips}</div>
                </div>
              </div>
            </div>
          </div>

          <div class="form-actions">
            <button type="button" class="btn-cancelar" data-goto="${voltar("professores")}">${ic("x", "currentColor")} Cancelar</button>
            <button type="submit" class="btn-salvar">${ic("save", "#fff")} Salvar professor</button>
          </div>
        </div>
      </div>
    </form>`;
}

/* ----- Turmas: LISTA ----- */
function paginaTurmas() {
  const lista = getTurmas();
  const linhas = lista.map((t, i) => `
    <tr>
      <td><div class="cell-nome"><span class="sec-avatar">${ic("tag", COR.laranja)}</span>${t.nome}</div></td>
      <td>${t.periodo}</td>
      <td>${t.faixa || "—"}</td>
      <td>${(t.alunos ? t.alunos.length : 0)} / ${t.capacidade}</td>
      <td>${t.sala}</td>
      <td><div class="acoes-cell">
        <button class="btn-icone editar" data-edit="${i}" data-store="turma" title="Editar">${ic("edit", COR.azul)}</button>
        <button class="btn-icone" data-del="${i}" data-store="turma" title="Excluir">${ic("trash", "#ef4444")}</button>
      </div></td>
    </tr>`).join("");

  const corpo = lista.length
    ? `<table><thead><tr><th>Turma</th><th>Período</th><th>Faixa etária</th><th>Alunos</th><th>Sala</th><th></th></tr></thead><tbody>${linhas}</tbody></table>`
    : `<div class="empty"><div class="big">${ic("tag", "#9aa7b8")}</div><h2>Nenhuma turma cadastrada</h2><p style="margin-top:8px">Clique em "Cadastrar turma" para criar a primeira.</p></div>`;

  return `
    <div class="page-head">
      <div class="ph-left">
        <div><div class="ph-title">Turmas</div><div class="ph-sub">Turmas cadastradas na escola</div></div>
      </div>
      <button class="btn-laranja" data-form="turma">${ic("plus", "#fff")} Cadastrar turma</button>
    </div>
    <div class="panel">${corpo}</div>`;
}

/* ----- Turmas: FORMULÁRIO ----- */
function formTurma() {
  const editando = editTurmaIdx != null;
  const d = editando ? getTurmas()[editTurmaIdx] : {};
  turmaAlunos = (d.alunos || []).slice();
  return `
    <div class="page-head">
      <div class="ph-left">
        <button class="back-btn" data-goto="turmas" title="Voltar">${ic("arrowLeft", COR.azul)}</button>
        <div><div class="ph-title">${editando ? "Editar" : "Cadastrar"} Turma</div><div class="ph-sub">${editando ? "Altere os dados da turma." : "Preencha os dados para cadastrar uma nova turma."}</div></div>
      </div>
    </div>

    <form id="form-turma">
      <div class="form-solo">
        <div class="form-card">
          <div class="bloco-titulo">Dados da turma</div>
          <div class="linha c3">
            ${campo("Nome", true, "tag", "text", "f-nome", "Ex.: Maternal II A", d.nome)}
            ${campoSelect("Período", true, "clock", "f-periodo", ["Matutino", "Vespertino", "Integral"], d.periodo)}
            ${campo("Faixa etária", true, "child", "text", "f-faixa", "Ex.: 3 anos", d.faixa)}
          </div>
          <div class="linha c2">
            ${campo("Capacidade máxima de alunos", true, "users", "number", "f-capacidade", "Ex.: 15", d.capacidade)}
            ${campo("Sala utilizada", true, "door", "text", "f-sala", "Ex.: Sala Azul", d.sala)}
          </div>

          <div class="linha">
            <div class="campo">
              <label>Alunos da turma <span class="hint-max">(pesquise o aluno pelo nome e associe)</span></label>
              <div class="inp busca-inp">${ic("search", "#9aa7b8")}
                <input type="text" id="busca-aluno" placeholder="Pesquisar aluno por nome..." autocomplete="off" />
              </div>
              <div class="busca-resultados" id="busca-resultados"></div>
              <div class="alunos-associados" id="alunos-associados"></div>
            </div>
          </div>

          <div class="form-actions">
            <button type="button" class="btn-cancelar" data-goto="turmas">${ic("x", "currentColor")} Cancelar</button>
            <button type="submit" class="btn-salvar">${ic("save", "#fff")} Salvar turma</button>
          </div>
        </div>
      </div>
    </form>`;
}
function renderBuscaResultados() {
  const inp = document.getElementById("busca-aluno");
  const box = document.getElementById("busca-resultados");
  if (!inp || !box) return;
  const q = inp.value;
  if (!q.trim()) { box.innerHTML = ""; return; }
  const res = alunosEncontrados(q, turmaAlunos).slice(0, 6);
  box.innerHTML = res.length
    ? res.map((n) => `<div class="res-item"><span>${n}</span><button type="button" class="btn-assoc" data-add-aluno="${esc(n)}">${ic("plus", COR.azul)} Associar</button></div>`).join("")
    : `<div class="res-vazio">Nenhum aluno encontrado para "${esc(q)}".</div>`;
}
function renderAlunosAssociados() {
  const box = document.getElementById("alunos-associados");
  if (!box) return;
  box.innerHTML = turmaAlunos.length
    ? turmaAlunos.map((n) => `<span class="aluno-chip">${n}<button type="button" data-rem-aluno="${esc(n)}" title="Remover">${ic("times", "#8a97a9")}</button></span>`).join("")
    : `<div class="assoc-vazio">Nenhum aluno associado ainda.</div>`;
}

/* ----- Histórico de movimentações ----- */
function paginaHistorico() {
  const lista = getMovimentacoes();
  const opcoesFiltro = ['<option value="Todos">Todos os tipos</option>']
    .concat(TIPOS_MOV.map((t) => `<option value="${t}" ${t === filtroHistorico ? "selected" : ""}>${t}</option>`)).join("");

  const filtrada = lista.map((m, i) => ({ m, i }))
    .filter((x) => filtroHistorico === "Todos" || x.m.tipo === filtroHistorico);

  const linhas = filtrada.map(({ m, i }) => `
    <tr>
      <td>${m.data}</td>
      <td><span class="tag-mov">${m.tipo}</span></td>
      <td>${m.descricao}</td>
      <td>${m.usuario || "—"}</td>
    </tr>`).join("");

  const corpo = filtrada.length
    ? `<table><thead><tr><th>Data/Hora</th><th>Tipo</th><th>Descrição</th><th>Usuário</th></tr></thead><tbody>${linhas}</tbody></table>`
    : `<div class="empty"><div class="big">${ic("history", "#9aa7b8")}</div><h2>Nenhuma movimentação encontrada</h2><p style="margin-top:8px">Não há registros para o filtro selecionado.</p></div>`;

  return `
    <div class="page-head">
      <div class="ph-left">
        <div><div class="ph-title">Histórico de movimentações</div><div class="ph-sub">Registro de alterações e acessos do sistema (somente leitura)</div></div>
      </div>
    </div>
    <div class="panel">
      <div class="filtro-bar">
        <span class="filtro-label">${ic("filter", "#7a8aa0")} Filtrar por movimentação</span>
        <div class="inp filtro-inp"><select id="filtro-historico">${opcoesFiltro}</select></div>
      </div>
      ${corpo}
    </div>`;
}
function formMovimentacao() {
  const editando = editMovIdx != null;
  const d = editando ? getMovimentacoes()[editMovIdx] : {};
  return `
    <div class="page-head">
      <div class="ph-left">
        <button class="back-btn" data-goto="historico" title="Voltar">${ic("arrowLeft", COR.azul)}</button>
        <div><div class="ph-title">${editando ? "Editar" : "Registrar"} Movimentação</div><div class="ph-sub">${editando ? "Altere os dados da movimentação." : "Registre uma nova movimentação no histórico."}</div></div>
      </div>
    </div>

    <form id="form-movimentacao">
      <div class="form-solo">
        <div class="form-card">
          <div class="bloco-titulo">Dados da movimentação</div>
          <div class="linha c2">
            ${campoSelect("Tipo de movimentação", true, "tag", "f-tipo", TIPOS_MOV, d.tipo)}
            ${campo("Data/Hora", true, "clock", "text", "f-data", "dd/mm/aaaa hh:mm", d.data)}
          </div>
          <div class="linha">
            ${campo("Descrição", true, "note", "text", "f-descricao", "Descreva a movimentação", d.descricao)}
          </div>
          <div class="form-actions">
            <button type="button" class="btn-cancelar" data-goto="historico">${ic("x", "currentColor")} Cancelar</button>
            <button type="submit" class="btn-salvar">${ic("save", "#fff")} Salvar movimentação</button>
          </div>
        </div>
      </div>
    </form>`;
}

/* ----- Secretaria: PÁGINA INICIAL (funções) ----- */
function cardAcao(icone, cor, titulo, desc, destino) {
  return `
    <div class="acao acao-lg" data-goto="${destino}">
      <div class="acao-ico ${cor}">${ic(icone, COR[cor === "cinza" ? "azul" : cor] || COR.azul)}</div>
      <h3>${titulo}</h3>
      <p>${desc}</p>
      <div class="acao-seta">${ic("arrow", COR.azul)}</div>
    </div>`;
}
function inicioSecretaria() {
  return `
    <div class="page-head">
      <div class="ph-left">
        <div class="ph-ico">${ic("school", COR.azul)}</div>
        <div><div class="ph-title">Secretaria</div><div class="ph-sub">Gerencie as informações da escola de forma rápida e fácil.</div></div>
      </div>
    </div>
    <div class="cards-grid">
      ${cardAcao("userplus", "azul", "Cadastrar Aluno", "Cadastre e gerencie os alunos da escola.", "alunos")}
      ${cardAcao("users", "verde", "Cadastrar Responsáveis", "Cadastre e gerencie os responsáveis pelos alunos.", "responsaveis")}
      ${cardAcao("users", "roxo", "Cadastrar Colaboradores", "Cadastre porteiros, almoxarifes e auxiliares.", "colaboradores")}
      ${cardAcao("cap", "laranja", "Cadastrar Professores", "Cadastre e gerencie os professores da escola.", "professores")}
      ${cardAcao("users", "verde", "Cadastrar Turmas", "Cadastre e gerencie as turmas da escola.", "turmas")}
      ${cardAcao("doc", "laranja", "Documentos", "Armazene e gerencie os documentos da escola.", "documentos")}
      ${cardAcao("apple", "vermelho", "Cadastrar Cardápio", "Cadastre e gerencie o cardápio da alimentação escolar.", "cardapio")}
      ${cardAcao("clipboard", "azul", "Lista de alunos com Restrições Alimentares", "Visualize a lista de alunos com restrições alimentares.", "restricoes")}
    </div>`;
}
/* ----- Alunos: LISTA ----- */
function paginaAlunos() {
  const lista = getAlunos();
  const linhas = lista.map((a, i) => `
    <tr>
      <td><div class="cell-nome"><span class="sec-avatar">${iniciais(a.nome)}</span>${a.nome}</div></td>
      <td>${a.cpf || "—"}</td>
      <td>${a.responsaveis && a.responsaveis.length ? a.responsaveis.join(", ") : "—"}</td>
      <td>${alunoTemRestricao(a) ? restricoesTexto(a) : "—"}</td>
      <td><span class="qr-cod">${a.qr_code || "—"}</span></td>
      <td><div class="acoes-cell">
        <button class="btn-icone" data-qr-aluno="${i}" title="Ver QR Code">${ic("box", COR.azul)}</button>
        <button class="btn-icone editar" data-edit="${i}" data-store="aluno" title="Editar">${ic("edit", COR.azul)}</button>
        <button class="btn-icone" data-del="${i}" data-store="aluno" title="Excluir">${ic("trash", "#ef4444")}</button>
      </div></td>
    </tr>`).join("");

  const corpo = lista.length
    ? `<table><thead><tr><th>Nome</th><th>CPF</th><th>Responsáveis</th><th>Restrições</th><th>QR Code</th><th></th></tr></thead><tbody>${linhas}</tbody></table>`
    : `<div class="empty"><div class="big">${ic("userplus", "#9aa7b8")}</div><h2>Nenhum aluno cadastrado</h2><p style="margin-top:8px">Clique em "Cadastrar aluno" para adicionar o primeiro.</p></div>`;

  return `
    <div class="page-head">
      <div class="ph-left"><div><div class="ph-title">Alunos</div><div class="ph-sub">Alunos cadastrados na escola</div></div></div>
      <button class="btn-laranja" data-form="aluno">${ic("plus", "#fff")} Cadastrar aluno</button>
    </div>
    <div class="panel">${corpo}</div>`;
}

/* ----- Alunos: FORMULÁRIO ----- */
function contatoRow(nome, tel) {
  return `<div class="linha-din contato-row">
    <div class="inp">${ic("userline", "#9aa7b8")}<input class="c-nome" placeholder="Nome do contato" value="${esc(nome)}"></div>
    <div class="inp">${ic("phone", "#9aa7b8")}<input class="c-tel" placeholder="(00) 00000-0000" value="${esc(tel)}"></div>
    <button type="button" class="btn-remove-linha" data-rem-linha title="Remover">${ic("times", "#8a97a9")}</button>
  </div>`;
}
const GRAVIDADES = ["Alergia", "Intolerância", "Preferência"];
function restricaoRow(r) {
  r = r || {};
  const ops = GRAVIDADES.map((g) => `<option ${g === r.gravidade ? "selected" : ""}>${g}</option>`).join("");
  return `<div class="linha-din restricao-row">
    <div class="inp">${ic("apple", "#9aa7b8")}<input class="r-alimento" placeholder="Alimento (ex.: Leite, Amendoim)" value="${esc(r.alimento)}"></div>
    <div class="inp"><select class="r-gravidade"><option value="" ${!r.gravidade ? "selected" : ""} disabled>Tipo</option>${ops}</select></div>
    <button type="button" class="btn-remove-linha" data-rem-linha title="Remover">${ic("times", "#8a97a9")}</button>
  </div>`;
}
function autorizadoRow(nome, doc) {
  return `<div class="linha-din autorizado-row">
    <div class="inp">${ic("userline", "#9aa7b8")}<input class="a-nome" placeholder="Nome completo" value="${esc(nome)}"></div>
    <div class="inp">${ic("idcard", "#9aa7b8")}<input class="a-doc" placeholder="Documento (RG/CPF)" value="${esc(doc)}"></div>
    <button type="button" class="btn-remove-linha" data-rem-linha title="Remover">${ic("times", "#8a97a9")}</button>
  </div>`;
}
function formAluno() {
  const editando = editAlunoIdx != null;
  const d = editando ? getAlunos()[editAlunoIdx] : {};
  alunoResponsaveis = (d.responsaveis || []).slice();
  const emergencia = (d.emergencia && d.emergencia.length) ? d.emergencia : [{ nome: "", telefone: "" }];
  const autorizados = (d.autorizados && d.autorizados.length) ? d.autorizados : [{ nome: "", documento: "" }];
  return `
    <div class="page-head">
      <div class="ph-left">
        <button class="back-btn" data-goto="alunos" title="Voltar">${ic("arrowLeft", COR.azul)}</button>
        <div><div class="ph-title">${editando ? "Editar" : "Cadastrar"} Aluno</div><div class="ph-sub">${editando ? "Altere os dados do aluno." : "Preencha os dados para cadastrar um novo aluno."}</div></div>
      </div>
    </div>

    <form id="form-aluno">
      <div class="form-solo">
        <div class="form-card">
          <div class="bloco-titulo">Dados do aluno</div>
          <div class="linha c3">
            ${campo("Nome", true, "userline", "text", "f-nome", "Digite o nome completo", d.nome)}
            ${campo("CPF", true, "idcard", "text", "f-cpf", "000.000.000-00", d.cpf)}
            ${campo("Data de nascimento", true, "calendar", "date", "f-nascimento", "", d.data_nascimento)}
          </div>
          <div class="linha c2">
            ${campo("RA (Registro do Aluno)", false, "idcard", "text", "f-ra", "Digite o RA (opcional)", d.ra)}
            <div class="campo">
              <label>Número de matrícula <span class="hint-max">(gerado automaticamente ao salvar)</span></label>
              <div class="inp">${ic("tag", "#9aa7b8")}<input type="text" id="f-matricula" value="${esc(d.matricula || "")}" placeholder="Gerado ao salvar" readonly></div>
            </div>
          </div>
          <div class="linha c3">
            ${campo("CEP", true, "location", "text", "f-cep", "00000-000", d.cep)}
            ${campo("Rua", true, "map", "text", "f-rua", "Digite o nome da rua", d.rua)}
            ${campo("Bairro", true, "building", "text", "f-bairro", "Digite o bairro", d.bairro)}
          </div>
          <div class="linha c2">
            ${campo("Número", true, "hash", "text", "f-numero", "Digite o número", d.numero)}
            ${campo("Complemento", false, "note", "text", "f-complemento", "Digite o complemento (opcional)", d.complemento)}
          </div>
          <div class="linha">
            ${campo("Informações médicas", false, "note", "text", "f-medicas", "Ex.: usa óculos, alergia a picada de inseto (opcional)", d.informacoes_medicas)}
          </div>

          <div class="bloco-titulo" style="margin-top:26px">Responsáveis</div>
          <div class="linha">
            <div class="campo">
              <label>Responsáveis <span class="hint-max">(digite o nome e associe da lista de responsáveis cadastrados)</span></label>
              <div class="inp busca-inp">${ic("search", "#9aa7b8")}
                <input type="text" id="busca-resp" placeholder="Pesquisar responsável por nome..." autocomplete="off" />
              </div>
              <div class="busca-resultados" id="resultados-resp"></div>
              <div class="alunos-associados" id="resp-associados"></div>
            </div>
          </div>

          <div class="bloco-titulo" style="margin-top:26px">Restrições alimentares</div>
          <div id="restricoes-lista" class="din-lista">${(restricoesLista(d).length ? restricoesLista(d) : [{}]).map(restricaoRow).join("")}</div>
          <button type="button" class="btn-add-linha" data-add-restricao>${ic("plus", COR.azul)} Adicionar restrição</button>

          <div class="bloco-titulo" style="margin-top:26px">Contatos para emergência</div>
          <div id="contatos-lista" class="din-lista">${emergencia.map((c) => contatoRow(c.nome, c.telefone)).join("")}</div>
          <button type="button" class="btn-add-linha" data-add-contato>${ic("plus", COR.azul)} Adicionar contato</button>

          <div class="bloco-titulo" style="margin-top:26px">Pessoas autorizadas a retirar o aluno</div>
          <div id="autorizados-lista" class="din-lista">${autorizados.map((p) => autorizadoRow(p.nome, p.documento)).join("")}</div>
          <button type="button" class="btn-add-linha" data-add-autorizado>${ic("plus", COR.azul)} Adicionar pessoa</button>

          <div class="form-actions">
            <button type="button" class="btn-cancelar" data-goto="alunos">${ic("x", "currentColor")} Cancelar</button>
            <button type="submit" class="btn-salvar">${ic("save", "#fff")} Salvar aluno</button>
          </div>
        </div>
      </div>
    </form>`;
}
function renderBuscaResp() {
  const inp = document.getElementById("busca-resp");
  const box = document.getElementById("resultados-resp");
  if (!inp || !box) return;
  const q = inp.value;
  if (!q.trim()) { box.innerHTML = ""; return; }
  const res = responsaveisEncontrados(q, alunoResponsaveis).slice(0, 6);
  box.innerHTML = res.length
    ? res.map((n) => `<div class="res-item"><span>${n}</span><button type="button" class="btn-assoc" data-add-resp="${esc(n)}">${ic("plus", COR.azul)} Associar</button></div>`).join("")
    : `<div class="res-vazio">Nenhum responsável encontrado para "${esc(q)}".</div>`;
}
function renderRespAssociados() {
  const box = document.getElementById("resp-associados");
  if (!box) return;
  box.innerHTML = alunoResponsaveis.length
    ? alunoResponsaveis.map((n) => `<span class="aluno-chip">${n}<button type="button" data-rem-resp="${esc(n)}" title="Remover">${ic("times", "#8a97a9")}</button></span>`).join("")
    : `<div class="assoc-vazio">Nenhum responsável associado ainda.</div>`;
}

/* ----- Responsáveis: LISTA ----- */
function paginaResponsaveis() {
  const lista = getResponsaveis();
  const linhas = lista.map((r, i) => `
    <tr>
      <td><div class="cell-nome"><span class="sec-avatar">${iniciais(r.nome)}</span>${r.nome}</div></td>
      <td>${r.cpf || "—"}</td>
      <td>${r.email || "—"}</td>
      <td>${r.telefone || "—"}</td>
      <td><div class="acoes-cell">
        <button class="btn-icone editar" data-edit="${i}" data-store="resp" title="Editar">${ic("edit", COR.azul)}</button>
        <button class="btn-icone" data-del="${i}" data-store="resp" title="Excluir">${ic("trash", "#ef4444")}</button>
      </div></td>
    </tr>`).join("");

  const corpo = lista.length
    ? `<table><thead><tr><th>Nome</th><th>CPF</th><th>E-mail</th><th>Telefone</th><th></th></tr></thead><tbody>${linhas}</tbody></table>`
    : `<div class="empty"><div class="big">${ic("users", "#9aa7b8")}</div><h2>Nenhum responsável cadastrado</h2><p style="margin-top:8px">Clique em "Cadastrar responsável" para adicionar o primeiro.</p></div>`;

  return `
    <div class="page-head">
      <div class="ph-left"><div><div class="ph-title">Responsáveis</div><div class="ph-sub">Responsáveis pelos alunos</div></div></div>
      <button class="btn-laranja" data-form="responsavel">${ic("plus", "#fff")} Cadastrar responsável</button>
    </div>
    <div class="panel">${corpo}</div>`;
}

/* ----- Responsáveis: FORMULÁRIO ----- */
function formResponsavel() {
  const editando = editRespIdx != null;
  const d = editando ? getResponsaveis()[editRespIdx] : {};
  const vinculados = editando ? getAlunos().filter((a) => (a.responsaveis || []).includes(d.nome)) : [];
  const vinculadosHtml = editando ? `
          <div class="bloco-titulo" style="margin-top:26px">Alunos vinculados</div>
          <div class="linha">
            ${vinculados.length
              ? `<div class="alunos-grid">${vinculados.map((a) => `<div class="aluno-card"><div class="aluno-card-head"><span class="sec-avatar">${iniciais(a.nome)}</span><b>${esc(a.nome)}</b></div><div class="aluno-info"><span class="ai-label">Turma</span><span class="ai-val">${esc(turmaDoAluno(a.nome) || "—")}</span></div><div class="aluno-info"><span class="ai-label">Matrícula</span><span class="ai-val">${esc(a.matricula || "—")}</span></div></div>`).join("")}</div>`
              : `<p class="hint">Nenhum aluno vinculado ainda. O vínculo é feito no cadastro do aluno.</p>`}
          </div>` : "";
  return `
    <div class="page-head">
      <div class="ph-left">
        <button class="back-btn" data-goto="${voltar("responsaveis")}" title="Voltar">${ic("arrowLeft", COR.azul)}</button>
        <div><div class="ph-title">${editando ? "Editar" : "Cadastrar"} Responsável</div><div class="ph-sub">${editando ? "Altere os dados do responsável." : "Preencha os dados para cadastrar um novo responsável."}</div></div>
      </div>
    </div>

    <form id="form-responsavel">
      <div class="form-solo">
        <div class="form-card">
          <div class="bloco-titulo">Dados pessoais</div>
          <div class="linha c3">
            ${campo("Nome", true, "userline", "text", "f-nome", "Digite o nome completo", d.nome)}
            ${campo("CPF", true, "idcard", "text", "f-cpf", "000.000.000-00", d.cpf)}
            ${campo("E-mail", true, "mail", "email", "f-email", "exemplo@email.com", d.email)}
          </div>
          <div class="linha c2">
            ${campo("Telefone", true, "phone", "text", "f-telefone", "(00) 00000-0000", d.telefone)}
            ${campo("CEP", true, "location", "text", "f-cep", "00000-000", d.cep)}
          </div>
          <div class="linha">
            ${campo("Rua", true, "map", "text", "f-rua", "Digite o nome da rua", d.rua)}
          </div>
          <div class="linha c2">
            ${campo("Bairro", true, "building", "text", "f-bairro", "Digite o bairro", d.bairro)}
            ${campo("Número", true, "hash", "text", "f-numero", "Digite o número", d.numero)}
          </div>
          <div class="linha">
            ${campo("Complemento", false, "note", "text", "f-complemento", "Digite o complemento (opcional)", d.complemento)}
          </div>
          ${vinculadosHtml}

          <div class="form-actions">
            <button type="button" class="btn-cancelar" data-goto="${voltar("responsaveis")}">${ic("x", "currentColor")} Cancelar</button>
            <button type="submit" class="btn-salvar">${ic("save", "#fff")} Salvar responsável</button>
          </div>
        </div>
      </div>
    </form>`;
}

/* ----- Documentos: TELA INICIAL (2 opções) ----- */
function paginaDocumentos() {
  return `
    <div class="page-head">
      <div class="ph-left"><div class="ph-ico">${ic("doc", COR.azul)}</div>
        <div><div class="ph-title">Documentos</div><div class="ph-sub">Cadastre modelos de documentos e emita para os alunos.</div></div>
      </div>
    </div>
    <div class="cards-grid cards-2">
      <div class="acao acao-lg" data-goto="documentosCadastrar">
        <div class="acao-ico azul">${ic("filePlus", COR.azul)}</div>
        <h3>Cadastrar Documento</h3>
        <p>Crie e gerencie os modelos de documentos da escola.</p>
        <div class="acao-seta">${ic("arrow", COR.azul)}</div>
      </div>
      <div class="acao acao-lg" data-goto="documentosEmitir">
        <div class="acao-ico laranja">${ic("printer", COR.laranja)}</div>
        <h3>Emitir Documento</h3>
        <p>Emita um documento para um aluno da escola.</p>
        <div class="acao-seta">${ic("arrow", COR.azul)}</div>
      </div>
    </div>`;
}

/* ----- Documentos: CADASTRAR (lista + formulário) ----- */
function documentosCadastrar() {
  const lista = getDocumentos();
  const linhas = lista.map((d, i) => `
    <tr>
      <td><div class="cell-nome"><span class="sec-avatar">${ic("doc", COR.azul)}</span>${d.nome}</div></td>
      <td>${d.descricao || "—"}</td>
      <td><div class="acoes-cell">
        <button class="btn-icone editar" data-edit="${i}" data-store="doc" title="Editar">${ic("edit", COR.azul)}</button>
        <button class="btn-icone" data-del="${i}" data-store="doc" title="Excluir">${ic("trash", "#ef4444")}</button>
      </div></td>
    </tr>`).join("");
  const corpo = lista.length
    ? `<table><thead><tr><th>Documento</th><th>Descrição</th><th></th></tr></thead><tbody>${linhas}</tbody></table>`
    : `<div class="empty"><div class="big">${ic("doc", "#9aa7b8")}</div><h2>Nenhum documento cadastrado</h2></div>`;
  return `
    <div class="page-head">
      <div class="ph-left">
        <button class="back-btn" data-goto="documentos" title="Voltar">${ic("arrowLeft", COR.azul)}</button>
        <div><div class="ph-title">Cadastrar Documento</div><div class="ph-sub">Modelos de documentos da escola</div></div>
      </div>
      <button class="btn-laranja" data-form="documento">${ic("plus", "#fff")} Novo documento</button>
    </div>
    <div class="panel">${corpo}</div>`;
}
function formDocumento() {
  const editando = editDocIdx != null;
  const d = editando ? getDocumentos()[editDocIdx] : {};
  docCampos = (d.campos || []).slice();
  // A assinatura agora é uma imagem inserida dentro do próprio texto (posicionável
  // livremente), não mais um bloco fixo no rodapé.
  return `
    <div class="page-head">
      <div class="ph-left">
        <button class="back-btn" data-goto="documentosCadastrar" title="Voltar">${ic("arrowLeft", COR.azul)}</button>
        <div><div class="ph-title">${editando ? "Editar" : "Novo"} Documento</div><div class="ph-sub">${editando ? "Altere o modelo do documento." : "Cadastre um novo modelo de documento."}</div></div>
      </div>
    </div>
    <form id="form-documento">
      <div class="form-solo">
        <div class="form-card">
          <div class="bloco-titulo">Dados do documento</div>
          <div class="linha c2">
            ${campo("Nome do documento", true, "tag", "text", "f-nome", "Ex.: Declaração de Matrícula", d.nome)}
            ${campo("Descrição", false, "note", "text", "f-descricao", "Para que serve este documento (opcional)", d.descricao)}
          </div>

          <div class="bloco-titulo" style="margin-top:26px">Campos de preenchimento automático</div>
          <div class="linha">
            <div class="campo">
              <label>Campos do catálogo <span class="hint-max">(clique para inserir; na emissão o sistema preenche sozinho com os dados do aluno)</span></label>
              <div class="campos-tags">
                ${CATALOGO_CAMPOS.map((c) => `<button type="button" class="campo-tag" data-inserir-campo="${esc(c.etiqueta)}" title="Inserir no texto">&lt;&lt; ${c.etiqueta} &gt;&gt;</button>`).join("")}
              </div>
            </div>
          </div>
          <div class="linha">
            <div class="campo">
              <label>Campo personalizado <span class="hint-max">(para dados que não estão no catálogo; serão preenchidos à mão na emissão)</span></label>
              <div class="add-campo-row">
                <div class="inp" style="flex:1">${ic("tag", "#9aa7b8")}
                  <input type="text" id="campo-personalizado" placeholder="Ex.: Motivo da declaração" autocomplete="off" />
                </div>
                <button type="button" class="btn-add-linha" data-add-personalizado>${ic("plus", COR.azul)} Inserir campo no texto</button>
              </div>
            </div>
          </div>

          <div class="bloco-titulo" style="margin-top:26px">Modelo do documento</div>
          <div class="linha">
            <div class="campo">
              <label>Texto do documento <span class="hint-max">(use a barra para formatar; clique numa etiqueta acima para inserir um campo &lt;&lt; nome &gt;&gt;)</span></label>
              <div class="rt-bar">
                <button type="button" class="rt-btn" data-cmd="bold" title="Negrito"><b>N</b></button>
                <button type="button" class="rt-btn" data-cmd="italic" title="Itálico"><i>I</i></button>
                <button type="button" class="rt-btn" data-cmd="underline" title="Sublinhado"><u>S</u></button>
                <button type="button" class="rt-btn" data-cmd="hiliteColor" data-val="#fde68a" title="Grifar"><span class="rt-grifo">G</span></button>
                <span class="rt-sep"></span>
                <button type="button" class="rt-btn" data-cmd="justifyLeft" title="Alinhar à esquerda">${ic("alignLeft", "#3a4a5c")}</button>
                <button type="button" class="rt-btn" data-cmd="justifyCenter" title="Centralizar">${ic("alignCenter", "#3a4a5c")}</button>
                <button type="button" class="rt-btn" data-cmd="justifyRight" title="Alinhar à direita">${ic("alignRight", "#3a4a5c")}</button>
                <span class="rt-sep"></span>
                <select id="doc-tamanho" class="rt-sel" title="Tamanho do texto">
                  <option value="">Tamanho</option><option value="2">Pequeno</option><option value="3">Normal</option><option value="5">Grande</option><option value="6">Título</option>
                </select>
                <input type="color" id="doc-cor" class="rt-color" title="Cor do texto" value="#1e293b">
                <span class="rt-sep"></span>
                <button type="button" class="rt-btn rt-logo" data-doc-logo title="Inserir logo / imagem">${ic("filePlus", "#3a4a5c")} Logo</button>
                <button type="button" class="rt-btn rt-logo" data-doc-assinatura title="Inserir imagem de assinatura no ponto do cursor">${ic("sign", "#3a4a5c")} Assinatura</button>
                <span class="rt-sep"></span>
                <span class="rt-img-ctrls" title="Clique numa imagem do texto e use estes botões para posicioná-la e redimensioná-la">
                  <button type="button" class="rt-btn" data-img-align="left" title="Imagem à esquerda">${ic("alignLeft", "#3a4a5c")}</button>
                  <button type="button" class="rt-btn" data-img-align="center" title="Centralizar imagem">${ic("alignCenter", "#3a4a5c")}</button>
                  <button type="button" class="rt-btn" data-img-align="right" title="Imagem à direita">${ic("alignRight", "#3a4a5c")}</button>
                  <button type="button" class="rt-btn" data-logo-size="menor" title="Diminuir a imagem selecionada"><b>−</b></button>
                  <button type="button" class="rt-btn" data-logo-size="maior" title="Aumentar a imagem selecionada"><b>+</b></button>
                  <input type="number" id="doc-img-tam" class="rt-num" min="40" max="700" step="10" placeholder="px" title="Largura da imagem selecionada (em pixels)">
                </span>
              </div>
              <div id="f-texto" class="doc-editor" contenteditable="true">${d.texto || ""}</div>
              <input type="file" id="doc-logo-input" accept="image/png,image/jpeg" hidden>
              <input type="file" id="doc-assinatura-input" accept="image/png,image/jpeg" hidden>
            </div>
          </div>

          <div class="form-actions">
            <button type="button" class="btn-cancelar" data-goto="documentosCadastrar">${ic("x", "currentColor")} Cancelar</button>
            <button type="submit" class="btn-salvar">${ic("save", "#fff")} Salvar documento</button>
          </div>
        </div>
      </div>
    </form>`;
}

/* ----- Documentos: EMITIR ----- */
function documentosEmitir() {
  const emissoes = getEmissoes();
  const linhas = emissoes.map((em, i) => `
    <tr>
      <td>${em.data}</td>
      <td><span class="tag-mov">${em.documento}</span></td>
      <td>${em.aluno}</td>
      <td><div class="acoes-cell">
        <button class="btn-icone editar" data-ver-emissao="${i}" title="Ver / imprimir">${ic("printer", COR.azul)}</button>
        <button class="btn-icone" data-del="${i}" data-store="emissao" title="Excluir">${ic("trash", "#ef4444")}</button>
      </div></td>
    </tr>`).join("");
  const historico = emissoes.length
    ? `<div class="panel" style="margin-top:22px"><h2>Documentos emitidos</h2>
        <table><thead><tr><th>Data/Hora</th><th>Documento</th><th>Aluno</th><th></th></tr></thead><tbody>${linhas}</tbody></table></div>`
    : "";
  return `
    <div class="page-head">
      <div class="ph-left">
        <button class="back-btn" data-goto="documentos" title="Voltar">${ic("arrowLeft", COR.azul)}</button>
        <div><div class="ph-title">Emitir Documento</div><div class="ph-sub">Selecione o documento, a turma e o aluno para emitir.</div></div>
      </div>
    </div>
    <form id="form-emitir">
      <div class="form-solo">
        <div class="form-card">
          <div class="bloco-titulo">Emissão de documento</div>
          <div class="linha c2">
            ${campoSelect("Documento", true, "doc", "f-documento", documentosNomes(), "")}
            ${campoSelect("Turma", true, "cap", "f-turma-emitir", getTurmas().map((t) => t.nome), "")}
          </div>
          <div class="linha">
            <div class="campo">
              <label for="f-aluno">Aluno<span class="obrig">*</span></label>
              <div class="inp">${ic("userline", "#9aa7b8")}
                <select id="f-aluno" name="f-aluno" required disabled>
                  <option value="" disabled selected>Selecione a turma primeiro</option>
                </select>
              </div>
            </div>
          </div>
          <div id="campos-manuais"></div>
          <div class="form-actions">
            <span></span>
            <button type="submit" class="btn-salvar">${ic("printer", "#fff")} Emitir documento</button>
          </div>
        </div>
      </div>
    </form>
    ${historico}`;
}

/* ----- Documento gerado (visualizar / imprimir) ----- */
function documentoGerado() {
  const em = getEmissoes()[viewEmissaoIdx];
  if (!em) return documentosEmitir();
  const corpo = em.texto || "";
  return `
    <div class="page-head no-print">
      <div class="ph-left">
        <button class="back-btn" data-goto="documentosEmitir" title="Voltar">${ic("arrowLeft", COR.azul)}</button>
        <div><div class="ph-title">${em.documento}</div><div class="ph-sub">Emitido para ${em.aluno} — ${em.data}</div></div>
      </div>
      <button class="btn-laranja" onclick="window.print()">${ic("printer", "#fff")} Imprimir</button>
    </div>
    <div class="folha" id="folha-doc">
      <div class="folha-cabecalho">Say Kids — Gestão Escolar</div>
      <div class="folha-titulo">${em.documento}</div>
      <div class="folha-texto">${corpo || "<em>Este documento não possui texto configurado.</em>"}</div>
    </div>`;
}

/* ----- Cardápio: LISTA ----- */
function paginaCardapio() {
  const lista = getCardapios();
  const linhas = lista.map((c, i) => {
    const preenchidos = c.dias ? Object.keys(c.dias).filter((k) => diaPreenchido(c.dias[k])).length : 0;
    return `
    <tr>
      <td><div class="cell-nome"><span class="sec-avatar">${ic("apple", COR.vermelho)}</span>${c.mes} / ${c.ano}</div></td>
      <td>${c.turma || "—"}</td>
      <td>${preenchidos} dia(s) preenchido(s)</td>
      <td><div class="acoes-cell">
        <button class="btn-icone editar" data-edit="${i}" data-store="cardapio" title="Editar">${ic("edit", COR.azul)}</button>
        <button class="btn-icone" data-del="${i}" data-store="cardapio" title="Excluir">${ic("trash", "#ef4444")}</button>
      </div></td>
    </tr>`;
  }).join("");
  const corpo = lista.length
    ? `<table><thead><tr><th>Cardápio</th><th>Turma</th><th>Preenchimento</th><th></th></tr></thead><tbody>${linhas}</tbody></table>`
    : `<div class="empty"><div class="big">${ic("apple", "#9aa7b8")}</div><h2>Nenhum cardápio cadastrado</h2><p style="margin-top:8px">Clique em "Criar cardápio" para montar o primeiro.</p></div>`;
  return `
    <div class="page-head">
      <div class="ph-left"><div><div class="ph-title">Cardápio</div><div class="ph-sub">Cardápios da alimentação escolar</div></div></div>
      <button class="btn-laranja" data-form="cardapio">${ic("plus", "#fff")} Criar cardápio</button>
    </div>
    <div class="panel">${corpo}</div>`;
}

/* ----- Cardápio: calendário (dias úteis do mês) ----- */
function calendarioCardapio(mesIndex, ano) {
  const dim = new Date(ano, mesIndex + 1, 0).getDate();
  let cards = "";
  for (let d = 1; d <= dim; d++) {
    const dt = new Date(ano, mesIndex, d);
    const dow = dt.getDay(); // 0 dom .. 6 sáb
    if (dow < 1 || dow > 5) continue;
    const iso = `${ano}-${String(mesIndex + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    const label = `${DIAS_SEMANA[dow - 1]} ${String(d).padStart(2, "0")}/${String(mesIndex + 1).padStart(2, "0")}/${ano}`;
    const conteudo = Object.prototype.hasOwnProperty.call(cardapioDias, iso) ? cardapioDias[iso] : CARDAPIO_DIA_PADRAO;
    cards += `<div class="dia-card" style="grid-column:${dow}">
      <div class="dia-head">${label}</div>
      <div class="dia-editor" contenteditable="true" data-dia="${iso}">${conteudo}</div>
    </div>`;
  }
  const header = DIAS_SEMANA.map((n) => `<div class="dia-col-head">${n}</div>`).join("");
  return `<div class="cal-header">${header}</div><div class="cal-grid">${cards}</div>`;
}
function montarGridCardapio() {
  const mesSel = document.getElementById("cardapio-mes").value;
  const ano = Number(document.getElementById("cardapio-ano").value) || new Date().getFullYear();
  const grid = document.getElementById("cardapio-grid");
  if (grid) grid.innerHTML = calendarioCardapio(MESES.indexOf(mesSel), ano);
}
function salvarDiasCardapio() {
  document.querySelectorAll(".dia-editor").forEach((el) => { cardapioDias[el.dataset.dia] = el.innerHTML; });
}
function cardapioVerificacao() {
  const v = ultimaVerificacao || { faltas: [], turma: "", mes: "", ano: "" };
  const faltas = v.faltas || [];
  const okEst = faltas.length === 0;
  const estoqueBloco = okEst
    ? `<div class="verif-ok"><span class="vi">${ic("check", "#1c8055")}</span> Estoque suficiente para todos os alimentos do cardápio.</div>`
    : `<div class="verif-aviso"><span class="vi">${ic("box", "#b25a12")}</span> Alguns alimentos não têm estoque suficiente. Lista de compras gerada:</div>
       <div class="lista-compra-box">
         ${faltas.map((f) => `
           <label class="lc-item">
             <input type="checkbox" class="lc-check">
             <span class="lc-nome">${esc(f.alimento)}</span>
             <span class="lc-qtd">Comprar: <b>${f.falta} ${esc(f.unidade || "")}</b></span>
           </label>`).join("")}
       </div>
       <button class="btn-laranja" id="btn-imprimir-lc" style="margin-top:14px">${ic("printer", "#fff")} Imprimir / Salvar PDF</button>`;
  return `
    <div class="page-head">
      <div class="ph-left">
        <div><div class="ph-title">Cardápio salvo com sucesso</div><div class="ph-sub">${esc(v.turma)} · ${esc(v.mes)}/${v.ano}</div></div>
      </div>
      <button class="btn-laranja" data-goto="cardapio">Concluir</button>
    </div>
    <div class="panel">
      <div class="verif-ok"><span class="vi">${ic("check", "#1c8055")}</span> Nenhum aluno da turma tem restrição aos alimentos do cardápio.</div>
    </div>
    <div class="panel" style="margin-top:18px">
      <h3 class="verif-titulo">Disponibilidade em estoque</h3>
      ${estoqueBloco}
    </div>`;
}
/* Abre a lista de compras numa janela pronta para imprimir / salvar como PDF */
function imprimirListaCompra(faltas, titulo) {
  const linhas = (faltas || []).map((f) => `<tr><td>${esc(f.alimento)}</td><td>${f.falta} ${esc(f.unidade || "")}</td></tr>`).join("");
  const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>Lista de Compras - Say Kids</title>
    <style>body{font-family:Arial,sans-serif;padding:32px;color:#222}h1{color:#f97316;margin:0 0 4px;font-size:22px}p{color:#555;margin:0 0 20px}
    table{width:100%;border-collapse:collapse}th,td{border:1px solid #ccc;padding:10px 12px;text-align:left;font-size:14px}th{background:#f3f4f6}</style></head>
    <body><h1>Lista de Compras - Say Kids</h1><p>${esc(titulo || "")}</p>
    <table><thead><tr><th>Alimento</th><th>Quantidade a comprar</th></tr></thead><tbody>${linhas}</tbody></table>
    <script>window.onload=function(){window.print();}</script></body></html>`;
  const w = window.open("", "_blank");
  if (!w) { aviso("Permita pop-ups para abrir a lista de compras para impressão."); return; }
  w.document.open(); w.document.write(html); w.document.close();
}
function cardapioItemRow(it) {
  it = it || {};
  const ops = ['<option value="" ' + (it.alimento ? "" : "selected") + " disabled>Alimento do estoque</option>"]
    .concat(alimentosEstoqueNomes().map((n) => `<option ${n === it.alimento ? "selected" : ""}>${n}</option>`)).join("");
  return `<div class="linha-din cardapio-item-row">
    <div class="inp">${ic("box", "#9aa7b8")}<select class="ci-alimento">${ops}</select></div>
    <div class="inp">${ic("hash", "#9aa7b8")}<input type="number" class="ci-qtd" min="0" placeholder="Quantidade" value="${esc(it.quantidade)}"></div>
    <button type="button" class="btn-remove-linha" data-rem-linha title="Remover">${ic("times", "#8a97a9")}</button>
  </div>`;
}
function formCardapio() {
  const editando = editCardapioIdx != null;
  const d = editando ? getCardapios()[editCardapioIdx] : {};
  cardapioDias = Object.assign({}, d.dias || {});
  const now = new Date();
  const mesSel = d.mes || MESES[now.getMonth()];
  const anoSel = d.ano || now.getFullYear();
  const opMes = MESES.map((m) => `<option value="${m}" ${m === mesSel ? "selected" : ""}>${m}</option>`).join("");
  const turmaSel = d.turma || "";
  const opTurma = [`<option value="" disabled ${turmaSel ? "" : "selected"}>Selecione a turma</option>`]
    .concat(turmasDisponiveis().map((t) => `<option ${t === turmaSel ? "selected" : ""}>${t}</option>`)).join("");
  const itens = (d.itens && d.itens.length) ? d.itens : [{}];
  const fontes = ["Arial", "Times New Roman", "Verdana", "Georgia", "Courier New", "Comic Sans MS", "Trebuchet MS"];
  return `
    <div class="page-head">
      <div class="ph-left">
        <button class="back-btn" data-goto="cardapio" title="Voltar">${ic("arrowLeft", COR.azul)}</button>
        <div><div class="ph-title">${editando ? "Editar" : "Criar"} Cardápio</div><div class="ph-sub">Cardápio da turma, com os alimentos do estoque e o detalhe de cada dia.</div></div>
      </div>
    </div>
    <form id="form-cardapio">
      <div class="form-card" style="margin-bottom:20px">
        <div class="linha c3" style="margin-bottom:0">
          <div class="campo"><label>Turma <span class="obrig">*</span></label>
            <div class="inp">${ic("users", "#9aa7b8")}<select id="cardapio-turma" required>${opTurma}</select></div>
          </div>
          <div class="campo"><label>Mês <span class="obrig">*</span></label>
            <div class="inp">${ic("calendar", "#9aa7b8")}<select id="cardapio-mes">${opMes}</select></div>
          </div>
          <div class="campo"><label>Ano <span class="obrig">*</span></label>
            <div class="inp">${ic("calendar", "#9aa7b8")}<input type="number" id="cardapio-ano" value="${anoSel}" min="2020" max="2100"></div>
          </div>
        </div>
      </div>

      <div class="form-card" style="margin-bottom:20px">
        <div class="bloco-titulo">Alimentos do cardápio <span class="hint-max">(do estoque — usados nas verificações automáticas)</span></div>
        <div id="cardapio-itens-lista" class="din-lista">${itens.map(cardapioItemRow).join("")}</div>
        <button type="button" class="btn-add-linha" data-add-cardapio-item>${ic("plus", COR.azul)} Adicionar alimento</button>
      </div>

      <div class="rt-toolbar" id="rt-toolbar">
        <select id="cardapio-fonte" title="Fonte"><option value="">Fonte</option>${fontes.map((f) => `<option value="${f}" style="font-family:'${f}'">${f}</option>`).join("")}</select>
        <select id="cardapio-tamanho" title="Tamanho"><option value="">Tamanho</option><option value="2">Pequeno</option><option value="3">Normal</option><option value="5">Grande</option><option value="7">Muito grande</option></select>
        <button type="button" class="rt-btn" data-cmd="bold" title="Negrito"><b>B</b></button>
        <button type="button" class="rt-btn" data-cmd="italic" title="Itálico"><i>I</i></button>
        <button type="button" class="rt-btn" data-cmd="underline" title="Sublinhado"><u>U</u></button>
        <input type="color" id="cardapio-cor" value="#333333" title="Cor do texto">
        <span class="rt-dica">Clique num dia e use os botões para formatar o texto.</span>
      </div>

      <div id="cardapio-grid">${calendarioCardapio(MESES.indexOf(mesSel), anoSel)}</div>

      <div class="form-actions">
        <button type="button" class="btn-cancelar" data-goto="cardapio">${ic("x", "currentColor")} Cancelar</button>
        <button type="submit" class="btn-salvar">${ic("save", "#fff")} Salvar cardápio</button>
      </div>
    </form>`;
}

/* ----- Restrições alimentares (lista automática + filtro por turma) ----- */
function paginaRestricoes() {
  const comRestricao = getAlunos()
    .map((a, i) => ({ a, i }))
    .filter((x) => alunoTemRestricao(x.a));

  const filtrada = comRestricao.filter((x) => filtroRestricaoTurma === "Todas" || turmaDoAluno(x.a.nome) === filtroRestricaoTurma);

  const opcoes = ['<option value="Todas">Todas as turmas</option>']
    .concat(turmasDisponiveis().map((t) => `<option value="${t}" ${t === filtroRestricaoTurma ? "selected" : ""}>${t}</option>`)).join("");

  const linhas = filtrada.map(({ a, i }) => `
    <tr>
      <td><div class="cell-nome"><span class="sec-avatar">${iniciais(a.nome)}</span>${a.nome}</div></td>
      <td>${turmaDoAluno(a.nome) || "—"}</td>
      <td><span class="tag-restricao">${restricoesTexto(a)}</span></td>
      <td><div class="acoes-cell">${(PERFIL === "admin" || PERFIL === "secretaria") ? `<button class="btn-icone editar" data-edit="${i}" data-store="aluno" title="Abrir aluno">${ic("edit", COR.azul)}</button>` : "—"}</div></td>
    </tr>`).join("");

  const corpo = filtrada.length
    ? `<table><thead><tr><th>Aluno</th><th>Turma</th><th>Restrições alimentares</th><th></th></tr></thead><tbody>${linhas}</tbody></table>`
    : `<div class="empty"><div class="big">${ic("clipboard", "#9aa7b8")}</div><h2>Nenhum aluno com restrição${filtroRestricaoTurma !== "Todas" ? " nesta turma" : ""}</h2><p style="margin-top:8px">As restrições são preenchidas no cadastro do aluno.</p></div>`;

  return `
    <div class="page-head">
      <div class="ph-left"><div><div class="ph-title">Alunos com Restrições Alimentares</div><div class="ph-sub">Lista gerada a partir do cadastro dos alunos</div></div></div>
    </div>
    <div class="panel">
      <div class="filtro-bar">
        <span class="filtro-label">${ic("filter", "#7a8aa0")} Filtrar por turma</span>
        <div class="inp filtro-inp"><select id="filtro-restricao-turma">${opcoes}</select></div>
        <span class="filtro-contagem">${filtrada.length} aluno(s)</span>
      </div>
      ${corpo}
    </div>`;
}

/* ----- Professor: PÁGINA INICIAL (2 opções) ----- */
function inicioProfessor() {
  return `
    <div class="page-head">
      <div class="ph-left"><div class="ph-ico">${ic("clipboard", COR.azul)}</div>
        <div><div class="ph-title">Área do Professor</div><div class="ph-sub">Selecione uma opção para começar.</div></div>
      </div>
    </div>
    <div class="cards-grid cards-2">
      <div class="acao acao-lg" data-goto="professorAgenda">
        <div class="acao-ico azul">${ic("clipboard", COR.azul)}</div>
        <h3>Agenda dos Alunos</h3>
        <p>Preencha a agenda diária dos seus alunos.</p>
        <div class="acao-seta">${ic("arrow", COR.azul)}</div>
      </div>
      <div class="acao acao-lg" data-goto="professorTurmas">
        <div class="acao-ico verde">${ic("users", COR.verde)}</div>
        <h3>Minhas Turmas</h3>
        <p>Veja as turmas em que você leciona.</p>
        <div class="acao-seta">${ic("arrow", COR.azul)}</div>
      </div>
    </div>`;
}

/* ----- Professor: AGENDA dos alunos ----- */
const REFEICOES = ["Lanche 1", "Almoço", "Lanche 2", "Jantar"];
const DETALHES_REF = ["Recusou", "Comeu metade", "Comeu tudo", "Repetiu"];
const SONO_SIT = ["Dormiu", "Não dormiu"];
function selAg(cls, opcoes, sel) {
  return `<select class="${cls}">${opcoes.map((o) => `<option ${o === sel ? "selected" : ""}>${o}</option>`).join("")}</select>`;
}
function refeicaoRow(r) {
  r = r || {};
  return `<div class="ag-linha ag-refeicao-row">
    ${selAg("ag-refeicao", REFEICOES, r.refeicao)}
    <input type="time" class="ag-hora" value="${esc(r.horario)}" title="Horário">
    ${selAg("ag-detalhes", DETALHES_REF, r.detalhes)}
    <button type="button" class="btn-remove-linha" data-rem-agenda-linha title="Remover">${ic("times", "#8a97a9")}</button>
  </div>`;
}
function sonoRow(s) {
  s = s || {};
  return `<div class="ag-linha ag-sono-row">
    ${selAg("ag-sono-sit", SONO_SIT, s.situacao)}
    <input type="time" class="ag-hora" value="${esc(s.horario)}" title="Horário">
    <button type="button" class="btn-remove-linha" data-rem-agenda-linha title="Remover">${ic("times", "#8a97a9")}</button>
  </div>`;
}
function salvarAgendaAtual() {
  const ag = getAgenda();
  // Atividades do dia: campo único (professor), espelhado para todos os alunos da turma
  const atEl = document.getElementById("ag-atividades-turma");
  const atividadesTurma = atEl ? atEl.value : null;
  document.querySelectorAll(".agenda-card").forEach((card) => {
    const aluno = card.dataset.aluno;
    const chave = chaveAgenda(aluno, agendaDataSel);
    const prev = ag[chave] || {};
    const alimentacao = [...card.querySelectorAll(".ag-refeicao-row")]
      .map((r) => ({ refeicao: r.querySelector(".ag-refeicao").value, horario: r.querySelector(".ag-hora").value, detalhes: r.querySelector(".ag-detalhes").value }))
      .filter((x) => x.horario);
    const sono = [...card.querySelectorAll(".ag-sono-row")]
      .map((r) => ({ situacao: r.querySelector(".ag-sono-sit").value, horario: r.querySelector(".ag-hora").value }))
      .filter((x) => x.horario);
    const obs = card.querySelector(".ag-observacoes");
    ag[chave] = {
      alimentacao, sono,
      atividades: (atividadesTurma != null) ? atividadesTurma : (prev.atividades || ""),
      observacoes: obs ? obs.value : (prev.observacoes || ""),
    };
  });
  setAgenda(ag);
}
let agendaSaveTimer = null;
function autoSalvarAgenda() {
  if (paginaAtual !== "professorAgenda" && paginaAtual !== "auxiliarAgenda") return;
  clearTimeout(agendaSaveTimer);
  agendaSaveTimer = setTimeout(salvarAgendaAtual, 300);
}
function telaAgenda(soAlimSono, titulo, subtitulo) {
  if (!agendaDataSel) agendaDataSel = new Date().toISOString().slice(0, 10);
  const turmasUsuario = turmasDoUsuario();
  // só mostra alunos depois que uma turma for escolhida
  const alunos = agendaTurmaSel ? alunosDasTurmas([agendaTurmaSel]) : [];
  const ag = getAgenda();
  const mostrarAtividades = !soAlimSono; // professor tem atividades e observações
  const atividadesTurma = (alunos.length && ag[chaveAgenda(alunos[0], agendaDataSel)]) ? (ag[chaveAgenda(alunos[0], agendaDataSel)].atividades || "") : "";
  const cards = alunos.map((nome) => {
    const e = ag[chaveAgenda(nome, agendaDataSel)] || {};
    const alim = (e.alimentacao && e.alimentacao.length) ? e.alimentacao : [{}];
    const sono = (e.sono && e.sono.length) ? e.sono : [{}];
    const recados = recadosDoAluno(nome).filter((r) => recadoISO(r) === agendaDataSel);
    const recadosHtml = recados.length
      ? `<div class="ag-secao"><div class="ag-secao-titulo">Recados do responsável (do dia)</div>${recados.map((r) => `<div class="ag-view">${esc(r.texto)} <span class="ag-recado-data">(${esc(r.hora || "")})</span></div>`).join("")}</div>`
      : "";
    const obsHtml = mostrarAtividades
      ? `<div class="ag-secao"><div class="ag-secao-titulo">Observações</div>
          <textarea class="ag-observacoes" placeholder="Observações sobre ${esc(nome)}">${esc(e.observacoes)}</textarea></div>`
      : "";
    return `
      <div class="agenda-card" data-aluno="${esc(nome)}">
        <div class="agenda-card-head"><span class="sec-avatar">${iniciais(nome)}</span><span>${nome}</span></div>
        <div class="ag-secoes">
          <div class="ag-secao">
            <div class="ag-secao-titulo">Alimentação</div>
            <div class="ag-cab"><span>Refeição</span><span>Horário</span><span>Detalhes</span><span></span></div>
            <div class="alim-lista">${alim.map(refeicaoRow).join("")}</div>
            <button type="button" class="btn-add-linha" data-add-refeicao>${ic("plus", COR.azul)} Adicionar refeição</button>
          </div>
          <div class="ag-secao">
            <div class="ag-secao-titulo">Sono</div>
            <div class="ag-cab ag-cab-sono"><span>Situação</span><span>Horário</span><span></span></div>
            <div class="sono-lista">${sono.map(sonoRow).join("")}</div>
            <button type="button" class="btn-add-linha" data-add-sono>${ic("plus", COR.azul)} Adicionar sono</button>
          </div>
        </div>
        ${obsHtml}
        ${recadosHtml}
      </div>`;
  }).join("");
  const atividadesBloco = (mostrarAtividades && agendaTurmaSel && alunos.length)
    ? `<div class="panel" style="margin-bottom:16px"><div class="ag-secao-titulo">Atividades do dia</div>
         <textarea id="ag-atividades-turma" class="ag-atividades" placeholder="Descreva as atividades do dia — será aplicado a todos os alunos da turma">${esc(atividadesTurma)}</textarea></div>`
    : "";

  let corpo;
  if (!agendaTurmaSel) {
    corpo = `<div class="panel"><div class="empty"><div class="big">${ic("users", "#9aa7b8")}</div><h2>Selecione uma turma</h2><p style="margin-top:8px">Escolha a turma no filtro acima para ver os alunos e preencher a agenda.</p></div></div>`;
  } else if (!alunos.length) {
    corpo = `<div class="panel"><div class="empty"><div class="big">${ic("users", "#9aa7b8")}</div><h2>Nenhum aluno nesta turma</h2><p style="margin-top:8px">Os alunos aparecem aqui quando forem associados a esta turma.</p></div></div>`;
  } else {
    corpo = atividadesBloco + cards;
  }

  const opTurma = [`<option value="" ${agendaTurmaSel ? "" : "selected"} disabled>Selecione a turma</option>`]
    .concat(turmasUsuario.map((t) => `<option ${t === agendaTurmaSel ? "selected" : ""}>${esc(t)}</option>`)).join("");

  return `
    <div class="page-head">
      <div class="ph-left"><div><div class="ph-title">${titulo}</div><div class="ph-sub">${subtitulo}</div></div></div>
      <div class="agenda-topo">
        <div class="inp filtro-inp"><span class="d-ico">${ic("filter", "#9aa7b8")}</span><select id="agenda-turma">${opTurma}</select></div>
        <div class="inp filtro-inp"><span class="d-ico">${ic("calendar", "#9aa7b8")}</span><input type="date" id="agenda-data" value="${agendaDataSel}"></div>
      </div>
    </div>
    ${corpo}`;
}
function professorAgenda() { return telaAgenda(false, "Agenda dos Alunos", "Preencha a agenda diária de cada aluno"); }
function auxiliarAgenda() { return telaAgenda(true, "Agenda da Turma", "Preencha a alimentação e o sono de cada aluno"); }

/* Recados recebidos dos responsáveis (professor/auxiliar — somente leitura) */
function recadosProfAux() {
  const turmas = turmasDoUsuario();
  // alunos conforme o filtro de turma (Todas = todas as turmas do usuário)
  const alunosFiltro = recFiltroTurma === "Todas"
    ? alunosDasTurmas(turmas)
    : alunosDasTurmas([recFiltroTurma]);
  const recados = getRecados().filter((r) =>
    alunosFiltro.includes(r.aluno) &&
    (!recFiltroData || recadoISO(r) === recFiltroData)
  );
  // descobre a turma de um aluno (dentre as turmas do usuário) para exibir a etiqueta
  const turmaDoAluno = (nome) => {
    const t = getTurmas().find((x) => turmas.includes(x.nome) && (x.alunos || []).includes(nome));
    return t ? t.nome : "";
  };
  const opTurma = [`<option value="Todas">Todas as turmas</option>`]
    .concat(turmas.map((t) => `<option ${t === recFiltroTurma ? "selected" : ""}>${esc(t)}</option>`)).join("");
  const temFiltro = recFiltroTurma !== "Todas" || recFiltroData;
  const corpo = recados.length
    ? recados.map((r) => {
        const tn = turmaDoAluno(r.aluno);
        return `
        <div class="resp-dia-card">
          <div class="resp-dia-data">${esc(r.aluno)}${tn ? ` <span class="rec-turma-tag">${esc(tn)}</span>` : ""} <span class="ag-recado-data">· ${esc(r.data || "")} ${esc(r.hora || "")}</span></div>
          <div class="ag-view">${esc(r.texto)}</div>
        </div>`;
      }).join("")
    : `<div class="empty"><div class="big">${ic("doc", "#9aa7b8")}</div><h2>Nenhum recado ${temFiltro ? "para o filtro" : "recebido"}</h2><p style="margin-top:8px">Os recados enviados pelos responsáveis dos seus alunos aparecem aqui.</p></div>`;
  return `
    <div class="page-head"><div class="ph-left"><div><div class="ph-title">Recados</div><div class="ph-sub">Recados enviados pelos responsáveis (somente leitura)</div></div></div></div>
    <div class="panel">
      <div class="filtro-bar">
        <span class="filtro-label">${ic("filter", "#7a8aa0")} Filtrar por</span>
        <div class="inp filtro-inp"><select id="rec-filtro-turma">${opTurma}</select></div>
        <div class="inp filtro-inp"><input type="date" id="rec-filtro-data" value="${recFiltroData}"></div>
        ${temFiltro ? `<button type="button" class="btn-mini-azul" data-rec-limpar>${ic("x", COR.azul)} Limpar filtros</button>` : ""}
      </div>
      ${corpo}
    </div>`;
}

/* ----- Turmas do usuário (professor / auxiliar) ----- */
function telaTurmas(titulo, subtitulo, mostrarAlunos) {
  const lista = getTurmas().filter((t) => turmasDoUsuario().includes(t.nome));
  const linhas = lista.map((t) => `
    <tr><td><div class="cell-nome"><span class="sec-avatar">${ic("tag", COR.laranja)}</span>${t.nome}</div></td>
    <td>${t.periodo || "—"}</td><td>${t.faixa || "—"}</td><td>${(t.alunos || []).length} aluno(s)</td>${mostrarAlunos ? `<td><button class="btn-mini-azul" data-listar-turma="${esc(t.nome)}">${ic("users", COR.azul)} Listar alunos</button></td>` : ""}</tr>`).join("");
  const corpo = lista.length
    ? `<table><thead><tr><th>Turma</th><th>Período</th><th>Faixa etária</th><th>Alunos</th>${mostrarAlunos ? "<th></th>" : ""}</tr></thead><tbody>${linhas}</tbody></table>`
    : `<div class="empty"><div class="big">${ic("tag", "#9aa7b8")}</div><h2>Nenhuma turma vinculada</h2></div>`;
  return `
    <div class="page-head"><div class="ph-left"><div><div class="ph-title">${titulo}</div><div class="ph-sub">${subtitulo}</div></div></div></div>
    <div class="panel">${corpo}</div>`;
}
function professorTurmas() { return telaTurmas("Minhas Turmas", "Turmas em que você leciona", true); }
function auxiliarTurmas() { return telaTurmas("Turmas", "Turmas em que você atua", false); }

/* Formata data ISO (aaaa-mm-dd) para dd/mm/aaaa */
function dataBR(v) { const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(v || ""); return m ? `${m[3]}/${m[2]}/${m[1]}` : (v || "—"); }

/* Professor: lista os alunos de uma turma com o cadastro básico */
function professorAlunos() {
  const turma = getTurmas().find((t) => t.nome === turmaAlunosSel);
  const nomes = turma ? (turma.alunos || []) : [];
  const alunos = getAlunos();
  const cards = nomes.map((nome) => {
    const a = alunos.find((x) => x.nome === nome) || { nome };
    const resp = (a.responsaveis || []).length ? (a.responsaveis || []).join(", ") : "—";
    const restr = restricoesTexto(a) || "Nenhuma";
    return `
      <div class="aluno-card">
        <div class="aluno-card-head"><span class="sec-avatar">${iniciais(a.nome || "?")}</span><b>${esc(a.nome)}</b></div>
        <div class="aluno-info"><span class="ai-label">Data de nascimento</span><span class="ai-val">${dataBR(a.data_nascimento)}</span></div>
        <div class="aluno-info"><span class="ai-label">Responsáveis</span><span class="ai-val">${esc(resp)}</span></div>
        <div class="aluno-info"><span class="ai-label">Restrições alimentares</span><span class="ai-val">${esc(restr)}</span></div>
      </div>`;
  }).join("");
  const corpo = nomes.length
    ? `<div class="alunos-grid">${cards}</div>`
    : `<div class="empty"><div class="big">${ic("users", "#9aa7b8")}</div><h2>Nenhum aluno nesta turma</h2><p style="margin-top:8px">Os alunos são associados à turma no cadastro de turmas.</p></div>`;
  return `
    <div class="page-head">
      <div class="ph-left">
        <button class="back-btn" data-goto="professorTurmas" title="Voltar">${ic("arrowLeft", COR.azul)}</button>
        <div><div class="ph-title">Alunos da turma ${esc(turmaAlunosSel)}</div><div class="ph-sub">Cadastro básico dos alunos da turma</div></div>
      </div>
    </div>
    <div class="panel">${corpo}</div>`;
}

/* ----- Responsável: AGENDA do(s) filho(s) (somente leitura) ----- */
/* ===================== APP DO RESPONSÁVEL (#8) ===================== */
function filhosDoResponsavel() {
  const nome = (sessao && sessao.nome) || "";
  return getAlunos().filter((a) => (a.responsaveis || []).includes(nome));
}
function alunoRespAtual() {
  const filhos = filhosDoResponsavel();
  if (!respAlunoSel || !filhos.find((a) => a.nome === respAlunoSel)) respAlunoSel = filhos.length ? filhos[0].nome : "";
  return filhos.find((a) => a.nome === respAlunoSel) || null;
}
function respSemFilho() {
  return `<div class="panel"><div class="empty"><div class="big">${ic("users", "#9aa7b8")}</div><h2>Nenhum filho vinculado</h2><p style="margin-top:8px">Fale com a secretaria para vincular seu filho(a) ao seu cadastro.</p></div></div>`;
}
function respHeader(titulo, comData, comMes) {
  const filhos = filhosDoResponsavel();
  const aluno = alunoRespAtual();
  const selFilho = filhos.length > 1 ? `<div class="inp filtro-inp"><span class="d-ico">${ic("users", "#9aa7b8")}</span><select id="resp-filho">${filhos.map((f) => `<option ${aluno && f.nome === aluno.nome ? "selected" : ""}>${esc(f.nome)}</option>`).join("")}</select></div>` : "";
  const dataF = comData ? `<div class="inp filtro-inp"><span class="d-ico">${ic("calendar", "#9aa7b8")}</span><input type="date" id="resp-data" value="${agendaDataSel}"></div>` : "";
  let mesF = "";
  if (comMes) {
    const [anoSel, mmSel] = respMesSel.split("-");
    const anoAtual = new Date().getFullYear();
    const anos = [anoAtual, anoAtual - 1];
    const opMes = MESES.map((m, idx) => { const v = String(idx + 1).padStart(2, "0"); return `<option value="${v}" ${v === mmSel ? "selected" : ""}>${m}</option>`; }).join("");
    const opAno = anos.map((a) => `<option ${String(a) === anoSel ? "selected" : ""}>${a}</option>`).join("");
    mesF = `<div class="inp filtro-inp"><span class="d-ico">${ic("calendar", "#9aa7b8")}</span><select id="resp-mes-mes">${opMes}</select></div>
            <div class="inp filtro-inp"><select id="resp-mes-ano">${opAno}</select></div>`;
  }
  return `<div class="page-head"><div class="ph-left"><button class="back-btn" data-goto="inicioResponsavel" title="Voltar">${ic("arrowLeft", COR.azul)}</button><div><div class="ph-title">${titulo}</div><div class="ph-sub">${esc(aluno ? aluno.nome : "")}</div></div></div><div class="agenda-topo">${selFilho}${dataF}${mesF}</div></div>`;
}
function inicioResponsavel() {
  if (!agendaDataSel) agendaDataSel = new Date().toISOString().slice(0, 10);
  const aluno = alunoRespAtual();
  if (!aluno) return `<div class="resp-topo"><div class="resp-saud">Olá!</div></div>` + respSemFilho();
  const filhos = filhosDoResponsavel();
  const selFilho = filhos.length > 1 ? `<div class="inp filtro-inp" style="margin-left:auto"><span class="d-ico">${ic("users", "#fff")}</span><select id="resp-filho">${filhos.map((f) => `<option ${f.nome === aluno.nome ? "selected" : ""}>${esc(f.nome)}</option>`).join("")}</select></div>` : "";
  const tiles = [
    { p: "respFrequencia", i: "check", c: "#22a06b", t: "Frequência", s: "Presenças do ano" },
    { p: "respAlimentacao", i: "apple", c: "#e2536e", t: "Alimentação", s: "Refeições registradas" },
    { p: "respSoninho", i: "clipboard", c: "#7c5cdb", t: "Soninho", s: "Registros de sono" },
    { p: "respAtividades", i: "clipboard", c: "#2563eb", t: "Atividades", s: "Do dia" },
    { p: "respObservacoes", i: "note", c: "#f97316", t: "Observações", s: "Do dia" },
    { p: "respCardapio", i: "apple", c: "#1c8055", t: "Cardápio do dia", s: "O que vai comer" },
    { p: "respDados", i: "userline", c: "#0ea5e9", t: "Dados do aluno", s: "Foto e cadastro" },
    { p: "respRecados", i: "doc", c: "#d97706", t: "Recados", s: "Enviar recado" },
  ];
  return `
    <div class="resp-topo">
      <div class="resp-avatar">${aluno.foto ? `<img src="${aluno.foto}" alt="">` : iniciais(aluno.nome)}</div>
      <div><div class="resp-saud">Olá! Acompanhe o dia de</div><div class="resp-aluno-nome">${esc(aluno.nome)}</div></div>
      ${selFilho}
    </div>
    <div class="resp-tiles">
      ${tiles.map((x) => `<button class="resp-tile" data-goto="${x.p}" style="--c:${x.c}"><span class="resp-tile-ico">${ic(x.i, "#fff")}</span><span class="resp-tile-t">${x.t}</span><span class="resp-tile-s">${x.s}</span></button>`).join("")}
    </div>`;
}
function respFrequencia() {
  const aluno = alunoRespAtual();
  if (!aluno) return respHeader("Frequência") + respSemFilho();
  const regs = getFrequencia().filter((f) => f.pessoa === aluno.nome && (f.data || "").startsWith(respMesSel));
  const dias = {};
  regs.forEach((f) => { (dias[f.data] = dias[f.data] || []).push(f); });
  const linhas = Object.keys(dias).sort().reverse().map((data) => {
    const ent = dias[data].filter((f) => f.tipo === "Entrada").map((f) => f.hora).sort();
    const sai = dias[data].filter((f) => f.tipo === "Saída").map((f) => f.hora).sort();
    return `<tr><td>${dataBR(data)}</td><td>${ent[0] || "—"}</td><td>${sai[sai.length - 1] || "—"}</td></tr>`;
  }).join("");
  const corpo = linhas
    ? `<table><thead><tr><th>Data</th><th>Chegada</th><th>Saída</th></tr></thead><tbody>${linhas}</tbody></table><p class="hint" style="margin-top:10px">${Object.keys(dias).length} dia(s) de presença no mês.</p>`
    : `<div class="empty"><div class="big">${ic("check", "#9aa7b8")}</div><h2>Sem presenças no mês selecionado</h2></div>`;
  return respHeader("Frequência", false, true) + `<div class="panel">${corpo}</div>`;
}
function respHistoricoAgenda(titulo, campo, iconeRender) {
  const aluno = alunoRespAtual();
  if (!aluno) return respHeader(titulo) + respSemFilho();
  const ag = getAgenda();
  const umAnoAtras = new Date(Date.now() - 366 * 864e5).toISOString().slice(0, 10);
  const itens = Object.keys(ag).filter((k) => k.indexOf(aluno.nome + "||") === 0)
    .map((k) => ({ data: k.split("||")[1], e: ag[k] }))
    .filter((x) => x.data >= umAnoAtras && x.e[campo] && x.e[campo].length)
    .sort((a, b) => b.data.localeCompare(a.data));
  const cards = itens.map((x) => `<div class="resp-dia-card"><div class="resp-dia-data">${dataBR(x.data)}</div>${iconeRender(x.e[campo])}</div>`).join("");
  return respHeader(titulo) + `<div class="panel">${cards || `<div class="empty"><div class="big">${ic("apple", "#9aa7b8")}</div><h2>Nenhum registro no último ano</h2></div>`}</div>`;
}
function respAlimentacao() {
  return respHistoricoAgenda("Alimentação", "alimentacao", (arr) => arr.map((a) => `<div class="ag-view">${esc(a.refeicao || "")} — ${esc(a.horario || "—")}${a.detalhes ? " — " + esc(a.detalhes) : ""}</div>`).join(""));
}
function respSoninho() {
  return respHistoricoAgenda("Soninho", "sono", (arr) => arr.map((s) => `<div class="ag-view">${esc(s.situacao || "")} — ${esc(s.horario || "—")}</div>`).join(""));
}
function respAtividades() {
  const aluno = alunoRespAtual();
  if (!aluno) return respHeader("Atividades do dia", true) + respSemFilho();
  const e = getAgenda()[chaveAgenda(aluno.nome, agendaDataSel)] || {};
  const texto = (e.atividades || "").trim();
  const corpo = texto ? `<div class="resp-dia-card"><div class="ag-view">${esc(texto).replace(/\n/g, "<br>")}</div></div>` : `<div class="empty"><div class="big">${ic("clipboard", "#9aa7b8")}</div><h2>Nenhuma atividade registrada neste dia</h2></div>`;
  return respHeader("Atividades do dia", true) + `<div class="panel">${corpo}</div>`;
}
function respObservacoes() {
  const aluno = alunoRespAtual();
  if (!aluno) return respHeader("Observações", true) + respSemFilho();
  const e = getAgenda()[chaveAgenda(aluno.nome, agendaDataSel)] || {};
  const texto = (e.observacoes || "").trim();
  const hoje = new Date().toISOString().slice(0, 10);
  const vazio = agendaDataSel === hoje ? "Nenhuma observação no dia de hoje" : "Nenhuma observação neste dia";
  const corpo = texto ? `<div class="resp-dia-card"><div class="ag-view">${esc(texto).replace(/\n/g, "<br>")}</div></div>` : `<div class="empty"><div class="big">${ic("note", "#9aa7b8")}</div><h2>${vazio}</h2></div>`;
  return respHeader("Observações", true) + `<div class="panel">${corpo}</div>`;
}
function respCardapio() {
  const aluno = alunoRespAtual();
  if (!aluno) return respHeader("Cardápio do dia", true) + respSemFilho();
  const turma = turmaDoAluno(aluno.nome);
  const [ano, mes] = agendaDataSel.split("-");
  const lista = getCardapios().filter((c) => String(c.ano) === ano && MESES.indexOf(c.mes) === (Number(mes) - 1));
  const cardMes = lista.find((c) => c.turma === turma) || lista[0];
  const dia = cardMes ? (cardMes.dias || {})[agendaDataSel] : "";
  const corpo = dia ? `<div class="resp-dia-card ag-cardapio">${dia}</div>` : `<div class="empty"><div class="big">${ic("apple", "#9aa7b8")}</div><h2>Sem cardápio para este dia</h2></div>`;
  return respHeader("Cardápio do dia", true) + `<div class="panel">${corpo}</div>`;
}
function respDados() {
  const aluno = alunoRespAtual();
  if (!aluno) return respHeader("Dados do aluno") + respSemFilho();
  return respHeader("Dados do aluno") + `
    <div class="panel">
      <div class="resp-foto-area">
        <div class="resp-foto-grande">${aluno.foto ? `<img src="${aluno.foto}" alt="">` : iniciais(aluno.nome)}</div>
        <button type="button" class="btn-mini-azul" data-resp-foto>${ic("camera", COR.azul)} Alterar foto</button>
        <input type="file" id="resp-foto-input" accept="image/png,image/jpeg" hidden>
      </div>
      <div class="aluno-info"><span class="ai-label">Nome</span><span class="ai-val">${esc(aluno.nome)}</span></div>
      <div class="aluno-info"><span class="ai-label">Matrícula</span><span class="ai-val">${esc(aluno.matricula || "—")}</span></div>
      <div class="aluno-info"><span class="ai-label">RA</span><span class="ai-val">${esc(aluno.ra || "—")}</span></div>
      <div class="aluno-info"><span class="ai-label">Data de nascimento</span><span class="ai-val">${dataBR(aluno.data_nascimento)}</span></div>
      <div class="aluno-info"><span class="ai-label">Turma</span><span class="ai-val">${esc(turmaDoAluno(aluno.nome) || "—")}</span></div>
      <div class="aluno-info"><span class="ai-label">Endereço</span><span class="ai-val">${esc([aluno.rua, aluno.numero, aluno.bairro].filter(Boolean).join(", ") || "—")}</span></div>
      <div class="aluno-info"><span class="ai-label">Restrições</span><span class="ai-val">${esc(restricoesTexto(aluno) || "Nenhuma")}</span></div>
    </div>`;
}
function respRecados() {
  const aluno = alunoRespAtual();
  if (!aluno) return respHeader("Recados") + respSemFilho();
  const recados = recadosDoAluno(aluno.nome);
  const lista = recados.length
    ? recados.map((r) => `<div class="resp-dia-card"><div class="ag-view">${esc(r.texto)}</div><div class="resp-dia-data">${esc(r.data || "")} ${esc(r.hora || "")}</div></div>`).join("")
    : `<p class="hint">Nenhum recado enviado ainda.</p>`;
  return respHeader("Recados") + `
    <div class="panel">
      <div class="ag-secao-titulo">Enviar recado para a professora / auxiliar</div>
      <textarea id="resp-recado-txt" class="ag-atividades" placeholder="Digite seu recado..."></textarea>
      <button type="button" class="btn-laranja" id="resp-recado-enviar" style="margin-top:10px">${ic("save", "#fff")} Enviar recado</button>
      <div class="ag-secao-titulo" style="margin-top:22px">Recados enviados</div>
      ${lista}
    </div>`;
}

function responsavelAgenda() {
  if (!agendaDataSel) agendaDataSel = new Date().toISOString().slice(0, 10);
  const nome = (sessao && sessao.nome) || "";
  const filhos = getAlunos().filter((a) => (a.responsaveis || []).includes(nome));
  const ag = getAgenda();
  const linhaView = (txt) => `<div class="ag-view">${txt}</div>`;
  // Cardápio do dia (a partir do cardápio mensal cadastrado)
  const [anoSel, mesSel] = agendaDataSel.split("-");
  const cardapioMes = getCardapios().find((c) => String(c.ano) === anoSel && MESES.indexOf(c.mes) === (Number(mesSel) - 1));
  const cardapioDia = cardapioMes ? (cardapioMes.dias || {})[agendaDataSel] : "";

  const cards = filhos.map((aluno) => {
    const e = ag[chaveAgenda(aluno.nome, agendaDataSel)] || {};
    const alimentacao = (e.alimentacao || []);
    const sono = (e.sono || []);
    const alimHtml = alimentacao.length
      ? alimentacao.map((a) => linhaView(`${esc(a.refeicao || "")} — ${esc(a.horario || "—")}${a.detalhes ? " — " + esc(a.detalhes) : ""}`)).join("")
      : linhaView("<span class='vazio'>Sem registros</span>");
    const sonoHtml = sono.length
      ? sono.map((s) => linhaView(`${esc(s.situacao || "")} — ${esc(s.horario || "—")}`)).join("")
      : linhaView("<span class='vazio'>Sem registros</span>");
    const texto = (v) => v && v.trim() ? esc(v).replace(/\n/g, "<br>") : "<span class='vazio'>—</span>";
    // Chegada / saída (registros da portaria)
    const regs = getFrequencia().filter((f) => f.pessoa === aluno.nome && f.data === agendaDataSel);
    const entradas = regs.filter((f) => f.tipo === "Entrada").map((f) => f.hora).sort();
    const saidas = regs.filter((f) => f.tipo === "Saída").map((f) => f.hora).sort();
    const chegada = entradas.length ? entradas[0] : "—";
    const saida = saidas.length ? saidas[saidas.length - 1] : "—";
    return `
      <div class="agenda-card-view">
        <div class="agenda-card-head"><span class="sec-avatar">${iniciais(aluno.nome)}</span><span>${aluno.nome}</span>
          <span class="ag-turma">${turmaDoAluno(aluno.nome) || ""}</span></div>
        <div class="ag-freq">
          <div class="ag-freq-item"><span class="ico">${ic("arrowDown", "#1c8055")}</span> Chegada: <b>${chegada}</b></div>
          <div class="ag-freq-item"><span class="ico">${ic("arrowUp", "#b25a12")}</span> Saída: <b>${saida}</b></div>
        </div>
        <div class="ag-secoes">
          <div class="ag-secao"><div class="ag-secao-titulo">Alimentação</div>${alimHtml}</div>
          <div class="ag-secao"><div class="ag-secao-titulo">Sono</div>${sonoHtml}</div>
        </div>
        <div class="ag-secoes">
          <div class="ag-secao"><div class="ag-secao-titulo">Atividades</div>${linhaView(texto(e.atividades))}</div>
          <div class="ag-secao"><div class="ag-secao-titulo">Observações</div>${linhaView(texto(e.observacoes))}</div>
        </div>
        <div class="ag-secao" style="margin-top:6px"><div class="ag-secao-titulo">Cardápio do dia</div>
          <div class="ag-view ag-cardapio">${cardapioDia ? cardapioDia : "<span class='vazio'>Sem cardápio para este dia</span>"}</div>
        </div>
      </div>`;
  }).join("");

  const corpo = filhos.length
    ? cards
    : `<div class="panel"><div class="empty"><div class="big">${ic("users", "#9aa7b8")}</div><h2>Nenhum aluno vinculado a você</h2><p style="margin-top:8px">Fale com a secretaria para vincular seu filho(a) ao seu cadastro.</p></div></div>`;

  return `
    <div class="page-head">
      <div class="ph-left"><div><div class="ph-title">Agenda do meu filho</div><div class="ph-sub">Acompanhe o dia a dia na escola</div></div></div>
      <div class="agenda-topo">
        <div class="inp filtro-inp"><span class="d-ico">${ic("calendar", "#9aa7b8")}</span><input type="date" id="agenda-data" value="${agendaDataSel}"></div>
      </div>
    </div>
    ${corpo}`;
}

/* ----- Almoxarife: PÁGINA INICIAL (3 opções) ----- */
function inicioAlmoxarife() {
  return `
    <div class="page-head">
      <div class="ph-left"><div class="ph-ico">${ic("box", COR.azul)}</div>
        <div><div class="ph-title">Área do Almoxarife</div><div class="ph-sub">Selecione uma opção para começar.</div></div>
      </div>
    </div>
    <div class="cards-grid cards-3">
      <div class="acao acao-lg" data-goto="estoque">
        <div class="acao-ico azul">${ic("box", COR.azul)}</div>
        <h3>Cadastro de estoque</h3>
        <p>Cadastre e controle os itens do almoxarifado.</p>
        <div class="acao-seta">${ic("arrow", COR.azul)}</div>
      </div>
      <div class="acao acao-lg" data-goto="restricoes">
        <div class="acao-ico vermelho">${ic("clipboard", COR.vermelho)}</div>
        <h3>Restrições alimentares</h3>
        <p>Veja a lista de alunos com restrições.</p>
        <div class="acao-seta">${ic("arrow", COR.azul)}</div>
      </div>
      <div class="acao acao-lg" data-goto="cardapioView">
        <div class="acao-ico verde">${ic("apple", COR.verde)}</div>
        <h3>Cardápio mensal</h3>
        <p>Visualize o cardápio do mês.</p>
        <div class="acao-seta">${ic("arrow", COR.azul)}</div>
      </div>
    </div>`;
}

/* ----- Almoxarife: ESTOQUE (lista + formulário) ----- */
function paginaEstoque() {
  const lista = getEstoque();
  const linhas = lista.map((it, i) => `
    <tr>
      <td><div class="cell-nome"><span class="sec-avatar">${ic("box", COR.azul)}</span>${it.nome}</div></td>
      <td>${it.categoria || "—"}</td>
      <td>${it.quantidade} ${it.unidade || ""}</td>
      <td>${it.validade ? it.validade.split("-").reverse().join("/") : "—"}</td>
      <td><div class="acoes-cell">
        <button class="btn-icone retirar" data-retirar="${i}" title="Retirar do estoque">${ic("arrowDown", "#b25a12")}</button>
        <button class="btn-icone editar" data-edit="${i}" data-store="estoque" title="Editar">${ic("edit", COR.azul)}</button>
        <button class="btn-icone" data-del="${i}" data-store="estoque" title="Excluir">${ic("trash", "#ef4444")}</button>
      </div></td>
    </tr>`).join("");
  const corpo = lista.length
    ? `<table><thead><tr><th>Item</th><th>Categoria</th><th>Quantidade</th><th>Validade</th><th></th></tr></thead><tbody>${linhas}</tbody></table>`
    : `<div class="empty"><div class="big">${ic("box", "#9aa7b8")}</div><h2>Nenhum item no estoque</h2><p style="margin-top:8px">Clique em "Novo item" para cadastrar.</p></div>`;
  return `
    <div class="page-head">
      <div class="ph-left"><div><div class="ph-title">Cadastro de Estoque</div><div class="ph-sub">Itens do almoxarifado</div></div></div>
      <div class="page-head-botoes">
        <button class="btn-cancelar" data-goto="listaCompra">${ic("box", "currentColor")} Lista de compra</button>
        <button class="btn-cancelar" data-goto="retiradasHistorico">${ic("history", "currentColor")} Histórico de retiradas</button>
        <button class="btn-laranja" data-form="estoque">${ic("plus", "#fff")} Novo item</button>
      </div>
    </div>
    <div class="panel">${corpo}</div>`;
}
function formRetirada() {
  const it = getEstoque()[retiradaIdx];
  if (!it) return paginaEstoque();
  return `
    <div class="page-head">
      <div class="ph-left">
        <button class="back-btn" data-goto="estoque" title="Voltar">${ic("arrowLeft", COR.azul)}</button>
        <div><div class="ph-title">Retirar do Estoque</div><div class="ph-sub">Dê baixa na quantidade de um item.</div></div>
      </div>
    </div>
    <form id="form-retirada">
      <div class="form-solo">
        <div class="form-card">
          <div class="retirada-info">
            <div class="sec-avatar">${ic("box", COR.azul)}</div>
            <div><div class="ri-nome">${it.nome}</div><div class="ri-disp">Disponível: <b>${it.quantidade} ${it.unidade || ""}</b></div></div>
          </div>
          <div class="linha c3">
            ${campo("Quantidade a retirar", true, "hash", "number", "f-qtd", "Ex.: 2", "")}
            ${campo("Responsável", false, "userline", "text", "f-responsavel", "Quem retirou", "")}
            ${campo("Data", true, "calendar", "date", "f-data-ret", "", new Date().toISOString().slice(0, 10))}
          </div>
          <div class="linha">
            ${campo("Observação", false, "note", "text", "f-obs-ret", "Motivo/uso (opcional)", "")}
          </div>
          <div class="form-actions">
            <button type="button" class="btn-cancelar" data-goto="estoque">${ic("x", "currentColor")} Cancelar</button>
            <button type="submit" class="btn-salvar">${ic("arrowDown", "#fff")} Confirmar retirada</button>
          </div>
        </div>
      </div>
    </form>`;
}
function listaCompraPage() {
  const lista = getListaCompra();
  const linhas = lista.map((c, i) => {
    const reposto = c.status === "Reposto";
    return `
    <tr class="${reposto ? "linha-reposta" : ""}">
      <td><div class="cell-nome"><span class="sec-avatar">${ic("box", COR.azul)}</span>${c.alimento}</div></td>
      <td>${c.turma || "—"}</td>
      <td>${c.necessario} ${c.unidade || ""}</td>
      <td>${c.disponivel} ${c.unidade || ""}</td>
      <td class="falta" style="color:#b25a12;font-weight:800">${c.falta} ${c.unidade || ""}</td>
      <td><span class="tag-freq ${reposto ? "entrada" : "saida"}">${reposto ? "Reposto" : "Pendente"}</span></td>
      <td><div class="acoes-cell">
        ${reposto ? "" : `<button class="btn-repor" data-repor="${i}">${ic("box", "#fff")} Repor estoque</button>`}
        <button class="btn-icone" data-del="${i}" data-store="listacompra" title="Excluir">${ic("trash", "#ef4444")}</button>
      </div></td>
    </tr>`;
  }).join("");
  const corpo = lista.length
    ? `<table><thead><tr><th>Alimento</th><th>Turma</th><th>Necessário</th><th>Em estoque</th><th>Comprar</th><th>Status</th><th></th></tr></thead><tbody>${linhas}</tbody></table>`
    : `<div class="empty"><div class="big">${ic("box", "#9aa7b8")}</div><h2>Lista de compra vazia</h2><p style="margin-top:8px">Itens aparecem aqui quando um cardápio exige mais do que há em estoque.</p></div>`;
  return `
    <div class="page-head">
      <div class="ph-left">
        <button class="back-btn" data-goto="estoque" title="Voltar">${ic("arrowLeft", COR.azul)}</button>
        <div><div class="ph-title">Lista de Compra</div><div class="ph-sub">Reposição gerada pelas verificações de cardápio (RF-14)</div></div>
      </div>
    </div>
    <div class="panel">${corpo}</div>`;
}
function retiradasHistorico() {
  const lista = getRetiradas();
  const linhas = lista.map((r, i) => `
    <tr>
      <td>${(r.data || "").split("-").reverse().join("/")}</td>
      <td><div class="cell-nome"><span class="sec-avatar">${ic("box", COR.azul)}</span>${r.item}</div></td>
      <td>${r.quantidade} ${r.unidade || ""}</td>
      <td>${r.responsavel || "—"}</td>
      <td>${r.observacao || "—"}</td>
      <td><div class="acoes-cell"><button class="btn-icone" data-del="${i}" data-store="retirada" title="Excluir">${ic("trash", "#ef4444")}</button></div></td>
    </tr>`).join("");
  const corpo = lista.length
    ? `<table><thead><tr><th>Data</th><th>Item</th><th>Quantidade</th><th>Responsável</th><th>Observação</th><th></th></tr></thead><tbody>${linhas}</tbody></table>`
    : `<div class="empty"><div class="big">${ic("arrowDown", "#9aa7b8")}</div><h2>Nenhuma retirada registrada</h2></div>`;
  return `
    <div class="page-head">
      <div class="ph-left">
        <button class="back-btn" data-goto="estoque" title="Voltar">${ic("arrowLeft", COR.azul)}</button>
        <div><div class="ph-title">Histórico de Retiradas</div><div class="ph-sub">Baixas feitas no estoque</div></div>
      </div>
    </div>
    <div class="panel">${corpo}</div>`;
}
function formEstoque() {
  const editando = editEstoqueIdx != null;
  const d = editando ? getEstoque()[editEstoqueIdx] : {};
  return `
    <div class="page-head">
      <div class="ph-left">
        <button class="back-btn" data-goto="estoque" title="Voltar">${ic("arrowLeft", COR.azul)}</button>
        <div><div class="ph-title">${editando ? "Editar" : "Novo"} Item</div><div class="ph-sub">${editando ? "Altere os dados do item." : "Cadastre um item no estoque."}</div></div>
      </div>
    </div>
    <form id="form-estoque">
      <div class="form-solo">
        <div class="form-card">
          <div class="bloco-titulo">Dados do item</div>
          <div class="linha c2">
            ${campo("Nome do item", true, "box", "text", "f-nome", "Ex.: Arroz", d.nome)}
            ${campo("Categoria", false, "tag", "text", "f-categoria", "Ex.: Alimento, Higiene", d.categoria)}
          </div>
          <div class="linha c3">
            ${campo("Quantidade", true, "hash", "number", "f-quantidade", "Ex.: 20", d.quantidade)}
            ${campoSelect("Unidade", true, "box", "f-unidade", ["un", "kg", "g", "L", "ml", "caixa", "pacote"], d.unidade)}
            ${campo("Validade", false, "calendar", "date", "f-validade", "", d.validade)}
          </div>
          <div class="form-actions">
            <button type="button" class="btn-cancelar" data-goto="estoque">${ic("x", "currentColor")} Cancelar</button>
            <button type="submit" class="btn-salvar">${ic("save", "#fff")} Salvar item</button>
          </div>
        </div>
      </div>
    </form>`;
}

/* ----- Cardápio em visualização (somente leitura) ----- */
function calendarioCardapioView(cardapio) {
  const mesIndex = MESES.indexOf(cardapio.mes);
  const ano = cardapio.ano;
  const dias = cardapio.dias || {};
  const dim = new Date(ano, mesIndex + 1, 0).getDate();
  let cards = "";
  for (let d = 1; d <= dim; d++) {
    const dt = new Date(ano, mesIndex, d);
    const dow = dt.getDay();
    if (dow < 1 || dow > 5) continue;
    const iso = `${ano}-${String(mesIndex + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    const label = `${DIAS_SEMANA[dow - 1]} ${String(d).padStart(2, "0")}/${String(mesIndex + 1).padStart(2, "0")}/${ano}`;
    const conteudo = dias[iso] || "<span style='color:#9aa7b8'>Sem cardápio</span>";
    cards += `<div class="dia-card" style="grid-column:${dow}"><div class="dia-head">${label}</div><div class="dia-editor dia-view">${conteudo}</div></div>`;
  }
  const header = DIAS_SEMANA.map((n) => `<div class="dia-col-head">${n}</div>`).join("");
  return `<div class="cal-header">${header}</div><div class="cal-grid">${cards}</div>`;
}
function cardapioView() {
  const lista = getCardapios();
  const head = `
    <div class="page-head"><div class="ph-left">
      <button class="back-btn" data-goto="inicioAlmoxarife" title="Voltar">${ic("arrowLeft", COR.azul)}</button>
      <div><div class="ph-title">Cardápio Mensal</div><div class="ph-sub">Visualização do cardápio</div></div></div></div>`;
  if (!lista.length) {
    return head + `<div class="panel"><div class="empty"><div class="big">${ic("apple", "#9aa7b8")}</div><h2>Nenhum cardápio disponível</h2><p style="margin-top:8px">A secretaria ainda não cadastrou cardápios.</p></div></div>`;
  }
  const turmas = [...new Set(lista.map((c) => c.turma).filter(Boolean))];
  const meses = [...new Set(lista.map((c) => `${c.mes}/${c.ano}`))];
  const opTurma = [`<option value="Todas">Todas as turmas</option>`].concat(turmas.map((t) => `<option ${t === viewCardapioTurma ? "selected" : ""}>${esc(t)}</option>`)).join("");
  const opMes = [`<option value="Todos">Todos os meses</option>`].concat(meses.map((m) => `<option ${m === viewCardapioMes ? "selected" : ""}>${esc(m)}</option>`)).join("");
  const filtrados = lista.filter((c) => (viewCardapioTurma === "Todas" || c.turma === viewCardapioTurma) && (viewCardapioMes === "Todos" || `${c.mes}/${c.ano}` === viewCardapioMes));
  const corpo = filtrados.length
    ? filtrados.map((c) => `<div style="margin-bottom:22px"><div class="bloco-titulo">${esc(c.turma || "—")} · ${esc(c.mes)}/${c.ano}</div>${calendarioCardapioView(c)}</div>`).join("")
    : `<div class="empty"><div class="big">${ic("apple", "#9aa7b8")}</div><h2>Nenhum cardápio para o filtro</h2></div>`;
  return head + `
    <div class="panel">
      <div class="filtro-bar">
        <span class="filtro-label">${ic("filter", "#7a8aa0")} Filtrar por</span>
        <div class="inp filtro-inp"><select id="cardapio-view-turma">${opTurma}</select></div>
        <div class="inp filtro-inp"><select id="cardapio-view-mes">${opMes}</select></div>
      </div>
      ${corpo}
    </div>`;
}

/* ----- Porteiro: PÁGINA INICIAL (2 opções) ----- */
function inicioPorteiro() {
  return `
    <div class="page-head">
      <div class="ph-left"><div class="ph-ico">${ic("clipboard", COR.azul)}</div>
        <div><div class="ph-title">Área do Porteiro</div><div class="ph-sub">Selecione uma opção para começar.</div></div>
      </div>
    </div>
    <div class="cards-grid cards-2">
      <div class="acao acao-lg" data-goto="porteiroFrequencia">
        <div class="acao-ico azul">${ic("check", COR.azul)}</div>
        <h3>Registrar frequência</h3>
        <p>Leia o QR Code do aluno para registrar entrada/saída.</p>
        <div class="acao-seta">${ic("arrow", COR.azul)}</div>
      </div>
      <div class="acao acao-lg" data-goto="porteiroHistorico">
        <div class="acao-ico verde">${ic("history", COR.verde)}</div>
        <h3>Histórico de registros</h3>
        <p>Veja os registros de entrada e saída.</p>
        <div class="acao-seta">${ic("arrow", COR.azul)}</div>
      </div>
    </div>`;
}

/* ----- Porteiro: REGISTRAR FREQUÊNCIA (leitura de QR Code) ----- */
function porteiroFrequencia() {
  const opcoes = alunosNomes().map((n) => `<option>${n}</option>`).join("");
  return `
    <div class="page-head">
      <div class="ph-left">
        <button class="back-btn" data-goto="inicioPorteiro" title="Voltar">${ic("arrowLeft", COR.azul)}</button>
        <div><div class="ph-title">Registrar Frequência</div><div class="ph-sub">Aponte a câmera para o QR Code do aluno.</div></div>
      </div>
    </div>
    <div class="panel qr-panel">
      <div id="qr-reader" class="qr-reader"></div>
      <div id="qr-status" class="qr-status">Iniciando a câmera...</div>
      <div class="qr-manual">
        <div class="qr-manual-titulo">Leitura manual (caso a câmera não abra)</div>
        <div class="add-campo-row">
          <div class="inp" style="flex:1">${ic("search", "#9aa7b8")}<select id="qr-manual-sel"><option value="">Selecione o aluno...</option>${opcoes}</select></div>
          <button type="button" class="btn-laranja" data-qr-manual>${ic("check", "#fff")} Registrar</button>
        </div>
      </div>
    </div>`;
}

/* ----- Porteiro: HISTÓRICO DE REGISTROS ----- */
function porteiroHistorico() {
  const freq = getFrequencia();
  const linhas = freq.map((f, i) => `
    <tr>
      <td>${f.data.split("-").reverse().join("/")}</td>
      <td>${f.hora}</td>
      <td><div class="cell-nome"><span class="sec-avatar">${iniciais(f.pessoa)}</span>${f.pessoa}</div></td>
      <td><span class="tag-freq ${f.tipo === "Entrada" ? "entrada" : "saida"}">${f.tipo}</span></td>
      <td><div class="acoes-cell"><button class="btn-icone" data-del="${i}" data-store="freq" title="Excluir">${ic("trash", "#ef4444")}</button></div></td>
    </tr>`).join("");
  const corpo = freq.length
    ? `<table><thead><tr><th>Data</th><th>Hora</th><th>Aluno</th><th>Registro</th><th></th></tr></thead><tbody>${linhas}</tbody></table>`
    : `<div class="empty"><div class="big">${ic("history", "#9aa7b8")}</div><h2>Nenhum registro ainda</h2><p style="margin-top:8px">Os registros de entrada e saída aparecem aqui.</p></div>`;
  return `
    <div class="page-head">
      <div class="ph-left">
        <button class="back-btn" data-goto="inicioPorteiro" title="Voltar">${ic("arrowLeft", COR.azul)}</button>
        <div><div class="ph-title">Histórico de Registros</div><div class="ph-sub">Entradas e saídas registradas</div></div>
      </div>
    </div>
    <div class="panel">${corpo}</div>`;
}

/* ----- Câmera + QR + processamento do registro ----- */
function pararCameraQR() {
  if (qrReader) {
    try {
      qrReader.stop().then(function () { try { qrReader.clear(); } catch (e) {} qrReader = null; })
        .catch(function () { qrReader = null; });
    } catch (e) { qrReader = null; }
  }
}
function iniciarCameraQR() {
  const status = document.getElementById("qr-status");
  const alvo = document.getElementById("qr-reader");
  if (!alvo) return;
  if (!window.Html5Qrcode) {
    if (status) status.textContent = "Leitor de QR não carregou. Use a leitura manual abaixo.";
    return;
  }
  // Função chamada a cada QR lido com sucesso
  const aoLer = (texto) => { processarQR(texto); };

  qrReader = new window.Html5Qrcode("qr-reader", { verbose: false });
  const config = { fps: 10, qrbox: { width: 230, height: 230 }, aspectRatio: 1.0 };

  // Tenta a câmera traseira (environment); se falhar, usa qualquer câmera disponível.
  qrReader.start({ facingMode: { exact: "environment" } }, config, aoLer)
    .then(() => { if (status) status.textContent = "Câmera ativa. Aponte para o QR Code do aluno. (v" + (window.__SK_VERSAO || "?") + ")"; })
    .catch(() => {
      qrReader.start({ facingMode: "environment" }, config, aoLer)
        .then(() => { if (status) status.textContent = "Câmera ativa. Aponte para o QR Code do aluno. (v" + (window.__SK_VERSAO || "?") + ")"; })
        .catch(() => {
          qrReader.start(true, config, aoLer) // true = primeira câmera disponível
            .then(() => { if (status) status.textContent = "Câmera ativa. Aponte para o QR Code do aluno. (v" + (window.__SK_VERSAO || "?") + ")"; })
            .catch(() => { if (status) status.textContent = "Não foi possível abrir a câmera. Permita o acesso ou use a leitura manual abaixo."; });
        });
    });
}
function processarQR(valor) {
  let pessoa = (valor || "").trim();
  if (!pessoa) return;
  // Se o valor lido for um código QR de aluno, converte para o nome do aluno
  const alunoPorQR = getAlunos().find((a) => a.qr_code && a.qr_code === pessoa);
  if (alunoPorQR) pessoa = alunoPorQR.nome;
  const agora = Date.now();
  if (qrUltimo && qrUltimo.valor === pessoa && (agora - qrUltimo.t) < 3500) return; // evita leitura repetida
  qrUltimo = { valor: pessoa, t: agora };
  const hoje = new Date().toISOString().slice(0, 10);
  const freq = getFrequencia();
  const doDia = freq.filter((f) => f.data === hoje && f.pessoa === pessoa);
  const tipo = (doDia.length % 2 === 0) ? "Entrada" : "Saída";
  const hora = new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  freq.unshift({ pessoa, tipo, data: hoje, hora });
  setFrequencia(freq);
  notificarResponsaveis(pessoa, tipo, hora, hoje);
  mostrarPopupFreq(tipo, pessoa, hora);
}
function mostrarReporModal(i) {
  const item = getListaCompra()[i];
  if (!item) return;
  const hoje = new Date().toISOString().slice(0, 10);
  const div = document.createElement("div");
  div.className = "qr-popup-overlay";
  div.innerHTML = `<div class="qr-popup repor-modal">
    <div class="qr-popup-tipo" style="color:var(--azul-titulo);font-size:20px">Repor estoque</div>
    <div class="qr-popup-pessoa">${esc(item.alimento)}</div>
    <div class="repor-campos">
      <label>Quantidade a repor <span class="obrig">*</span>
        <input type="number" id="rep-qtd" min="0" placeholder="Ex.: 10 ${esc(item.unidade || "")}"></label>
      <label>Data de entrada <span class="obrig">*</span>
        <input type="date" id="rep-entrada" value="${hoje}"></label>
      <label>Data de vencimento
        <input type="date" id="rep-venc"></label>
    </div>
    <div class="repor-botoes">
      <button class="btn-cancelar" type="button" data-fechar-popup>Cancelar</button>
      <button class="btn-salvar" type="button" id="rep-confirmar" style="background:var(--verde)">${ic("check", "#fff")} Confirmar reposição</button>
    </div>
  </div>`;
  document.body.appendChild(div);
  const fechar = () => { if (div.parentNode) div.remove(); };
  div.addEventListener("click", (e) => { if (e.target === div || e.target.closest("[data-fechar-popup]")) fechar(); });
  div.querySelector("#rep-confirmar").addEventListener("click", () => {
    const qtd = Number(div.querySelector("#rep-qtd").value);
    const entrada = div.querySelector("#rep-entrada").value;
    const venc = div.querySelector("#rep-venc").value;
    if (!(qtd > 0)) { aviso("Informe a quantidade a repor."); return; }
    if (!entrada) { aviso("Informe a data de entrada."); return; }
    reporEstoque(i, qtd, entrada, venc);
    fechar();
    aviso("Estoque reposto com sucesso!");
    abrir("listaCompra");
  });
}
function mostrarQRAluno(aluno) {
  if (!aluno) return;
  if (!aluno.qr_code) { aviso("Este aluno ainda não tem QR Code. Edite e salve o cadastro para gerar."); return; }
  const div = document.createElement("div");
  div.className = "qr-popup-overlay";
  div.innerHTML = `<div class="qr-popup">
    <div class="qr-popup-tipo" style="color:var(--azul-titulo);font-size:19px">QR Code do aluno</div>
    <div class="qr-popup-pessoa">${esc(aluno.nome)}</div>
    <div class="qr-code-box" id="qr-render"></div>
    <div class="qr-cod-grande">${esc(aluno.qr_code)}</div>
    <div class="repor-botoes">
      <button class="btn-cancelar" type="button" data-fechar-popup>Fechar</button>
      <button class="btn-salvar" type="button" id="qr-imprimir" style="background:var(--azul)">${ic("printer", "#fff")} Imprimir tag</button>
    </div>
  </div>`;
  document.body.appendChild(div);
  desenharQR(div.querySelector("#qr-render"), aluno.qr_code);
  const btImp = div.querySelector("#qr-imprimir");
  if (btImp) btImp.addEventListener("click", () => imprimirQRAluno(aluno, div.querySelector("#qr-render")));
  const fechar = () => { if (div.parentNode) div.remove(); };
  div.addEventListener("click", (e) => { if (e.target === div || e.target.closest("[data-fechar-popup]")) fechar(); });
}

/* Imprime a tag do aluno (nome + QR Code + código) para colocar na mochila */
function imprimirQRAluno(aluno, render) {
  // Pega a imagem do QR já gerado (canvas ou img criados pelo qrcodejs)
  let src = "";
  if (render) {
    const canvas = render.querySelector("canvas");
    const img = render.querySelector("img");
    if (canvas) { try { src = canvas.toDataURL("image/png"); } catch (e) {} }
    if (!src && img) src = img.src;
  }
  if (!src) { aviso("Não foi possível preparar o QR Code para impressão. Tente abrir o QR novamente."); return; }
  const w = window.open("", "_blank", "width=430,height=600");
  if (!w) { aviso("Permita pop-ups para imprimir a tag do QR Code."); return; }
  w.document.write(
    '<!doctype html><html lang="pt-BR"><head><meta charset="utf-8">' +
    "<title>Tag QR - " + esc(aluno.nome) + "</title><style>" +
    "body{font-family:Arial,Helvetica,sans-serif;margin:0;padding:28px;text-align:center;color:#12335c}" +
    ".tag{border:2px dashed #9db6d6;border-radius:18px;padding:24px 28px;display:inline-block}" +
    ".escola{font-size:13px;letter-spacing:3px;color:#2f7de1;font-weight:bold;margin-bottom:4px}" +
    ".sub{font-size:10px;letter-spacing:2px;color:#8a97a9;margin-bottom:14px}" +
    ".nome{font-size:21px;font-weight:800;margin:4px 0 14px}" +
    "img{width:230px;height:230px;display:block;margin:0 auto}" +
    ".cod{font-size:13px;color:#555;margin-top:12px;letter-spacing:1px}" +
    ".noprint{margin-top:18px}.noprint button{padding:11px 22px;font-size:15px;border:none;border-radius:10px;background:#2563eb;color:#fff;font-weight:bold;cursor:pointer}" +
    "@media print{.noprint{display:none}}" +
    "</style></head><body>" +
    '<div class="tag">' +
    '<div class="escola">SAY KIDS</div>' +
    '<div class="sub">GESTÃO ESCOLAR</div>' +
    '<div class="nome">' + esc(aluno.nome) + "</div>" +
    '<img src="' + src + '" alt="QR Code">' +
    '<div class="cod">' + esc(aluno.qr_code) + "</div>" +
    "</div>" +
    '<div class="noprint"><button onclick="window.print()">Imprimir</button></div>' +
    "<scr" + "ipt>setTimeout(function(){window.focus();window.print();},350);</scr" + "ipt>" +
    "</body></html>"
  );
  w.document.close();
}

/* Gera um QR Code REAL e scannável usando a biblioteca QRCode (qrcodejs).
   Se a biblioteca não carregar (offline), cai num padrão visual só de aparência. */
function desenharQR(el, texto) {
  el.innerHTML = "";
  if (window.QRCode) {
    try {
      new window.QRCode(el, {
        text: texto, width: 200, height: 200,
        colorDark: "#12335c", colorLight: "#ffffff",
        correctLevel: window.QRCode.CorrectLevel.M,
      });
      return;
    } catch (e) { /* cai no fallback abaixo */ }
  }
  // Fallback (sem internet / lib indisponível): padrão visual — NÃO é scannável.
  const n = 25, cell = 8;
  let h = 0; for (let i = 0; i < texto.length; i++) h = (h * 31 + texto.charCodeAt(i)) >>> 0;
  const rand = () => { h = (h * 1103515245 + 12345) & 0x7fffffff; return h / 0x7fffffff; };
  const cv = document.createElement("canvas");
  cv.width = cv.height = n * cell; cv.style.width = cv.style.height = "200px";
  const ctx = cv.getContext("2d");
  ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, cv.width, cv.height);
  ctx.fillStyle = "#12335c";
  const finder = (x, y) => { for (let i = 0; i < 7; i++) for (let j = 0; j < 7; j++) { const b = i === 0 || i === 6 || j === 0 || j === 6 || (i >= 2 && i <= 4 && j >= 2 && j <= 4); if (b) ctx.fillRect((x + i) * cell, (y + j) * cell, cell, cell); } };
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
    if ((x < 8 && y < 8) || (x > n - 9 && y < 8) || (x < 8 && y > n - 9)) continue;
    if (rand() > 0.5) ctx.fillRect(x * cell, y * cell, cell, cell);
  }
  finder(0, 0); finder(n - 7, 0); finder(0, n - 7);
  el.appendChild(cv);
}
function mostrarPopupFreq(tipo, pessoa, hora) {
  const entrada = tipo === "Entrada";
  const cor = entrada ? "#22a06b" : "#f97316";
  const div = document.createElement("div");
  div.className = "qr-popup-overlay";
  div.innerHTML = `<div class="qr-popup">
    <div class="qr-popup-ico" style="background:${cor}">${ic("check", "#fff")}</div>
    <div class="qr-popup-tipo" style="color:${cor}">${tipo} registrada</div>
    <div class="qr-popup-pessoa">${esc(pessoa)}</div>
    <div class="qr-popup-hora">${hora}</div>
    <button class="btn-salvar" style="background:${cor}" data-fechar-popup>OK</button>
  </div>`;
  document.body.appendChild(div);
  const fechar = () => { if (div.parentNode) div.remove(); };
  div.addEventListener("click", (e) => { if (e.target === div || e.target.closest("[data-fechar-popup]")) fechar(); });
  setTimeout(fechar, 4500);
}

/* =====================================================================
   POP-UP PADRÃO DO SISTEMA (substitui o alert/confirm do navegador)
   aviso(mensagem, tipo)  -> "sucesso" | "erro" | "alerta" | "info"
   confirmar(mensagem, aoConfirmar, opcoes) -> botão Cancelar / Confirmar
   ===================================================================== */
function aviso(mensagem, tipo) {
  // Se o tipo não for informado, deduz pela mensagem.
  // Primeiro verifica sinais de FALHA/validação (têm prioridade, mesmo que a frase
  // contenha "salvar"), depois sinais de SUCESSO; o resto vira "alerta".
  if (!tipo) {
    if (/n[ãa]o |inv[áa]lid|indispon[íi]v|obrigat[óo]ri|\berro\b|falh|selecione|informe|digite|preencha|permita|m[áa]ximo|remova/i.test(mensagem))
      tipo = "alerta";
    else if (/sucesso|cadastrad|atualizad|registrad|salv|enviad|repost|emitid|exclu[íi]d|removid|gerad/i.test(mensagem))
      tipo = "sucesso";
    else tipo = "alerta";
  }
  const estilos = {
    sucesso: { cor: "#22a06b", ico: "check",  titulo: "Tudo certo!" },
    erro:    { cor: "#e2536e", ico: "x",      titulo: "Atenção" },
    alerta:  { cor: "#f97316", ico: "alerta", titulo: "Atenção" },
    info:    { cor: "#2563eb", ico: "info",   titulo: "Aviso" },
  };
  const s = estilos[tipo] || estilos.info;
  const div = document.createElement("div");
  div.className = "qr-popup-overlay";
  div.innerHTML = `<div class="qr-popup aviso-popup">
    <div class="qr-popup-ico" style="background:${s.cor}">${ic(s.ico, "#fff")}</div>
    <div class="qr-popup-tipo" style="color:${s.cor}">${s.titulo}</div>
    <div class="aviso-msg">${esc(mensagem).replace(/\n/g, "<br>")}</div>
    <button class="btn-salvar" style="background:${s.cor}" data-fechar-popup>OK</button>
  </div>`;
  document.body.appendChild(div);
  const fechar = () => { if (div.parentNode) div.remove(); };
  div.addEventListener("click", (e) => { if (e.target === div || e.target.closest("[data-fechar-popup]")) fechar(); });
  // foco no botão para permitir confirmar com Enter/Esc
  const bt = div.querySelector("[data-fechar-popup]"); if (bt) bt.focus();
}

function confirmar(mensagem, aoConfirmar, opcoes) {
  opcoes = opcoes || {};
  const perigo = opcoes.perigo !== false; // por padrão é uma ação de risco (excluir/sair)
  const cor = perigo ? "#e2536e" : "#2563eb";
  const div = document.createElement("div");
  div.className = "qr-popup-overlay";
  div.innerHTML = `<div class="qr-popup aviso-popup">
    <div class="qr-popup-ico" style="background:${cor}">${ic(perigo ? "alerta" : "info", "#fff")}</div>
    <div class="qr-popup-tipo" style="color:${cor}">${opcoes.titulo || "Confirmação"}</div>
    <div class="aviso-msg">${esc(mensagem).replace(/\n/g, "<br>")}</div>
    <div class="repor-botoes">
      <button class="btn-cancelar" type="button" data-fechar-popup>${opcoes.cancelar || "Cancelar"}</button>
      <button class="btn-salvar" type="button" id="conf-sim" style="background:${cor}">${opcoes.confirmar || "Confirmar"}</button>
    </div>
  </div>`;
  document.body.appendChild(div);
  const fechar = () => { if (div.parentNode) div.remove(); };
  div.addEventListener("click", (e) => { if (e.target === div || e.target.closest("[data-fechar-popup]")) fechar(); });
  div.querySelector("#conf-sim").addEventListener("click", () => { fechar(); if (aoConfirmar) aoConfirmar(); });
}

/* ----- Auxiliar: PÁGINA INICIAL (2 opções) ----- */
function inicioAuxiliar() {
  return `
    <div class="page-head">
      <div class="ph-left"><div class="ph-ico">${ic("clipboard", COR.azul)}</div>
        <div><div class="ph-title">Área do Auxiliar</div><div class="ph-sub">Selecione uma opção para começar.</div></div>
      </div>
    </div>
    <div class="cards-grid cards-2">
      <div class="acao acao-lg" data-goto="auxiliarAgenda">
        <div class="acao-ico azul">${ic("clipboard", COR.azul)}</div>
        <h3>Agenda da turma</h3>
        <p>Preencha a alimentação e o sono dos alunos.</p>
        <div class="acao-seta">${ic("arrow", COR.azul)}</div>
      </div>
      <div class="acao acao-lg" data-goto="auxiliarTurmas">
        <div class="acao-ico verde">${ic("users", COR.verde)}</div>
        <h3>Turmas</h3>
        <p>Veja as turmas em que você atua.</p>
        <div class="acao-seta">${ic("arrow", COR.azul)}</div>
      </div>
    </div>`;
}

function paginaEmBreve(titulo, descricao, icone) {
  return `
    <div class="page-head">
      <div class="ph-left">
        <div><div class="ph-title">${titulo}</div><div class="ph-sub">${descricao}</div></div>
      </div>
    </div>
    <div class="panel">
      <div class="empty">
        <div class="big">${ic(icone, "#9aa7b8")}</div>
        <h2>${titulo}</h2>
        <p style="margin-top:8px;max-width:480px;margin-inline:auto">${descricao}</p>
        <p style="margin-top:6px;color:#9aa7b8">Módulo em desenvolvimento — em breve disponível.</p>
      </div>
    </div>`;
}

/* ===== Gerenciar Usuários (perfil administrador) ===== */
function usuariosUnificados() {
  const arr = [];
  getSecretarias().forEach((s, i) => arr.push({ nome: s.nome, email: s.email || "", telefone: s.telefone || "", tipo: "Secretaria", store: "sec", i }));
  getProfessores().forEach((p, i) => arr.push({ nome: p.nome, email: p.email || "", telefone: p.telefone || "", tipo: "Professor", store: "prof", i }));
  getColaboradores().forEach((c, i) => arr.push({ nome: c.nome, email: c.email || "", telefone: c.telefone || "", tipo: c.funcao || "Colaborador", store: "col", i }));
  getResponsaveis().forEach((r, i) => arr.push({ nome: r.nome, email: r.email || "", telefone: r.telefone || "", tipo: "Responsável", store: "resp", i }));
  return arr;
}
function paginaGerenciarUsuarios() {
  const tipos = ["Todos", "Secretaria", "Professor", "Auxiliar", "Porteiro", "Almoxarife", "Responsável"];
  let lista = usuariosUnificados();
  if (guFiltro !== "Todos") lista = lista.filter((u) => u.tipo === guFiltro);
  const linhas = lista.map((u) => `
    <tr>
      <td><div class="cell-nome"><span class="sec-avatar">${iniciais(u.nome || "?")}</span>${esc(u.nome)}</div></td>
      <td>${esc(u.email)}</td>
      <td><span class="tag-tipo">${esc(u.tipo)}</span></td>
      <td>${esc(u.telefone)}</td>
      <td><div class="acoes-cell">
        <button class="btn-icone editar" data-gu-edit="${u.store}:${u.i}" title="Editar">${ic("edit", COR.azul)}</button>
        <button class="btn-icone" data-gu-del="${u.store}:${u.i}" title="Excluir">${ic("trash", "#ef4444")}</button>
      </div></td>
    </tr>`).join("");
  const opts = tipos.map((t) => `<option value="${t}" ${t === guFiltro ? "selected" : ""}>${t}</option>`).join("");
  const corpo = lista.length
    ? `<table><thead><tr><th>Nome</th><th>E-mail</th><th>Tipo</th><th>Telefone</th><th></th></tr></thead><tbody>${linhas}</tbody></table>`
    : `<div class="empty"><div class="big">${ic("users", "#9aa7b8")}</div><h2>Nenhum usuário encontrado</h2><p style="margin-top:8px">Ajuste o filtro de tipo acima.</p></div>`;
  return `
    <div class="page-head">
      <div class="ph-left"><div><div class="ph-title">Gerenciar Usuários</div><div class="ph-sub">Visualize, edite ou exclua os usuários do sistema.</div></div></div>
    </div>
    <div class="panel">
      <div class="gu-filtro">
        <label for="gu-filtro">Filtrar por tipo:</label>
        <div class="inp inp-gu">${ic("filter", "#9aa7b8")}<select id="gu-filtro" data-gu-filter>${opts}</select></div>
      </div>
      ${corpo}
    </div>`;
}
/* Destino de retorno dos formulários: volta ao Gerenciar Usuários quando aberto por ele */
function voltar(padrao) { return voltarGU ? "gerenciarUsuarios" : padrao; }

const PAGINAS = {
  dashboard: () => `
    <div class="stats">
      <div class="stat">
        <div class="stat-top"><div class="stat-ico azul">${ic("users", COR.azul)}</div>
          <div><div class="stat-lbl">Alunos Matriculados</div><div class="stat-num">128</div></div></div>
        <div class="stat-foot verde">${ic("arrowUp", COR.verde)} 8 novos este mês</div>
      </div>
      <div class="stat">
        <div class="stat-top"><div class="stat-ico verde">${ic("check", COR.verde)}</div>
          <div><div class="stat-lbl">Presentes Hoje</div><div class="stat-num">98</div></div></div>
        <div class="stat-foot cinza">76,6% do total</div>
      </div>
      <div class="stat">
        <div class="stat-top"><div class="stat-ico laranja">${ic("calendar", COR.laranja)}</div>
          <div><div class="stat-lbl">Ausentes Hoje</div><div class="stat-num">30</div></div></div>
        <div class="stat-foot laranja">23,4% do total</div>
      </div>
      <div class="stat">
        <div class="stat-top"><div class="stat-ico roxo">${ic("doc", COR.roxo)}</div>
          <div><div class="stat-lbl">Documentos Emitidos</div><div class="stat-num">42</div></div></div>
        <div class="stat-foot roxo">este mês</div>
      </div>
    </div>

    <h2 class="sec-titulo">Ações rápidas</h2>
    <div class="acoes">
      <div class="acao"><div class="acao-ico azul">${ic("school", COR.azul)}</div>
        <h3>Secretaria</h3><p>Gerencie as informações da secretaria da escola.</p>
        <button class="acao-btn azul" data-goto="secretaria">Acessar <span class="seta">${ic("arrow", COR.azul)}</span></button></div>
      <div class="acao"><div class="acao-ico verde">${ic("users", COR.verde)}</div>
        <h3>Colaboradores</h3><p>Cadastre e gerencie os colaboradores e auxiliares.</p>
        <button class="acao-btn verde" data-goto="colaboradores">Acessar <span class="seta">${ic("arrow", COR.verde)}</span></button></div>
      <div class="acao"><div class="acao-ico roxo">${ic("cap", COR.roxo)}</div>
        <h3>Professores</h3><p>Cadastre e gerencie os professores da escola.</p>
        <button class="acao-btn roxo" data-goto="professores">Acessar <span class="seta">${ic("arrow", COR.roxo)}</span></button></div>
      <div class="acao"><div class="acao-ico laranja">${ic("users", COR.laranja)}</div>
        <h3>Turmas</h3><p>Cadastre turmas e associe os alunos.</p>
        <button class="acao-btn laranja" data-goto="turmas">Acessar <span class="seta">${ic("arrow", COR.laranja)}</span></button></div>
      <div class="acao"><div class="acao-ico azul">${ic("userplus", COR.azul)}</div>
        <h3>Gerenciar Usuários</h3><p>Visualize, edite ou exclua os usuários do sistema.</p>
        <button class="acao-btn azul" data-goto="gerenciarUsuarios">Acessar <span class="seta">${ic("arrow", COR.azul)}</span></button></div>
      <div class="acao"><div class="acao-ico azul">${ic("clock", COR.azul)}</div>
        <h3>Histórico de movimentações</h3><p>Visualize o histórico de alterações e acessos.</p>
        <button class="acao-btn azul" data-goto="historico">Acessar <span class="seta">${ic("arrow", COR.azul)}</span></button></div>
    </div>

    <div class="panel">
      <h2>Atividades recentes</h2>
      <div class="atividade"><div class="at-ico azul">${ic("child", COR.azul)}</div>
        <div class="at-texto"><b>Novo aluno cadastrado:</b> Lucas Pereira da Silva</div><div class="at-hora">Hoje, 10:30</div></div>
      <div class="atividade"><div class="at-ico verde">${ic("users", COR.verde)}</div>
        <div class="at-texto"><b>Colaborador cadastrado:</b> Ana Beatriz Souza (Auxiliar)</div><div class="at-hora">Hoje, 09:15</div></div>
      <div class="atividade"><div class="at-ico laranja">${ic("users", COR.laranja)}</div>
        <div class="at-texto"><b>Turma "Maternal II A"</b> criada com sucesso</div><div class="at-hora">Ontem, 16:45</div></div>
      <div class="atividade"><div class="at-ico roxo">${ic("doc", COR.roxo)}</div>
        <div class="at-texto">Documento <b>"Regulamento Interno"</b> emitido</div><div class="at-hora">Ontem, 14:20</div></div>
      <button class="ver-todas" data-goto="historico">Ver todas as atividades ${ic("arrow", COR.azul)}</button>
    </div>`,

  secretaria: paginaSecretaria,
  formSecretaria: formSecretaria,
  colaboradores: paginaColaboradores,
  formColaborador: formColaborador,
  professores: paginaProfessores,
  formProfessor: formProfessor,
  turmas: paginaTurmas,
  formTurma: formTurma,
  historico: paginaHistorico,
  formMovimentacao: formMovimentacao,
  gerenciarUsuarios: paginaGerenciarUsuarios,
  // Perfil Secretaria
  inicioSecretaria: inicioSecretaria,
  alunos: paginaAlunos,
  formAluno: formAluno,
  responsaveis: paginaResponsaveis,
  formResponsavel: formResponsavel,
  documentos: paginaDocumentos,
  documentosCadastrar: documentosCadastrar,
  formDocumento: formDocumento,
  documentosEmitir: documentosEmitir,
  documentoGerado: documentoGerado,
  cardapio: paginaCardapio,
  formCardapio: formCardapio,
  cardapioVerificacao: cardapioVerificacao,
  // Perfil Professor
  inicioProfessor: inicioProfessor,
  professorAgenda: professorAgenda,
  professorTurmas: professorTurmas,
  professorAlunos: professorAlunos,
  recados: recadosProfAux,
  // Perfil Auxiliar
  inicioAuxiliar: inicioAuxiliar,
  auxiliarAgenda: auxiliarAgenda,
  auxiliarTurmas: auxiliarTurmas,
  // Perfil Porteiro
  inicioPorteiro: inicioPorteiro,
  porteiroFrequencia: porteiroFrequencia,
  porteiroHistorico: porteiroHistorico,
  // Perfil Responsável
  responsavelAgenda: responsavelAgenda,
  inicioResponsavel: inicioResponsavel,
  respFrequencia: respFrequencia,
  respAlimentacao: respAlimentacao,
  respSoninho: respSoninho,
  respAtividades: respAtividades,
  respObservacoes: respObservacoes,
  respCardapio: respCardapio,
  respDados: respDados,
  respRecados: respRecados,
  // Perfil Almoxarife
  inicioAlmoxarife: inicioAlmoxarife,
  estoque: paginaEstoque,
  formEstoque: formEstoque,
  formRetirada: formRetirada,
  retiradasHistorico: retiradasHistorico,
  listaCompra: listaCompraPage,
  cardapioView: cardapioView,
  restricoes: paginaRestricoes,
};

/* ===== Menus por perfil ===== */
const ICO = (p) => `<span class="ico">${ic(p, "currentColor")}</span>`;
const MENUS = {
  admin: [
    { page: "dashboard", ico: "home", label: "Dashboard" },
    { page: "secretaria", ico: "school", label: "Cadastrar Secretaria" },
    { page: "colaboradores", ico: "users", label: "Cadastrar Colaboradores" },
    { page: "professores", ico: "cap", label: "Cadastrar Professores" },
    { page: "turmas", ico: "users", label: "Cadastrar Turmas" },
    { page: "gerenciarUsuarios", ico: "userplus", label: "Gerenciar Usuários" },
    { page: "historico", ico: "history", label: "Histórico de movimentações" },
  ],
  secretaria: [
    { page: "inicioSecretaria", ico: "home", label: "Secretaria" },
    { page: "alunos", ico: "userplus", label: "Cadastrar Alunos" },
    { page: "responsaveis", ico: "users", label: "Cadastrar Responsáveis" },
    { page: "colaboradores", ico: "users", label: "Cadastrar Colaboradores" },
    { page: "professores", ico: "cap", label: "Cadastrar Professores" },
    { page: "turmas", ico: "users", label: "Cadastrar Turmas" },
    { page: "documentos", ico: "doc", label: "Documentos" },
    { page: "cardapio", ico: "apple", label: "Cadastrar Cardápio" },
    { page: "restricoes", ico: "clipboard", label: "Lista de alunos com Restrições Alimentares" },
  ],
  professor: [
    { page: "inicioProfessor", ico: "home", label: "Professor" },
    { page: "professorAgenda", ico: "clipboard", label: "Agenda dos Alunos" },
    { page: "professorTurmas", ico: "users", label: "Minhas Turmas" },
    { page: "recados", ico: "doc", label: "Recados" },
  ],
  auxiliar: [
    { page: "inicioAuxiliar", ico: "home", label: "Auxiliar" },
    { page: "auxiliarAgenda", ico: "clipboard", label: "Agenda da turma" },
    { page: "auxiliarTurmas", ico: "users", label: "Turmas" },
    { page: "recados", ico: "doc", label: "Recados" },
  ],
  porteiro: [
    { page: "inicioPorteiro", ico: "home", label: "Porteiro" },
    { page: "porteiroFrequencia", ico: "check", label: "Registrar frequência" },
    { page: "porteiroHistorico", ico: "history", label: "Histórico de registros" },
  ],
  almoxarife: [
    { page: "inicioAlmoxarife", ico: "home", label: "Almoxarife" },
    { page: "estoque", ico: "box", label: "Cadastro de estoque" },
    { page: "restricoes", ico: "clipboard", label: "Restrições alimentares" },
    { page: "cardapioView", ico: "apple", label: "Cardápio mensal" },
  ],
  responsavel: [
    { page: "inicioResponsavel", ico: "home", label: "Início" },
  ],
};
const HOMES = { admin: "dashboard", secretaria: "inicioSecretaria", professor: "inicioProfessor", auxiliar: "inicioAuxiliar", porteiro: "inicioPorteiro", almoxarife: "inicioAlmoxarife", responsavel: "inicioResponsavel" };
const PERFIL = (sessao && MENUS[sessao.perfil]) ? sessao.perfil : "admin";
const HOME = HOMES[PERFIL];
const SAUDACAO = {
  admin: ["Olá, Administrador!", "Bem-vindo ao painel de gestão da escola"],
  secretaria: ["Olá, Secretaria!", "Bem-vinda à secretaria. Selecione uma opção no menu ao lado."],
  professor: ["Olá, Professor(a)!", "Preencha a agenda diária dos seus alunos."],
  auxiliar: ["Olá, Auxiliar!", "Selecione uma opção no menu ao lado."],
  porteiro: ["Olá, Porteiro!", "Registre a frequência dos alunos por QR Code."],
  almoxarife: ["Olá, Almoxarife!", "Selecione uma opção no menu ao lado."],
  responsavel: ["Olá!", "Acompanhe a agenda do seu filho(a)."],
};
const ROTULO_PERFIL = { admin: "Administrador", secretaria: "Secretaria", professor: "Professor(a)", auxiliar: "Auxiliar", porteiro: "Porteiro", almoxarife: "Almoxarife", responsavel: "Responsável" };

function montarMenu() {
  const nav = document.getElementById("nav");
  nav.innerHTML = MENUS[PERFIL].map((m) =>
    `<a class="nav-item" data-page="${m.page}">${ICO(m.ico)} ${m.label}</a>`).join("");
  // Cabeçalho + usuário conforme perfil
  const [t, s] = SAUDACAO[PERFIL];
  document.getElementById("titulo-pagina").textContent = t;
  document.getElementById("subtitulo-pagina").textContent = s;
  document.getElementById("u-nome").textContent = sessao ? sessao.nome : "Perfil";
  document.getElementById("u-perfil").textContent = ROTULO_PERFIL[PERFIL];
}

const page = document.getElementById("page");
let fotoDataUrl = "";
let editSecIdx = null; // índice em edição (secretaria) ou null para novo
let editColIdx = null; // índice em edição (colaborador) ou null para novo
let voltarGU = false;  // true quando um form foi aberto pelo "Gerenciar Usuários"
let guFiltro = "Todos"; // filtro de tipo na tela Gerenciar Usuários
let turmaAlunosSel = ""; // turma selecionada para listar alunos (professor)
let editProfIdx = null; // índice em edição (professor) ou null para novo
let editTurmaIdx = null; // índice em edição (turma) ou null para novo
let turmaAlunos = []; // alunos associados durante o cadastro/edição da turma
let editMovIdx = null; // índice em edição (movimentação) ou null para novo
let filtroHistorico = "Todos"; // filtro atual do histórico
let filtroRestricaoTurma = "Todas"; // filtro de turma da lista de restrições
let editAlunoIdx = null; // índice em edição (aluno) ou null para novo
let alunoResponsaveis = []; // responsáveis associados durante o cadastro/edição do aluno
let editRespIdx = null; // índice em edição (responsável) ou null para novo
let editDocIdx = null; // índice em edição (documento) ou null para novo
let docCampos = []; // campos automáticos do documento em edição
let viewEmissaoIdx = null; // emissão sendo visualizada/impressa
let editCardapioIdx = null; // índice em edição (cardápio) ou null para novo
let cardapioDias = {}; // conteúdo por dia (ISO → HTML) no cardápio em edição
let rtRange = null, rtEditor = null; // seleção salva do editor de texto do cardápio
let agendaDataSel = ""; // data selecionada na agenda do professor
let agendaTurmaSel = ""; // turma selecionada na agenda (obrigatória antes de ver os alunos)
let respAlunoSel = "";   // filho selecionado no app do responsável
let respMesSel = new Date().toISOString().slice(0, 7); // mês (AAAA-MM) na frequência do responsável
let qrReader = null, qrUltimo = null; // estado da leitura de QR (porteiro) - html5-qrcode
let editEstoqueIdx = null; // índice em edição (estoque) ou null para novo
let retiradaIdx = null; // item selecionado para retirada
let paginaAtual = ""; // página atualmente aberta
let viewCardapioIdx = null; // cardápio selecionado na visualização
let recFiltroTurma = "Todas", recFiltroData = ""; // filtros da página de recados (professor/auxiliar)
let viewCardapioTurma = "Todas"; // filtro de turma no cardápio mensal (almoxarife)
let viewCardapioMes = "Todos";   // filtro de mês no cardápio mensal (almoxarife)
let docImgSel = null; // imagem (logo) selecionada no editor de documento
let ultimaVerificacao = null; // resultado da última verificação de cardápio

function abrir(nome, viaPop) {
  pararCameraQR(); // encerra a câmera ao trocar de página
  paginaAtual = nome;
  const render = PAGINAS[nome] || PAGINAS.dashboard;
  page.innerHTML = render();
  // destaca o item do menu (os formulários mantêm o item base ativo)
  const MAP_ATIVO = { formSecretaria: "secretaria", formColaborador: "colaboradores", formProfessor: "professores", formTurma: "turmas", formMovimentacao: "historico", formAluno: "alunos", formResponsavel: "responsaveis", documentosCadastrar: "documentos", documentosEmitir: "documentos", formDocumento: "documentos", documentoGerado: "documentos", formCardapio: "cardapio", cardapioVerificacao: "cardapio", formEstoque: "estoque", formRetirada: "estoque", retiradasHistorico: "estoque", listaCompra: "estoque" };
  const ativo = MAP_ATIVO[nome] || nome;
  document.querySelectorAll(".nav-item").forEach((el) => {
    el.classList.toggle("active", el.dataset.page === ativo);
  });
  window.scrollTo(0, 0);
  sidebar.classList.remove("open");
  overlay.classList.remove("show");
  // Inicializa a área de alunos ao abrir o formulário de turma
  if (nome === "formTurma") { renderAlunosAssociados(); renderBuscaResultados(); }
  // Inicializa a área de responsáveis ao abrir o formulário de aluno
  if (nome === "formAluno") { renderRespAssociados(); renderBuscaResp(); }
  // Inicia a câmera na tela de registrar frequência
  if (nome === "porteiroFrequencia") { iniciarCameraQR(); }
  // Registra a navegação no histórico do navegador (para o botão "voltar")
  if (!viaPop) { try { history.pushState({ sk: true, page: nome }, ""); } catch (e) {} }
}

// Botão "voltar" do navegador: navega DENTRO do painel (não desloga).
// Para sair do usuário, use o botão "Sair".
window.addEventListener("popstate", (e) => {
  if (e.state && e.state.sk && e.state.page) {
    abrir(e.state.page, true);
  } else {
    abrir(HOME, true);
    try { history.pushState({ sk: true, page: HOME }, ""); } catch (x) {}
  }
});

// Menu lateral
document.getElementById("nav").addEventListener("click", (e) => {
  const item = e.target.closest(".nav-item");
  if (item) abrir(item.dataset.page);
});

// Cliques no conteúdo (navegação, abrir formulário, excluir, foto)
page.addEventListener("click", (e) => {
  const goto = e.target.closest("[data-goto]");
  if (goto) { abrir(goto.dataset.goto); return; }

  // Imprimir / salvar a lista de compras em PDF
  if (e.target.closest("#btn-imprimir-lc")) {
    const v = ultimaVerificacao || {};
    imprimirListaCompra(v.faltas || [], `${v.turma || ""} · ${v.mes || ""}/${v.ano || ""}`);
    return;
  }

  const form = e.target.closest("[data-form]");
  if (form) {
    editSecIdx = null; editColIdx = null; editProfIdx = null; editTurmaIdx = null; editMovIdx = null; editAlunoIdx = null; editRespIdx = null; editDocIdx = null; editCardapioIdx = null; editEstoqueIdx = null; voltarGU = false; // novo cadastro
    abrir("form" + form.dataset.form.charAt(0).toUpperCase() + form.dataset.form.slice(1));
    return;
  }

  const editar = e.target.closest("[data-edit]");
  if (editar) {
    const i = Number(editar.dataset.edit);
    voltarGU = false;
    if (editar.dataset.store === "col") { editColIdx = i; abrir("formColaborador"); }
    else if (editar.dataset.store === "prof") { editProfIdx = i; abrir("formProfessor"); }
    else if (editar.dataset.store === "turma") { editTurmaIdx = i; abrir("formTurma"); }
    else if (editar.dataset.store === "mov") { editMovIdx = i; abrir("formMovimentacao"); }
    else if (editar.dataset.store === "aluno") { editAlunoIdx = i; abrir("formAluno"); }
    else if (editar.dataset.store === "resp") { editRespIdx = i; abrir("formResponsavel"); }
    else if (editar.dataset.store === "doc") { editDocIdx = i; abrir("formDocumento"); }
    else if (editar.dataset.store === "cardapio") { editCardapioIdx = i; abrir("formCardapio"); }
    else if (editar.dataset.store === "estoque") { editEstoqueIdx = i; abrir("formEstoque"); }
    else { editSecIdx = i; abrir("formSecretaria"); }
    return;
  }

  // Gerenciar Usuários (admin): editar qualquer usuário (reaproveita os formulários)
  const guEdit = e.target.closest("[data-gu-edit]");
  if (guEdit) {
    const partes = guEdit.dataset.guEdit.split(":");
    const store = partes[0], i = Number(partes[1]);
    voltarGU = true;
    if (store === "sec") { editSecIdx = i; abrir("formSecretaria"); }
    else if (store === "prof") { editProfIdx = i; abrir("formProfessor"); }
    else if (store === "col") { editColIdx = i; abrir("formColaborador"); }
    else if (store === "resp") { editRespIdx = i; abrir("formResponsavel"); }
    return;
  }
  // Gerenciar Usuários (admin): excluir qualquer usuário
  const guDel = e.target.closest("[data-gu-del]");
  if (guDel) {
    const partes = guDel.dataset.guDel.split(":");
    const store = partes[0], i = Number(partes[1]);
    const mapa = {
      sec: [getSecretarias, setSecretarias, "secretaria"],
      prof: [getProfessores, setProfessores, "professor"],
      col: [getColaboradores, setColaboradores, "colaborador"],
      resp: [getResponsaveis, setResponsaveis, "responsável"],
    };
    const cfg = mapa[store];
    if (cfg) {
      const [get, set, rot] = cfg;
      const lista = get();
      if (lista[i]) confirmar(`Excluir o usuário "${lista[i].nome}" (${rot})?`, () => {
        lista.splice(i, 1); set(lista); abrir("gerenciarUsuarios");
      }, { titulo: "Excluir usuário", confirmar: "Excluir" });
    }
    return;
  }

  // Professor: listar alunos de uma turma
  const listarTurma = e.target.closest("[data-listar-turma]");
  if (listarTurma) { turmaAlunosSel = listarTurma.dataset.listarTurma; abrir("professorAlunos"); return; }

  // Recados (professor/auxiliar): limpar filtros
  if (e.target.closest("[data-rec-limpar]")) { recFiltroTurma = "Todas"; recFiltroData = ""; abrir("recados"); return; }

  // Associar responsável ao aluno (busca)
  const addResp = e.target.closest("[data-add-resp]");
  if (addResp) {
    const nome = addResp.dataset.addResp;
    if (!alunoResponsaveis.includes(nome)) alunoResponsaveis.push(nome);
    renderBuscaResp(); renderRespAssociados();
    return;
  }
  const remResp = e.target.closest("[data-rem-resp]");
  if (remResp) {
    alunoResponsaveis = alunoResponsaveis.filter((n) => n !== remResp.dataset.remResp);
    renderBuscaResp(); renderRespAssociados();
    return;
  }
  // Linhas dinâmicas (contatos / autorizados)
  const addRestricao = e.target.closest("[data-add-restricao]");
  if (addRestricao) { document.getElementById("restricoes-lista").insertAdjacentHTML("beforeend", restricaoRow({})); return; }
  const addCardItem = e.target.closest("[data-add-cardapio-item]");
  if (addCardItem) { document.getElementById("cardapio-itens-lista").insertAdjacentHTML("beforeend", cardapioItemRow({})); return; }
  const addContato = e.target.closest("[data-add-contato]");
  if (addContato) { document.getElementById("contatos-lista").insertAdjacentHTML("beforeend", contatoRow("", "")); return; }
  const addAutorizado = e.target.closest("[data-add-autorizado]");
  if (addAutorizado) { document.getElementById("autorizados-lista").insertAdjacentHTML("beforeend", autorizadoRow("", "")); return; }
  const remLinha = e.target.closest("[data-rem-linha]");
  if (remLinha) {
    const linha = remLinha.closest(".linha-din");
    const cont = linha.parentElement;
    if (cont.querySelectorAll(".linha-din").length > 1) linha.remove();
    else linha.querySelectorAll("input").forEach((el) => (el.value = ""));
    return;
  }

  // Associar aluno à turma (busca)
  const addAluno = e.target.closest("[data-add-aluno]");
  if (addAluno) {
    const cap = Number(document.getElementById("f-capacidade").value) || 0;
    if (cap > 0 && turmaAlunos.length >= cap) {
      aviso(`Capacidade máxima da turma atingida (${cap} alunos).`);
      return;
    }
    const nome = addAluno.dataset.addAluno;
    if (!turmaAlunos.includes(nome)) turmaAlunos.push(nome);
    renderBuscaResultados();
    renderAlunosAssociados();
    return;
  }
  // Remover aluno associado
  const remAluno = e.target.closest("[data-rem-aluno]");
  if (remAluno) {
    turmaAlunos = turmaAlunos.filter((n) => n !== remAluno.dataset.remAluno);
    renderBuscaResultados();
    renderAlunosAssociados();
    return;
  }

  const del = e.target.closest("[data-del]");
  if (del) {
    const i = Number(del.dataset.del);
    // Mapa: store -> [getLista, setLista, páginaDeVolta, função que monta a mensagem]
    const mapaDel = {
      col:        [getColaboradores, setColaboradores, "colaboradores",       (x) => `Excluir o colaborador "${x.nome}"?`],
      prof:       [getProfessores,   setProfessores,   "professores",         (x) => `Excluir o professor "${x.nome}"?`],
      turma:      [getTurmas,        setTurmas,        "turmas",              (x) => `Excluir a turma "${x.nome}"?`],
      mov:        [getMovimentacoes, setMovimentacoes, "historico",           ()  => "Excluir esta movimentação do histórico?"],
      aluno:      [getAlunos,        setAlunos,        "alunos",              (x) => `Excluir o aluno "${x.nome}"?`],
      resp:       [getResponsaveis,  setResponsaveis,  "responsaveis",        (x) => `Excluir o responsável "${x.nome}"?`],
      doc:        [getDocumentos,    setDocumentos,    "documentosCadastrar", (x) => `Excluir o documento "${x.nome}"?`],
      emissao:    [getEmissoes,      setEmissoes,      "documentosEmitir",    ()  => "Excluir este documento emitido do histórico?"],
      cardapio:   [getCardapios,     setCardapios,     "cardapio",            (x) => `Excluir o cardápio de ${x.mes}/${x.ano}?`],
      freq:       [getFrequencia,    setFrequencia,    "porteiroHistorico",   ()  => "Excluir este registro de frequência?"],
      estoque:    [getEstoque,       setEstoque,       "estoque",             (x) => `Excluir o item "${x.nome}"?`],
      retirada:   [getRetiradas,     setRetiradas,     "retiradasHistorico",  ()  => "Excluir este registro de retirada?"],
      listacompra:[getListaCompra,   setListaCompra,   "listaCompra",         ()  => "Remover este item da lista de compra?"],
    };
    const cfgDel = mapaDel[del.dataset.store]
      || [getSecretarias, setSecretarias, "secretaria", (x) => `Excluir a secretaria "${x.nome}"?`];
    const [getL, setL, pagina, msgFn] = cfgDel;
    const lista = getL();
    if (lista[i]) confirmar(msgFn(lista[i]), () => {
      lista.splice(i, 1); setL(lista); abrir(pagina);
    }, { titulo: "Confirmar exclusão", confirmar: "Excluir" });
    return;
  }

  const fotoTrigger = e.target.closest("[data-foto-trigger]");
  if (fotoTrigger) { document.getElementById("foto-input").click(); return; }

  // Documentos: inserir campo do catálogo no texto
  const inserirCampo = e.target.closest("[data-inserir-campo]");
  if (inserirCampo) { inserirNoTexto(inserirCampo.dataset.inserirCampo); return; }
  // Documentos: inserir campo personalizado no texto
  const addPers = e.target.closest("[data-add-personalizado]");
  if (addPers) {
    const inp = document.getElementById("campo-personalizado");
    if (inp && inp.value.trim()) { inserirNoTexto(inp.value.trim()); inp.value = ""; }
    return;
  }

  // Ver/imprimir documento emitido
  const verEmissao = e.target.closest("[data-ver-emissao]");
  if (verEmissao) { viewEmissaoIdx = Number(verEmissao.dataset.verEmissao); abrir("documentoGerado"); return; }

  // Professor: salvar agenda
  const salvarAg = e.target.closest("[data-salvar-agenda]");
  if (salvarAg) { salvarAgendaAtual(); aviso("Agenda salva com sucesso!"); return; }

  // Aluno: ver QR Code
  const qrAluno = e.target.closest("[data-qr-aluno]");
  if (qrAluno) { mostrarQRAluno(getAlunos()[Number(qrAluno.dataset.qrAluno)]); return; }

  // Almoxarife: abrir retirada de um item
  const retBtn = e.target.closest("[data-retirar]");
  if (retBtn) { retiradaIdx = Number(retBtn.dataset.retirar); abrir("formRetirada"); return; }

  // Almoxarife: repor estoque a partir da lista de compra
  const reporBtn = e.target.closest("[data-repor]");
  if (reporBtn) { mostrarReporModal(Number(reporBtn.dataset.repor)); return; }

  // Porteiro: leitura manual do QR (simula um registro)
  const qrManual = e.target.closest("[data-qr-manual]");
  if (qrManual) {
    const sel = document.getElementById("qr-manual-sel");
    if (sel && sel.value) { processarQR(sel.value); sel.selectedIndex = 0; }
    else aviso("Selecione um aluno para registrar.");
    return;
  }
  // Professor: adicionar/remover refeição e sono
  const addRef = e.target.closest("[data-add-refeicao]");
  if (addRef) { addRef.closest(".agenda-card").querySelector(".alim-lista").insertAdjacentHTML("beforeend", refeicaoRow({})); return; }
  const addSono = e.target.closest("[data-add-sono]");
  if (addSono) { addSono.closest(".agenda-card").querySelector(".sono-lista").insertAdjacentHTML("beforeend", sonoRow({})); return; }
  const remAg = e.target.closest("[data-rem-agenda-linha]");
  if (remAg) { remAg.closest(".ag-linha").remove(); autoSalvarAgenda(); return; }

  // Documento: inserir logo / imagem no texto
  if (e.target.closest("[data-doc-logo]")) { const inp = document.getElementById("doc-logo-input"); if (inp) inp.click(); return; }
  // Documento: inserir imagem de assinatura no ponto do cursor
  if (e.target.closest("[data-doc-assinatura]")) { const inp = document.getElementById("doc-assinatura-input"); if (inp) inp.click(); return; }
  // Documento: alinhar a imagem selecionada (esquerda / centro / direita)
  const imgAlign = e.target.closest("[data-img-align]");
  if (imgAlign) {
    const imgs = document.querySelectorAll("#f-texto img");
    const img = docImgSel || imgs[imgs.length - 1];
    if (!img) { aviso("Clique primeiro na imagem (logo ou assinatura) que você quer posicionar."); return; }
    const al = imgAlign.dataset.imgAlign;
    img.style.display = "block";
    img.style.marginTop = "8px"; img.style.marginBottom = "8px";
    if (al === "center") { img.style.marginLeft = "auto"; img.style.marginRight = "auto"; }
    else if (al === "right") { img.style.marginLeft = "auto"; img.style.marginRight = "0"; }
    else { img.style.marginLeft = "0"; img.style.marginRight = "auto"; }
    docImgSel = img;
    return;
  }
  // App do responsável: alterar foto / enviar recado
  if (e.target.closest("[data-resp-foto]")) { const inp = document.getElementById("resp-foto-input"); if (inp) inp.click(); return; }
  if (e.target.closest("#resp-recado-enviar")) {
    const txt = document.getElementById("resp-recado-txt");
    const aluno = alunoRespAtual();
    if (txt && txt.value.trim() && aluno) {
      const recados = getRecados();
      const agora = new Date();
      recados.unshift({ aluno: aluno.nome, texto: txt.value.trim(), autor: (sessao && sessao.nome) || "", dataISO: agora.toISOString().slice(0, 10), data: agora.toLocaleDateString("pt-BR"), hora: agora.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }) });
      setRecados(recados);
      notificar("professor", `Novo recado do responsável de ${aluno.nome}.`);
      notificar("auxiliar", `Novo recado do responsável de ${aluno.nome}.`);
      aviso("Recado enviado!");
      abrir("respRecados");
    } else { aviso("Digite um recado antes de enviar."); }
    return;
  }
  // Documento: selecionar imagem (para redimensionar)
  if (e.target.tagName === "IMG" && e.target.closest("#f-texto")) { docImgSel = e.target; return; }
  // Documento: ajustar tamanho do logo
  const logoSz = e.target.closest("[data-logo-size]");
  if (logoSz) {
    const imgs = document.querySelectorAll("#f-texto img");
    const img = docImgSel || imgs[imgs.length - 1];
    if (!img) { aviso("Insira um logo primeiro (ou clique na imagem) para ajustar o tamanho."); return; }
    const atual = parseInt(img.style.maxWidth) || img.clientWidth || 180;
    const novo = Math.round(logoSz.dataset.logoSize === "maior" ? Math.min(atual * 1.25, 600) : Math.max(atual * 0.8, 50));
    img.style.maxWidth = novo + "px"; img.style.width = novo + "px";
    docImgSel = img;
    return;
  }

  // Formatação (cardápio e documento): negrito/itálico/sublinhado/grifar/alinhar
  const rtBtn = e.target.closest("[data-cmd]");
  if (rtBtn) { formatar(rtBtn.dataset.cmd, rtBtn.dataset.val || null); return; }
});

// Aplica formatação no editor de dia atualmente selecionado
function formatar(cmd, valor) {
  if (rtEditor && rtRange) {
    rtEditor.focus();
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(rtRange);
  }
  try { document.execCommand("styleWithCSS", false, true); } catch (err) {}
  document.execCommand(cmd, false, valor);
  const sel = window.getSelection();
  if (sel.rangeCount) rtRange = sel.getRangeAt(0).cloneRange();
}

// Mantém a seleção do editor (para a barra não perder o texto marcado)
document.addEventListener("selectionchange", () => {
  const sel = window.getSelection();
  if (!sel.rangeCount) return;
  let node = sel.anchorNode;
  while (node && node.nodeType === 3) node = node.parentNode;
  const ed = node && node.closest ? node.closest(".dia-editor, .doc-editor") : null;
  if (ed) { rtEditor = ed; rtRange = sel.getRangeAt(0).cloneRange(); }
});

// Botões da barra não roubam o foco/seleção do editor
document.addEventListener("mousedown", (e) => {
  if (e.target.closest && e.target.closest(".rt-btn")) e.preventDefault();
});

// Insere uma etiqueta << campo >> na posição do cursor do editor do documento
function inserirNoTexto(nomeCampo) {
  const ed = document.getElementById("f-texto");
  if (!ed) return;
  ed.focus();
  if (rtEditor === ed && rtRange) {
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(rtRange);
  }
  document.execCommand("insertText", false, `<< ${nomeCampo} >>`);
  const sel = window.getSelection();
  if (sel.rangeCount) rtRange = sel.getRangeAt(0).cloneRange();
  rtEditor = ed;
}

// Enter no campo personalizado insere no texto (sem enviar o formulário)
page.addEventListener("keydown", (e) => {
  if (e.target.id === "campo-personalizado" && e.key === "Enter") {
    e.preventDefault();
    const v = e.target.value.trim();
    if (v) { inserirNoTexto(v); e.target.value = ""; }
  }
});

// Pré-visualização da foto + Função→turmas + limite de turmas
page.addEventListener("change", (e) => {
  // Auto-salvar agenda ao alterar refeição/sono (sem precisar do botão Salvar)
  if (e.target.closest(".agenda-card") || e.target.id === "ag-atividades-turma") { salvarAgendaAtual(); return; }
  // Gerenciar Usuários: filtro por tipo
  if (e.target.id === "gu-filtro") { guFiltro = e.target.value; abrir("gerenciarUsuarios"); return; }
  // Professor: no máximo 2 turmas (bloqueia a 3ª no clique)
  if (e.target.name === "turma-prof") { checarTurmasLive('input[name="turma-prof"]', e.target, 2); return; }
  // Foto
  if (e.target.id === "foto-input") {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { aviso("A imagem deve ter até 2MB."); e.target.value = ""; return; }
    const reader = new FileReader();
    reader.onload = () => {
      fotoDataUrl = reader.result;
      const box = document.getElementById("foto-conteudo");
      if (box) box.innerHTML = `<img class="preview" src="${fotoDataUrl}" alt="Foto">`;
    };
    reader.readAsDataURL(file);
    return;
  }

  // Documento: inserir imagem da ASSINATURA no ponto do cursor (posicionável)
  if (e.target.id === "doc-assinatura-input") {
    const file = e.target.files[0]; if (!file) return;
    if (file.size > 2 * 1024 * 1024) { aviso("A imagem deve ter até 2MB."); e.target.value = ""; return; }
    const reader = new FileReader();
    reader.onload = () => {
      const ed = document.getElementById("f-texto");
      if (ed) {
        ed.focus();
        if (rtEditor === ed && rtRange) { const s = window.getSelection(); s.removeAllRanges(); s.addRange(rtRange); }
        document.execCommand("insertHTML", false, `<img src="${reader.result}" alt="Assinatura" style="max-width:220px;width:220px;height:auto;display:block;margin:8px 0">`);
        const imgs = document.querySelectorAll("#f-texto img"); docImgSel = imgs[imgs.length - 1] || null;
      }
    };
    reader.readAsDataURL(file);
    e.target.value = "";
    return;
  }
  // Documento: definir a largura exata (px) da imagem selecionada
  if (e.target.id === "doc-img-tam") {
    const imgs = document.querySelectorAll("#f-texto img");
    const img = docImgSel || imgs[imgs.length - 1];
    if (!img) { aviso("Clique primeiro na imagem que você quer redimensionar."); e.target.value = ""; return; }
    const px = Math.max(40, Math.min(Number(e.target.value) || 0, 700));
    img.style.maxWidth = px + "px"; img.style.width = px + "px"; img.style.height = "auto";
    docImgSel = img;
    return;
  }

  // Cardápio: barra de formatação (fonte, tamanho, cor)
  if (e.target.id === "cardapio-fonte") { if (e.target.value) formatar("fontName", e.target.value); e.target.selectedIndex = 0; return; }
  if (e.target.id === "cardapio-tamanho") { if (e.target.value) formatar("fontSize", e.target.value); e.target.selectedIndex = 0; return; }
  if (e.target.id === "cardapio-cor") { formatar("foreColor", e.target.value); return; }
  // Documento: formatação (tamanho, cor, logo)
  if (e.target.id === "doc-tamanho") { if (e.target.value) formatar("fontSize", e.target.value); e.target.selectedIndex = 0; return; }
  if (e.target.id === "doc-cor") { formatar("foreColor", e.target.value); return; }
  if (e.target.id === "doc-logo-input") {
    const file = e.target.files[0]; if (!file) return;
    if (file.size > 2 * 1024 * 1024) { aviso("A imagem deve ter até 2MB."); e.target.value = ""; return; }
    const reader = new FileReader();
    reader.onload = () => {
      const ed = document.getElementById("f-texto");
      if (ed) {
        ed.focus();
        if (rtEditor === ed && rtRange) { const s = window.getSelection(); s.removeAllRanges(); s.addRange(rtRange); }
        document.execCommand("insertHTML", false, `<img src="${reader.result}" style="max-width:180px;width:180px;height:auto;display:block;margin:8px 0">`);
        const imgs = document.querySelectorAll("#f-texto img"); docImgSel = imgs[imgs.length - 1] || null;
      }
    };
    reader.readAsDataURL(file);
    e.target.value = "";
    return;
  }
  // Cardápio: troca de mês/ano regenera o calendário (preservando o que já foi digitado)
  if (e.target.id === "cardapio-mes" || e.target.id === "cardapio-ano") {
    salvarDiasCardapio();
    montarGridCardapio();
    return;
  }

  // Filtro do histórico
  if (e.target.id === "filtro-historico") {
    filtroHistorico = e.target.value;
    abrir("historico");
    return;
  }
  // Filtro da lista de restrições por turma
  if (e.target.id === "filtro-restricao-turma") {
    filtroRestricaoTurma = e.target.value;
    abrir("restricoes");
    return;
  }
  // Almoxarife: filtros do cardápio mensal (turma e mês)
  if (e.target.id === "rec-filtro-turma") { recFiltroTurma = e.target.value; abrir("recados"); return; }
  if (e.target.id === "rec-filtro-data") { recFiltroData = e.target.value; abrir("recados"); return; }
  if (e.target.id === "cardapio-view-turma") { viewCardapioTurma = e.target.value; abrir("cardapioView"); return; }
  if (e.target.id === "cardapio-view-mes") { viewCardapioMes = e.target.value; abrir("cardapioView"); return; }
  // Troca de turma da agenda (filtro obrigatório antes de ver os alunos)
  if (e.target.id === "agenda-turma") {
    if (agendaTurmaSel && (paginaAtual === "professorAgenda" || paginaAtual === "auxiliarAgenda")) salvarAgendaAtual();
    agendaTurmaSel = e.target.value;
    abrir(paginaAtual);
    return;
  }
  // Troca de data da agenda (salva a atual só se for tela editável)
  if (e.target.id === "agenda-data") {
    if (agendaTurmaSel && (paginaAtual === "professorAgenda" || paginaAtual === "auxiliarAgenda")) salvarAgendaAtual();
    agendaDataSel = e.target.value;
    abrir(paginaAtual);
    return;
  }
  // App do responsável: filtros e foto
  if (e.target.id === "resp-filho") { respAlunoSel = e.target.value; abrir(paginaAtual); return; }
  if (e.target.id === "resp-data") { agendaDataSel = e.target.value; abrir(paginaAtual); return; }
  if (e.target.id === "resp-mes-mes" || e.target.id === "resp-mes-ano") {
    const mm = document.getElementById("resp-mes-mes").value;
    const ano = document.getElementById("resp-mes-ano").value;
    respMesSel = ano + "-" + mm;
    abrir(paginaAtual);
    return;
  }
  if (e.target.id === "resp-foto-input") {
    const file = e.target.files[0]; if (!file) return;
    if (file.size > 2 * 1024 * 1024) { aviso("A imagem deve ter até 2MB."); e.target.value = ""; return; }
    const reader = new FileReader();
    reader.onload = () => {
      const alunos = getAlunos();
      const i = alunos.findIndex((a) => a.nome === respAlunoSel);
      if (i >= 0) { alunos[i].foto = reader.result; setAlunos(alunos); abrir("respDados"); }
    };
    reader.readAsDataURL(file);
    return;
  }

  // Emitir: turma escolhida → preenche o filtro de alunos com os alunos daquela turma
  if (e.target.id === "f-turma-emitir") {
    const turma = getTurmas().find((t) => t.nome === e.target.value);
    const nomes = turma ? (turma.alunos || []) : [];
    const sel = document.getElementById("f-aluno");
    if (sel) {
      sel.disabled = nomes.length === 0;
      sel.innerHTML = `<option value="" disabled selected>${nomes.length ? "Selecione o aluno" : "Nenhum aluno nesta turma"}</option>` +
        nomes.map((n) => `<option value="${esc(n)}">${esc(n)}</option>`).join("");
    }
    return;
  }

  // Emitir: documento escolhido → mostra caixinhas dos campos personalizados
  if (e.target.id === "f-documento") {
    const box = document.getElementById("campos-manuais");
    if (!box) return;
    const doc = getDocumentos().find((x) => x.nome === e.target.value);
    const desconhecidos = doc ? camposDesconhecidos(doc.texto) : [];
    box.innerHTML = desconhecidos.length
      ? `<div class="bloco-titulo" style="margin-top:8px">Campos a preencher</div>` +
        desconhecidos.map((c) => `<div class="linha"><div class="campo"><label>${esc(c)}</label><div class="inp">${ic("note", "#9aa7b8")}<input type="text" class="campo-manual" data-campo="${esc(c)}" placeholder="Digite: ${esc(c)}"></div></div></div>`).join("")
      : "";
    return;
  }

  // Função → mostra/oculta bloco de turmas (só para Auxiliar)
  if (e.target.id === "f-funcao") {
    const bloco = document.getElementById("bloco-turmas");
    if (!bloco) return;
    const auxiliar = e.target.value === "Auxiliar";
    bloco.style.display = auxiliar ? "" : "none";
    if (!auxiliar) bloco.querySelectorAll('input[name="turma"]').forEach((c) => (c.checked = false));
    return;
  }

  // Limite e regras de período das turmas do auxiliar
  if (e.target.name === "turma") { checarTurmasLive('input[name="turma"]', e.target, MAX_TURMAS_AUXILIAR); }
});

// Digitação nas buscas (turma → alunos, aluno → responsáveis)
page.addEventListener("input", (e) => {
  // Auto-salvar agenda ao digitar (sem precisar do botão Salvar)
  if (e.target.closest(".agenda-card") || e.target.id === "ag-atividades-turma") { autoSalvarAgenda(); return; }
  if (e.target.id === "busca-aluno") renderBuscaResultados();
  if (e.target.id === "busca-resp") renderBuscaResp();
});

// Envio dos formulários (secretaria e colaborador)
page.addEventListener("submit", (e) => {
  const val = (id) => document.getElementById(id).value.trim();

  if (e.target.id === "form-secretaria") {
    e.preventDefault();
    const reg = {
      nome: val("f-nome"), cpf: val("f-cpf"), email: val("f-email"),
      telefone: val("f-telefone"), cep: val("f-cep"), rua: val("f-rua"),
      bairro: val("f-bairro"), numero: val("f-numero"), complemento: val("f-complemento"),
      foto: fotoDataUrl,
    };
    const lista = getSecretarias();
    if (editSecIdx != null) { lista[editSecIdx] = reg; aviso("Secretaria atualizada com sucesso!"); }
    else { lista.push(reg); aviso("Secretaria cadastrada com sucesso!"); }
    setSecretarias(lista);
    editSecIdx = null;
    { const dest = voltar("secretaria"); voltarGU = false; abrir(dest); }
    return;
  }

  if (e.target.id === "form-colaborador") {
    e.preventDefault();
    const funcao = val("f-funcao");
    const turmas = [...document.querySelectorAll('input[name="turma"]:checked')].map((c) => c.value);
    if (funcao === "Auxiliar") {
      if (turmas.length === 0) { aviso("Selecione ao menos 1 turma para o auxiliar."); return; }
      if (turmas.length > MAX_TURMAS_AUXILIAR) { aviso(`Um auxiliar pode ter no máximo ${MAX_TURMAS_AUXILIAR} turmas.`); return; }
      const erroAux = validarTurmasPeriodo(turmas);
      if (erroAux) { aviso(erroAux); return; }
    }
    const reg = {
      nome: val("f-nome"), cpf: val("f-cpf"), email: val("f-email"),
      telefone: val("f-telefone"), cep: val("f-cep"), rua: val("f-rua"),
      bairro: val("f-bairro"), numero: val("f-numero"), complemento: val("f-complemento"),
      funcao, turmas: funcao === "Auxiliar" ? turmas : [], foto: fotoDataUrl,
    };
    const lista = getColaboradores();
    if (editColIdx != null) { lista[editColIdx] = reg; aviso("Colaborador atualizado com sucesso!"); }
    else { lista.push(reg); aviso("Colaborador cadastrado com sucesso!"); }
    setColaboradores(lista);
    editColIdx = null;
    { const dest = voltar("colaboradores"); voltarGU = false; abrir(dest); }
    return;
  }

  if (e.target.id === "form-professor") {
    e.preventDefault();
    const turmas = [...document.querySelectorAll('input[name="turma-prof"]:checked')].map((c) => c.value);
    if (turmas.length === 0) {
      aviso("Selecione ao menos 1 turma para o professor.");
      return;
    }
    if (turmas.length > 2) { aviso("Um professor pode ter no máximo 2 turmas."); return; }
    const erroPeriodo = validarTurmasPeriodo(turmas);
    if (erroPeriodo) { aviso(erroPeriodo); return; }
    const reg = {
      nome: val("f-nome"), cpf: val("f-cpf"), email: val("f-email"),
      telefone: val("f-telefone"), cep: val("f-cep"), rua: val("f-rua"),
      bairro: val("f-bairro"), numero: val("f-numero"), complemento: val("f-complemento"),
      turmas, foto: fotoDataUrl,
    };
    const lista = getProfessores();
    if (editProfIdx != null) { lista[editProfIdx] = reg; aviso("Professor atualizado com sucesso!"); }
    else { lista.push(reg); aviso("Professor cadastrado com sucesso!"); }
    setProfessores(lista);
    editProfIdx = null;
    { const dest = voltar("professores"); voltarGU = false; abrir(dest); }
    return;
  }

  if (e.target.id === "form-turma") {
    e.preventDefault();
    const cap = Number(val("f-capacidade"));
    if (cap > 0 && turmaAlunos.length > cap) {
      aviso(`A turma tem ${turmaAlunos.length} alunos associados, acima da capacidade de ${cap}.`);
      return;
    }
    const reg = {
      nome: val("f-nome"), periodo: val("f-periodo"), faixa: val("f-faixa"), capacidade: cap,
      sala: val("f-sala"), alunos: turmaAlunos.slice(),
    };
    const lista = getTurmas();
    if (editTurmaIdx != null) {
      const nomeAntigo = lista[editTurmaIdx] && lista[editTurmaIdx].nome;
      lista[editTurmaIdx] = reg;
      renomearVinculos("turma", nomeAntigo, reg.nome); // mantém professores, auxiliares e cardápios vinculados
      aviso("Turma atualizada com sucesso!");
    } else { lista.push(reg); aviso("Turma cadastrada com sucesso!"); }
    setTurmas(lista);
    editTurmaIdx = null;
    abrir("turmas");
    return;
  }

  if (e.target.id === "form-retirada") {
    e.preventDefault();
    const item = getEstoque()[retiradaIdx];
    if (!item) { abrir("estoque"); return; }
    const qtd = Number(val("f-qtd"));
    if (!(qtd > 0)) { aviso("Informe uma quantidade válida."); return; }
    if (qtd > item.quantidade) { aviso(`Quantidade indisponível. Em estoque: ${item.quantidade} ${item.unidade || ""}.`); return; }
    const estoque = getEstoque();
    estoque[retiradaIdx].quantidade = item.quantidade - qtd;
    setEstoque(estoque);
    const retiradas = getRetiradas();
    retiradas.unshift({
      item: item.nome, quantidade: qtd, unidade: item.unidade,
      responsavel: val("f-responsavel"), observacao: val("f-obs-ret"), data: val("f-data-ret"),
    });
    setRetiradas(retiradas);
    retiradaIdx = null;
    aviso("Retirada registrada com sucesso!");
    abrir("estoque");
    return;
  }

  if (e.target.id === "form-estoque") {
    e.preventDefault();
    const reg = {
      nome: val("f-nome"), categoria: val("f-categoria"),
      quantidade: Number(val("f-quantidade")) || 0, unidade: val("f-unidade"), validade: val("f-validade"),
    };
    const lista = getEstoque();
    if (editEstoqueIdx != null) { lista[editEstoqueIdx] = reg; aviso("Item atualizado com sucesso!"); }
    else { lista.push(reg); aviso("Item cadastrado com sucesso!"); }
    setEstoque(lista);
    editEstoqueIdx = null;
    abrir("estoque");
    return;
  }

  if (e.target.id === "form-cardapio") {
    e.preventDefault();
    const turma = document.getElementById("cardapio-turma").value;
    if (!turma) { aviso("Selecione a turma do cardápio."); return; }
    salvarDiasCardapio();
    const itens = [...document.querySelectorAll(".cardapio-item-row")]
      .map((r) => ({ alimento: r.querySelector(".ci-alimento").value, quantidade: Number(r.querySelector(".ci-qtd").value) || 0 }))
      .filter((x) => x.alimento);
    // RF-15: NÃO salva se algum aluno da turma tiver restrição a um alimento do cardápio
    const conflitos = verificarRestricoes(turma, itens);
    if (conflitos.length) {
      notificar("secretaria", `Cardápio de ${turma} não salvo: ${conflitos.length} aluno(s) com restrição a alimentos inseridos.`);
      aviso(
        "Não foi possível salvar o cardápio.\n\nHá aluno(s) com restrição a alimentos inseridos:\n" +
        conflitos.map((c) => "• " + c.aluno + " — " + c.alimento).join("\n") +
        "\n\nRemova esses alimentos do cardápio para poder salvar.",
        "erro"
      );
      return; // mantém o formulário com os dados preenchidos
    }

    // Sem restrições: salva o cardápio
    const mes = document.getElementById("cardapio-mes").value;
    const ano = Number(document.getElementById("cardapio-ano").value);
    const reg = { turma, mes, ano, itens, dias: cardapioDias };
    const lista = getCardapios();
    if (editCardapioIdx != null) lista[editCardapioIdx] = reg; else lista.push(reg);
    setCardapios(lista);
    editCardapioIdx = null;

    // RF-14: se faltar estoque, gera lista de compras e notifica o almoxarife
    const faltas = verificarEstoque(itens);
    if (faltas.length) {
      const agora = new Date().toLocaleDateString("pt-BR");
      const lc = getListaCompra();
      faltas.forEach((f) => lc.unshift({ turma, alimento: f.alimento, necessario: f.necessario, disponivel: f.disponivel, falta: f.falta, unidade: f.unidade, data: agora, status: "Pendente" }));
      setListaCompra(lc);
      notificar("almoxarife", `Lista de compra gerada para o cardápio de ${turma}: ${faltas.length} item(ns) em falta.`);
    }
    ultimaVerificacao = { turma, mes, ano, faltas, salvo: true };
    abrir("cardapioVerificacao");
    return;
  }

  if (e.target.id === "form-documento") {
    e.preventDefault();
    const reg = {
      nome: val("f-nome"), descricao: val("f-descricao"),
      campos: docCampos.slice(), texto: document.getElementById("f-texto").innerHTML,
    };
    const lista = getDocumentos();
    if (editDocIdx != null) { lista[editDocIdx] = reg; aviso("Documento atualizado com sucesso!"); }
    else { lista.push(reg); aviso("Documento cadastrado com sucesso!"); }
    setDocumentos(lista);
    editDocIdx = null;
    abrir("documentosCadastrar");
    return;
  }

  if (e.target.id === "form-emitir") {
    e.preventDefault();
    const documento = val("f-documento");
    const aluno = val("f-aluno");
    if (!documento || !aluno) { aviso("Selecione o documento e o aluno."); return; }
    const agora = new Date();
    const data = agora.toLocaleDateString("pt-BR") + " " + agora.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
    const docObj = getDocumentos().find((x) => x.nome === documento);
    const alunoObj = getAlunos().find((a) => a.nome === aluno) || { nome: aluno };
    const manuais = {};
    document.querySelectorAll(".campo-manual").forEach((el) => { manuais[el.dataset.campo.toLowerCase()] = el.value.trim(); });
    const textoPreenchido = docObj ? preencherTexto(docObj.texto, alunoObj, manuais) : "";
    const emissoes = getEmissoes();
    emissoes.unshift({ documento, aluno, data, texto: textoPreenchido });
    setEmissoes(emissoes);
    viewEmissaoIdx = 0;
    abrir("documentoGerado");
    return;
  }

  if (e.target.id === "form-responsavel") {
    e.preventDefault();
    const reg = {
      nome: val("f-nome"), cpf: val("f-cpf"), email: val("f-email"),
      telefone: val("f-telefone"), cep: val("f-cep"), rua: val("f-rua"),
      bairro: val("f-bairro"), numero: val("f-numero"), complemento: val("f-complemento"),
    };
    const lista = getResponsaveis();
    if (editRespIdx != null) {
      const nomeAntigo = lista[editRespIdx] && lista[editRespIdx].nome;
      lista[editRespIdx] = reg;
      renomearVinculos("responsavel", nomeAntigo, reg.nome); // mantém os vínculos ao renomear
      aviso("Responsável atualizado com sucesso!");
    } else { lista.push(reg); aviso("Responsável cadastrado com sucesso!"); }
    setResponsaveis(lista);
    editRespIdx = null;
    { const dest = voltar("responsaveis"); voltarGU = false; abrir(dest); }
    return;
  }

  if (e.target.id === "form-aluno") {
    e.preventDefault();
    const emergencia = [...document.querySelectorAll(".contato-row")]
      .map((r) => ({ nome: r.querySelector(".c-nome").value.trim(), telefone: r.querySelector(".c-tel").value.trim() }))
      .filter((c) => c.nome || c.telefone);
    const autorizados = [...document.querySelectorAll(".autorizado-row")]
      .map((r) => ({ nome: r.querySelector(".a-nome").value.trim(), documento: r.querySelector(".a-doc").value.trim() }))
      .filter((p) => p.nome || p.documento);
    const restricoes = [...document.querySelectorAll(".restricao-row")]
      .map((r) => ({ alimento: r.querySelector(".r-alimento").value.trim(), gravidade: r.querySelector(".r-gravidade").value }))
      .filter((x) => x.alimento);
    const alunoAnterior = (editAlunoIdx != null && getAlunos()[editAlunoIdx]) ? getAlunos()[editAlunoIdx] : {};
    const reg = {
      nome: val("f-nome"), cpf: val("f-cpf"), data_nascimento: val("f-nascimento"),
      ra: val("f-ra"), matricula: alunoAnterior.matricula || gerarMatricula(),
      cep: val("f-cep"), rua: val("f-rua"), bairro: val("f-bairro"), numero: val("f-numero"), complemento: val("f-complemento"),
      responsaveis: alunoResponsaveis.slice(), restricoes, informacoes_medicas: val("f-medicas"),
      emergencia, autorizados, qr_code: alunoAnterior.qr_code || gerarQRCode(),
    };
    const lista = getAlunos();
    if (editAlunoIdx != null) {
      lista[editAlunoIdx] = reg;
      renomearVinculos("aluno", alunoAnterior.nome, reg.nome); // mantém turmas, agenda, recados, frequência, etc.
      aviso("Aluno atualizado com sucesso!");
    } else { lista.push(reg); aviso("Aluno cadastrado com sucesso!\nNúmero de matrícula: " + reg.matricula); }
    setAlunos(lista);
    editAlunoIdx = null;
    abrir("alunos");
    return;
  }

  if (e.target.id === "form-movimentacao") {
    e.preventDefault();
    const reg = { tipo: val("f-tipo"), descricao: val("f-descricao"), data: val("f-data"), usuario: "Administrador" };
    const lista = getMovimentacoes();
    if (editMovIdx != null) { lista[editMovIdx] = reg; aviso("Movimentação atualizada com sucesso!"); }
    else { lista.unshift(reg); aviso("Movimentação registrada com sucesso!"); }
    setMovimentacoes(lista);
    editMovIdx = null;
    abrir("historico");
    return;
  }
});

// Após renderizar o formulário de turma, inicializa a lista de alunos associados
const _abrirOriginal = abrir;
abrir = function (nome) {
  _abrirOriginal(nome);
  if (nome === "formTurma") { renderAlunosAssociados(); renderBuscaResultados(); }
};

/* ===== Notificações (sininho do topo) ===== */
// Cria uma notificação direcionada a um perfil (admin, secretaria, almoxarife...)
function notificar(perfil, mensagem) {
  const notis = getNotificacoes();
  const agora = new Date();
  notis.unshift({ perfil, mensagem, lida: false,
    data: agora.toLocaleDateString("pt-BR"),
    hora: agora.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }) });
  setNotificacoes(notis);
}
// Notificações do usuário logado (responsável vê as do filho; demais, as do seu perfil)
function notificacoesDoUsuario() {
  const todas = getNotificacoes();
  const nome = (sessao && sessao.nome) || "";
  if (PERFIL === "responsavel") return todas.filter((n) => n.responsavel === nome);
  return todas.filter((n) => n.perfil === PERFIL);
}
function atualizarSino() {
  const badge = document.getElementById("sino-badge");
  if (!badge) return;
  const n = notificacoesDoUsuario().filter((x) => !x.lida).length;
  badge.textContent = n > 9 ? "9+" : String(n);
  badge.hidden = n === 0;
}
// Popup de notificação (aparece para o responsável ao registrar entrada/saída)
let ultimaNotifSeen = -1;
function popupNotificacao(n) {
  const cor = (n.tipo === "Saída") ? "#b25a12" : "#1c8055";
  const div = document.createElement("div");
  div.className = "qr-popup-overlay";
  div.innerHTML = `<div class="qr-popup">
    <div class="qr-popup-ico" style="background:${cor}">${ic(n.tipo === "Saída" ? "arrowUp" : "arrowDown", "#fff")}</div>
    <div class="qr-popup-tipo" style="color:${cor};font-size:20px">Notificação</div>
    <div class="qr-popup-pessoa">${esc(n.mensagem || "")}</div>
    <div class="qr-popup-hora">${esc(((n.data || "") + " " + (n.hora || "")).trim())}</div>
    <button class="btn-salvar" style="background:${cor}" data-fechar-popup>OK</button>
  </div>`;
  document.body.appendChild(div);
  div.addEventListener("click", (e) => { if (e.target === div || e.target.closest("[data-fechar-popup]")) div.remove(); });
}
function checarNotificacoesNovas() {
  const lista = notificacoesDoUsuario();
  atualizarSino();
  if (PERFIL !== "responsavel") { ultimaNotifSeen = lista.length; return; }
  if (ultimaNotifSeen < 0) { ultimaNotifSeen = lista.length; return; } // 1ª vez: não popa os antigos
  if (lista.length > ultimaNotifSeen && lista[0]) popupNotificacao(lista[0]);
  ultimaNotifSeen = lista.length;
}
// Entre abas do mesmo navegador (tempo real)
window.addEventListener("storage", (e) => { if (e.key === "saykids_notificacoes") checarNotificacoesNovas(); });
// Poll do Supabase (captura registros feitos em outro computador/celular, em tempo real)
setInterval(() => {
  const db = window.__SAYKIDS_DB;
  if (!window.__DB_ONLINE || !db) return;
  try {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", db.rest + "?store_key=eq.saykids_notificacoes&select=payload", true);
    db.cabecalhos(xhr, false);
    xhr.onload = () => {
      if (xhr.status < 200 || xhr.status >= 300) return;
      try {
        const rows = JSON.parse(xhr.responseText || "[]");
        if (rows[0] && rows[0].payload) {
          const novo = JSON.stringify(rows[0].payload);
          if (novo !== localStorage.getItem("saykids_notificacoes")) {
            db.setLocalOnly("saykids_notificacoes", novo); // grava local sem reenviar ao banco
            checarNotificacoesNovas();
          }
        }
      } catch (err) {}
    };
    xhr.send();
  } catch (err) {}
}, 8000);
(function initSino() {
  const sino = document.getElementById("sino");
  if (!sino) return;
  sino.addEventListener("click", (e) => {
    if (e.target.closest("#noti-dropdown")) return;
    const dd = document.getElementById("noti-dropdown");
    if (!dd.hidden) { dd.hidden = true; return; }
    const lista = notificacoesDoUsuario();
    dd.innerHTML = `<div class="noti-head">Notificações</div>` + (lista.length
      ? lista.slice(0, 30).map((n) => `
          <div class="noti-item${n.lida ? "" : " nova"}">
            <div class="noti-msg">${esc(n.mensagem || n.titulo || "")}</div>
            <div class="noti-time">${esc(((n.data || "") + " " + (n.hora || "")).trim())}</div>
          </div>`).join("")
      : `<div class="noti-vazio">Nenhuma notificação no momento.</div>`);
    dd.hidden = false;
    // marca como lidas
    const nome = (sessao && sessao.nome) || "";
    const todas = getNotificacoes();
    todas.forEach((n) => {
      if ((PERFIL === "responsavel" && n.responsavel === nome) || (PERFIL !== "responsavel" && n.perfil === PERFIL)) n.lida = true;
    });
    setNotificacoes(todas);
    atualizarSino();
  });
  document.addEventListener("click", (e) => {
    const dd = document.getElementById("noti-dropdown");
    if (dd && !dd.hidden && !e.target.closest("#sino")) dd.hidden = true;
  });
})();

// Monta o menu conforme o perfil e abre a página inicial
montarMenu();
abrir(HOME);
checarNotificacoesNovas();

// Quando os dados do Supabase terminam de carregar (assíncrono), re-renderiza
// a página atual para mostrar os dados já atualizados (sem travar a tela).
window.__onDadosCarregados = function () {
  try { montarMenu(); } catch (e) {}
  try { if (paginaAtual) abrir(paginaAtual, true); } catch (e) {}
  try { atualizarSino(); } catch (e) {}
};
