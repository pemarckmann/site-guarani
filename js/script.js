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
