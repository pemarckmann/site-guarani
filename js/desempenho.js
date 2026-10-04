/* DESEMPENHO POR CATEGORIA */

const seletorCategoria =
  document.querySelector(
    "#categoria-desempenho",
  );

const categoriaJogos =
  document.querySelector(
    "#categoria-jogos",
  );

const competicaoClassificacao =
  document.querySelector(
    "#competicao-classificacao",
  );

const listaUltimosJogos =
  document.querySelector(
    "#ultimos-jogos-lista",
  );

const listaClassificacao =
  document.querySelector(
    "#classificacao-lista",
  );

const linkTabelaCompleta =
  document.querySelector(
    "#link-tabela-completa",
  );

const linkVerTodosJogos =
  document.querySelector(
    "#link-ver-todos-jogos",
  );

const tituloJogos = document.querySelector("#titulo-jogos");
const temporadaDesempenho = document.querySelector("#temporada-desempenho");
const fonteDesempenho = document.querySelector("#fonte-desempenho");
const contextoClassificacao = document.querySelector("#contexto-classificacao");
const resumoClassificacao = document.querySelector("#resumo-classificacao");
const destaqueProximoJogo = document.querySelector("#proximo-jogo-card");

// Versoes pequenas das marcas conhecidas; a origem do JSON continua como alternativa.
const logosCompeticoesOtimizados = {
  "https://fgf.com.br/marcas/SERIE-A2.png": {
    "src": "assets/otimizadas/heroes/gauchao-serie-a2-ee8cc65f1300c4b2.webp",
    "largura": 320,
    "altura": 368
  },
  "https://fgf.com.br/marcas/SUB-17-A2.png": {
    "src": "assets/otimizadas/heroes/gauchao-sub-17-a2-grupo-c-0af1bb4d5af9edaa.webp",
    "largura": 320,
    "altura": 385
  },
  "https://fgf.com.br/marcas/SUB-15.png": {
    "src": "assets/otimizadas/heroes/gauchao-sub-15-grupo-a-d86311271d5a90f2.webp",
    "largura": 320,
    "altura": 385
  },
  "https://fgf.com.br/marcas/FEMININO-SUB-15.png": {
    "src": "assets/otimizadas/heroes/gauchao-feminino-sub-15-grupo-b-ba73eea4fb607af7.webp",
    "largura": 292,
    "altura": 400
  }
};

const logosCompeticoes = {
  "gauchao serie a2": { src: "assets/competicoes/gauchao-a2.webp", largura: 3164, altura: 3634 },
  "gauchao a2": { src: "assets/competicoes/gauchao-a2.webp", largura: 3164, altura: 3634 },
  "gauchao sub 17 a2": { src: "assets/otimizadas/sub17-a2.webp", largura: 360, altura: 434 },
  "gauchao sub 15": { src: "assets/competicoes/gauchao-sub15.webp", largura: 3116, altura: 3753 },
  "gauchao feminino sub 15": { src: "assets/competicoes/gauchao-feminino-sub15.webp", largura: 2743, altura: 3753 },
  "gauchao serie b": { src: "assets/competicoes/gauchao-serie-b.webp", largura: 3776, altura: 3634 },
  "gauchao feminino sub 20": { src: "assets/competicoes/gauchao-feminino-sub20.webp", largura: 2742, altura: 3753 },
  "gauchao feminino sub 17": { src: "assets/competicoes/gauchao-feminino-sub17.webp", largura: 2742, altura: 3753 },
  "gauchao sub 20 a1": { src: "assets/competicoes/gauchao-sub20-a1.webp", largura: 3116, altura: 3753 },
  "gauchao sub 20 a2": { src: "assets/competicoes/gauchao-sub20-a2.webp", largura: 3116, altura: 3753 },
  "gauchao sub 17 a1": { src: "assets/competicoes/gauchao-sub17-a1.webp", largura: 3116, altura: 3753 },
  "gauchao sub 13": { src: "assets/competicoes/gauchao-sub13.webp", largura: 3116, altura: 3753 },
  "gauchao 2025": { src: "assets/competicoes/variantes/gauchao/versao-9.webp", largura: 2312, altura: 2262 },
  "copa fgf": { src: "assets/competicoes/variantes/copa-fgf/versao-3.webp", largura: 2080, altura: 2722 },
  "recopa": { src: "assets/competicoes/variantes/recopa-gaucha/versao-2.webp", largura: 2962, altura: 2556 },
  "recopa gaucha": { src: "assets/competicoes/variantes/recopa-gaucha/versao-2.webp", largura: 2962, altura: 2556 },
  "gauchao feminino": { src: "assets/competicoes/variantes/gauchao-feminino/versao-10.webp", largura: 1453, altura: 1507 },
  "copa sul 2025": { src: "assets/competicoes/variantes/copa-sul-2026/versao-4.webp", largura: 1740, altura: 2540 },
  "2 festival de futebol infantil": { src: "assets/competicoes/variantes/festival-infantil-2/versao-3.webp", largura: 2855, altura: 3620 },
  "3 festival de futebol infantil": { src: "assets/competicoes/variantes/festival-infantil-3/versao-3.webp", largura: 2855, altura: 3620 },
};

// Escudos escolhidos pelo clube têm prioridade sobre os coletados da FGF.
// Variantes locais; caminhos novos do scraper continuam usando a imagem coletada.
const escudosOtimizados = {
  "assets/coletadas/equipes/aimore-f8a7baca9f369b68.png": "assets/otimizadas/escudos/aimore-f8a7baca9f369b68.webp",
  "assets/coletadas/equipes/apafut-1e5d2ef8e2750b39.png": "assets/otimizadas/escudos/apafut-1e5d2ef8e2750b39.webp",
  "assets/coletadas/equipes/as-mina-de-candiota-c21ca2518d5be9b4.png": "assets/otimizadas/escudos/as-mina-de-candiota-c21ca2518d5be9b4.webp",
  "assets/coletadas/equipes/bage-7e53d2b229040748.png": "assets/otimizadas/escudos/bage-7e53d2b229040748.webp",
  "assets/coletadas/equipes/brasil-de-farroupilha-ed0ae104d6421d52.jpg": "assets/otimizadas/escudos/brasil-de-farroupilha-ed0ae104d6421d52.webp",
  "assets/coletadas/equipes/ceramica-9fa88e98fce94255.jpg": "assets/otimizadas/escudos/ceramica-9fa88e98fce94255.webp",
  "assets/coletadas/equipes/clube-riograndense-89782e79d91cba76.png": "assets/otimizadas/escudos/clube-riograndense-89782e79d91cba76.webp",
  "assets/coletadas/equipes/esportivo-b606df4c15039879.jpg": "assets/otimizadas/escudos/esportivo-b606df4c15039879.webp",
  "assets/coletadas/equipes/gaucho-811f0d797c727cf6.png": "assets/otimizadas/escudos/gaucho-811f0d797c727cf6.webp",
  "assets/coletadas/equipes/gloria-754f90913b817edc.png": "assets/otimizadas/escudos/gloria-754f90913b817edc.webp",
  "assets/coletadas/equipes/gramadense-404fd7c6d98613a3.jpg": "assets/otimizadas/escudos/gramadense-404fd7c6d98613a3.webp",
  "assets/coletadas/equipes/gremio-352814188180671b.png": "assets/otimizadas/escudos/gremio-352814188180671b.webp",
  "assets/coletadas/equipes/guarani-6ef3ddc4323a8019.jpg": "assets/otimizadas/escudos/guarani-6ef3ddc4323a8019.webp",
  "assets/coletadas/equipes/guarany-1e65406fc0dc2d70.jpg": "assets/otimizadas/escudos/guarany-1e65406fc0dc2d70.webp",
  "assets/coletadas/equipes/internacional-756c8d326aa960aa.png": "assets/otimizadas/escudos/internacional-756c8d326aa960aa.webp",
  "assets/coletadas/equipes/lajeadense-408dc17dd111ed18.jpg": "assets/otimizadas/escudos/lajeadense-408dc17dd111ed18.webp",
  "assets/coletadas/equipes/novo-hamburgo-22f9685ef322e805.png": "assets/otimizadas/escudos/novo-hamburgo-22f9685ef322e805.webp",
  "assets/coletadas/equipes/osoriense-98bc9f14ffe21d94.jpg": "assets/otimizadas/escudos/osoriense-98bc9f14ffe21d94.webp",
  "assets/coletadas/equipes/passo-fundo-7830535aaea48a43.jpg": "assets/otimizadas/escudos/passo-fundo-7830535aaea48a43.webp",
  "assets/coletadas/equipes/pelotas-a0bb0f4561b38d98.jpg": "assets/otimizadas/escudos/pelotas-a0bb0f4561b38d98.webp",
  "assets/coletadas/equipes/pinheiros-7c392135a6fe2ea9.jpg": "assets/otimizadas/escudos/pinheiros-7c392135a6fe2ea9.webp",
  "assets/coletadas/equipes/progresso-e836a0509c48abf0.jpg": "assets/otimizadas/escudos/progresso-e836a0509c48abf0.webp",
  "assets/coletadas/equipes/santa-cruz-e8cd576d84e93603.jpg": "assets/otimizadas/escudos/santa-cruz-e8cd576d84e93603.webp",
  "assets/coletadas/equipes/soledade-fc-1b289a15334c8976.png": "assets/otimizadas/escudos/soledade-fc-1b289a15334c8976.webp",
  "assets/coletadas/equipes/tamoio-44e86df293e485ed.png": "assets/otimizadas/escudos/tamoio-44e86df293e485ed.webp",
  "assets/coletadas/equipes/uniao-frederiquense-8f5ab8d1168c0405.jpg": "assets/otimizadas/escudos/uniao-frederiquense-8f5ab8d1168c0405.webp",
  "assets/coletadas/equipes/veranopolis-50348719c6f8a094.png": "assets/otimizadas/escudos/veranopolis-50348719c6f8a094.webp"
};

const escudosLocais = {
  "guarani": "assets/otimizadas/escudo.webp",
  "osoriense": "assets/otimizadas/osoriense.webp",
  "uniao frederiquense": "assets/otimizadas/uniao-frederiquense.webp",
  "passo fundo": "assets/otimizadas/passo-fundo.webp",
  "santa cruz": "assets/otimizadas/santa-cruz.webp",
  "pinheiros": "assets/otimizadas/pinheiros.webp",
  "soledade fc": "assets/otimizadas/soledade.webp",
  "ceramica": "assets/otimizadas/ceramica.webp",
};

function atributosEscudo(clube, coletado, fonte) {
  const caminhos = [...new Set([
    escudosLocais[normalizarNome(clube)], escudosOtimizados[coletado], coletado, fonte,
  ].filter(urlDadosValida))];
  return `src="${escaparHTML(caminhos[0] || "")}" data-escudos-alternativos="${escaparHTML(JSON.stringify(caminhos.slice(1)))}"`;
}

function normalizarNome(valor) {
  return valor.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .toLowerCase().replace(/-/g, " ").replace(/\s+/g, " ").trim();
}

function logoCompeticaoValido(logo) {
  return logo && urlDadosValida(logo.src) &&
    [logo.largura, logo.altura].every(valor => Number.isInteger(valor) && valor > 0);
}

function numeroPartidaValido(jogo) {
  return Number.isInteger(jogo.partida) && Number.isInteger(jogo.totalPartidas) &&
    jogo.partida > 0 && jogo.totalPartidas > 1 && jogo.partida <= jogo.totalPartidas;
}

function identificarPartidas(jogos) {
  const confrontos = new Map();
  jogos.forEach(jogo => {
    if (!textoValido(jogo.fase) ||
        !/^(oitavas|quartas|semifinal|semifinais|final)(\s|$)/.test(normalizarNome(jogo.fase))) return;
    const chave = JSON.stringify([
      normalizarNome(jogo.competicao), normalizarNome(jogo.fase), jogo.data.slice(0, 4),
      [jogo.mandante, jogo.visitante].sort(),
    ]);
    if (!confrontos.has(chave)) confrontos.set(chave, []);
    confrontos.get(chave).push(jogo);
  });
  const numeros = new Map();
  confrontos.forEach(partidas => {
    if (partidas.length !== 2 || partidas[0].mandante !== partidas[1].visitante ||
        partidas[0].visitante !== partidas[1].mandante || ordenarJogos(...partidas) === 0) return;
    partidas.sort(ordenarJogos).forEach((jogo, indice) => numeros.set(jogo.id, indice + 1));
  });
  return jogos.map(jogo => numeroPartidaValido(jogo) || !numeros.has(jogo.id)
    ? jogo : { ...jogo, partida: numeros.get(jogo.id), totalPartidas: 2 });
}

function horaValida(hora) {
  return typeof hora === "string" && /^(?:[01]\d|2[0-3]):[0-5]\d$/.test(hora);
}

function golsValidos(gols) {
  return Number.isInteger(gols) && gols >= 0;
}

function penaltisValidos(jogo) {
  return jogo.status === "encerrado" && jogo.mandanteGols === jogo.visitanteGols &&
    [jogo.mandantePenaltis, jogo.visitantePenaltis].every(golsValidos) &&
    jogo.mandantePenaltis !== jogo.visitantePenaltis;
}

/* CRIAR JOGO */

function escaparHTML(valor) {
  const entidades = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  };

  return String(valor).replace(/[&<>"']/g, (caractere) => entidades[caractere]);
}

function jogoValido(jogo) {
  if (!jogo || !idValido(jogo.id) || !dataISOValida(jogo.data) ||
      ![jogo.competicao, jogo.estadio, jogo.mandante, jogo.visitante].every(textoValido) ||
      ![jogo.mandanteEscudo, jogo.visitanteEscudo].every(urlDadosValida) ||
      jogo.mandante === jogo.visitante ||
      ![jogo.mandante, jogo.visitante].includes("Guarani") ||
      (jogo.hora != null && !horaValida(jogo.hora)) ||
      (jogo.decisao != null &&
        (jogo.decisao !== "penaltis" || !penaltisValidos(jogo)))) return false;
  if (jogo.status === "agendado") {
    return jogo.mandanteGols === null && jogo.visitanteGols === null;
  }
  return jogo.status === "encerrado" &&
    [jogo.mandanteGols, jogo.visitanteGols].every(golsValidos);
}

function classificacaoValida(time) {
  return textoValido(time.clube) && typeof time.posicao === "string" &&
    /^[1-9]\d*º$/.test(time.posicao) && Number.isInteger(time.pontos) &&
    (time.guarani === undefined || typeof time.guarani === "boolean");
}

function criarJogo(jogo) {
  if (!jogoValido(jogo)) return "";
  const agendado = jogo.status === "agendado";
  const penaltis = jogo.decisao === "penaltis";
  let resultado = "Agendado";
  let classeResultado = "resultado-agendado";
  if (!agendado) {
    const golsMandante = penaltis ? jogo.mandantePenaltis : jogo.mandanteGols;
    const golsVisitante = penaltis ? jogo.visitantePenaltis : jogo.visitanteGols;
    const saldo = jogo.mandante === "Guarani"
      ? golsMandante - golsVisitante : golsVisitante - golsMandante;
    resultado = saldo > 0 ? "Vitória" : saldo < 0 ? "Derrota" : "Empate";
    if (penaltis) resultado += " nos pênaltis";
    classeResultado = saldo > 0
      ? "resultado-vitoria"
      : saldo < 0 ? "resultado-derrota" : "resultado-empate";
  }
  const dataCurta = `${jogo.data.slice(8, 10)}/${jogo.data.slice(5, 7)}`;

  return `
    <div class="ultimo-jogo" data-jogo-id="${escaparHTML(jogo.id)}">

      <div class="ultimo-jogo-info">

        <strong>
          <time datetime="${escaparHTML(jogo.data)}">${dataCurta}</time>${horaValida(jogo.hora) ? ` • ${escaparHTML(jogo.hora)}` : ""}
        </strong>

        <span>
          ${escaparHTML(jogo.competicao)}
        </span>

        <small>
          ${escaparHTML(jogo.estadio)}
        </small>
        ${textoValido(jogo.fase) ? `<small>${escaparHTML(jogo.fase)}${Number.isInteger(jogo.rodada) && jogo.rodada > 0 ? ` • ${jogo.rodada}ª rodada` : ""}</small>` : ""}
        ${numeroPartidaValido(jogo) ? `<small class="partida-confronto">Partida ${jogo.partida} de ${jogo.totalPartidas}</small>` : ""}

      </div>

      <div class="ultimo-jogo-confronto">

        <div class="ultimo-jogo-time">

          <img
            ${atributosEscudo(jogo.mandante, jogo.mandanteEscudo, jogo.mandanteEscudoFonte)}
            width="48"
            height="48"
            alt="Escudo do ${escaparHTML(jogo.mandante)}"
          />

          <span>
            ${escaparHTML(jogo.mandante)}
          </span>

        </div>

        <div class="ultimo-jogo-marcador">
          <div class="ultimo-jogo-placar">

            <strong>
              ${agendado ? "—" : escaparHTML(jogo.mandanteGols)}
            </strong>

            <span>
              X
            </span>

            <strong>
              ${agendado ? "—" : escaparHTML(jogo.visitanteGols)}
            </strong>

          </div>
          ${penaltis ? `<small class="ultimo-jogo-penaltis">Pênaltis: ${jogo.mandantePenaltis} × ${jogo.visitantePenaltis}</small>` : ""}
        </div>

        <div class="ultimo-jogo-time">

          <img
            ${atributosEscudo(jogo.visitante, jogo.visitanteEscudo, jogo.visitanteEscudoFonte)}
            width="48"
            height="48"
            alt="Escudo do ${escaparHTML(jogo.visitante)}"
          />

          <span>
            ${escaparHTML(jogo.visitante)}
          </span>

        </div>

      </div>

      <span
        class="resultado ${classeResultado}"
      >
        ${resultado}
      </span>

    </div>
  `;
}

/* CRIAR LINHA DA CLASSIFICAÇÃO */

function criarLinhaClassificacao(time) {
  /*
    Linha especial do Guarani.
  */

  if (time.guarani || time.clube === "Guarani") {
    return `
      <div
        class="classificacao-linha classificacao-guarani"
      >

        <strong>
          ${escaparHTML(time.posicao)}
        </strong>

        <div class="classificacao-time-guarani">

          <img
            ${atributosEscudo("Guarani", time.escudo, time.escudoFonte)}
            width="27"
            height="27"
            alt="Escudo do Guarani"
          />

          <span>
            ${escaparHTML(time.clube)}
          </span>

        </div>

        <strong>
          ${escaparHTML(time.pontos)}
        </strong>

      </div>
    `;
  }

  /*
    Demais clubes.
  */

  return `
    <div class="classificacao-linha">

      <strong>
        ${escaparHTML(time.posicao)}
      </strong>

      <span>
        ${escaparHTML(time.clube)}
      </span>

      <strong>
        ${escaparHTML(time.pontos)}
      </strong>

    </div>
  `;
}

function prepararDadosDesempenho(origem) {
  if (!origem || typeof origem !== "object" || Array.isArray(origem)) {
    throw new Error("Formato de desempenho invalido.");
  }
  const dados = Object.create(null);
  Object.entries(origem).forEach(([chave, categoria]) => {
    const invalida = !idValido(chave) || !categoria || typeof categoria !== "object" ||
      ![categoria.categoria, categoria.competicao].every(textoValido) ||
      !urlDadosValida(categoria.urlCompeticao) ||
      !Array.isArray(categoria.jogos) || !Array.isArray(categoria.classificacao);
    if (invalida) {
      console.warn(`Categoria inválida ignorada: ${chave}.`);
      return;
    }
    dados[chave] = {
      ...categoria,
      jogos: identificarPartidas(registrosValidos(categoria.jogos, jogoValido, "Jogos")),
      classificacao: registrosValidos(categoria.classificacao, classificacaoValida, "Classificação", "clube")
        .sort((a, b) => parseInt(a.posicao, 10) - parseInt(b.posicao, 10)),
    };
  });
  const disponiveis = Object.keys(dados);
  if (!disponiveis.length) throw new Error("Nenhuma categoria válida disponível.");
  return dados;
}

function ordenarJogos(a, b) {
  return `${a.data}T${a.hora || "00:00"}`.localeCompare(`${b.data}T${b.hora || "00:00"}`);
}

function jogosEmDestaque(jogos) {
  return jogos.filter(jogo => jogo.status === "encerrado")
    .sort((a, b) => ordenarJogos(b, a)).slice(0, 3);
}

function classificacaoEmDestaque(classificacao) {
  const limite = 6;
  const indiceGuarani = classificacao.findIndex(time => time.guarani || time.clube === "Guarani");
  const inicio = Math.max(0, Math.min(
    indiceGuarani - Math.floor((limite - 1) / 2),
    classificacao.length - limite,
  ));
  return classificacao.slice(inicio, inicio + limite);
}

function prepararEscudos(container) {
  if (!container) return;
  container.querySelectorAll("img:not(.logo-competicao)").forEach(imagem => {
    const caminhos = JSON.parse(imagem.dataset.escudosAlternativos || "[]");
    function mostrarAlternativa() {
      if (!imagem.isConnected) return;
      if (caminhos.length) {
        imagem.src = caminhos.shift();
        return;
      }
      imagem.removeEventListener("error", mostrarAlternativa);
      const alternativa = document.createElement("span");
      alternativa.className = "escudo-indisponivel";
      alternativa.setAttribute("role", "img");
      alternativa.setAttribute("aria-label", imagem.alt);
      const clube = imagem.alt.replace(/^Escudo do /, "");
      alternativa.textContent = clube.split(/\s+/).slice(0, 2).map(palavra => palavra[0]).join("");
      imagem.replaceWith(alternativa);
    }
    imagem.addEventListener("error", mostrarAlternativa);
    if (imagem.complete && !imagem.naturalWidth) mostrarAlternativa();
  });
}

let navegarProximoJogoPorArrasto = null;
const reduzirMovimentoProximoJogo = matchMedia("(prefers-reduced-motion: reduce)");
let trocandoProximoJogo = false;

function conteudosProximoJogo() {
  return [...destaqueProximoJogo.querySelectorAll(
    ".jogo-titulo > *, .jogo-times > .time, .jogo-times > .versus, .jogo-info > *"
  )];
}

async function trocarProximoJogoComEfeito(direcao, atualizar) {
  if (trocandoProximoJogo) return;
  if (reduzirMovimentoProximoJogo.matches) {
    atualizar();
    return;
  }
  trocandoProximoJogo = true;
  const animacoes = [];
  try {
    const distancia = Math.min(destaqueProximoJogo.clientWidth * 0.12, 48);
    const saidas = conteudosProximoJogo().map(elemento => elemento.animate([
      { transform: elemento.style.transform || "translateX(0)", opacity: 1 },
      { transform: `translateX(${-direcao * distancia}px)`, opacity: 0 },
    ], { duration: 130, easing: "ease-out", fill: "forwards" }));
    animacoes.push(...saidas);
    await Promise.all(saidas.map(animacao => animacao.finished));
    atualizar();
    const entradas = conteudosProximoJogo().map(elemento => elemento.animate([
      { transform: `translateX(${direcao * distancia}px)`, opacity: 0 },
      { transform: "translateX(0)", opacity: 1 },
    ], { duration: 220, easing: "cubic-bezier(.22, 1, .36, 1)" }));
    animacoes.push(...entradas);
    saidas.forEach(animacao => animacao.cancel());
    await Promise.all(entradas.map(animacao => animacao.finished));
  } catch (erro) {
    if (erro.name !== "AbortError") console.error(erro);
  } finally {
    animacoes.forEach(animacao => animacao.cancel());
    conteudosProximoJogo().forEach(elemento => { elemento.style.transform = ""; });
    trocandoProximoJogo = false;
  }
}

if (destaqueProximoJogo) {
  let inicioArrasto = null;
  let ignorarCliqueAte = 0;
  let retornos = [];

  function restaurarCard() {
    inicioArrasto = null;
    retornos.forEach(animacao => animacao.cancel());
    retornos = [];
    conteudosProximoJogo().forEach(elemento => {
      const origem = elemento.style.transform;
      elemento.style.transform = "";
      if (origem && !reduzirMovimentoProximoJogo.matches) {
        retornos.push(elemento.animate([
          { transform: origem }, { transform: "translateX(0)" },
        ], { duration: 180, easing: "ease-out" }));
      }
    });
  }

  destaqueProximoJogo.addEventListener("pointerdown", evento => {
    // Mouse continua usando as setas; dois dedos ficam disponíveis para zoom.
    if (!evento.isPrimary) {
      restaurarCard();
      return;
    }
    if (trocandoProximoJogo || !navegarProximoJogoPorArrasto || evento.pointerType !== "touch" ||
        evento.target.closest("button")) return;
    retornos.forEach(animacao => animacao.cancel());
    inicioArrasto = { id: evento.pointerId, x: evento.clientX, y: evento.clientY };
  });

  destaqueProximoJogo.addEventListener("pointermove", evento => {
    if (!inicioArrasto || evento.pointerId !== inicioArrasto.id) return;
    const horizontal = Math.abs(evento.clientX - inicioArrasto.x);
    const vertical = Math.abs(evento.clientY - inicioArrasto.y);
    if (vertical > 12 && vertical >= horizontal) {
      restaurarCard();
    } else if (horizontal > 12 && horizontal > vertical * 1.5) {
      destaqueProximoJogo.setPointerCapture(evento.pointerId);
      if (!reduzirMovimentoProximoJogo.matches) {
        const limite = Math.min(destaqueProximoJogo.clientWidth * 0.12, 48);
        const deslocamento = Math.max(-limite, Math.min(limite, evento.clientX - inicioArrasto.x));
        conteudosProximoJogo().forEach(elemento => {
          elemento.style.transform = `translateX(${deslocamento}px)`;
        });
      }
    }
  });

  destaqueProximoJogo.addEventListener("pointerup", evento => {
    if (!inicioArrasto || evento.pointerId !== inicioArrasto.id) return;
    const horizontal = evento.clientX - inicioArrasto.x;
    const vertical = evento.clientY - inicioArrasto.y;
    inicioArrasto = null;
    if (Math.abs(horizontal) < 45 || Math.abs(horizontal) <= Math.abs(vertical) * 1.5) {
      restaurarCard();
      return;
    }
    // Um arrasto iniciado sobre o link não deve abrir a FGF ao soltar o dedo.
    ignorarCliqueAte = Date.now() + 500;
    navegarProximoJogoPorArrasto?.(horizontal < 0 ? 1 : -1);
  });

  destaqueProximoJogo.addEventListener("pointercancel", restaurarCard);
  destaqueProximoJogo.addEventListener("lostpointercapture", evento => {
    // Transferir a captura de um escudo ou texto para o card também dispara
    // esse evento no filho; somente a perda da captura do card cancela o gesto.
    if (evento.target === destaqueProximoJogo && inicioArrasto) restaurarCard();
  });
  destaqueProximoJogo.addEventListener("click", evento => {
    if (evento.detail > 0 && Date.now() < ignorarCliqueAte) {
      evento.preventDefault();
      evento.stopPropagation();
    }
  }, true);
}

function atualizarProximoJogo(categorias, indice = 0) {
  if (!destaqueProximoJogo) return;
  const agendados = Object.values(categorias).flatMap(categoria =>
    categoria.jogos.filter(jogo => jogo.status === "agendado")
      .map(jogo => ({ jogo, categoria: categoria.categoria, logo: categoria.logoCompeticao }))
  ).sort((a, b) => ordenarJogos(a.jogo, b.jogo));
  const selecionado = agendados.length
    ? ((indice % agendados.length) + agendados.length) % agendados.length : 0;
  const proximo = agendados[selecionado];
  navegarProximoJogoPorArrasto = agendados.length > 1
    ? direcao => trocarProximoJogoComEfeito(direcao, () => atualizarProximoJogo(categorias, selecionado + direcao)) : null;
  destaqueProximoJogo.classList.toggle("jogo-card-arrastavel", agendados.length > 1);
  if (agendados.length > 1 && !destaqueProximoJogo.parentElement.classList.contains("jogo-destaque")) {
    const destaque = document.createElement("div");
    destaque.className = "jogo-destaque";
    destaqueProximoJogo.before(destaque);
    destaque.append(destaqueProximoJogo);
  }
  let navegacao = destaqueProximoJogo.parentElement.querySelector(".jogo-navegacao");
  if (agendados.length > 1 && !navegacao) {
    navegacao = document.createElement("nav");
    navegacao.className = "jogo-navegacao";
    navegacao.setAttribute("aria-label", "Consultar próximas partidas");
    navegacao.innerHTML = `
      <button type="button" class="jogo-anterior" aria-label="Ver partida agendada anterior" aria-controls="proximo-jogo-card"><span class="jogo-seta" aria-hidden="true"></span></button>
      <button type="button" class="jogo-seguinte" aria-label="Ver próxima partida agendada" aria-controls="proximo-jogo-card"><span class="jogo-seta" aria-hidden="true"></span></button>`;
    destaqueProximoJogo.after(navegacao);
  }
  if (navegacao) {
    navegacao.hidden = agendados.length <= 1;
    // Mantém os mesmos botões ao trocar a partida, preservando o foco do teclado.
    navegacao.querySelector(".jogo-anterior").onclick = () => navegarProximoJogoPorArrasto?.(-1);
    navegacao.querySelector(".jogo-seguinte").onclick = () => navegarProximoJogoPorArrasto?.(1);
  }
  destaqueProximoJogo.dataset.jogoId = proximo?.jogo.id || "";
  destaqueProximoJogo.classList.toggle("jogo-card-sem-dados", !proximo);
  if (!proximo) {
    destaqueProximoJogo.innerHTML = '<p class="desempenho-aviso">Próximas partidas em breve.</p>';
    return;
  }
  const { jogo, categoria } = proximo;
  const logoOriginal = logoCompeticaoValido(proximo.logo) ? proximo.logo
    : logosCompeticoes[normalizarNome(jogo.competicao)];
  const logo = logosCompeticoesOtimizados[logoOriginal?.fonte || logoOriginal?.src] || logoOriginal;
  const data = new Date(`${jogo.data}T12:00:00Z`);
  const diaSemana = new Intl.DateTimeFormat("pt-BR", { weekday: "long", timeZone: "UTC" }).format(data);
  const dataCurta = `${jogo.data.slice(8, 10)}/${jogo.data.slice(5, 7)}`;
  const criarTime = (clube, escudo, fonte) => `
    <div class="time">
      <img ${atributosEscudo(clube, escudo, fonte)} width="90" height="90" alt="Escudo do ${escaparHTML(clube)}" />
      <strong>${escaparHTML(clube)}</strong>
      ${clube === "Guarani" ? `<span class="time-categoria">${escaparHTML(categoria)}</span>` : ""}
    </div>`;
  destaqueProximoJogo.innerHTML = `
    <div class="jogo-titulo">
      ${logoCompeticaoValido(logo) ? `<img src="${escaparHTML(logo.src)}" width="${logo.largura}" height="${logo.altura}" alt="${escaparHTML(jogo.competicao)}" class="logo-competicao" fetchpriority="high"${logo !== logoOriginal ? ` data-logo-original="${escaparHTML(logoOriginal.src)}"` : ""} />` : ""}
      <span>${selecionado === 0 ? "PRÓXIMA PARTIDA" : "PARTIDA AGENDADA"}</span>
      <strong>${escaparHTML(jogo.competicao)}</strong>
      ${textoValido(jogo.fase) ? `<small>${escaparHTML(jogo.fase)}</small>` : ""}
      ${numeroPartidaValido(jogo) ? `<small>Partida ${jogo.partida} de ${jogo.totalPartidas}</small>` : ""}
    </div>
    <div class="jogo-times">
      ${criarTime(jogo.mandante, jogo.mandanteEscudo, jogo.mandanteEscudoFonte)}
      <div class="versus"><span aria-hidden="true">X</span><span class="sr-only">contra</span></div>
      ${criarTime(jogo.visitante, jogo.visitanteEscudo, jogo.visitanteEscudoFonte)}
    </div>
    <div class="jogo-info">
      <strong>${escaparHTML(diaSemana)}
        <span class="data-jogo"><time datetime="${escaparHTML(jogo.data)}">${dataCurta}</time>${horaValida(jogo.hora) ? ` • ${escaparHTML(jogo.hora)}` : " • Horário a confirmar"}</span>
      </strong>
      <span>${escaparHTML(jogo.estadio)}</span>
      ${urlDadosValida(jogo.urlFonte) ? `<a href="${escaparHTML(jogo.urlFonte)}" target="_blank" rel="noopener noreferrer" class="detalhes-jogo">Sobre o jogo →</a>` : ""}
    </div>`;
  prepararEscudos(destaqueProximoJogo);
  const imagemLogo = destaqueProximoJogo.querySelector(".logo-competicao");
  if (imagemLogo) {
    function tentarLogoOriginal() {
      const original = imagemLogo.dataset.logoOriginal;
      if (original) {
        delete imagemLogo.dataset.logoOriginal;
        imagemLogo.src = original;
      } else imagemLogo.remove();
    }
    imagemLogo.addEventListener("error", tentarLogoOriginal);
    if (imagemLogo.complete && !imagemLogo.naturalWidth) tentarLogoOriginal();
  }
}

function atualizarMetadados(dados) {
  if (temporadaDesempenho) temporadaDesempenho.textContent = Number.isInteger(dados.temporada)
    ? `TEMPORADA ${dados.temporada}` : "DESEMPENHO";
  if (contextoClassificacao) {
    contextoClassificacao.textContent = [dados.faseClassificacao, dados.grupo].filter(textoValido).join(" • ");
    contextoClassificacao.hidden = !contextoClassificacao.textContent;
  }
  if (fonteDesempenho) {
    const informacoes = [];
    if (textoValido(dados.fonte)) informacoes.push(dados.fonte);
    if (textoValido(dados.atualizadoEm) && /^\d{4}-\d{2}-\d{2}T/.test(dados.atualizadoEm) &&
        Number.isFinite(Date.parse(dados.atualizadoEm))) {
      const atualizado = new Intl.DateTimeFormat("pt-BR", {
        dateStyle: "short", timeStyle: "short", timeZone: "America/Sao_Paulo",
      }).format(new Date(dados.atualizadoEm));
      informacoes.push(`Atualizado em ${atualizado}`);
    }
    fonteDesempenho.textContent = informacoes.join(" • ");
    fonteDesempenho.title = "Fonte dos dados e última atualização no horário de Brasília";
    fonteDesempenho.hidden = !fonteDesempenho.textContent;
  }
}

/* ATUALIZAR DESEMPENHO */

function atualizarDesempenho(dados, chaveCategoria) {
  if (!dados) {
    return;
  }
  atualizarMetadados(dados);
  const jogos = jogosEmDestaque(dados.jogos);
  const classificacao = classificacaoEmDestaque(dados.classificacao);

  /* TÍTULOS */

  categoriaJogos.textContent =
    dados.categoria;

  competicaoClassificacao.textContent =
    dados.competicao;

  if (tituloJogos) {
    tituloJogos.textContent = "Últimos jogos";
  }

  /* JOGOS */

  listaUltimosJogos.innerHTML =
    jogos
      .map(criarJogo)
      .join("") || '<p class="desempenho-aviso">Nenhum resultado disponível no momento.</p>';

  /* CLASSIFICAÇÃO */

  listaClassificacao.innerHTML =
    classificacao
      .map(criarLinhaClassificacao)
      .join("") || '<p class="desempenho-aviso">Classificação indisponível no momento.</p>';
  if (resumoClassificacao) {
    resumoClassificacao.textContent = classificacao.length < dados.classificacao.length
      ? `Trecho da tabela: ${classificacao[0].posicao} ao ${classificacao[classificacao.length - 1].posicao} de ${dados.classificacao.length} clubes.` : "";
    resumoClassificacao.hidden = !resumoClassificacao.textContent;
  }
  prepararEscudos(listaUltimosJogos);
  prepararEscudos(listaClassificacao);

  /* LINKS */

  if (linkTabelaCompleta) {
    linkTabelaCompleta.href =
      `jogos.html?categoria=${encodeURIComponent(chaveCategoria)}&aba=classificacao#painel-classificacao`;
  }

  if (linkVerTodosJogos) {
    linkVerTodosJogos.href =
      `jogos.html?categoria=${encodeURIComponent(chaveCategoria)}&status=encerrado#painel-partidas`;
  }
}

/* EVENTO DA COMBOBOX */

if (
  seletorCategoria &&
  categoriaJogos &&
  competicaoClassificacao &&
  listaUltimosJogos &&
  listaClassificacao
) {
  function mostrarEstadoDesempenho(mensagem) {
    [listaUltimosJogos, listaClassificacao].forEach(lista => {
      const estado = document.createElement("p");
      estado.className = "desempenho-aviso";
      estado.setAttribute("role", "status");
      estado.textContent = mensagem;
      lista.replaceChildren(estado);
    });
  }

  async function carregarDesempenho() {
    mostrarEstadoDesempenho("Carregando dados…");
    try {
      const origem = await carregarDados(fontesDados.desempenho);
      const dados = prepararDadosDesempenho(origem);
      const disponiveis = Object.keys(dados);
      const selecionada = seletorCategoria.value;
      seletorCategoria.replaceChildren(...disponiveis.map(chave => {
        const opcao = document.createElement("option");
        opcao.value = chave;
        opcao.textContent = dados[chave].categoria;
        return opcao;
      }));
      seletorCategoria.value = dados[selecionada] ? selecionada
        : dados.profissional ? "profissional" : disponiveis[0];

      atualizarProximoJogo(dados);
      atualizarDesempenho(dados[seletorCategoria.value], seletorCategoria.value);
      seletorCategoria.disabled = false;
      seletorCategoria.addEventListener("change", () => {
        atualizarDesempenho(dados[seletorCategoria.value], seletorCategoria.value);
      });
    } catch (erro) {
      mostrarEstadoDesempenho(mensagemFalhaDados());
      if (destaqueProximoJogo) {
        const aviso = document.createElement("p");
        aviso.className = "desempenho-aviso";
        aviso.textContent = mensagemFalhaDados();
        destaqueProximoJogo.classList.add("jogo-card-sem-dados");
        destaqueProximoJogo.replaceChildren(aviso);
      }
      console.error(erro);
    }
  }

  carregarDesempenho();
}
