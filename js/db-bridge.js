/* =====================================================================
   Ponte com o Banco de Dados (Supabase)  -  Say Kids
   ---------------------------------------------------------------------
   Como funciona:
   1) Ao abrir o sistema, baixa TODOS os dados do banco (tabela app_store)
      e coloca no armazenamento local (para as telas lerem normalmente).
   2) Toda vez que o sistema salva algo (saykids_*), envia junto para o
      Supabase (persistencia real, compartilhada entre dispositivos).
   Obs.: as chaves de sessao (login por aba) NAO vao para o banco.
   Se o Supabase estiver inacessivel, o sistema continua funcionando
   apenas com os dados locais (modo offline).

   Seguranca: a chave abaixo e a chave PUBLICA (anon) do Supabase. Ela e
   feita para ficar exposta no site; o acesso e controlado pelas regras
   (Row Level Security) definidas na tabela app_store.
   ===================================================================== */
(function () {
  var SUPABASE_URL = "https://fggvhipbqfmzmhopnlqa.supabase.co";
  var SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZnZ3ZoaXBicWZtem1ob3BubHFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI3NzQyMzksImV4cCI6MjEwODM1MDIzOX0.8iS-SsBUUqKADM5wTQnDPiWodDY02dkpb7MKEaRAHNA";
  var REST = SUPABASE_URL + "/rest/v1/app_store";
  var IGNORAR = ["saykids_sess", "saykids_email"]; // nao sincronizar (sessao)

  function ignorar(key) {
    if (key.indexOf("saykids_") !== 0) return true;
    for (var i = 0; i < IGNORAR.length; i++) {
      if (key.indexOf(IGNORAR[i]) === 0) return true;
    }
    return false;
  }

  function cabecalhos(x, comConteudo) {
    x.setRequestHeader("apikey", SUPABASE_KEY);
    x.setRequestHeader("Authorization", "Bearer " + SUPABASE_KEY);
    if (comConteudo) {
      x.setRequestHeader("Content-Type", "application/json");
      x.setRequestHeader("Prefer", "resolution=merge-duplicates"); // upsert
    }
  }

  // 1) Carrega os dados do Supabase ANTES do sistema iniciar (sincrono de proposito)
  try {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", REST + "?select=store_key,payload", false);
    cabecalhos(xhr, false);
    xhr.send(null);
    if (xhr.status >= 200 && xhr.status < 300) {
      var rows = JSON.parse(xhr.responseText || "[]");
      rows.forEach(function (row) {
        try { localStorage.setItem(row.store_key, JSON.stringify(row.payload)); } catch (e) {}
      });
      window.__DB_ONLINE = true;
      console.log("[Say Kids] Conectado ao banco de dados Supabase.");
    } else {
      window.__DB_ONLINE = false;
      console.warn("[Say Kids] Supabase respondeu " + xhr.status + " - usando dados locais.");
    }
  } catch (e) {
    window.__DB_ONLINE = false;
    console.warn("[Say Kids] Banco offline - usando dados locais.", e && e.message);
  }

  // Envia um store para o Supabase (upsert) usando fetch — mais confiavel no iOS.
  function enviarAoBanco(key, val) {
    var payload;
    try { payload = JSON.parse(val); } catch (e) { payload = val; }
    var body = JSON.stringify({ store_key: key, payload: payload, updated_at: new Date().toISOString() });
    try {
      if (typeof fetch === "function") {
        fetch(REST, {
          method: "POST",
          headers: {
            "apikey": SUPABASE_KEY,
            "Authorization": "Bearer " + SUPABASE_KEY,
            "Content-Type": "application/json",
            "Prefer": "resolution=merge-duplicates",
          },
          body: body,
          keepalive: true,
          mode: "cors",
        }).catch(function () {});
      } else {
        var x = new XMLHttpRequest();
        x.open("POST", REST, true);
        cabecalhos(x, true);
        x.send(body);
      }
    } catch (e) {}
  }

  // 2) Write-through: toda escrita nos dados do sistema tambem vai para o Supabase (upsert)
  var _set = localStorage.setItem.bind(localStorage);
  localStorage.setItem = function (key, val) {
    // O armazenamento local pode falhar (ex.: Safari em modo privado no iPhone).
    // Se falhar, NÃO impedimos o envio ao banco — o dado precisa chegar ao Supabase.
    try { _set(key, val); } catch (e) {}
    if (!ignorar(key)) enviarAoBanco(key, val);
  };

  // 3) Exposto para o painel.js (ex.: poll de notificacoes em tempo real do Supabase)
  window.__SAYKIDS_DB = {
    url: SUPABASE_URL,
    key: SUPABASE_KEY,
    rest: REST,
    cabecalhos: cabecalhos,
    // grava no localStorage SEM reenviar ao banco (evita re-upload do que acabou de ler)
    setLocalOnly: function (k, v) { _set(k, v); },
  };
})();
