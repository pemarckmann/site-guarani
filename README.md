# Site do Esporte Clube Guarani

Site estático em HTML, CSS e JavaScript. Pode ser servido pelo GitHub Pages ou por
outro servidor HTTP. Notícias, partidas e elenco vêm de arquivos JSON; a coleta
do scraper e a integração com a AWS são etapas separadas.

## Executar localmente

Na raiz do projeto, com Python 3.10 ou mais recente:

```powershell
python -m http.server 8000 --bind 127.0.0.1
```

Abra `http://127.0.0.1:8000/`. O Live Server também funciona. Os JSONs precisam de
HTTP: abrir um HTML diretamente por `file://` não carrega os dados.

## Estrutura

| Caminho | Responsabilidade |
| --- | --- |
| `*.html` | Páginas e navegação; permanecem na raiz para preservar os endereços publicados. |
| `css/style.css` | Base, cabeçalho, rodapé e controles compartilhados. |
| `css/home.css`, `clube.css`, `contato.css`, `socio.css` | Estilos específicos dessas páginas. |
| `css/noticias.css`, `desempenho.css`, `elenco.css` | Conteúdos usados tanto na Home quanto nas páginas completas. |
| `css/heroes.css`, `jogos.css`, `patrocinadores.css`, `sem-js.css` | Destaques, tabela completa, patrocinadores e navegação sem JavaScript. |
| `js/dados.js` | URLs das fontes, carregamento, validações e pequenas funções compartilhadas. |
| `js/script.js` | Menu, comportamento do cabeçalho e formulário de contato. |
| `js/noticias.js`, `desempenho.js`, `jogos.js`, `elenco.js` | Apresentação e filtros dos dados. |
| `js/componentes/carrossel.js` | Rolagem circular, teclado, toque e limpeza de eventos do carrossel. |
| `dados/` | Conteúdo editável e complementos editoriais. |
| `assets/otimizadas/` | Imagens usadas pelo site; os heroes ficam em `heroes/`. |
| `assets/originais/` | Imagens de origem preservadas para futuras edições. |
| `assets/coletadas/` | Imagens exportadas pelo scraper, mantendo os caminhos do JSON. |
| `assets/competicoes/` | Biblioteca de marcas da FGF e variantes reservadas para uso futuro. |
| `scripts/` | Ferramentas locais de manutenção, sem dependências externas. |
| `tests/` | Testes do exportador, executados com a biblioteca padrão do Python. |

Cada página carrega seus estilos específicos e os componentes que usa. Evite
colocar regras de uma página em `style.css` ou duplicar dados no HTML.

## Editar e verificar

Consulte [dados/README.md](dados/README.md) para os formatos, campos opcionais e
atualização do elenco. Para marcas de competições, consulte
[o catálogo da FGF](assets/competicoes/README.md).

Depois de alterar CSS ou JavaScript, execute:

```powershell
python scripts/atualizar-versoes.py
python scripts/verificar-projeto.py
```

O primeiro comando atualiza as versões dos arquivos nos HTMLs para evitar cache
antigo. O segundo verifica referências locais, âncoras, IDs duplicados, versões
e sintaxe dos JSONs. Ele não consulta serviços externos nem substitui a conferência
no navegador.

Para conferir a exportação do elenco e a preservação dos complementos:

```powershell
python -m unittest discover -s tests
```

Antes de publicar, confira as páginas em computador e celular, os filtros, a
paginação, o menu e a passagem do último para o primeiro integrante no carrossel.
Também confira as mensagens de erro de carregamento e a navegação sem JavaScript.

## Limites da primeira versão

As notícias e os planos de sócio ainda são exemplos. O formulário de contato
ainda não envia mensagens. O elenco tem complementos editoriais; a fonte de cada
campo deve ser revisada antes da publicação oficial. Os JSONs atuais continuam
compatíveis com o scraper. A integração futura deverá substituir as URLs em
`fontesDados`, devolvendo os formatos documentados, e atualizar os preloads dos
JSONs nas páginas correspondentes.
