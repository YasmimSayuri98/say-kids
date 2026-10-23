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

  var _set = localStorage.setItem.bind(localStorage); // gravação local "pura" (sem reenviar ao banco)

  // Envia um store para o Supabase (upsert) usando fetch.
  // Sem keepalive: no Safari do iPhone o keepalive falha (e tem limite de 64KB,
  // que quebra envios maiores como alunos com foto).
  function enviarAoBanco(key, val) {
    var payload; try { payload = JSON.parse(val); } catch (e) { payload = val; }
    var body = JSON.stringify({ store_key: key, payload: payload, updated_at: new Date().toISOString() });
    try {
      fetch(REST, { method: "POST", headers: headersObj(true), body: body })
        .then(function (r) { if (!r.ok && r.status) console.warn("[Say Kids] Falha ao salvar no banco:", r.status); })
        .catch(function (e) { console.warn("[Say Kids] Erro ao salvar no banco:", e && e.message); });
    } catch (e) {}
  }

  // Write-through: toda escrita no sistema também vai para o Supabase
  localStorage.setItem = function (key, val) {
    try { _set(key, val); } catch (e) {} // local pode falhar (ex.: Safari privado) — não impede o envio
    if (!ignorar(key)) enviarAoBanco(key, val);
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
