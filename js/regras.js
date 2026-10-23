/* =====================================================================
   REGRAS DE NEGÓCIO (puras) - Say Kids
   ---------------------------------------------------------------------
   Funções sem dependência de tela/banco — fáceis de testar com Jest.
   Usadas pelo sistema (painel.js) e pelos testes automatizados.
   ===================================================================== */
(function () {
  // Regras de período das turmas (professor/auxiliar)
  function validarTurmasPeriodo(turmas) {
    // turmas: [{ nome, periodo }] — as turmas já selecionadas
    const periodos = turmas.map((t) => (t.periodo || "").trim().toLowerCase());
    if (periodos.some((p) => p === "integral") && turmas.length > 1)
      return "Turma de período Integral não pode ser combinada com outra. Selecione apenas essa turma.";
    if (periodos.some((p, i) => p && periodos.indexOf(p) !== i))
      return "As turmas selecionadas têm o mesmo período. Escolha turmas de períodos diferentes.";
    return null;
  }

  // RF-15: conflitos entre restrições dos alunos e alimentos do cardápio
  function verificarRestricoes(alunos, itens) {
    // alunos: [{ nome, restricoes:[{alimento,gravidade}] }]; itens: [{ alimento }]
    const alimentos = itens.map((i) => (i.alimento || "").toLowerCase()).filter(Boolean);
    const conflitos = [];
    alunos.forEach((a) => (a.restricoes || []).forEach((r) => {
      const alvo = (r.alimento || "").toLowerCase();
      if (!alvo) return;
      if (alimentos.some((al) => al === alvo || al.includes(alvo) || alvo.includes(al)))
        conflitos.push({ aluno: a.nome, alimento: r.alimento, gravidade: r.gravidade || "" });
    }));
    return conflitos;
  }

  // RF-14: alimentos do cardápio sem estoque suficiente
  function verificarEstoque(itens, estoque) {
    const need = {};
    itens.forEach((i) => { if (i.alimento) need[i.alimento] = (need[i.alimento] || 0) + (Number(i.quantidade) || 0); });
    const faltas = [];
    Object.keys(need).forEach((nome) => {
      const it = estoque.find((e) => (e.nome || "").toLowerCase() === nome.toLowerCase());
      const disp = it ? Number(it.quantidade) : 0;
      if (need[nome] > disp) faltas.push({ alimento: nome, necessario: need[nome], disponivel: disp, falta: need[nome] - disp, unidade: it ? it.unidade : "" });
    });
    return faltas;
  }

  // Data de um recado em formato ISO (AAAA-MM-DD)
  function recadoISO(r) {
    if (r.dataISO) return r.dataISO;
    const m = /^(\d{2})\/(\d{2})\/(\d{4})/.exec(r.data || "");
    return m ? `${m[3]}-${m[2]}-${m[1]}` : "";
  }

  const API = { validarTurmasPeriodo, verificarRestricoes, verificarEstoque, recadoISO };
  if (typeof module !== "undefined" && module.exports) module.exports = API;
  if (typeof window !== "undefined") window.Regras = API;
})();
