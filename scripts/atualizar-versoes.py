"""Atualiza as versões de CSS e JavaScript nos HTMLs usando o hash dos arquivos."""
import hashlib
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parent.parent
REFERENCIA = re.compile(r'(?P<prefixo>\b(?:href|src)=["\'])(?P<arquivo>(?:css|js)/[\w/.-]+\.(?:css|js))(?:\?v=[a-f0-9]+)?(?P<fim>["\'])')


def atualizar(html):
    def referencia(match):
        caminho = ROOT / match["arquivo"]
        if not caminho.is_file():
            raise ValueError(f"Arquivo ausente: {match['arquivo']}")
        versao = hashlib.sha256(caminho.read_bytes()).hexdigest()[:10]
        return f"{match['prefixo']}{match['arquivo']}?v={versao}{match['fim']}"

    return REFERENCIA.sub(referencia, html)


def main():
    alterados = 0
    for caminho in sorted(ROOT.glob("*.html")):
        original = caminho.read_text(encoding="utf-8")
        novo = atualizar(original)
        if novo != original:
            caminho.write_text(novo, encoding="utf-8", newline="\n")
            alterados += 1
    print(f"Versões atualizadas em {alterados} páginas.")


if __name__ == "__main__":
    main()
