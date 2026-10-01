/* Fontes atuais do site. Quando a API estiver pronta, ajuste estas URLs
   para endpoints que devolvam os mesmos formatos JSON. */
const fontesDados = {
  noticias: "dados/noticias.json",
  desempenho: "dados/desempenho.json",
};

async function carregarDados(url) {
  if (window.location.protocol === "file:") {
    throw new Error("Abra o site por um servidor local para carregar os dados JSON.");
  }

  const resposta = await fetch(url);
  if (!resposta.ok) {
    throw new Error(`Falha ao carregar ${url}: HTTP ${resposta.status}.`);
  }
  return resposta.json();
}

function mensagemFalhaDados() {
  return window.location.protocol === "file:"
    ? "Para carregar os dados, abra o site pelo Live Server ou outro servidor local."
    : "Não foi possível carregar os dados. Tente novamente mais tarde.";
}

function textoValido(valor) {
  return typeof valor === "string" && valor.trim().length > 0;
}

function idValido(valor) {
  return typeof valor === "string" && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(valor);
}

function dataISOValida(valor) {
  if (typeof valor !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(valor)) return false;
  const data = new Date(`${valor}T12:00:00Z`);
  return Number.isFinite(data.getTime()) && data.toISOString().slice(0, 10) === valor;
}

function urlDadosValida(valor) {
  if (!textoValido(valor)) return false;
  try {
    return ["http:", "https:"].includes(new URL(valor, window.location.href).protocol);
  } catch {
    return false;
  }
}

function registrosValidos(registros, validar, tipo, chave = "id") {
  if (!Array.isArray(registros)) throw new Error(`Formato inválido: ${tipo}.`);
  const identificadores = new Set();
  return registros.filter((registro, indice) => {
    if (!registro || typeof registro !== "object" || Array.isArray(registro) ||
        !validar(registro) || identificadores.has(registro[chave])) {
      console.warn(`${tipo}: registro inválido ou duplicado ignorado na posição ${indice}.`);
      return false;
    }
    identificadores.add(registro[chave]);
    return true;
  });
}
