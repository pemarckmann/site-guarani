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

Edite o elenco diretamente em `dados/elenco.json`: atletas e comissão técnica
ficam no mesmo arquivo. Não é necessário gerar outro JSON a partir de súmulas.

Antes de publicar, confira as páginas em computador e celular, os filtros, a
paginação, o menu e a passagem do último para o primeiro integrante no carrossel.
Também confira as mensagens de erro de carregamento e a navegação sem JavaScript.

## Limites da primeira versão

As páginas públicas têm metadados Open Graph e Twitter Card no HTML, com título
e descrição próprios e uma imagem de prévia comum em
`assets/otimizadas/compartilhamento.png`. Os endereços absolutos usam
`https://pemarckmann.github.io/site-guarani/`; ao trocar o domínio, atualize os
metadados e os links `canonical`. A página 404 permanece com `noindex`.
`noticia.html` usa uma prévia geral, pois a matéria vem do JSON. Ela não fixa
`canonical` nem `og:url`, preservando o endereço com o identificador da notícia.
Prévias por matéria exigem HTML gerado na publicação ou resposta do backend com
os metadados da notícia já presentes, sem depender de JavaScript.

`404.html` é a página para endereços inexistentes no GitHub Pages. Seus links usam
a base `/site-guarani/` para funcionar também em URLs com subpastas. Em testes
locais e domínios próprios, o script ajusta a base para `/`. Se publicar em outro
subdiretório ou precisar funcionar sem JavaScript em um domínio próprio, ajuste
o `<base>` para a raiz publicada. Na AWS, configure a hospedagem para usar esse
arquivo como página de erro com status HTTP 404. O servidor simples do Python
não escolhe essa página automaticamente; abra `/404.html` para testar o visual.

As notícias e os planos de sócio ainda são exemplos. O formulário de contato
ainda não envia mensagens. O elenco tem complementos editoriais; a fonte de cada
campo deve ser revisada antes da publicação oficial. Os JSONs atuais continuam
compatíveis com o scraper. A integração futura deverá substituir as URLs em
`fontesDados`, devolvendo os formatos documentados, e atualizar os preloads dos
JSONs nas páginas correspondentes.
