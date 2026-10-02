"""Protege a exportação pública e a preservação dos complementos editoriais."""
import json
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest

SCRIPT = Path(__file__).resolve().parents[1] / "scripts/preparar-elenco.py"


class ExportacaoElencoTest(unittest.TestCase):
    def setUp(self):
        self.temporario = tempfile.TemporaryDirectory()
        self.addCleanup(self.temporario.cleanup)
        self.pasta = Path(self.temporario.name)
        self.entrada = self.pasta / "entrada.json"
        self.complementos = self.pasta / "complementos.json"
        self.saida = self.pasta / "saida.json"
        self.origem = [{
            "registro_cbf": "123", "nome": "Atleta da súmula", "temporada": 2026,
            "categoria": "profissional", "numero_recente": 9, "numeros_usados": [7, 9],
            "foto_local": "assets/coletadas/atleta.webp", "coleta_completa": False,
            "aparicoes": [{"pdf": "C:/privado/sumula.pdf"}],
        }]
        self.editorial = {
            "categoria": "profissional", "temporada": 2026,
            "atletas": {"123": {
                "nome_exibicao": "Apelido", "grupo": "atacantes", "ordem": 0,
                "numero_referencia": 11, "foto": "assets/otimizadas/atleta.webp",
            }},
        }

    def executar(self):
        self.entrada.write_text(json.dumps(self.origem), encoding="utf-8")
        self.complementos.write_text(json.dumps(self.editorial), encoding="utf-8")
        return subprocess.run([
            sys.executable, str(SCRIPT), "--entrada", str(self.entrada),
            "--complementos", str(self.complementos), "--saida", str(self.saida),
        ], capture_output=True)

    def rejeitar_sem_substituir(self):
        anterior = b'{"arquivo": "preservado"}\n'
        self.saida.write_bytes(anterior)
        resultado = self.executar()
        self.assertNotEqual(resultado.returncode, 0)
        self.assertEqual(self.saida.read_bytes(), anterior)

    def test_complementos_foto_e_numero_sobrevivem_ao_scraper(self):
        self.assertEqual(self.executar().returncode, 0)
        dados = json.loads(self.saida.read_text(encoding="utf-8"))
        atleta = dados["atletas"][0]
        self.assertEqual(atleta["foto"], "assets/otimizadas/atleta.webp")
        self.assertEqual(atleta["numero_referencia"], 11)
        self.assertEqual(atleta["numero_recente"], 9)
        self.assertEqual(atleta["numeros_usados"], [7, 9])
        self.assertEqual(atleta["nome_exibicao"], "Apelido")
        self.assertNotIn("C:/privado", self.saida.read_text(encoding="utf-8"))
        self.assertEqual(json.loads(self.entrada.read_text(encoding="utf-8")), self.origem)

    def test_registro_duplicado_nao_substitui_saida(self):
        self.origem.append(self.origem[0].copy())
        self.rejeitar_sem_substituir()

    def test_complemento_de_outra_temporada_nao_substitui_saida(self):
        self.editorial["temporada"] = 2025
        self.rejeitar_sem_substituir()

    def test_caminho_privado_no_complemento_nao_substitui_saida(self):
        self.editorial["atletas"]["123"]["foto"] = "C:/privado/foto.png"
        self.rejeitar_sem_substituir()

    def test_idade_invalida_nao_substitui_saida(self):
        self.editorial["atletas"]["123"]["idade"] = True
        self.rejeitar_sem_substituir()

    def test_integrante_sem_cbf_preserva_identificador_editorial(self):
        self.editorial["atletas_adicionais"] = [{
            "id": "editorial-novo-atleta", "registro_cbf": None,
            "nome_exibicao": "Novo atleta", "grupo": "defensores", "ordem": 0,
        }]
        self.assertEqual(self.executar().returncode, 0)
        dados = json.loads(self.saida.read_text(encoding="utf-8"))
        adicional = dados["atletas"][1]
        self.assertIsNone(adicional["registro_cbf"])
        self.assertEqual(adicional["id"], "editorial-novo-atleta")


if __name__ == "__main__":
    unittest.main()
