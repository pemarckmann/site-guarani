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


/* =====================================================
   DADOS DE EXEMPLO — SUBSTITUIR PELA API QUANDO DISPONÍVEL
===================================================== */

const dadosDesempenho = {
  /* ===================================================
     PROFISSIONAL
  =================================================== */

  profissional: {
    categoria: "PROFISSIONAL",

    competicao: "GAUCHÃO SÉRIE A2",

    urlCompeticao:
      "https://fgf.com.br/competicoes/profissional/24/2026/4218",

    jogos: [
      {
        data: "27/09",
        competicao: "Gauchão Série A2",
        estadio: "Edmundo Feix",

        mandante: "Guarani",
        mandanteEscudo:
          "assets/otimizadas/escudo.webp",
        mandanteGols: 3,

        visitante:
          "União Frederiquense",
        visitanteEscudo:
          "assets/otimizadas/uniao-frederiquense.webp",
        visitanteGols: 1,

      },

      {
        data: "23/09",
        competicao: "Gauchão Série A2",
        estadio: "Vermelhão da Serra",

        mandante: "Passo Fundo",
        mandanteEscudo:
          "assets/otimizadas/passo-fundo.webp",
        mandanteGols: 2,

        visitante: "Guarani",
        visitanteEscudo:
          "assets/otimizadas/escudo.webp",
        visitanteGols: 1,

      },

      {
        data: "19/09",
        competicao: "Gauchão Série A2",
        estadio: "Edmundo Feix",

        mandante: "Guarani",
        mandanteEscudo:
          "assets/otimizadas/escudo.webp",
        mandanteGols: 1,

        visitante: "Santa Cruz",
        visitanteEscudo:
          "assets/otimizadas/santa-cruz.webp",
        visitanteGols: 1,

      },
    ],

    classificacao: [
      {
        posicao: "7º",
        clube:
          "União Frederiquense",
        pontos: 24,
      },

      {
        posicao: "8º",
        clube:
          "Brasil de Farroupilha",
        pontos: 24,
      },

      {
        posicao: "9º",
        clube: "Aimoré",
        pontos: 21,
      },

      {
        posicao: "10º",
        clube: "Guarani",
        pontos: 18,
        guarani: true,
      },

      {
        posicao: "11º",
        clube: "Pelotas",
        pontos: 16,
      },

      {
        posicao: "12º",
        clube: "Bagé",
        pontos: 15,
      },
    ],
  },


  /* ===================================================
     SUB-17
  =================================================== */

  sub17: {
    categoria: "SUB-17",

    competicao:
      "GAUCHÃO SUB-17 A2 • GRUPO C",

    urlCompeticao:
      "https://fgf.com.br/competicoes/amador/602/2026/4195",

    jogos: [
      {
        data: "26/09",
        competicao:
          "Gauchão Sub-17 A2",
        estadio: "Edmundo Feix",

        mandante: "Guarani",
        mandanteEscudo:
          "assets/otimizadas/escudo.webp",
        mandanteGols: 1,

        visitante: "Pinheiros",
        visitanteEscudo:
          "assets/otimizadas/pinheiros.webp",
        visitanteGols: 2,

      },

      {
        data: "11/09",
        competicao:
          "Gauchão Sub-17 A2",
        estadio: "Arena Cruzeiro",

        mandante: "Cerâmica",
        mandanteEscudo:
          "assets/otimizadas/ceramica.webp",
        mandanteGols: 0,

        visitante: "Guarani",
        visitanteEscudo:
          "assets/otimizadas/escudo.webp",
        visitanteGols: 2,

      },

      {
        data: "22/08",
        competicao:
          "Gauchão Sub-17 A2",
        estadio: "Edmundo Feix",

        mandante: "Guarani",
        mandanteEscudo:
          "assets/otimizadas/escudo.webp",
        mandanteGols: 1,

        visitante: "Soledade FC",
        visitanteEscudo:
          "assets/otimizadas/soledade.webp",
        visitanteGols: 0,

      },
    ],

    classificacao: [
      {
        posicao: "1º",
        clube: "Guarany",
        pontos: 15,
      },

      {
        posicao: "2º",
        clube: "Guarani",
        pontos: 13,
        guarani: true,
      },

      {
        posicao: "3º",
        clube: "Pinheiros",
        pontos: 11,
      },

      {
        posicao: "4º",
        clube: "Soledade FC",
        pontos: 9,
      },

      {
        posicao: "5º",
        clube: "Tamoio",
        pontos: 5,
      },

      {
        posicao: "6º",
        clube: "Pelotas",
        pontos: 4,
      },
    ],
  },
};


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

function criarJogo(jogo) {
  const saldo = jogo.mandante === "Guarani"
    ? jogo.mandanteGols - jogo.visitanteGols
    : jogo.visitanteGols - jogo.mandanteGols;
  const resultado = saldo > 0 ? "Vitória" : saldo < 0 ? "Derrota" : "Empate";
  const classeResultado = saldo > 0
    ? "resultado-vitoria"
    : saldo < 0 ? "resultado-derrota" : "resultado-empate";

  return `
    <div class="ultimo-jogo">

      <div class="ultimo-jogo-info">

        <strong>
          ${escaparHTML(jogo.data)}
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
            ${escaparHTML(jogo.mandanteGols)}
          </strong>

          <span>
            X
          </span>

          <strong>
            ${escaparHTML(jogo.visitanteGols)}
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


  /* ===============================================
     JOGOS
  =============================================== */

  listaUltimosJogos.innerHTML =
    dados.jogos
      .map(criarJogo)
      .join("");


  /* ===============================================
     CLASSIFICAÇÃO
  =============================================== */

  listaClassificacao.innerHTML =
    dados.classificacao
      .map(criarLinhaClassificacao)
      .join("");


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
  /*
    Garante que os dados exibidos correspondam
    ao valor atual da combobox.
  */

  atualizarDesempenho(
    dadosDesempenho[seletorCategoria.value],
  );

  seletorCategoria.disabled = false;


  /*
    Troca o conteúdo quando o usuário
    muda de categoria.
  */

  seletorCategoria.addEventListener(
    "change",
    () => {
      atualizarDesempenho(
        dadosDesempenho[seletorCategoria.value],
      );
    },
  );
}