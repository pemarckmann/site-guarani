/* Apresentacao das noticias. O conteudo fica em dados/noticias.json. */
(() => {
  const LIMITE_HOME = 3;
  const ITENS_POR_PAGINA = 6;
  const home = document.querySelector("#noticias-home");
  const lista = document.querySelector("#noticias-lista");
  const leitura = document.querySelector("#noticia-completa");
  if (!home && !lista && !leitura) return;

  const formatador = new Intl.DateTimeFormat("pt-BR");

  function elemento(tag, classe, texto) {
    const node = document.createElement(tag);
    if (classe) node.className = classe;
    if (texto !== undefined) node.textContent = texto;
    return node;
  }

  function endereco(noticia) {
    const parametros = new URLSearchParams({ id: noticia.id });
    if (lista) {
      const origem = new URLSearchParams(window.location.search);
      ["categoria", "pagina"].forEach(chave => {
        if (origem.has(chave)) parametros.set(chave, origem.get(chave));
      });
    }
    return `noticia.html?${parametros}`;
  }

  function noticiaValida(noticia) {
    const img = noticia.imagem;
    return idValido(noticia.id) && dataISOValida(noticia.data) &&
      [noticia.titulo, noticia.resumo, noticia.categoria].every(textoValido) &&
      (noticia.demonstrativa === undefined || typeof noticia.demonstrativa === "boolean") &&
      (noticia.destaque === undefined || typeof noticia.destaque === "boolean") &&
      img && typeof img === "object" && urlDadosValida(img.src) && textoValido(img.alt) &&
      Number.isInteger(img.largura) && img.largura > 0 &&
      Number.isInteger(img.altura) && img.altura > 0 &&
      Array.isArray(noticia.paragrafos) && noticia.paragrafos.length > 0 &&
      noticia.paragrafos.every(textoValido);
  }

  function paginaDaURL(parametros) {
    const numero = Number(parametros.get("pagina") || 1);
    return Number.isSafeInteger(numero) && numero > 0 ? numero : 1;
  }

  if (leitura) {
    const voltar = document.querySelector(".noticia-voltar");
    const origem = new URLSearchParams(window.location.search);
    const retorno = new URLSearchParams();
    if (origem.get("categoria")) retorno.set("categoria", origem.get("categoria"));
    const pagina = paginaDaURL(origem);
    if (pagina > 1) retorno.set("pagina", pagina);
    if (voltar && retorno.size) voltar.href = `noticias.html?${retorno}`;
  }

  function imagem(noticia, prioridade = false) {
    const moldura = elemento("div", "noticia-imagem");
    const img = document.createElement("img");
    img.src = noticia.imagem.src;
    img.width = noticia.imagem.largura;
    img.height = noticia.imagem.altura;
    img.alt = noticia.imagem.alt;
    img.loading = prioridade ? "eager" : "lazy";
    img.decoding = "async";
    if (!prioridade && noticia.imagem.foco) {
      img.style.objectPosition = noticia.imagem.foco;
    }
    moldura.append(img);
    return moldura;
  }

  function metadados(noticia) {
    const meta = elemento("div", "noticia-meta");
    const data = elemento("time", "", formatador.format(new Date(`${noticia.data}T12:00:00`)));
    data.dateTime = noticia.data;
    meta.append(elemento("span", "noticia-categoria", noticia.categoria), data);
    return meta;
  }

  function card(noticia, formato) {
    const principal = formato === "principal";
    const arquivo = formato === "arquivo";
    const classe = arquivo ? "noticia-arquivo-card" : principal ? "noticia-principal" : "noticia-menor";
    const article = elemento("article", `noticia-card ${classe}`);
    const prefixo = arquivo ? "arquivo" : "home";
    const titulo = elemento(arquivo ? "h2" : "h3");
    titulo.id = `${prefixo}-${noticia.id}-titulo`;
    article.setAttribute("aria-labelledby", titulo.id);
    const link = elemento("a", "noticia-card-link");
    link.href = endereco(noticia);
    link.setAttribute("aria-labelledby", titulo.id);
    titulo.textContent = noticia.titulo;
    const conteudo = elemento("div", "noticia-conteudo");
    conteudo.append(metadados(noticia), titulo);
    if (principal || arquivo) {
      conteudo.append(elemento("p", "noticia-resumo", noticia.resumo));
    }
    link.append(imagem(noticia), conteudo);
    article.append(link);
    return article;
  }

  function mostrarHome(noticias) {
    home.replaceChildren();
    home.classList.remove("noticias-grid-unica");
    const recentes = noticias.slice(0, LIMITE_HOME);
    if (!recentes.length) {
      home.append(elemento("p", "noticias-estado", "Novas notícias em breve."));
      return;
    }
    home.append(card(recentes[0], "principal"));
    if (recentes.length > 1) {
      const laterais = elemento("div", "noticias-laterais");
      recentes.slice(1).forEach(noticia => laterais.append(card(noticia, "menor")));
      home.append(laterais);
    } else {
      home.classList.add("noticias-grid-unica");
    }
  }

  function mostrarArquivo(noticias) {
    mostrarHero(noticias);
    const aviso = document.querySelector("#noticias-aviso");
    aviso.hidden = !noticias.some(noticia => noticia.demonstrativa);
    const ferramentas = document.querySelector("#noticias-ferramentas");
    const categoria = document.querySelector("#noticias-categoria");
    const contagem = document.querySelector("#noticias-contagem");
    const paginacao = document.querySelector("#noticias-paginacao");
    const anterior = document.querySelector("#noticias-anterior");
    const proxima = document.querySelector("#noticias-proxima");
    const indicador = document.querySelector("#noticias-pagina");
    let pagina = 1;
    const categorias = [...new Set(noticias.map(noticia => noticia.categoria))];
    categorias.sort((a, b) => a.localeCompare(b, "pt-BR"));
    categorias.forEach(nome => categoria.add(new Option(nome, nome)));
    ferramentas.hidden = false;

    function lerURL() {
      const parametros = new URLSearchParams(window.location.search);
      categoria.value = categorias.includes(parametros.get("categoria")) ? parametros.get("categoria") : "";
      pagina = paginaDaURL(parametros);
    }

    function salvarURL(navegar) {
      const url = new URL(window.location.href);
      url.searchParams.delete("categoria");
      url.searchParams.delete("pagina");
      if (categoria.value) url.searchParams.set("categoria", categoria.value);
      if (pagina > 1) url.searchParams.set("pagina", pagina);
      if (url.href !== window.location.href) {
        window.history[navegar ? "pushState" : "replaceState"](null, "", url);
      }
    }

    function atualizar(navegar = false) {
      const filtradas = noticias.filter(noticia => !categoria.value || noticia.categoria === categoria.value);
      const paginas = Math.max(1, Math.ceil(filtradas.length / ITENS_POR_PAGINA));
      pagina = Math.min(pagina, paginas);
      salvarURL(navegar);
      const inicio = (pagina - 1) * ITENS_POR_PAGINA;
      const visiveis = filtradas.slice(inicio, inicio + ITENS_POR_PAGINA);
      lista.replaceChildren(...visiveis.map(noticia => card(noticia, "arquivo")));
      contagem.textContent = filtradas.length
        ? `${inicio + 1}–${inicio + visiveis.length} de ${filtradas.length} ${filtradas.length === 1 ? "notícia" : "notícias"}`
        : "Nenhuma notícia disponível.";
      if (!visiveis.length) lista.append(elemento("p", "noticias-estado", "Novas notícias em breve."));
      paginacao.hidden = paginas <= 1;
      anterior.disabled = pagina === 1;
      proxima.disabled = pagina === paginas;
      indicador.textContent = `Página ${pagina} de ${paginas}`;
    }

    categoria.addEventListener("change", () => {
      pagina = 1;
      atualizar(true);
    });
    function mudarPagina(delta, acionador) {
      pagina += delta;
      atualizar(true);
      if (acionador.disabled) (delta > 0 ? anterior : proxima).focus({ preventScroll: true });
      ferramentas.scrollIntoView({ block: "start" });
    }
    anterior.addEventListener("click", () => mudarPagina(-1, anterior));
    proxima.addEventListener("click", () => mudarPagina(1, proxima));
    window.addEventListener("popstate", () => {
      lerURL();
      atualizar();
    });
    lerURL();
    atualizar();
  }

  function mostrarHero(noticias) {
    const hero = document.querySelector("#noticias-hero");
    if (!hero) return;
    // As notícias já estão em ordem de data: o destaque mais recente tem prioridade.
    const noticia = noticias.find(item => item.destaque === true) || noticias[0];
    if (!noticia) return;
    const foto = imagem(noticia, true);
    const img = foto.querySelector("img");
    img.fetchPriority = "high";
    if (noticia.imagem.foco) img.style.objectPosition = noticia.imagem.foco;
    img.addEventListener("error", () => foto.remove(), { once: true });
    const container = elemento("div", "container");
    const conteudo = elemento("div", "noticia-hero-conteudo");
    const tituloPagina = elemento("h1", "", "Notícias do Guarani");
    tituloPagina.id = "noticias-titulo";
    const titulo = elemento("h2", "", noticia.titulo);
    titulo.id = "noticia-hero-titulo";
    const link = elemento("a", "hero-botao", "Ler notícia");
    link.href = endereco(noticia);
    conteudo.append(elemento("span", "secao-tag", "FIQUE POR DENTRO"), tituloPagina, metadados(noticia), titulo, elemento("p", "", noticia.resumo), link);
    container.append(conteudo);
    hero.replaceChildren(foto, container);
    hero.setAttribute("aria-labelledby", tituloPagina.id);
  }

  function mostrarLeitura(noticias) {
    leitura.replaceChildren();
    const id = new URLSearchParams(window.location.search).get("id");
    const noticia = noticias.find(item => item.id === id);
    if (!noticia) {
      leitura.append(elemento("h1", "", "Notícia não encontrada"));
      leitura.append(elemento("p", "noticias-estado", "Use o link acima para escolher uma notícia disponível."));
      return;
    }
    document.title = `${noticia.titulo} | Esporte Clube Guarani`;
    const titulo = elemento("h1", "", noticia.titulo);
    titulo.id = "noticia-titulo";
    leitura.setAttribute("aria-labelledby", titulo.id);
    leitura.append(metadados(noticia), titulo, elemento("p", "noticia-introducao", noticia.resumo));
    if (noticia.demonstrativa) {
      leitura.append(elemento("p", "noticias-aviso", "Conteúdo demonstrativo para apresentação do site."));
    }
    leitura.append(imagem(noticia, true));
    const texto = elemento("div", "noticia-texto");
    noticia.paragrafos.forEach(paragrafo => texto.append(elemento("p", "", paragrafo)));
    leitura.append(texto);
  }

  async function carregarNoticias() {
    const noticias = await carregarDados(fontesDados.noticias);
    return registrosValidos(noticias, noticiaValida, "Notícias")
      .sort((a, b) => b.data.localeCompare(a.data));
  }

  const destino = home || lista || leitura;
  const estado = elemento("p", "noticias-estado", "Carregando notícias…");
  estado.setAttribute("role", "status");
  destino.replaceChildren(estado);

  carregarNoticias().then(noticias => {
    if (home) mostrarHome(noticias);
    if (lista) mostrarArquivo(noticias);
    if (leitura) mostrarLeitura(noticias);
  }).catch(erro => {
    destino.replaceChildren(elemento("p", "noticias-estado", mensagemFalhaDados()));
    console.error(erro);
  });
})();
