/* =====================================================================
   TESTE AUTOMATIZADO (Jest) - REGRAS DE NEGÓCIO (Say Kids)
   ---------------------------------------------------------------------
   Testa as funções REAIS de js/regras.js, que concentram as regras do
   sistema (turmas, restrições alimentares, estoque e recados).
   Cada teste monta uma situação e confere se a regra responde certo.

   Como rodar (na pasta do projeto):  npm test
   ===================================================================== */
const { validarTurmasPeriodo, verificarRestricoes, verificarEstoque, recadoISO } = require("../js/regras.js");

// ---------------------------------------------------------------------
// REGRAS DE TURMA (usadas no cadastro de professor e auxiliar)
// Regra: no máximo 2 turmas; os períodos devem ser DIFERENTES; e uma
// turma de período INTEGRAL só pode ser escolhida sozinha.
// A função retorna null quando está tudo certo, ou uma MENSAGEM de erro.
// ---------------------------------------------------------------------
describe("Regras de turmas (professor/auxiliar)", () => {
  // Duas turmas em turnos diferentes (manhã e tarde): é permitido -> null.
  test("2 turmas de períodos diferentes: permitido", () => {
    expect(validarTurmasPeriodo([{ nome: "A", periodo: "Matutino" }, { nome: "B", periodo: "Vespertino" }])).toBeNull();
  });

  // Duas turmas no MESMO período (duas de manhã): deve bloquear
  // (não dá para estar em duas turmas ao mesmo tempo).
  test("2 turmas do mesmo período: bloqueia", () => {
    expect(validarTurmasPeriodo([{ nome: "A", periodo: "Matutino" }, { nome: "B", periodo: "Matutino" }])).toMatch(/mesmo período/);
  });

  // Turma Integral combinada com outra: deve bloquear (Integral é o dia todo).
  test("Integral + outra turma: bloqueia (Integral só sozinha)", () => {
    expect(validarTurmasPeriodo([{ nome: "A", periodo: "Integral" }, { nome: "B", periodo: "Matutino" }])).toMatch(/Integral/);
  });

  // Apenas uma turma Integral: é permitido -> null.
  test("Apenas uma turma Integral: permitido", () => {
    expect(validarTurmasPeriodo([{ nome: "A", periodo: "Integral" }])).toBeNull();
  });
});

// ---------------------------------------------------------------------
// RESTRIÇÕES ALIMENTARES (RF-15) - ao salvar um cardápio
// A função recebe os alunos (com suas restrições) e os alimentos do
// cardápio, e retorna a lista de CONFLITOS (aluno x alimento).
// ---------------------------------------------------------------------
describe("Restrições alimentares (RF-15)", () => {
  const alunos = [
    { nome: "Cecília", restricoes: [{ alimento: "Leite", gravidade: "Alta" }] },
    { nome: "Bernardo", restricoes: [] },
  ];

  // A Cecília tem restrição a "Leite" e o cardápio tem "Leite":
  // deve gerar 1 conflito, apontando a Cecília.
  test("alimento com restrição gera conflito", () => {
    const c = verificarRestricoes(alunos, [{ alimento: "Leite" }]);
    expect(c).toHaveLength(1);
    expect(c[0].aluno).toBe("Cecília");
  });

  // Cardápio só com "Arroz": ninguém tem restrição -> nenhum conflito.
  test("cardápio sem o alimento restrito: sem conflito", () => {
    expect(verificarRestricoes(alunos, [{ alimento: "Arroz" }])).toHaveLength(0);
  });

  // Correspondência parcial: "Leite integral" contém "Leite",
  // então ainda assim deve detectar o conflito da Cecília.
  test("correspondência parcial também detecta (Leite integral ~ Leite)", () => {
    expect(verificarRestricoes(alunos, [{ alimento: "Leite integral" }])).toHaveLength(1);
  });
});

// ---------------------------------------------------------------------
// DISPONIBILIDADE DE ESTOQUE (RF-14) - ao salvar um cardápio
// A função recebe os itens do cardápio e o estoque, e retorna o que
// está FALTANDO (alimento, quanto falta, etc.).
// ---------------------------------------------------------------------
describe("Disponibilidade de estoque (RF-14)", () => {
  const estoque = [{ nome: "Arroz", quantidade: 10, unidade: "kg" }];

  // Precisa de 15 kg de arroz, mas só tem 10: falta 5 kg.
  test("quantidade maior que o estoque gera falta", () => {
    const f = verificarEstoque([{ alimento: "Arroz", quantidade: 15 }], estoque);
    expect(f).toHaveLength(1);
    expect(f[0].falta).toBe(5);
  });

  // Precisa de 8 kg e tem 10: estoque suficiente -> nenhuma falta.
  test("estoque suficiente: sem falta", () => {
    expect(verificarEstoque([{ alimento: "Arroz", quantidade: 8 }], estoque)).toHaveLength(0);
  });

  // "Feijão" não existe no estoque: disponível = 0 e falta = tudo (4).
  test("alimento inexistente no estoque: falta total", () => {
    const f = verificarEstoque([{ alimento: "Feijão", quantidade: 4 }], estoque);
    expect(f[0].disponivel).toBe(0);
    expect(f[0].falta).toBe(4);
  });
});

// ---------------------------------------------------------------------
// DATA DO RECADO (usada para mostrar o recado só no dia do filtro)
// Converte a data do recado para o formato ISO (AAAA-MM-DD).
// ---------------------------------------------------------------------
describe("Data do recado (recadoISO)", () => {
  // Se o recado já tem a data em ISO, usa ela direto.
  test("usa a data ISO quando existe", () => {
    expect(recadoISO({ dataISO: "2026-10-17", data: "17/10/2026" })).toBe("2026-10-17");
  });

  // Se só tem a data no formato brasileiro (dd/mm/aaaa), converte para ISO.
  test("converte data BR (dd/mm/aaaa) para ISO", () => {
    expect(recadoISO({ data: "05/03/2026" })).toBe("2026-03-05");
  });
});
