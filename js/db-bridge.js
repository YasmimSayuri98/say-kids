/* =====================================================================
   Ponte com o Banco de Dados (MySQL)  -  Say Kids
   ---------------------------------------------------------------------
   Como funciona:
   1) Ao abrir o sistema, baixa TODOS os dados do banco e coloca no
      armazenamento local (para as telas lerem normalmente).
   2) Toda vez que o sistema salva algo (saykids_*), envia junto para o
      banco MySQL (persistencia real, compartilhada entre computadores).
   Obs.: as chaves de sessao (login por aba) NAO vao para o banco.
   Se o servidor estiver desligado, o sistema continua funcionando
   apenas com os dados locais (modo offline).
   ===================================================================== */
(function () {
  var API = "http://localhost:3000";      // endereco do servidor (backend)
  var IGNORAR = ["saykids_sess", "saykids_email"]; // nao sincronizar (sessao)

  function ignorar(key) {
    if (key.indexOf("saykids_") !== 0) return true;
    for (var i = 0; i < IGNORAR.length; i++) {
      if (key.indexOf(IGNORAR[i]) === 0) return true;
    }
    return false;
  }

  // 1) Carrega os dados do banco ANTES do sistema iniciar (sincrono de proposito)
  try {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", API + "/api/stores", false);
    xhr.send(null);
    if (xhr.status === 200) {
      var stores = JSON.parse(xhr.responseText || "{}");
      Object.keys(stores).forEach(function (k) {
        try { localStorage.setItem(k, JSON.stringify(stores[k])); } catch (e) {}
      });
      window.__DB_ONLINE = true;
      console.log("[Say Kids] Conectado ao banco de dados MySQL.");
    }
  } catch (e) {
    window.__DB_ONLINE = false;
    console.warn("[Say Kids] Banco offline - usando dados locais.", e && e.message);
  }

  // 2) Write-through: toda escrita nos dados do sistema tambem vai para o banco
  var _set = localStorage.setItem.bind(localStorage);
  localStorage.setItem = function (key, val) {
    _set(key, val);
    if (!ignorar(key)) {
      try {
        var x = new XMLHttpRequest();
        x.open("PUT", API + "/api/stores/" + encodeURIComponent(key), true);
        x.setRequestHeader("Content-Type", "application/json");
        x.send(val);
      } catch (e) {}
    }
  };
})();
