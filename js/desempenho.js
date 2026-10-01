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
      ![jogo.mandante, jogo.visitante].includes("Guarani")) return false;
  if (jogo.status === "agendado") {
    return jogo.mandanteGols === null && jogo.visitanteGols === null;
  }
  return jogo.status === "encerrado" &&
    [jogo.mandanteGols, jogo.visitanteGols].every(gols => Number.isInteger(gols) && gols >= 0);
}

function classificacaoValida(time) {
  return textoValido(time.clube) && typeof time.posicao === "string" &&
    /^[1-9]\d*º$/.test(time.posicao) && Number.isInteger(time.pontos) &&
    (time.guarani === undefined || typeof time.guarani === "boolean");
}

function criarJogo(jogo) {
  if (!jogoValido(jogo)) return "";
  const agendado = jogo.status === "agendado";
  let resultado = "Agendado";
  let classeResultado = "resultado-agendado";
  if (!agendado) {
    const saldo = jogo.mandante === "Guarani"
      ? jogo.mandanteGols - jogo.visitanteGols
      : jogo.visitanteGols - jogo.mandanteGols;
    resultado = saldo > 0 ? "Vitória" : saldo < 0 ? "Derrota" : "Empate";
    classeResultado = saldo > 0
      ? "resultado-vitoria"
      : saldo < 0 ? "resultado-derrota" : "resultado-empate";
  }
  const dataCurta = `${jogo.data.slice(8, 10)}/${jogo.data.slice(5, 7)}`;

  return `
    <div class="ultimo-jogo">

      <div class="ultimo-jogo-info">

        <strong>
          <time datetime="${escaparHTML(jogo.data)}">${dataCurta}</time>
        </strong>

        <span>
          ${escaparHTML(jogo.competicao)}
        </span>

        <small>
          ${escaparHTML(jogo.estadio)}
        </small>

      </div>


      <div class="ultimo-jogo-confronto">

        <div class="ultimo-jogo-time">

          <img
            src="${escaparHTML(jogo.mandanteEscudo)}"
            width="48"
            height="48"
            alt="Escudo do ${escaparHTML(jogo.mandante)}"
          />

          <span>
            ${escaparHTML(jogo.mandante)}
          </span>

        </div>


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


        <div class="ultimo-jogo-time">

          <img
            src="${escaparHTML(jogo.visitanteEscudo)}"
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

  if (time.guarani) {
    return `
      <div
        class="classificacao-linha classificacao-guarani"
      >

        <strong>
          ${escaparHTML(time.posicao)}
        </strong>


        <div class="classificacao-time-guarani">

          <img
            src="assets/otimizadas/escudo.webp"
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


/* =====================================================
   ATUALIZAR DESEMPENHO
===================================================== */

function atualizarDesempenho(dados) {
  if (!dados) {
    return;
  }


  /* ===============================================
     TÍTULOS
  =============================================== */

  categoriaJogos.textContent =
    dados.categoria;

  competicaoClassificacao.textContent =
    dados.competicao;

  if (tituloJogos) {
    tituloJogos.textContent = dados.jogos.some(jogo => jogo.status === "agendado")
      ? "Jogos" : "Últimos jogos";
  }


  /* ===============================================
     JOGOS
  =============================================== */

  listaUltimosJogos.innerHTML =
    dados.jogos
      .map(criarJogo)
      .join("") || '<p class="desempenho-aviso">Nenhum jogo disponível no momento.</p>';


  /* ===============================================
     CLASSIFICAÇÃO
  =============================================== */

  listaClassificacao.innerHTML =
    dados.classificacao
      .map(criarLinhaClassificacao)
      .join("") || '<p class="desempenho-aviso">Classificação indisponível no momento.</p>';


  /* ===============================================
     LINKS
  =============================================== */

  if (linkTabelaCompleta) {
    linkTabelaCompleta.href =
      dados.urlCompeticao;
  }

  if (linkVerTodosJogos) {
    linkVerTodosJogos.href =
      dados.urlCompeticao;
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
      if (!origem || typeof origem !== "object" || Array.isArray(origem)) {
        throw new Error("Formato de desempenho invalido.");
      }
      const dados = {};
      [...seletorCategoria.options].forEach(opcao => {
        const categoria = origem[opcao.value];
        opcao.disabled = !categoria ||
          ![categoria.categoria, categoria.competicao].every(textoValido) ||
          !urlDadosValida(categoria.urlCompeticao) ||
          !Array.isArray(categoria.jogos) || !Array.isArray(categoria.classificacao);
        if (opcao.disabled) {
          console.warn(`Categoria inválida ignorada: ${opcao.value}.`);
          return;
        }
        dados[opcao.value] = {
          ...categoria,
          jogos: registrosValidos(categoria.jogos, jogoValido, "Jogos")
            .sort((a, b) => b.data.localeCompare(a.data)).slice(0, 3),
          classificacao: registrosValidos(categoria.classificacao, classificacaoValida, "Classificação", "clube"),
        };
      });
      const disponiveis = Object.keys(dados);
      if (!disponiveis.length) throw new Error("Nenhuma categoria válida disponível.");
      if (!dados[seletorCategoria.value]) seletorCategoria.value = disponiveis[0];

      atualizarDesempenho(dados[seletorCategoria.value]);
      seletorCategoria.disabled = false;
      seletorCategoria.addEventListener("change", () => {
        atualizarDesempenho(dados[seletorCategoria.value]);
      });
    } catch (erro) {
      mostrarEstadoDesempenho(mensagemFalhaDados());
      console.error(erro);
    }
  }

  carregarDesempenho();
}
