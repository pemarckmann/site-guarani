/* =====================================================
   DESEMPENHO POR CATEGORIA
===================================================== */

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
    escudosLocais[normalizarNome(clube)], coletado, fonte,
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




/* =====================================================
   CRIAR JOGO
===================================================== */

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


/* =====================================================
   CRIAR LINHA DA CLASSIFICAÇÃO
===================================================== */

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

function atualizarProximoJogo(categorias) {
  if (!destaqueProximoJogo) return;
  const proximo = Object.values(categorias).flatMap(categoria =>
    categoria.jogos.filter(jogo => jogo.status === "agendado")
      .map(jogo => ({ jogo, categoria: categoria.categoria, logo: categoria.logoCompeticao }))
  ).sort((a, b) => ordenarJogos(a.jogo, b.jogo))[0];
  if (!proximo) {
    destaqueProximoJogo.innerHTML = '<p class="desempenho-aviso">Próximas partidas em breve.</p>';
    return;
  }
  const { jogo, categoria } = proximo;
  const logo = logoCompeticaoValido(proximo.logo) ? proximo.logo
    : logosCompeticoes[normalizarNome(jogo.competicao)];
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
      ${logoCompeticaoValido(logo) ? `<img src="${escaparHTML(logo.src)}" width="${logo.largura}" height="${logo.altura}" alt="${escaparHTML(jogo.competicao)}" class="logo-competicao" />` : ""}
      <span>PRÓXIMA PARTIDA</span>
      <strong>${escaparHTML(jogo.competicao)}</strong>
      ${textoValido(jogo.fase) ? `<small>${escaparHTML(jogo.fase)}</small>` : ""}
      ${numeroPartidaValido(jogo) ? `<small>Partida ${jogo.partida} de ${jogo.totalPartidas}</small>` : ""}
    </div>
    <div class="jogo-times">
      ${criarTime(jogo.mandante, jogo.mandanteEscudo, jogo.mandanteEscudoFonte)}
      <div class="versus" aria-label="contra">X</div>
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
    imagemLogo.addEventListener("error", () => imagemLogo.remove(), { once: true });
    if (imagemLogo.complete && !imagemLogo.naturalWidth) imagemLogo.remove();
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


/* =====================================================
   ATUALIZAR DESEMPENHO
===================================================== */

function atualizarDesempenho(dados, chaveCategoria) {
  if (!dados) {
    return;
  }
  atualizarMetadados(dados);
  const jogos = jogosEmDestaque(dados.jogos);
  const classificacao = classificacaoEmDestaque(dados.classificacao);


  /* ===============================================
     TÍTULOS
  =============================================== */

  categoriaJogos.textContent =
    dados.categoria;

  competicaoClassificacao.textContent =
    dados.competicao;

  if (tituloJogos) {
    tituloJogos.textContent = "Últimos jogos";
  }


  /* ===============================================
     JOGOS
  =============================================== */

  listaUltimosJogos.innerHTML =
    jogos
      .map(criarJogo)
      .join("") || '<p class="desempenho-aviso">Nenhum resultado disponível no momento.</p>';


  /* ===============================================
     CLASSIFICAÇÃO
  =============================================== */

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


  /* ===============================================
     LINKS
  =============================================== */

  if (linkTabelaCompleta) {
    linkTabelaCompleta.href =
      `jogos.html?categoria=${encodeURIComponent(chaveCategoria)}&aba=classificacao`;
  }

  if (linkVerTodosJogos) {
    linkVerTodosJogos.href =
      `jogos.html?categoria=${encodeURIComponent(chaveCategoria)}&status=encerrado`;
  }
}


/* =====================================================
   EVENTO DA COMBOBOX
===================================================== */

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
        destaqueProximoJogo.replaceChildren(aviso);
      }
      console.error(erro);
    }
  }

  carregarDesempenho();
}
