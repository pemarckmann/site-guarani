/* =====================================================
   ELEMENTOS GERAIS
===================================================== */

const topo = document.querySelector(".topo");

const formContato = document.querySelector("#form-contato");
const assuntoContato = document.querySelector("#assunto");

const botaoMenu = document.querySelector(".menu-toggle");
const menuPrincipal = document.querySelector(".menu-principal");


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
   MENU MOBILE
===================================================== */

if (topo && botaoMenu && menuPrincipal) {
  topo.classList.add("menu-interativo");

  /* ===============================================
     FUNÇÃO PARA FECHAR O MENU
  =============================================== */

  function fecharMenu() {
    topo.classList.remove("menu-aberto");

    botaoMenu.setAttribute("aria-expanded", "false");
    botaoMenu.setAttribute("aria-label", "Abrir menu");

    if (
      window.innerWidth <= 700 &&
      menuPrincipal.contains(document.activeElement)
    ) {
      botaoMenu.focus({ preventScroll: true });
    }
  }


  /* ===============================================
     ABRIR / FECHAR PELO BOTÃO
  =============================================== */

  botaoMenu.addEventListener("click", () => {
    const menuEstaAberto = topo.classList.toggle("menu-aberto");

    botaoMenu.setAttribute(
      "aria-expanded",
      String(menuEstaAberto),
    );

    botaoMenu.setAttribute(
      "aria-label",
      menuEstaAberto
        ? "Fechar menu"
        : "Abrir menu",
    );

    /*
      Se o cabeçalho estiver oculto pelo scroll,
      força sua exibição ao abrir o menu.
    */

    if (menuEstaAberto) {
      topo.classList.remove("topo-oculto");
    }
  });


  /* ===============================================
     FECHAR AO ESCOLHER UMA OPÇÃO
  =============================================== */

  menuPrincipal
    .querySelectorAll("a")
    .forEach((link) => {
      link.addEventListener("click", fecharMenu);
    });


  /* ===============================================
     FECHAR COM ESC
  =============================================== */

  document.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      topo.classList.contains("menu-aberto")
    ) {
      fecharMenu();
      botaoMenu.focus({ preventScroll: true });
    }
  });


  /* ===============================================
     FECHAR AO CLICAR FORA
  =============================================== */

  document.addEventListener("click", (event) => {
    const menuEstaAberto =
      topo.classList.contains("menu-aberto");

    if (!menuEstaAberto) {
      return;
    }

    const clicouNoTopo = topo.contains(event.target);

    if (!clicouNoTopo) {
      fecharMenu();
    }
  });


  /* ===============================================
     VOLTAR AO DESKTOP
  =============================================== */

  window.addEventListener("resize", () => {
    if (window.innerWidth > 700) {
      fecharMenu();
    }
  });
}


/* =====================================================
   CABEÇALHO INTELIGENTE
===================================================== */

if (topo) {
  let ultimaPosicao = window.scrollY;
  let aguardandoFrame = false;

  /*
    Evita que movimentos muito pequenos do scroll
    façam o cabeçalho aparecer e desaparecer.
  */

  const tolerancia = 5;

  /*
    Perto do início da página,
    o cabeçalho permanece sempre visível.
  */

  const inicioScroll = 100;

  topo.addEventListener("focusin", () => {
    topo.classList.remove("topo-oculto");
  });


  function controlarTopo() {
    const posicaoAtual = window.scrollY;


    /* ===============================================
       MENU MOBILE ABERTO
    =============================================== */

    if (
      topo.classList.contains("menu-aberto") ||
      topo.contains(document.activeElement)
    ) {
      topo.classList.remove("topo-oculto");

      ultimaPosicao = posicaoAtual;
      aguardandoFrame = false;

      return;
    }


    /* ===============================================
       PERTO DO TOPO
    =============================================== */

    if (posicaoAtual <= inicioScroll) {
      topo.classList.remove("topo-oculto");
      topo.classList.remove("topo-scroll");

      ultimaPosicao = posicaoAtual;
      aguardandoFrame = false;

      return;
    }


    /* ===============================================
       CABEÇALHO FLUTUANDO
    =============================================== */

    topo.classList.add("topo-scroll");


    /* ===============================================
       DIFERENÇA DO SCROLL
    =============================================== */

    const diferenca =
      posicaoAtual - ultimaPosicao;


    /* ===============================================
       IGNORA MOVIMENTOS PEQUENOS
    =============================================== */

    if (Math.abs(diferenca) < tolerancia) {
      aguardandoFrame = false;

      return;
    }


    /* ===============================================
       DESCENDO
    =============================================== */

    if (diferenca > 0) {
      topo.classList.add("topo-oculto");
    }


    /* ===============================================
       SUBINDO
    =============================================== */

    else {
      topo.classList.remove("topo-oculto");
    }


    ultimaPosicao = posicaoAtual;
    aguardandoFrame = false;
  }


  /* ===============================================
     EVENTO DE SCROLL
  =============================================== */

  window.addEventListener(
    "scroll",
    () => {
      if (!aguardandoFrame) {
        window.requestAnimationFrame(
          controlarTopo,
        );

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
   DADOS DAS CATEGORIAS
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

        resultado: "Vitória",
        classeResultado:
          "resultado-vitoria",
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

        resultado: "Derrota",
        classeResultado:
          "resultado-derrota",
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

        resultado: "Empate",
        classeResultado:
          "resultado-empate",
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

        resultado: "Derrota",
        classeResultado:
          "resultado-derrota",
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

        resultado: "Vitória",
        classeResultado:
          "resultado-vitoria",
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

        resultado: "Vitória",
        classeResultado:
          "resultado-vitoria",
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

        <strong>
          ${jogo.data}
        </strong>

        <span>
          ${jogo.competicao}
        </span>

        <small>
          ${jogo.estadio}
        </small>

      </div>


      <div class="ultimo-jogo-confronto">

        <div class="ultimo-jogo-time">

          <img
            src="${jogo.mandanteEscudo}"
            width="48"
            height="48"
            alt="Escudo do ${jogo.mandante}"
          />

          <span>
            ${jogo.mandante}
          </span>

        </div>


        <div class="ultimo-jogo-placar">

          <strong>
            ${jogo.mandanteGols}
          </strong>

          <span>
            X
          </span>

          <strong>
            ${jogo.visitanteGols}
          </strong>

        </div>


        <div class="ultimo-jogo-time">

          <img
            src="${jogo.visitanteEscudo}"
            width="48"
            height="48"
            alt="Escudo do ${jogo.visitante}"
          />

          <span>
            ${jogo.visitante}
          </span>

        </div>

      </div>


      <span
        class="resultado ${jogo.classeResultado}"
      >
        ${jogo.resultado}
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
          ${time.posicao}
        </strong>


        <div class="classificacao-time-guarani">

          <img
            src="assets/otimizadas/escudo.webp"
            width="27"
            height="27"
            alt="Escudo do Guarani"
          />

          <span>
            ${time.clube}
          </span>

        </div>


        <strong>
          ${time.pontos}
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
        ${time.posicao}
      </strong>

      <span>
        ${time.clube}
      </span>

      <strong>
        ${time.pontos}
      </strong>

    </div>
  `;
}


/* =====================================================
   ATUALIZAR DESEMPENHO
===================================================== */

function atualizarDesempenho(categoria) {
  const dados =
    dadosDesempenho[categoria];

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
    seletorCategoria.value,
  );


  /*
    Troca o conteúdo quando o usuário
    muda de categoria.
  */

  seletorCategoria.addEventListener(
    "change",
    () => {
      atualizarDesempenho(
        seletorCategoria.value,
      );
    },
  );
}