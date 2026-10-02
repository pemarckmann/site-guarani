/* Carrossel circular com rolagem nativa, toque e teclado. */
function criarCarrosselCircular(linha, anterior, proxima, criarReplica) {
  const originais = [...linha.children];
  const reduzirMovimento = matchMedia("(prefers-reduced-motion: reduce)");
  const eventos = new AbortController();
  let ciclo = 0;
  let interagiu = false;
  let reposicionando = false;
  let fimRolagem;
  let frame;
  let frameReposicao;

  function passoCard() {
    const espaco = parseFloat(getComputedStyle(linha).columnGap) || 0;
    return { largura: originais[0].getBoundingClientRect().width + espaco, espaco };
  }

  function reposicionar(destino) {
    reposicionando = true;
    linha.classList.add("elenco-reposicionando");
    linha.scrollTo({ left: destino, behavior: "instant" });
    cancelAnimationFrame(frameReposicao);
    frameReposicao = requestAnimationFrame(() => {
      linha.classList.remove("elenco-reposicionando");
      reposicionando = false;
    });
  }

  function normalizarCiclo() {
    if (!ciclo || reposicionando || !linha.isConnected) return;
    if (linha.scrollLeft < ciclo - 1 || linha.scrollLeft >= ciclo * 2 - 1) {
      // Mantém a mesma imagem na tela, inclusive após arrastos de vários cards.
      const progresso = ((linha.scrollLeft - ciclo) % ciclo + ciclo) % ciclo;
      reposicionar(ciclo + progresso);
    }
  }

  function atualizar() {
    const { largura, espaco } = passoCard();
    const precisaCircular = originais.length * largura - espaco > linha.clientWidth + 2;
    if (precisaCircular && !ciclo) {
      linha.prepend(...originais.map((_, indice) => criarReplica(indice)));
      linha.append(...originais.map((_, indice) => criarReplica(indice)));
      ciclo = originais.length * largura;
      reposicionar(ciclo);
    } else if (!precisaCircular && ciclo) {
      linha.querySelectorAll(".atleta-replica").forEach(node => node.remove());
      ciclo = 0;
      reposicionar(0);
    } else if (ciclo && Math.abs(ciclo - originais.length * largura) > 1) {
      const progresso = linha.scrollLeft / ciclo;
      ciclo = originais.length * largura;
      reposicionar(progresso * ciclo);
    }
    anterior.disabled = proxima.disabled = !precisaCircular;
  }

  function avancar(direcao) {
    if (!ciclo) return;
    linha.scrollBy({
      left: direcao * passoCard().largura,
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
    clearTimeout(fimRolagem);
    fimRolagem = setTimeout(normalizarCiclo, 180);
  }, { passive: true, signal: eventos.signal });
  linha.addEventListener("scrollend", normalizarCiclo, { signal: eventos.signal });
  linha.addEventListener("keydown", evento => {
    if (evento.target !== linha || !["ArrowLeft", "ArrowRight"].includes(evento.key)) return;
    evento.preventDefault();
    avancar(evento.key === "ArrowRight" ? 1 : -1);
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
      cancelAnimationFrame(frame);
      cancelAnimationFrame(frameReposicao);
    },
  };
}
