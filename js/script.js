const topo = document.querySelector(".topo");
const formContato = document.querySelector("#form-contato");
const assuntoContato = document.querySelector("#assunto");

/* =====================================================
   ASSUNTO DO FORMULÁRIO
===================================================== */

if (assuntoContato) {
  const parametros = new URLSearchParams(window.location.search);
  const assunto = parametros.get("assunto");

  if (assunto) {
    assuntoContato.value = assunto;
  }
}

/* =====================================================
   FORMULÁRIO DE CONTATO
===================================================== */

if (formContato) {
  formContato.addEventListener("submit", (event) => {
    event.preventDefault();

    alert("O formulário de contato estará disponível em breve.");
  });
}

/* =====================================================
   CABEÇALHO INTELIGENTE
===================================================== */

if (topo) {
  let ultimaPosicao = window.scrollY;
  let aguardandoFrame = false;

  const tolerancia = 5;
  const inicioScroll = 100;

  function controlarTopo() {
    const posicaoAtual = window.scrollY;

    /* PERTO DO TOPO */

    if (posicaoAtual <= inicioScroll) {
      topo.classList.remove("topo-oculto");
      topo.classList.remove("topo-scroll");

      ultimaPosicao = posicaoAtual;
      aguardandoFrame = false;

      return;
    }

    /* CABEÇALHO FLUTUANDO */

    topo.classList.add("topo-scroll");

    const diferenca = posicaoAtual - ultimaPosicao;

    /* IGNORA MOVIMENTOS PEQUENOS */

    if (Math.abs(diferenca) < tolerancia) {
      aguardandoFrame = false;

      return;
    }

    /* DESCENDO */

    if (diferenca > 0) {
      topo.classList.add("topo-oculto");
    } else {
      /* SUBINDO */

      topo.classList.remove("topo-oculto");
    }

    ultimaPosicao = posicaoAtual;
    aguardandoFrame = false;
  }

  window.addEventListener(
    "scroll",
    () => {
      if (!aguardandoFrame) {
        window.requestAnimationFrame(controlarTopo);

        aguardandoFrame = true;
      }
    },
    {
      passive: true,
    },
  );
}

/* =====================================================
   DESEMPENHO POR CATEGORIA
===================================================== */

const seletorCategoria = document.querySelector(
  "#categoria-desempenho",
);

const categoriaJogos = document.querySelector(
  "#categoria-jogos",
);

const competicaoClassificacao = document.querySelector(
  "#competicao-classificacao",
);

const listaUltimosJogos = document.querySelector(
  "#ultimos-jogos-lista",
);

const listaClassificacao = document.querySelector(
  "#classificacao-lista",
);

const linkTabelaCompleta = document.querySelector(
  "#link-tabela-completa",
);

const linkVerTodosJogos = document.querySelector(
  "#link-ver-todos-jogos",
);

/* =====================================================
   DADOS DAS CATEGORIAS
===================================================== */

const dadosDesempenho = {
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
        mandanteEscudo: "assets/escudo.png",
        mandanteGols: 3,

        visitante: "União Frederiquense",
        visitanteEscudo: "assets/uniao-frederiquense.png",
        visitanteGols: 1,

        resultado: "Vitória",
        classeResultado: "resultado-vitoria",
      },

      {
        data: "23/09",
        competicao: "Gauchão Série A2",
        estadio: "Vermelhão da Serra",

        mandante: "Passo Fundo",
        mandanteEscudo: "assets/passo-fundo.png",
        mandanteGols: 2,

        visitante: "Guarani",
        visitanteEscudo: "assets/escudo.png",
        visitanteGols: 1,

        resultado: "Derrota",
        classeResultado: "resultado-derrota",
      },

      {
        data: "19/09",
        competicao: "Gauchão Série A2",
        estadio: "Edmundo Feix",

        mandante: "Guarani",
        mandanteEscudo: "assets/escudo.png",
        mandanteGols: 1,

        visitante: "Santa Cruz",
        visitanteEscudo: "assets/santa-cruz.png",
        visitanteGols: 1,

        resultado: "Empate",
        classeResultado: "resultado-empate",
      },
    ],

    classificacao: [
      {
        posicao: "7º",
        clube: "União Frederiquense",
        pontos: 24,
      },

      {
        posicao: "8º",
        clube: "Brasil de Farroupilha",
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

  sub17: {
    categoria: "SUB-17",

    competicao: "GAUCHÃO SUB-17 A2 • GRUPO C",

    urlCompeticao:
      "https://fgf.com.br/competicoes/amador/602/2026/4195",

    jogos: [
      {
        data: "26/09",
        competicao: "Gauchão Sub-17 A2",
        estadio: "Edmundo Feix",

        mandante: "Guarani",
        mandanteEscudo: "assets/escudo.png",
        mandanteGols: 1,

        visitante: "Pinheiros",
        visitanteEscudo: "assets/pinheiros.png",
        visitanteGols: 2,

        resultado: "Derrota",
        classeResultado: "resultado-derrota",
      },

      {
        data: "11/09",
        competicao: "Gauchão Sub-17 A2",
        estadio: "Arena Cruzeiro",

        mandante: "Cerâmica",
        mandanteEscudo: "assets/ceramica.png",
        mandanteGols: 0,

        visitante: "Guarani",
        visitanteEscudo: "assets/escudo.png",
        visitanteGols: 2,

        resultado: "Vitória",
        classeResultado: "resultado-vitoria",
      },

      {
        data: "22/08",
        competicao: "Gauchão Sub-17 A2",
        estadio: "Edmundo Feix",

        mandante: "Guarani",
        mandanteEscudo: "assets/escudo.png",
        mandanteGols: 1,

        visitante: "Soledade FC",
        visitanteEscudo: "assets/soledade.png",
        visitanteGols: 0,

        resultado: "Vitória",
        classeResultado: "resultado-vitoria",
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

function criarJogo(jogo) {
  return `
    <div class="ultimo-jogo">

      <div class="ultimo-jogo-info">
        <strong>${jogo.data}</strong>

        <span>${jogo.competicao}</span>

        <small>${jogo.estadio}</small>
      </div>

      <div class="ultimo-jogo-confronto">

        <div class="ultimo-jogo-time">
          <img
            src="${jogo.mandanteEscudo}"
            alt="Escudo do ${jogo.mandante}"
          />

          <span>${jogo.mandante}</span>
        </div>

        <div class="ultimo-jogo-placar">
          <strong>${jogo.mandanteGols}</strong>

          <span>X</span>

          <strong>${jogo.visitanteGols}</strong>
        </div>

        <div class="ultimo-jogo-time">
          <img
            src="${jogo.visitanteEscudo}"
            alt="Escudo do ${jogo.visitante}"
          />

          <span>${jogo.visitante}</span>
        </div>

      </div>

      <span class="resultado ${jogo.classeResultado}">
        ${jogo.resultado}
      </span>

    </div>
  `;
}

/* =====================================================
   CRIAR LINHA DA CLASSIFICAÇÃO
===================================================== */

function criarLinhaClassificacao(time) {
  if (time.guarani) {
    return `
      <div class="classificacao-linha classificacao-guarani">

        <strong>${time.posicao}</strong>

        <div class="classificacao-time-guarani">
          <img
            src="assets/escudo.png"
            alt="Escudo do Guarani"
          />

          <span>${time.clube}</span>
        </div>

        <strong>${time.pontos}</strong>

      </div>
    `;
  }

  return `
    <div class="classificacao-linha">

      <strong>${time.posicao}</strong>

      <span>${time.clube}</span>

      <strong>${time.pontos}</strong>

    </div>
  `;
}

/* =====================================================
   ATUALIZAR DESEMPENHO
===================================================== */

function atualizarDesempenho(categoria) {
  const dados = dadosDesempenho[categoria];

  if (!dados) {
    return;
  }

  categoriaJogos.textContent =
    dados.categoria;

  competicaoClassificacao.textContent =
    dados.competicao;

  listaUltimosJogos.innerHTML =
    dados.jogos
      .map(criarJogo)
      .join("");

  listaClassificacao.innerHTML =
    dados.classificacao
      .map(criarLinhaClassificacao)
      .join("");

  /* LINKS DA CATEGORIA */

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
  /* SINCRONIZA O CONTEÚDO AO CARREGAR */

  atualizarDesempenho(
    seletorCategoria.value,
  );

  /* TROCA DE CATEGORIA */

  seletorCategoria.addEventListener(
    "change",
    () => {
      atualizarDesempenho(
        seletorCategoria.value,
      );
    },
  );
}