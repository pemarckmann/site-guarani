"""Confere arquivos locais, IDs dos HTMLs, versões de cache e JSONs sem dependências."""
import hashlib
from html.parser import HTMLParser
import json
from pathlib import Path
import re
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parent.parent


def verificar_referencia(origem, endereco, erros):
    url = urlsplit(endereco)
    if url.scheme or url.netloc or not url.path:
        return
    destino = (origem.parent / unquote(url.path)).resolve()
    if not destino.is_relative_to(ROOT):
        erros.append(f"{origem.relative_to(ROOT)}: caminho fora do projeto ({endereco})")
    elif not destino.exists():
        erros.append(f"{origem.relative_to(ROOT)}: arquivo ausente ({endereco})")
    elif destino.suffix in {".css", ".js"} and origem.suffix == ".html":
        versao = hashlib.sha256(destino.read_bytes()).hexdigest()[:10]
        if url.query != f"v={versao}":
            erros.append(f"{origem.name}: versão desatualizada de {url.path}; execute atualizar-versoes.py")


class Pagina(HTMLParser):
    def __init__(self, caminho, erros):
        super().__init__(convert_charrefs=True)
        self.caminho = caminho
        self.erros = erros
        self.ids = set()
        self.ancoras = []

    def handle_starttag(self, tag, attrs):
        atributos = dict(attrs)
        identificador = atributos.get("id")
        if identificador:
            if identificador in self.ids:
                self.erros.append(f"{self.caminho.name}: ID duplicado ({identificador})")
            self.ids.add(identificador)
        # <base> aponta para a raiz publicada, não para um arquivo local.
        for chave in (() if tag == "base" else ("src", "href", "poster")):
            if atributos.get(chave):
                verificar_referencia(self.caminho, atributos[chave], self.erros)
        for chave in ("srcset", "imagesrcset"):
            for variante in atributos.get(chave, "").split(","):
                if variante.strip():
                    verificar_referencia(self.caminho, variante.strip().split()[0], self.erros)
        if tag == "a" and atributos.get("href"):
            self.ancoras.append(atributos["href"])

    handle_startendtag = handle_starttag


def referencias_json(valor, erros):
    if isinstance(valor, dict):
        for item in valor.values():
            referencias_json(item, erros)
    elif isinstance(valor, list):
        for item in valor:
            referencias_json(item, erros)
    elif isinstance(valor, str) and valor.startswith("assets/"):
        verificar_referencia(ROOT / "index.html", valor, erros)


def main():
    erros = []
    paginas = {}
    for caminho in sorted(ROOT.glob("*.html")):
        pagina = Pagina(caminho, erros)
        pagina.feed(caminho.read_text(encoding="utf-8"))
        paginas[caminho.resolve()] = pagina
    for pagina in paginas.values():
        for endereco in pagina.ancoras:
            url = urlsplit(endereco)
            if url.scheme or url.netloc or not url.fragment:
                continue
            destino = (pagina.caminho.parent / unquote(url.path)).resolve() if url.path else pagina.caminho.resolve()
            outra = paginas.get(destino)
            if outra and unquote(url.fragment) not in outra.ids:
                pagina.erros.append(f"{pagina.caminho.name}: âncora ausente ({endereco})")
    for caminho in sorted((ROOT / "css").glob("*.css")):
        for endereco in re.findall(r'url\(\s*["\']?([^"\')]+)["\']?\s*\)', caminho.read_text(encoding="utf-8")):
            verificar_referencia(caminho, endereco.strip(), erros)
    for caminho in sorted((ROOT / "dados").glob("*.json")):
        try:
            referencias_json(json.loads(caminho.read_text(encoding="utf-8-sig")), erros)
        except (ValueError, OSError) as erro:
            erros.append(f"{caminho.name}: {erro}")
    for caminho in sorted((ROOT / "js").rglob("*.js")):
        for endereco in re.findall(r'["\'](assets/[\w/.-]+)["\']', caminho.read_text(encoding="utf-8")):
            verificar_referencia(ROOT / "index.html", endereco, erros)
    if erros:
        raise SystemExit("\n".join(erros))
    print(f"Verificação concluída: {len(paginas)} páginas, referências locais e JSONs válidos.")


if __name__ == "__main__":
    main()
