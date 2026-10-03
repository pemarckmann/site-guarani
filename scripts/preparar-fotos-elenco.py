"""Recorta as fotos de apresentação sem gerar novos rostos ou uniformes.

Dependências opcionais, apenas para preparar imagens: rembg[cpu] e Pillow.
O navegador recebe somente WebP; não precisa dessas dependências ou do modelo.
"""

import argparse
import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
ORIGINAIS = ROOT / "assets/originais/elenco"
DESTINO = ROOT / "assets/otimizadas/elenco"


def recortar(original, session, corte_inferior=None):
    import numpy as np
    from PIL import Image
    from scipy import ndimage

    foto = Image.open(original).convert("RGB")
    mascara = np.asarray(session.predict(foto)[0]).copy()
    componentes, total = ndimage.label(mascara > 64)
    if not total:
        raise ValueError(f"Nenhum jogador encontrado em {original.name}")
    areas = np.bincount(componentes.ravel())
    areas[0] = 0
    principal = componentes == areas.argmax()
    # Conserva os fios e bordas próximos ao corpo, descartando texto e ilhas.
    entorno = ndimage.binary_dilation(principal, iterations=4)
    mascara[~entorno] = 0
    if corte_inferior is not None:
        # Algumas artes têm uma faixa promocional sobre o fim do uniforme.
        mascara[corte_inferior:, :] = 0
    rgba = foto.convert("RGBA")
    rgba.putalpha(Image.fromarray(mascara))
    caixa = Image.fromarray((mascara > 8).astype("uint8") * 255).getbbox()
    if not caixa:
        raise ValueError(f"Recorte vazio em {original.name}")
    # Só muda transparência e enquadramento: o RGB da fotografia é mantido.
    return rgba.crop(caixa), caixa


def retrato(recorte, largura):
    from PIL import Image

    altura = largura * 3 // 2
    margem = round(largura * .03)
    escala = min((largura - 2 * margem) / recorte.width,
                 (altura - margem) / recorte.height, 1)
    tamanho = (round(recorte.width * escala), round(recorte.height * escala))
    jogador = recorte.resize(tamanho, Image.Resampling.LANCZOS)
    tela = Image.new("RGBA", (largura, altura), (0, 0, 0, 0))
    tela.alpha_composite(jogador, ((largura - jogador.width) // 2, margem))
    return tela


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--nomes", nargs="*", help="Nomes de arquivos do catálogo a processar.")
    parser.add_argument("--sobrescrever", action="store_true")
    args = parser.parse_args()
    try:
        from rembg import new_session
    except ImportError as erro:
        raise SystemExit('Instale em um ambiente separado: pip install "rembg[cpu]"') from erro
    catalogo = json.loads((ORIGINAIS / "catalogo.json").read_text(encoding="utf-8"))
    if args.nomes:
        catalogo = [item for item in catalogo if item["nome_arquivo"] in args.nomes]
        if len(catalogo) != len(set(args.nomes)):
            raise SystemExit("Um dos nomes não foi encontrado no catálogo.")
    pendentes = [item for item in catalogo if args.sobrescrever or not all(
        (DESTINO / f'{item["nome_arquivo"]}-{largura}.webp').exists()
        for largura in (480, 800))]
    if not pendentes:
        print("Todas as fotos selecionadas já foram preparadas.")
        return
    session = new_session("birefnet-portrait", providers=["CPUExecutionProvider"])
    DESTINO.mkdir(parents=True, exist_ok=True)
    for item in pendentes:
        nome = item["nome_arquivo"]
        recorte, caixa = recortar(ORIGINAIS / (nome + ".jpg"), session,
                                 item.get("corte_inferior"))
        arquivos = []
        for largura in (480, 800):
            destino = DESTINO / f"{nome}-{largura}.webp"
            temporario = destino.with_suffix(".webp.tmp")
            try:
                retrato(recorte, largura).save(temporario, "WEBP", quality=88, method=6)
                temporario.replace(destino)
            finally:
                temporario.unlink(missing_ok=True)
            arquivos.append(f"{largura}px: {destino.stat().st_size} bytes")
        print(f"{nome}: recorte {caixa}; " + "; ".join(arquivos), flush=True)
    print("Confira os recortes visualmente antes de associar as fotos no elenco.json.")


if __name__ == "__main__":
    main()
