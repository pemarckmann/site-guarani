"""Gera o JSON público do elenco sem os caminhos locais das súmulas."""
import argparse
import json
import os
from pathlib import Path
import re
import tempfile
from urllib.parse import urlsplit

ROOT = Path(__file__).resolve().parent.parent
GRUPOS = {"goleiros", "defensores", "meio-campistas", "atacantes"}


def texto_valido(valor):
    return isinstance(valor, str) and bool(valor.strip())


def inteiro_valido(valor, minimo):
    return type(valor) is int and valor >= minimo


def foto_publica(valor):
    if not texto_valido(valor) or "\\" in valor:
        return None
    if valor.startswith("assets/") and ".." not in valor.split("/"):
        return valor
    url = urlsplit(valor)
    return valor if url.scheme in {"http", "https"} and url.netloc else None


def validar_complemento(extra):
    if not isinstance(extra, dict) or extra.get("grupo") not in GRUPOS or not texto_valido(extra.get("nome_exibicao")):
        raise ValueError("Complemento de atleta inválido.")
    for chave, minimo in (("ordem", 0), ("idade", 1), ("numero_referencia", 1)):
        if extra.get(chave) is not None and not inteiro_valido(extra[chave], minimo):
            raise ValueError(f"Campo {chave} inválido no complemento.")
    for chave in ("nome_completo", "posicao"):
        if extra.get(chave) is not None and not texto_valido(extra[chave]):
            raise ValueError(f"Campo {chave} inválido no complemento.")
    if extra.get("foto") is not None and not foto_publica(extra["foto"]):
        raise ValueError("A foto do complemento precisa de um endereço público.")


def aplicar_complemento(atleta, extra):
    validar_complemento(extra)
    campos = ("nome_exibicao", "grupo", "ordem", "nome_completo", "idade", "posicao", "numero_referencia")
    atleta.update({chave: extra[chave] for chave in campos if chave in extra})
    if extra.get("foto") is not None:
        atleta["foto"] = foto_publica(extra["foto"])
    atleta.update({"fonte_grupo": "editorial", "fonte_complemento": "editorial"})


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
        if not isinstance(atleta, dict):
            raise ValueError("Cada atleta da entrada deve ser um objeto.")
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
        resumo["foto"] = foto_publica(local) or foto_publica(remoto)
        atletas.append(resumo)
    temporadas = {atleta.get("temporada") for atleta in origem}
    categorias = {atleta.get("categoria") for atleta in origem}
    if len(temporadas) != 1 or len(categorias) != 1:
        raise ValueError("A entrada deve conter uma única categoria e temporada.")
    temporada, categoria = temporadas.pop(), categorias.pop()
    if not inteiro_valido(temporada, 1900) or not texto_valido(categoria):
        raise ValueError("Categoria ou temporada inválida.")
    dados = {"categoria": categoria, "temporada": temporada,
             "parcial": any(atleta.get("coleta_completa") is not True for atleta in origem),
             "fonte": "FGF", "atletas": atletas}
    if args.complementos.exists():
        complemento = json.loads(args.complementos.read_text(encoding="utf-8-sig"))
        if not isinstance(complemento, dict) or not isinstance(complemento.get("atletas", {}), dict):
            raise ValueError("Os complementos devem conter um objeto de atletas.")
        if complemento.get("categoria") != dados["categoria"] or complemento.get("temporada") != dados["temporada"]:
            raise ValueError("Os complementos devem corresponder à categoria e temporada da entrada.")
        for extra in complemento.get("atletas", {}).values():
            validar_complemento(extra)
        for atleta in atletas:
            extra = complemento.get("atletas", {}).get(atleta["registro_cbf"])
            if extra:
                aplicar_complemento(atleta, extra)
        adicionais = complemento.get("atletas_adicionais", [])
        if not isinstance(adicionais, list):
            raise ValueError("Atletas adicionais devem ser uma lista.")
        for extra in adicionais:
            validar_complemento(extra)
            identificador = extra.get("id")
            if not isinstance(identificador, str) or not re.fullmatch(r"editorial-[a-z0-9-]+", identificador):
                raise ValueError("Identificador editorial inválido.")
            if identificador in registros or extra.get("registro_cbf") is not None:
                raise ValueError("Atleta editorial duplicado ou com registro CBF não associado.")
            registros.add(identificador)
            resumo = {"id": identificador, "registro_cbf": None,
                      "nome": extra.get("nome_completo") or extra["nome_exibicao"], "foto": None}
            aplicar_complemento(resumo, extra)
            atletas.append(resumo)
        comissao = complemento.get("comissao_tecnica", [])
        if not isinstance(comissao, list) or any(not isinstance(pessoa, dict) or
                not texto_valido(pessoa.get("nome")) or not texto_valido(pessoa.get("cargo")) for pessoa in comissao):
            raise ValueError("A comissão deve conter nomes e cargos válidos.")
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
    try:
        main()
    except (ValueError, OSError) as erro:
        raise SystemExit(f"Não foi possível exportar o elenco: {erro}") from erro
