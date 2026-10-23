/* =====================================================================
   TESTE AUTOMATIZADO (Jest) - Módulo de LOGIN (Say Kids)
   ---------------------------------------------------------------------
   Estes testes verificam a função REAL de autenticação, importada de
   js/login.js. Cada teste simula uma tentativa de login e confere se o
   sistema aceitou/recusou corretamente.

   Como rodar (na pasta do projeto):
       npm install      (só na primeira vez)
       npm test
   ===================================================================== */

// Simula o armazenamento do navegador (localStorage) no ambiente de teste,
// para a função de login conseguir ler/gravar os usuários de teste.
const store = {};
global.localStorage = {
  getItem: (k) => (k in store ? store[k] : null),
  setItem: (k, v) => { store[k] = String(v); },
  removeItem: (k) => { delete store[k]; },
  clear: () => { for (const k in store) delete store[k]; },
};

// Importa as funções REAIS do sistema (as mesmas que o site usa).
const { autenticar, seedUsuariosTeste } = require("../js/login.js");

describe("Login - autenticação", () => {
  // Antes de cada teste, limpa os dados para começar do zero.
  beforeEach(() => localStorage.clear());

  // TESTE 1: reproduz o ERRO 02 que encontramos.
  // Sem criar os usuários de teste, o login da secretaria deve FALHAR
  // (retornar null). Era exatamente o erro: só o admin entrava no 1º acesso.
  test("ERRO 02: sem os usuários de teste, a Secretaria é recusada", () => {
    expect(autenticar("marina@saykids.com", "secretaria123")).toBeNull();
  });

  // TESTE 2: o administrador é um usuário fixo; com a senha correta,
  // deve entrar e o perfil retornado deve ser "admin".
  test("CT01 - Administrador loga com a senha correta", () => {
    expect(autenticar("admin@saykids.com", "admin123").perfil).toBe("admin");
  });

  // A partir daqui, CRIAMOS os usuários de teste (a correção do ERRO 02).
  // Agora os logins de secretaria, professor e auxiliar devem funcionar.
  describe("após criar os usuários de teste (seedUsuariosTeste)", () => {
    beforeEach(() => seedUsuariosTeste());

    // TESTE 3: secretaria com e-mail e senha corretos -> perfil "secretaria".
    test("CT02 - Secretaria loga", () => {
      expect(autenticar("marina@saykids.com", "secretaria123").perfil).toBe("secretaria");
    });

    // TESTE 4: professor com e-mail e senha corretos -> perfil "professor".
    test("CT03 - Professor loga", () => {
      expect(autenticar("juliana@saykids.com", "professor123").perfil).toBe("professor");
    });

    // TESTE 5: auxiliar com e-mail e senha corretos -> perfil "auxiliar".
    test("CT04 - Auxiliar loga", () => {
      expect(autenticar("ana@saykids.com", "auxiliar123").perfil).toBe("auxiliar");
    });

    // TESTE 6 (segurança): senha errada deve ser RECUSADA (retorna null).
    test("CT05 - Senha incorreta é recusada", () => {
      expect(autenticar("admin@saykids.com", "000")).toBeNull();
    });

    // TESTE 7 (segurança): e-mail que não existe deve ser RECUSADO.
    test("CT07 - E-mail inexistente é recusado", () => {
      expect(autenticar("naoexiste@saykids.com", "admin123")).toBeNull();
    });

    // TESTE 8 (segurança): usar a senha de OUTRO perfil deve ser RECUSADO
    // (ex.: e-mail de secretaria com a senha de professor).
    test("CT08 - Senha de outro perfil é recusada", () => {
      expect(autenticar("marina@saykids.com", "professor123")).toBeNull();
    });
  });
});
