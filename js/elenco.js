/* A relação pública é preparada a partir da saída do scraper, sem dados inventados. */
(() => {
  const lista = document.querySelector("#elenco-lista");
  if (!lista) return;
  const resumoHome = lista.dataset.modo === "resumo";
  const busca = document.querySelector("#elenco-busca");
  const posicao = document.querySelector("#elenco-posicao");
  const reduzirMovimento = matchMedia("(prefers-reduced-motion: reduce)");
  let temporizador;
  let fileiras = [];
  const grupos = [
    ["goleiros", "Goleiros"], ["defensores", "Defensores"],
    ["meio-campistas", "Meio-campistas"], ["atacantes", "Atacantes"],
    ["comissao-tecnica", "Comissão técnica"],
  ];
  let atletas = [];
  let observador;
  function iniciarMovimento() {
    clearInterval(temporizador);
    if (reduzirMovimento.matches) return;
    temporizador = setInterval(() => {
      if (document.hidden || busca?.value.trim() || posicao?.value) return;
      fileiras.forEach(({ linha, estado }) => {
        if (estado.interagiu || !linha.isConnected || linha.scrollWidth <= linha.clientWidth + 2) return;
        const area = linha.getBoundingClientRect();
        const visivel = Math.min(area.bottom, innerHeight) - Math.max(area.top, 90);
        if (visivel < Math.min(area.height * .4, 160)) return;
        linha.avancar(1);
      });
    }, 4500);
  }
  function grupoAtleta(atleta) {
    if (grupos.some(([chave]) => chave === atleta.grupo)) return atleta.grupo;
    return normalizar(atleta.posicao) === "goleiro" ? "goleiros" : null;
  }

  function normalizar(texto) {
    return String(texto).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
  }
  function elemento(tag, classe, texto) {
    const node = document.createElement(tag);
    if (classe) node.className = classe;
    if (texto !== undefined) node.textContent = texto;
    return node;
  }
  function nomeExibicao(atleta) {
    if (textoValido(atleta.nome_exibicao)) return atleta.nome_exibicao;
    return textoValido(atleta.apelido) ? atleta.apelido : textoValido(atleta.nome_cbf) ? atleta.nome_cbf : atleta.nome;
  }
  function card(atleta) {
    const nome = nomeExibicao(atleta);
    const article = elemento("article", "atleta-card");
    article.dataset.registro = atleta.registro_cbf || atleta.id;
    const foto = elemento("div", "atleta-foto");
    function semFoto() {
      const numero = foto.querySelector(".atleta-numero");
      const placeholder = elemento("img", "atleta-silhueta");
      placeholder.src = "assets/otimizadas/atleta-silhueta.webp";
      placeholder.width = 480;
      placeholder.height = 720;
      placeholder.alt = "Foto ainda não disponível";
      placeholder.loading = "lazy";
      placeholder.decoding = "async";
      foto.replaceChildren(placeholder);
      if (numero) foto.append(numero);
    }
    if (urlDadosValida(atleta.foto)) {
      const img = elemento("img");
      img.alt = nome;
      img.width = 480;
      img.height = 720;
      img.loading = "lazy";
      img.decoding = "async";
      img.addEventListener("error", semFoto, { once: true });
      img.src = atleta.foto;
      foto.append(img);
    } else semFoto();
    const conteudo = elemento("div", "atleta-conteudo");
    const titulo = elemento("h3", "", nome);
    titulo.id = `atleta-${atleta.registro_cbf || atleta.id}`;
    article.setAttribute("aria-labelledby", titulo.id);
    conteudo.append(titulo);
    if (textoValido(atleta.cargo)) conteudo.append(elemento("p", "comissao-cargo", atleta.cargo));
    else if (resumoHome) conteudo.append(elemento("p", "atleta-setor", textoValido(atleta.posicao) ? atleta.posicao : grupos.find(([chave]) => chave === grupoAtleta(atleta))?.[1]));
    const nomeCompleto = textoValido(atleta.nome_completo) ? atleta.nome_completo : textoValido(atleta.nome_cbf) ? atleta.nome_cbf
      : atleta.nome_completo_fgf === true ? atleta.nome : null;
    if (nomeCompleto && normalizar(nomeCompleto) !== normalizar(nome))
      conteudo.append(elemento("p", "atleta-nome", nomeCompleto));
    if (atleta.identidade_conflitante === true)
      conteudo.append(elemento("p", "atleta-nome", "Identificação em conferência"));
    const temReferencia = Number.isInteger(atleta.numero_referencia) && atleta.numero_referencia > 0;
    const numeroExibido = temReferencia ? atleta.numero_referencia : atleta.numero_recente;
    if (Number.isInteger(numeroExibido) && numeroExibido > 0) {
      const numero = elemento("span", "atleta-numero", numeroExibido);
      numero.title = temReferencia ? "Número de referência informado para o elenco" : "Último número registrado em súmula";
      numero.setAttribute("aria-label", `${temReferencia ? "Número de referência" : "Último número registrado"}: ${numeroExibido}`);
      foto.append(numero);
    }
    article.setAttribute("role", "listitem");
    article.append(foto, conteudo);
    return article;
  }
  function lerURL() {
    const parametros = new URLSearchParams(location.search);
    busca.value = parametros.get("busca") || "";
    const filtro = parametros.get("posicao") || "";
    posicao.value = [...posicao.options].some(opcao => opcao.value === filtro) ? filtro : "";
  }
  function fileira(chave, nome, jogadores) {
    const secao = elemento("section", "elenco-grupo");
    const titulo = elemento("h2", "", nome);
    titulo.id = `grupo-${chave}`;
    secao.setAttribute("aria-labelledby", titulo.id);
    const cabecalho = elemento("div", "elenco-grupo-cabecalho");
    const identificacao = elemento("div", "elenco-grupo-titulo");
    const unidade = chave === "comissao-tecnica" ? ["profissional", "profissionais"] : ["atleta", "atletas"];
    identificacao.append(titulo, elemento("span", "", `${jogadores.length} ${unidade[jogadores.length === 1 ? 0 : 1]}`));
    const controles = elemento("div", "elenco-setas");
    const moldura = elemento("div", "elenco-fileira-moldura");
    const linha = elemento("div", "atleta-linha");
    linha.id = `linha-${chave}`;
    linha.setAttribute("role", "list");
    linha.setAttribute("aria-label", nome);
    linha.tabIndex = 0;
    const anterior = elemento("button", "", "←");
    const proxima = elemento("button", "", "→");
    [anterior, proxima].forEach(botao => { botao.type = "button"; botao.setAttribute("aria-controls", linha.id); });
    anterior.setAttribute("aria-label", `Ver integrantes anteriores: ${nome}`);
    proxima.setAttribute("aria-label", `Ver próximos integrantes: ${nome}`);
    const estado = { interagiu: false };
    const originais = jogadores.map(card);
    let ciclo = 0;
    let reposicionando = false;
    let fimRolagem;
    function reposicionar(destino) {
      reposicionando = true;
      linha.classList.add("elenco-reposicionando");
      linha.scrollTo({ left: destino, behavior: "instant" });
      requestAnimationFrame(() => {
        linha.classList.remove("elenco-reposicionando");
        reposicionando = false;
      });
    }
    function replica(atleta) {
      // As cópias só completam a passagem visual; os atletas continuam únicos na lista acessível.
      const copia = card(atleta);
      copia.classList.add("atleta-replica");
      copia.setAttribute("aria-hidden", "true");
      copia.inert = true;
      copia.removeAttribute("aria-labelledby");
      delete copia.dataset.registro;
      copia.querySelectorAll("[id]").forEach(node => node.removeAttribute("id"));
      return copia;
    }
    function normalizarCiclo() {
      if (!ciclo || reposicionando || !linha.isConnected) return;
      if (linha.scrollLeft < ciclo - 1) reposicionar(linha.scrollLeft + ciclo);
      else if (linha.scrollLeft >= ciclo * 2 - 1) reposicionar(linha.scrollLeft - ciclo);
    }
    function pararMovimento() { estado.interagiu = true; }
    ["pointerenter", "pointerdown", "focusin", "keydown", "wheel", "touchstart"].forEach(evento =>
      secao.addEventListener(evento, pararMovimento, { passive: true }));
    function atualizarSetas() {
      const passo = originais[0].getBoundingClientRect().width + parseFloat(getComputedStyle(linha).columnGap);
      const precisaCircular = jogadores.length * passo - parseFloat(getComputedStyle(linha).columnGap) > linha.clientWidth + 2;
      if (precisaCircular && !ciclo) {
        linha.prepend(...jogadores.map(replica));
        linha.append(...jogadores.map(replica));
        ciclo = jogadores.length * passo;
        reposicionar(ciclo);
      } else if (!precisaCircular && ciclo) {
        linha.querySelectorAll(".atleta-replica").forEach(node => node.remove());
        ciclo = 0;
        reposicionar(0);
      } else if (ciclo && Math.abs(ciclo - jogadores.length * passo) > 1) {
        const progresso = linha.scrollLeft / ciclo;
        ciclo = jogadores.length * passo;
        reposicionar(progresso * ciclo);
      }
      anterior.disabled = proxima.disabled = !precisaCircular;
    }
    function rolar(direcao) {
      if (!ciclo) return;
      const comportamento = reduzirMovimento.matches ? "instant" : "smooth";
      const passo = originais[0].getBoundingClientRect().width + parseFloat(getComputedStyle(linha).columnGap);
      linha.scrollBy({ left: direcao * passo, behavior: comportamento });
    }
    linha.avancar = rolar;
    anterior.addEventListener("click", () => rolar(-1));
    proxima.addEventListener("click", () => rolar(1));
    linha.addEventListener("scroll", () => {
      clearTimeout(fimRolagem);
      fimRolagem = setTimeout(normalizarCiclo, 180);
    }, { passive: true });
    linha.addEventListener("scrollend", normalizarCiclo);
    linha.addEventListener("keydown", evento => {
      if (evento.target !== linha || !["ArrowLeft", "ArrowRight"].includes(evento.key)) return;
      evento.preventDefault(); rolar(evento.key === "ArrowRight" ? 1 : -1);
    });
    linha.append(...originais);
    controles.append(anterior, proxima);
    cabecalho.append(identificacao);
    moldura.append(controles, linha);
    secao.append(cabecalho, moldura);
    fileiras.push({ linha, estado });
    linha.atualizarSetas = atualizarSetas;
    requestAnimationFrame(atualizarSetas);
    return secao;
  }
  function renderizar(navegar = false) {
    observador?.disconnect();
    clearInterval(temporizador);
    fileiras = [];
    if (resumoHome) {
      const ordenados = [...atletas].sort((a, b) =>
        grupos.findIndex(([chave]) => chave === grupoAtleta(a)) - grupos.findIndex(([chave]) => chave === grupoAtleta(b)) ||
        (a.ordem ?? 999) - (b.ordem ?? 999));
      lista.replaceChildren(ordenados.length ? fileira("todos", "Elenco e comissão técnica", ordenados)
        : elemento("p", "desempenho-aviso", "Elenco em breve."));
      observarFileiras();
      iniciarMovimento();
      return;
    }
    const termo = normalizar(busca.value);
    const filtrados = atletas.filter(atleta =>
      (!termo || normalizar([atleta.nome_exibicao, atleta.apelido, atleta.nome, atleta.nome_cbf, atleta.nome_completo, atleta.cargo].filter(textoValido).join(" ")).includes(termo)) &&
      (!posicao.value || grupoAtleta(atleta) === posicao.value));
    lista.replaceChildren();
    grupos.forEach(([chave, nome]) => {
      const jogadores = filtrados.filter(atleta => grupoAtleta(atleta) === chave)
        .sort((a, b) => (Number.isInteger(a.ordem) ? a.ordem : 999) - (Number.isInteger(b.ordem) ? b.ordem : 999));
      if (jogadores.length) lista.append(fileira(chave, nome, jogadores));
    });
    if (!filtrados.length) lista.append(elemento("p", "desempenho-aviso", "Nenhum integrante encontrado para estes filtros."));
    const totalAtletas = filtrados.filter(atleta => grupoAtleta(atleta) !== "comissao-tecnica").length;
    const totalComissao = filtrados.length - totalAtletas;
    const contagens = [];
    if (totalAtletas || !totalComissao) contagens.push(`${totalAtletas} ${totalAtletas === 1 ? "atleta" : "atletas"}`);
    if (totalComissao) contagens.push(`${totalComissao} ${totalComissao === 1 ? "integrante" : "integrantes"} da comissão`);
    document.querySelector("#elenco-contagem").textContent = contagens.join(" • ");
    observarFileiras();
    const url = new URL(location.href);
    ["busca", "posicao", "pagina"].forEach(chave => url.searchParams.delete(chave));
    if (busca.value.trim()) url.searchParams.set("busca", busca.value.trim());
    if (posicao.value) url.searchParams.set("posicao", posicao.value);
    if (url.href !== location.href) history[navegar ? "pushState" : "replaceState"](null, "", url);
    iniciarMovimento();
  }
  function observarFileiras() {
    if (typeof ResizeObserver !== "undefined") {
      observador = new ResizeObserver(entries => entries.forEach(entry => entry.target.atualizarSetas()));
      lista.querySelectorAll(".atleta-linha").forEach(linha => observador.observe(linha));
    }
  }
  async function iniciar() {
    try {
      const dados = await carregarDados(fontesDados.elenco);
      if (!dados || !textoValido(dados.categoria) || !Number.isInteger(dados.temporada) || !Array.isArray(dados.atletas)) throw new Error("Formato inválido do elenco.");
      const registros = dados.atletas.map(atleta => ({ ...atleta, id: atleta?.registro_cbf || atleta?.id }));
      atletas = registrosValidos(registros, atleta => textoValido(atleta.nome) && (
        typeof atleta.registro_cbf === "string" && /^\d+$/.test(atleta.registro_cbf) ||
        atleta.registro_cbf === null && atleta.fonte_complemento === "editorial" && /^editorial-[a-z0-9-]+$/.test(atleta.id)
      ), "Elenco", "id")
        .filter(atleta => grupoAtleta(atleta))
        .sort((a, b) => nomeExibicao(a).localeCompare(nomeExibicao(b), "pt-BR", { sensitivity: "base" }));
      const comissao = (Array.isArray(dados.comissao_tecnica) ? dados.comissao_tecnica : [])
        .filter(pessoa => pessoa && textoValido(pessoa.nome) && textoValido(pessoa.cargo))
        .map((pessoa, ordem) => ({ ...pessoa, grupo: "comissao-tecnica", ordem,
          id: `comissao-${normalizar(pessoa.nome).replace(/[^a-z0-9]+/g, "-")}` }));
      atletas.push(...registrosValidos(comissao, pessoa => textoValido(pessoa.id), "Comissão técnica", "id"));
      reduzirMovimento.addEventListener("change", iniciarMovimento);
      window.addEventListener("pagehide", () => clearInterval(temporizador));
      window.addEventListener("pageshow", evento => { if (evento.persisted) iniciarMovimento(); });
      if (resumoHome) {
        renderizar();
        lista.setAttribute("aria-busy", "false");
        return;
      }
      document.querySelector("#elenco-temporada").textContent = `${dados.categoria.toUpperCase()} • ${dados.temporada}`;
      document.querySelector("#elenco-aviso").hidden = dados.parcial === false;
      document.querySelector("#elenco-fonte").textContent = `Dados de origem: ${textoValido(dados.fonte) ? dados.fonte : "FGF"}, com complementos editoriais. Números: referência informada para o elenco ou último registro em súmula, sujeitos a mudanças.`;
      grupos.forEach(([chave, nome]) => {
        if (atletas.some(atleta => grupoAtleta(atleta) === chave)) posicao.add(new Option(nome, chave));
      });
      lerURL(); renderizar();
      lista.setAttribute("aria-busy", "false");
      document.querySelector("#elenco-filtros").hidden = false;
      busca.addEventListener("input", () => renderizar());
      posicao.addEventListener("change", () => renderizar(true));
      window.addEventListener("popstate", () => { lerURL(); renderizar(); });
    } catch (erro) {
      lista.replaceChildren(criarAvisoFalhaDados());
      lista.setAttribute("aria-busy", "false");
      console.error(erro);
    }
  }
  iniciar();
})();
