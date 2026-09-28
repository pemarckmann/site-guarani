const topo = document.querySelector(".topo");
const formContato = document.querySelector("#form-contato");

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

  /*
       Evita que pequenos movimentos do scroll
       façam o cabeçalho aparecer e desaparecer.
    */

  const tolerancia = 5;

  /*
       Até esta distância do início da página,
       o cabeçalho permanece sempre visível.
    */

  const inicioScroll = 100;

  function controlarTopo() {
    const posicaoAtual = window.scrollY;

    /* =========================
           PERTO DO TOPO
        ========================== */

    if (posicaoAtual <= inicioScroll) {
      topo.classList.remove("topo-oculto");
      topo.classList.remove("topo-scroll");

      ultimaPosicao = posicaoAtual;
      aguardandoFrame = false;

      return;
    }

    /* =========================
           CABEÇALHO FLUTUANDO
        ========================== */

    topo.classList.add("topo-scroll");

    /* =========================
           DIFERENÇA DO SCROLL
        ========================== */

    const diferenca = posicaoAtual - ultimaPosicao;

    /* =========================
           IGNORA MOVIMENTOS PEQUENOS
        ========================== */

    if (Math.abs(diferenca) < tolerancia) {
      aguardandoFrame = false;

      return;
    }

    /* =========================
           DESCENDO
        ========================== */

    if (diferenca > 0) {
      topo.classList.add("topo-oculto");
    } else {

    /* =========================
           SUBINDO
        ========================== */
      topo.classList.remove("topo-oculto");
    }

    ultimaPosicao = posicaoAtual;
    aguardandoFrame = false;
  }

  /* =========================
       EVENTO DE SCROLL
    ========================== */

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
