"""Gera o JSON público do elenco sem os caminhos locais das súmulas."""
import argparse
import json
import os
from pathlib import Path
import re
import tempfile

ROOT = Path(__file__).resolve().parent.parent


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--entrada", type=Path, default=ROOT / "dados/elenco-profissional-2026-parcial.json")
    parser.add_argument("--saida", type=Path, default=ROOT / "dados/elenco.json")
    parser.add_argument("--complementos", type=Path, default=ROOT / "dados/elenco-complementos.json")
    args = parser.parse_args()
    origem = json.loads(args.entrada.read_text(encoding="utf-8-sig"))
    if not isinstance(origem, list) or not origem:
        raise ValueError("A entrada deve conter uma lista de atletas.")
    registros = set()
    atletas = []
    campos = ("registro_cbf", "nome", "apelido", "nome_cbf", "nome_completo_fgf",
              "identidade_conflitante", "posicao", "numero_recente", "numeros_usados",
              "aparicoes_sumulas")
    for atleta in origem:
        registro = atleta.get("registro_cbf")
        if not isinstance(registro, str) or not re.fullmatch(r"\d+", registro) or registro in registros:
            raise ValueError("Registro de atleta inválido ou duplicado.")
        if not isinstance(atleta.get("nome"), str) or not atleta["nome"].strip():
            raise ValueError("Nome de atleta ausente.")
        registros.add(registro)
        resumo = {campo: atleta.get(campo) for campo in campos}
        resumo["numero_recente"] = atleta.get("numero_recente", atleta.get("numero"))
        # Fotos precisam de um endereço público, não de caminhos do computador.
        local = atleta.get("foto_local")
        remoto = atleta.get("foto_original_url")
        resumo["foto"] = local if isinstance(local, str) and local.startswith("assets/") and ".." not in local.split("/") else (
            remoto if isinstance(remoto, str) and remoto.startswith(("https://", "http://")) else None)
        atletas.append(resumo)
    temporadas = {atleta.get("temporada") for atleta in origem}
    categorias = {atleta.get("categoria") for atleta in origem}
    if len(temporadas) != 1 or len(categorias) != 1:
        raise ValueError("A entrada deve conter uma única categoria e temporada.")
    dados = {"categoria": categorias.pop(), "temporada": temporadas.pop(),
             "parcial": any(atleta.get("coleta_completa") is not True for atleta in origem),
             "fonte": "FGF", "atletas": atletas}
    if args.complementos.exists():
        complemento = json.loads(args.complementos.read_text(encoding="utf-8-sig"))
        if complemento.get("categoria") != dados["categoria"] or complemento.get("temporada") != dados["temporada"]:
            raise ValueError("Os complementos devem corresponder à categoria e temporada da entrada.")
        grupos = {"goleiros", "defensores", "meio-campistas", "atacantes"}
        for atleta in atletas:
            extra = complemento.get("atletas", {}).get(atleta["registro_cbf"])
            if extra:
                if extra.get("grupo") not in grupos or not isinstance(extra.get("nome_exibicao"), str) or not extra["nome_exibicao"].strip():
                    raise ValueError("Complemento de atleta inválido.")
                atleta.update({chave: extra[chave] for chave in ("nome_exibicao", "grupo", "ordem", "nome_completo", "idade", "posicao", "numero_referencia") if chave in extra})
                atleta["fonte_grupo"] = "editorial"
                atleta["fonte_complemento"] = "editorial"
        for extra in complemento.get("atletas_adicionais", []):
            identificador = extra.get("id")
            if not isinstance(identificador, str) or not re.fullmatch(r"editorial-[a-z0-9-]+", identificador):
                raise ValueError("Identificador editorial inválido.")
            if identificador in registros or extra.get("registro_cbf") is not None:
                raise ValueError("Atleta editorial duplicado ou com registro CBF não associado.")
            if extra.get("grupo") not in grupos or not isinstance(extra.get("nome_exibicao"), str) or not extra["nome_exibicao"].strip():
                raise ValueError("Complemento de atleta adicional inválido.")
            registros.add(identificador)
            resumo = {chave: extra[chave] for chave in ("id", "nome_exibicao", "nome_completo", "grupo", "ordem", "idade", "posicao", "numero_referencia") if chave in extra}
            resumo.update({"registro_cbf": None, "nome": extra.get("nome_completo") or extra["nome_exibicao"],
                           "foto": None, "fonte_grupo": "editorial", "fonte_complemento": "editorial"})
            atletas.append(resumo)
        dados["clube"] = complemento.get("clube")
        dados["comissao_tecnica"] = complemento.get("comissao_tecnica", [])
        dados["complemento_fonte"] = complemento.get("fonte")
        dados["identificacoes_pendentes"] = complemento.get("pendentes", [])
    args.saida.parent.mkdir(parents=True, exist_ok=True)
    temporario = None
    try:
        with tempfile.NamedTemporaryFile(mode="w", encoding="utf-8", dir=args.saida.parent, delete=False) as arquivo:
            temporario = Path(arquivo.name)
            json.dump(dados, arquivo, ensure_ascii=False, indent=2)
            arquivo.write("\n")
        os.replace(temporario, args.saida)
    finally:
        if temporario: temporario.unlink(missing_ok=True)
    print(f"{len(atletas)} atletas exportados para {args.saida}")


if __name__ == "__main__":
    main()
