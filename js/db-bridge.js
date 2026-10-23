/* =====================================================================
   Ponte com o Banco de Dados (Supabase)  -  Say Kids
   ---------------------------------------------------------------------
   - Carrega os dados do Supabase de forma ASSÍNCRONA (não trava a tela,
     importante no iPhone/Safari) e, ao terminar, avisa o sistema para
     re-renderizar a página atual.
   - Toda escrita nos dados (saykids_*) é enviada ao Supabase via fetch
     (mais confiável que XMLHttpRequest no Safari).
   - As chaves de sessão (login por aba) NÃO vão para o banco.
   - Se o Supabase estiver inacessível, o sistema usa os dados locais.

   Segurança: a chave abaixo é a chave PÚBLICA (anon) do Supabase, feita
   para ficar exposta; o acesso é controlado pelas regras (RLS) da tabela.
   ===================================================================== */
(function () {
  var SUPABASE_URL = "https://fggvhipbqfmzmhopnlqa.supabase.co";
  var SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZnZ3ZoaXBicWZtem1ob3BubHFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI3NzQyMzksImV4cCI6MjEwODM1MDIzOX0.8iS-SsBUUqKADM5wTQnDPiWodDY02dkpb7MKEaRAHNA";
  var REST = SUPABASE_URL + "/rest/v1/app_store";
  var IGNORAR = ["saykids_sess", "saykids_email"];

  function ignorar(key) {
    if (key.indexOf("saykids_") !== 0) return true;
    for (var i = 0; i < IGNORAR.length; i++) {
      if (key.indexOf(IGNORAR[i]) === 0) return true;
    }
    return false;
  }

  // Cabeçalhos para XMLHttpRequest (usado pelo poll de notificações no painel.js)
  function cabecalhos(x, comConteudo) {
    x.setRequestHeader("apikey", SUPABASE_KEY);
    x.setRequestHeader("Authorization", "Bearer " + SUPABASE_KEY);
    if (comConteudo) {
      x.setRequestHeader("Content-Type", "application/json");
      x.setRequestHeader("Prefer", "resolution=merge-duplicates");
    }
  }
  // Cabeçalhos para fetch (objeto)
  function headersObj(comConteudo) {
    var h = { "apikey": SUPABASE_KEY, "Authorization": "Bearer " + SUPABASE_KEY };
    if (comConteudo) { h["Content-Type"] = "application/json"; h["Prefer"] = "resolution=merge-duplicates"; }
    return h;
  }

  // Gravação local "pura" (sem reenviar ao banco), usando o método ORIGINAL do navegador
  var _protoSet = Storage.prototype.setItem;
  var _set = function (k, v) { return _protoSet.call(window.localStorage, k, v); };
  // Limpa um item "setItem" que versões antigas criavam por engano no Safari
  try { if (window.localStorage.getItem("setItem") !== null) window.localStorage.removeItem("setItem"); } catch (e) {}

  // Envia um store para o Supabase (upsert) usando fetch.
  // Sem keepalive: no Safari do iPhone o keepalive falha (e tem limite de 64KB,
  // que quebra envios maiores como alunos com foto).
  // Diagnóstico: mostra na tela (uma vez por página) se a gravação no banco falhar
  var jaAvisou = false;
  function avisarErro(msg) {
    console.warn("[Say Kids] Erro ao salvar no banco:", msg);
    if (jaAvisou) return; jaAvisou = true;
    setTimeout(function () {
      if (typeof window.aviso === "function") window.aviso("Não foi possível salvar no banco de dados.\nDetalhe: " + msg, "erro");
    }, 600);
  }

  function enviarAoBanco(key, val) {
    var payload; try { payload = JSON.parse(val); } catch (e) { payload = val; }
    var body = JSON.stringify({ store_key: key, payload: payload, updated_at: new Date().toISOString() });
    try {
      fetch(REST, { method: "POST", headers: headersObj(true), body: body })
        .then(function (r) {
          if (!r.ok) r.text().then(function (t) { avisarErro("HTTP " + r.status + " " + (t || "").slice(0, 120)); });
        })
        .catch(function (e) { avisarErro((e && e.message) || "erro de rede"); });
    } catch (e) { avisarErro("exceção: " + (e && e.message)); }
  }
  window.__SK_VERSAO = "4";

  // Write-through: toda escrita no sistema também vai para o Supabase.
  // IMPORTANTE: no Safari (iPhone) NÃO dá para substituir "localStorage.setItem = ..."
  // (o Safari ignora e cria um item chamado "setItem"). Por isso interceptamos no
  // protótipo, que funciona em todos os navegadores.
  Storage.prototype.setItem = function (key, val) {
    try { _protoSet.call(this, key, val); } catch (e) {} // local pode falhar (ex.: modo privado) — não impede o envio
    if (this === window.localStorage && !ignorar(String(key))) enviarAoBanco(String(key), String(val));
  };

  // Exposto para o painel.js (poll de notificações em tempo real)
  window.__SAYKIDS_DB = {
    url: SUPABASE_URL,
    key: SUPABASE_KEY,
    rest: REST,
    cabecalhos: cabecalhos,
    setLocalOnly: function (k, v) { try { _set(k, v); } catch (e) {} },
  };

  // Carrega TODOS os dados do Supabase de forma assíncrona (não trava a tela).
  // Usa _set (gravação local pura) para não reenviar ao banco o que acabou de ler.
  function carregarDados() {
    try {
      fetch(REST + "?select=store_key,payload", { headers: headersObj(false) })
        .then(function (r) { return r.ok ? r.json() : []; })
        .then(function (rows) {
          (rows || []).forEach(function (row) {
            try { _set(row.store_key, JSON.stringify(row.payload)); } catch (e) {}
          });
          window.__DB_ONLINE = true;
          // Avisa o sistema para re-renderizar a página com os dados já carregados
          if (typeof window.__onDadosCarregados === "function") {
            try { window.__onDadosCarregados(); } catch (e) {}
          }
        })
        .catch(function () { window.__DB_ONLINE = false; });
    } catch (e) { window.__DB_ONLINE = false; }
  }
  carregarDados();
})();
