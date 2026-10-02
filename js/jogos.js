/* Agenda e resultados usam a mesma fonte e os mesmos escudos da Home. */
(() => {
  const lista = document.querySelector("#jogos-lista");
  if (!lista) return;
  const categoria = document.querySelector("#jogos-categoria");
  const status = document.querySelector("#jogos-status");
  const contagem = document.querySelector("#jogos-contagem");
  const paginacao = document.querySelector("#jogos-paginacao");
  const anterior = document.querySelector("#jogos-anterior");
  const proxima = document.querySelector("#jogos-proxima");
  const fonte = document.querySelector("#jogos-fonte");
  const abas = [...document.querySelectorAll('.jogos-abas [role="tab"]')];
  const tabela = document.querySelector("#jogos-classificacao");
  const limite = 8;
  let dados;
  let pagina = 1;
  let aba = "partidas";

  function lerURL() {
    const parametros = new URLSearchParams(location.search);
    const chave = parametros.get("categoria");
    categoria.value = Object.hasOwn(dados, chave) ? chave
      : Object.hasOwn(dados, "profissional") ? "profissional" : Object.keys(dados)[0];
    status.value = ["agendado", "encerrado"].includes(parametros.get("status"))
      ? parametros.get("status") : "todos";
    pagina = paginaDaURL(parametros);
    aba = parametros.get("aba") === "classificacao" ||
      (!parametros.has("aba") && location.hash === "#painel-classificacao") ? "classificacao" : "partidas";
  }

  function posicionarPainel() {
    const seletor = `#painel-${aba}`;
    if (location.hash !== seletor) return;
    requestAnimationFrame(() => {
      const painel = document.querySelector(seletor);
      painel.scrollIntoView({ block: "start", behavior: "instant" });
      painel.focus({ preventScroll: true });
    });
  }

  function renderizarClassificacao(selecionada) {
    if (!selecionada.classificacao.length) {
      tabela.innerHTML = '<p class="desempenho-aviso" role="status">Classificação indisponível no momento.</p>';
      return;
    }
    const estatistica = (time, chave) => Number.isInteger(time[chave]) &&
      (chave === "saldoGols" || time[chave] >= 0) ? time[chave] : "—";
    tabela.innerHTML = `<div class="classificacao-rolagem" role="region" tabindex="0" aria-label="Classificação completa; role horizontalmente para ver todas as colunas">
      <table class="classificacao-completa">
        <caption>Classificação · ${escaparHTML(selecionada.categoria)}</caption>
        <thead><tr><th scope="col">Pos.</th><th scope="col">Clube</th>
          <th scope="col"><abbr title="Pontos">P</abbr></th><th scope="col"><abbr title="Jogos">J</abbr></th>
          <th scope="col"><abbr title="Vitórias">V</abbr></th><th scope="col"><abbr title="Empates">E</abbr></th>
          <th scope="col"><abbr title="Derrotas">D</abbr></th><th scope="col"><abbr title="Saldo de gols">SG</abbr></th></tr></thead>
        <tbody>${selecionada.classificacao.map(time => `<tr${time.guarani || time.clube === "Guarani" ? ' class="classificacao-destaque"' : ""}>
          <td>${escaparHTML(time.posicao)}</td>
          <th scope="row"><div class="classificacao-clube">
            ${escudosLocais[normalizarNome(time.clube)] || urlDadosValida(time.escudo) || urlDadosValida(time.escudoFonte)
              ? `<img ${atributosEscudo(time.clube, time.escudo, time.escudoFonte)} width="28" height="32" alt="Escudo do ${escaparHTML(time.clube)}" loading="lazy" />` : ""}
            <span>${escaparHTML(time.clube)}</span></div></th>
          <td>${time.pontos}</td>${["jogos", "vitorias", "empates", "derrotas", "saldoGols"].map(chave => `<td>${estatistica(time, chave)}</td>`).join("")}
        </tr>`).join("")}</tbody>
      </table></div>`;
    prepararEscudos(tabela);
  }

  function renderizar(navegacao = false) {
    const selecionada = dados[categoria.value];
    const jogos = selecionada.jogos.filter(jogo => status.value === "todos" || jogo.status === status.value)
      .sort((a, b) => {
        if (a.status !== b.status) return a.status === "agendado" ? -1 : 1;
        return a.status === "agendado" ? ordenarJogos(a, b) : ordenarJogos(b, a);
      });
    const paginas = Math.max(1, Math.ceil(jogos.length / limite));
    pagina = Math.min(pagina, paginas);
    const inicio = (pagina - 1) * limite;
    const visiveis = jogos.slice(inicio, inicio + limite);
    // A data completa diferencia temporadas quando houver jogos de anos distintos.
    lista.innerHTML = visiveis.map(criarJogo).join("") ||
      '<p class="desempenho-aviso" role="status">Nenhuma partida disponível para este filtro.</p>';
    lista.querySelectorAll("time").forEach(time => {
      const [ano, mes, dia] = time.dateTime.split("-");
      time.textContent = `${dia}/${mes}/${ano}`;
    });
    prepararEscudos(lista);
    lista.setAttribute("aria-busy", "false");
    contagem.textContent = jogos.length
      ? `${inicio + 1}–${inicio + visiveis.length} de ${jogos.length} ${jogos.length === 1 ? "partida" : "partidas"}`
      : "0 partidas";
    document.querySelector("#jogos-competicao").textContent = selecionada.competicao;
    fonte.href = selecionada.urlCompeticao;
    fonte.hidden = false;
    atualizarMetadados(selecionada);
    renderizarClassificacao(selecionada);
    const classificacao = aba === "classificacao";
    document.querySelector("#painel-partidas").hidden = classificacao;
    document.querySelector("#painel-classificacao").hidden = !classificacao;
    document.querySelector("#jogos-status-filtro").hidden = classificacao;
    document.querySelector("#contexto-classificacao").hidden = !classificacao ||
      !document.querySelector("#contexto-classificacao").textContent;
    document.querySelector(".classificacao-legenda").hidden = !selecionada.classificacao.length;
    if (classificacao) contagem.textContent = `${selecionada.classificacao.length} clubes`;
    abas.forEach(botao => {
      const ativa = botao.id === `aba-${aba}`;
      botao.setAttribute("aria-selected", String(ativa));
      botao.tabIndex = ativa ? 0 : -1;
    });
    paginacao.hidden = paginas < 2;
    anterior.disabled = pagina === 1;
    proxima.disabled = pagina === paginas;
    document.querySelector("#jogos-pagina").textContent = `Página ${pagina} de ${paginas}`;
    const url = new URL(location.href);
    url.searchParams.set("categoria", categoria.value);
    if (classificacao) url.searchParams.set("aba", "classificacao");
    else url.searchParams.delete("aba");
    if (["#painel-partidas", "#painel-classificacao"].includes(url.hash) &&
      url.hash !== `#painel-${aba}`) url.hash = "";
    if (status.value === "todos") url.searchParams.delete("status");
    else url.searchParams.set("status", status.value);
    if (pagina === 1) url.searchParams.delete("pagina");
    else url.searchParams.set("pagina", pagina);
    if (url.href !== location.href) history[navegacao ? "pushState" : "replaceState"](null, "", url);
  }

  async function iniciar() {
    try {
      dados = prepararDadosDesempenho(await carregarDados(fontesDados.desempenho));
      atualizarProximoJogo(dados);
      categoria.replaceChildren(...Object.entries(dados).map(([chave, item]) => {
        const opcao = document.createElement("option");
        opcao.value = chave;
        opcao.textContent = item.categoria;
        return opcao;
      }));
      lerURL();
      renderizar();
      posicionarPainel();
      categoria.disabled = status.disabled = false;
      document.querySelector(".jogos-abas").hidden = false;
      abas.forEach((botao, indice) => {
        botao.addEventListener("click", () => {
          aba = botao.id.replace("aba-", "");
          renderizar(true);
        });
        botao.addEventListener("keydown", evento => {
          if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(evento.key)) return;
          evento.preventDefault();
          const proximo = evento.key === "Home" ? 0 : evento.key === "End" ? abas.length - 1
            : (indice + (evento.key === "ArrowRight" ? 1 : -1) + abas.length) % abas.length;
          abas[proximo].focus();
          abas[proximo].click();
        });
      });
      [categoria, status].forEach(filtro => filtro.addEventListener("change", () => {
        pagina = 1;
        renderizar(true);
      }));
      function mudarPagina(deslocamento) {
        pagina += deslocamento;
        renderizar(true);
        document.querySelector("#jogos-filtros").scrollIntoView({ block: "start" });
        // Se o botão ficou desativado, mantém o foco em um controle utilizável.
        if (document.activeElement?.disabled) (anterior.disabled ? proxima : anterior).focus({ preventScroll: true });
      }
      anterior.addEventListener("click", () => mudarPagina(-1));
      proxima.addEventListener("click", () => mudarPagina(1));
      window.addEventListener("popstate", () => { lerURL(); renderizar(); posicionarPainel(); });
    } catch (erro) {
      const aviso = criarAvisoFalhaDados();
      lista.replaceChildren(aviso);
      lista.setAttribute("aria-busy", "false");
      if (destaqueProximoJogo) destaqueProximoJogo.replaceChildren(criarAvisoFalhaDados());
      console.error(erro);
    }
  }
  iniciar();
})();
