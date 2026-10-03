/* Carrossel circular com rolagem nativa, toque e teclado. */
function criarCarrosselCircular(linha, anterior, proxima, criarReplica) {
  const originais = [...linha.children];
  const reduzirMovimento = matchMedia("(prefers-reduced-motion: reduce)");
  const eventos = new AbortController();
  let ciclo = 0;
  let inicio = 0;
  let passo = 0;
  let replicas = 0;
  let indiceSelecionado = 0;
  let redimensionando = false;
  let fimRedimensionamento;
  let interagiu = false;
  let reposicionando = false;
  let fimRolagem;
  let frame;
  let frameReposicao;
  let frameDestaque;
  let cardAtual;

  function passoCard() {
    const espaco = parseFloat(getComputedStyle(linha).columnGap) || 0;
    return { largura: originais[0].getBoundingClientRect().width + espaco, espaco };
  }

  function reposicionar(destino) {
    reposicionando = true;
    linha.classList.add("elenco-reposicionando");
    linha.scrollTo({ left: destino, behavior: "instant" });
    atualizarDestaque();
    cancelAnimationFrame(frameReposicao);
    frameReposicao = requestAnimationFrame(() => {
      linha.classList.remove("elenco-reposicionando");
      reposicionando = false;
    });
  }

  function atualizarDestaque() {
    const largura = passo;
    if (!largura || redimensionando) return;
    const atual = linha.children[Math.round(linha.scrollLeft / largura)] || originais[0];
    if (atual === cardAtual) return;
    cardAtual?.classList.remove("atleta-atual");
    atual.classList.add("atleta-atual");
    cardAtual = atual;
    indiceSelecionado = ((Math.round(linha.scrollLeft / passo) - replicas) % originais.length + originais.length) % originais.length;
  }

  function normalizarCiclo() {
    if (!ciclo || reposicionando || !linha.isConnected) return;
    if (linha.scrollLeft < inicio - 1 || linha.scrollLeft >= inicio + ciclo - 1) {
      // Mantém a mesma imagem na tela, inclusive após arrastos de vários cards.
      const progresso = ((linha.scrollLeft - inicio) % ciclo + ciclo) % ciclo;
      reposicionar(inicio + progresso);
    }
  }

  function atualizar() {
    const { largura, espaco } = passoCard();
    const progresso = indiceSelecionado;
    const precisaCircular = originais.length * largura - espaco > linha.clientWidth + 2;
    const quantidade = precisaCircular ? Math.min(originais.length, Math.ceil(linha.clientWidth / largura) + 1) : 0;
    const mudou = quantidade !== replicas || Math.abs(passo - largura) > 1;
    if (quantidade !== replicas) {
      linha.querySelectorAll(".atleta-replica").forEach(node => node.remove());
      if (quantidade) {
        linha.prepend(...Array.from({ length: quantidade }, (_, i) => criarReplica(originais.length - quantidade + i)));
        linha.append(...Array.from({ length: quantidade }, (_, i) => criarReplica(i)));
      }
      replicas = quantidade;
    }
    passo = largura;
    inicio = replicas * passo;
    ciclo = precisaCircular ? originais.length * passo : 0;
    if (mudou) reposicionar(ciclo ? inicio + ((progresso % originais.length + originais.length) % originais.length) * passo : 0);
    anterior.disabled = proxima.disabled = !precisaCircular;
    atualizarDestaque();
  }

  function avancar(direcao) {
    if (!ciclo) return;
    linha.scrollBy({
      left: direcao * passo,
      behavior: reduzirMovimento.matches ? "instant" : "smooth",
    });
  }

  const secao = linha.closest("section") || linha;
  ["pointerenter", "pointerdown", "focusin", "keydown", "wheel", "touchstart"].forEach(evento => {
    secao.addEventListener(evento, () => { interagiu = true; }, { passive: true, signal: eventos.signal });
  });
  anterior.addEventListener("click", () => avancar(-1), { signal: eventos.signal });
  proxima.addEventListener("click", () => avancar(1), { signal: eventos.signal });
  linha.addEventListener("scroll", () => {
    if (!frameDestaque) frameDestaque = requestAnimationFrame(() => {
      frameDestaque = null;
      atualizarDestaque();
    });
    clearTimeout(fimRolagem);
    fimRolagem = setTimeout(normalizarCiclo, 180);
  }, { passive: true, signal: eventos.signal });
  linha.addEventListener("scrollend", normalizarCiclo, { signal: eventos.signal });
  linha.addEventListener("keydown", evento => {
    if (evento.target !== linha || !["ArrowLeft", "ArrowRight"].includes(evento.key)) return;
    evento.preventDefault();
    avancar(evento.key === "ArrowRight" ? 1 : -1);
  }, { signal: eventos.signal });

  // A rolagem nativa pode mudar durante a troca de orientação.
  // Mantém o integrante selecionado até a largura se estabilizar.
  window.addEventListener("resize", () => {
    redimensionando = true;
    clearTimeout(fimRedimensionamento);
    fimRedimensionamento = setTimeout(() => {
      atualizar();
      redimensionando = false;
      reposicionar(ciclo ? inicio + indiceSelecionado * passo : 0);
    }, 100);
  }, { signal: eventos.signal });

  const observador = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(atualizar);
  observador?.observe(linha);
  frame = requestAnimationFrame(atualizar);

  return {
    linha,
    avancar,
    get interagiu() { return interagiu; },
    destruir() {
      eventos.abort();
      observador?.disconnect();
      clearTimeout(fimRolagem);
      clearTimeout(fimRedimensionamento);
      cancelAnimationFrame(frame);
      cancelAnimationFrame(frameReposicao);
      cancelAnimationFrame(frameDestaque);
    },
  };
}
