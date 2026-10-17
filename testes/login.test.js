/* =====================================================================
   TESTE AUTOMATIZADO (Jest) - Modulo de Login (Say Kids)
   ---------------------------------------------------------------------
   Testa a funcao REAL de autenticacao (importada de js/login.js).
   Como rodar (na pasta do projeto):
       npm install      (so na primeira vez)
       npm test
   ===================================================================== */

// Simula o armazenamento do navegador (localStorage) no ambiente de teste.
const store = {};
global.localStorage = {
  getItem: (k) => (k in store ? store[k] : null),
  setItem: (k, v) => { store[k] = String(v); },
  removeItem: (k) => { delete store[k]; },
  clear: () => { for (const k in store) delete store[k]; },
};

// Importa a funcao real do sistema.
const { autenticar, seedUsuariosTeste } = require("../js/login.js");

describe("Login - autenticacao", () => {
  beforeEach(() => localStorage.clear());

  test("ERRO 02: sem os usuarios de teste, a Secretaria e recusada", () => {
    expect(autenticar("marina@saykids.com", "secretaria123")).toBeNull();
  });

  test("CT01 - Administrador loga com a senha correta", () => {
    expect(autenticar("admin@saykids.com", "admin123").perfil).toBe("admin");
  });

  describe("apos criar os usuarios de teste (seedUsuariosTeste)", () => {
    beforeEach(() => seedUsuariosTeste());

    test("CT02 - Secretaria loga", () => {
      expect(autenticar("marina@saykids.com", "secretaria123").perfil).toBe("secretaria");
    });
    test("CT03 - Professor loga", () => {
      expect(autenticar("juliana@saykids.com", "professor123").perfil).toBe("professor");
    });
    test("CT04 - Auxiliar loga", () => {
      expect(autenticar("ana@saykids.com", "auxiliar123").perfil).toBe("auxiliar");
    });
    test("CT05 - Senha incorreta e recusada", () => {
      expect(autenticar("admin@saykids.com", "000")).toBeNull();
    });
    test("CT07 - E-mail inexistente e recusado", () => {
      expect(autenticar("naoexiste@saykids.com", "admin123")).toBeNull();
    });
    test("CT08 - Senha de outro perfil e recusada", () => {
      expect(autenticar("marina@saykids.com", "professor123")).toBeNull();
    });
  });
});
