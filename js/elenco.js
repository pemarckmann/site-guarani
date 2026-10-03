/* Atletas e comissão técnica são editados diretamente em dados/elenco.json. */
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
  function iniciarMovimento() {
    clearInterval(temporizador);
    if (reduzirMovimento.matches) return;
    temporizador = setInterval(() => {
      if (document.hidden || busca?.value.trim() || posicao?.value) return;
      fileiras.forEach(({ linha, interagiu, avancar }) => {
        if (interagiu || !linha.isConnected || linha.scrollWidth <= linha.clientWidth + 2) return;
        const area = linha.getBoundingClientRect();
        const visivel = Math.min(area.bottom, innerHeight) - Math.max(area.top, 90);
        if (visivel < Math.min(area.height * .4, 160)) return;
        avancar(1);
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
  function nomeExibicao(atleta) {
    if (textoValido(atleta.nome_exibicao)) return atleta.nome_exibicao;
    return atleta.nome;
  }
  function card(atleta) {
    const nome = nomeExibicao(atleta);
    const article = criarElemento("article", "atleta-card");
    article.dataset.registro = atleta.registro_cbf || atleta.id;
    const foto = criarElemento("div", "atleta-foto");
    function semFoto() {
      const numero = foto.querySelector(".atleta-numero");
      const placeholder = criarElemento("img", "atleta-silhueta");
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
      const img = criarElemento("img");
      img.alt = nome;
      img.width = 480;
      img.height = 720;
      img.loading = "lazy";
      img.decoding = "async";
      img.addEventListener("error", semFoto, { once: true });
      img.src = atleta.foto;
      foto.append(img);
    } else semFoto();
    const conteudo = criarElemento("div", "atleta-conteudo");
    const titulo = criarElemento("h3", "", nome);
    titulo.id = `atleta-${atleta.registro_cbf || atleta.id}`;
    article.setAttribute("aria-labelledby", titulo.id);
    conteudo.append(titulo);
    if (textoValido(atleta.cargo)) conteudo.append(criarElemento("p", "comissao-cargo", atleta.cargo));
    else if (resumoHome) conteudo.append(criarElemento("p", "atleta-setor", textoValido(atleta.posicao) ? atleta.posicao : grupos.find(([chave]) => chave === grupoAtleta(atleta))?.[1]));
    const nomeCompleto = textoValido(atleta.nome_completo) ? atleta.nome_completo : null;
    if (nomeCompleto && normalizar(nomeCompleto) !== normalizar(nome))
      conteudo.append(criarElemento("p", "atleta-nome", nomeCompleto));
    if (atleta.identidade_conflitante === true)
      conteudo.append(criarElemento("p", "atleta-nome", "Identificação em conferência"));
    const numeroExibido = atleta.numero;
    if (Number.isInteger(numeroExibido) && numeroExibido > 0) {
      const numero = criarElemento("span", "atleta-numero", numeroExibido);
      numero.title = "Número de referência informado para o elenco";
      numero.prepend(criarElemento("span", "sr-only", "Número de referência: "));
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
    const secao = criarElemento("section", "elenco-grupo");
    const titulo = criarElemento("h2", "", nome);
    titulo.id = `grupo-${chave}`;
    secao.setAttribute("aria-labelledby", titulo.id);
    const cabecalho = criarElemento("div", "elenco-grupo-cabecalho");
    const identificacao = criarElemento("div", "elenco-grupo-titulo");
    const unidade = chave === "todos" ? ["integrante", "integrantes"] : chave === "comissao-tecnica" ? ["profissional", "profissionais"] : ["atleta", "atletas"];
    identificacao.append(titulo, criarElemento("span", "", `${jogadores.length} ${unidade[jogadores.length === 1 ? 0 : 1]}`));
    const controles = criarElemento("div", "elenco-setas");
    const moldura = criarElemento("div", "elenco-fileira-moldura");
    const linha = criarElemento("div", "atleta-linha");
    linha.id = `linha-${chave}`;
    linha.setAttribute("role", "list");
    linha.setAttribute("aria-label", nome);
    linha.tabIndex = 0;
    const anterior = criarElemento("button", "", "←");
    const proxima = criarElemento("button", "", "→");
    [anterior, proxima].forEach(botao => { botao.type = "button"; botao.setAttribute("aria-controls", linha.id); });
    anterior.setAttribute("aria-label", `Ver integrantes anteriores: ${nome}`);
    proxima.setAttribute("aria-label", `Ver próximos integrantes: ${nome}`);
    function replica(indice) {
      const copia = card(jogadores[indice]);
      copia.classList.add("atleta-replica");
      copia.setAttribute("aria-hidden", "true");
      copia.inert = true;
      copia.removeAttribute("aria-labelledby");
      delete copia.dataset.registro;
      copia.querySelectorAll("[id]").forEach(node => node.removeAttribute("id"));
      return copia;
    }
    linha.append(...jogadores.map(card));
    controles.append(anterior, proxima);
    cabecalho.append(identificacao);
    moldura.append(controles, linha);
    secao.append(cabecalho, moldura);
    fileiras.push(criarCarrosselCircular(linha, anterior, proxima, replica));
    return secao;
  }
  function renderizar(navegar = false) {
    fileiras.forEach(fileira => fileira.destruir());
    clearInterval(temporizador);
    fileiras = [];
    if (resumoHome) {
      const ordenados = [...atletas].sort((a, b) =>
        grupos.findIndex(([chave]) => chave === grupoAtleta(a)) - grupos.findIndex(([chave]) => chave === grupoAtleta(b)) ||
        (a.ordem ?? 999) - (b.ordem ?? 999));
      lista.replaceChildren(ordenados.length ? fileira("todos", "Elenco e comissão técnica", ordenados)
        : criarElemento("p", "desempenho-aviso", "Elenco em breve."));
      iniciarMovimento();
      return;
    }
    const termo = normalizar(busca.value);
    const filtrados = atletas.filter(atleta =>
      (!termo || normalizar([atleta.nome_exibicao, atleta.nome, atleta.nome_completo, atleta.cargo].filter(textoValido).join(" ")).includes(termo)) &&
      (!posicao.value || grupoAtleta(atleta) === posicao.value));
    lista.replaceChildren();
    grupos.forEach(([chave, nome]) => {
      const jogadores = filtrados.filter(atleta => grupoAtleta(atleta) === chave)
        .sort((a, b) => (Number.isInteger(a.ordem) ? a.ordem : 999) - (Number.isInteger(b.ordem) ? b.ordem : 999));
      if (jogadores.length) lista.append(fileira(chave, nome, jogadores));
    });
    if (!filtrados.length) lista.append(criarElemento("p", "desempenho-aviso", "Nenhum integrante encontrado para estes filtros."));
    const totalAtletas = filtrados.filter(atleta => grupoAtleta(atleta) !== "comissao-tecnica").length;
    const totalComissao = filtrados.length - totalAtletas;
    const contagens = [];
    if (totalAtletas || !totalComissao) contagens.push(`${totalAtletas} ${totalAtletas === 1 ? "atleta" : "atletas"}`);
    if (totalComissao) contagens.push(`${totalComissao} ${totalComissao === 1 ? "integrante" : "integrantes"} da comissão`);
    document.querySelector("#elenco-contagem").textContent = contagens.join(" • ");
    const url = new URL(location.href);
    ["busca", "posicao", "pagina"].forEach(chave => url.searchParams.delete(chave));
    if (busca.value.trim()) url.searchParams.set("busca", busca.value.trim());
    if (posicao.value) url.searchParams.set("posicao", posicao.value);
    if (url.href !== location.href) history[navegar ? "pushState" : "replaceState"](null, "", url);
    iniciarMovimento();
  }
  async function iniciar() {
    try {
      const dados = await carregarDados(fontesDados.elenco);
      if (!dados || !textoValido(dados.categoria) || !Number.isInteger(dados.temporada) || !Array.isArray(dados.atletas)) throw new Error("Formato inválido do elenco.");
      atletas = registrosValidos(dados.atletas, atleta => textoValido(atleta.nome_exibicao) &&
        textoValido(atleta.id) && /^[a-z0-9-]+$/.test(atleta.id) &&
        (atleta.registro_cbf === null || typeof atleta.registro_cbf === "string" && /^\d+$/.test(atleta.registro_cbf)), "Elenco", "id")
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
      document.querySelector("#elenco-fonte").textContent = `Dados de origem: ${textoValido(dados.fonte) ? dados.fonte : "FGF"}, com informações revisadas pelo responsável pelo site. Números de referência sujeitos a mudanças.`;
      grupos.forEach(([chave, nome]) => {
        if (atletas.some(atleta => grupoAtleta(atleta) === chave)) posicao.add(new Option(nome, chave));
      });
      lerURL(); renderizar();
      lista.setAttribute("aria-busy", "false");
      document.querySelector("#elenco-filtros").hidden = false;
      busca.disabled = posicao.disabled = false;
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
