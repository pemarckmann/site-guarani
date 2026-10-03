# Dados do site

Edite o conteúdo nestes arquivos JSON, sem alterar os scripts de apresentação:

- `noticias.json`: lista de notícias usada na Home, na lista e na leitura completa.
- `desempenho.json`: jogos e classificação gerados pelo scraper, separados por categoria.
- `elenco.json`: arquivo único para editar atletas, fotos, números e comissão técnica.

As notícias atuais são demonstrativas. O desempenho é lido do arquivo produzido pelo
scraper; sua coleta e publicação ainda não estão integradas à AWS.

## Notícias

Cada notícia contém:

- `id`: identificador único e estável, usado no endereço da matéria.
- `titulo`, `resumo`, `categoria` e `data`: data no formato `YYYY-MM-DD`.
- `imagem`: `src`, `largura`, `altura`, `alt` e `foco`.
- `foco`: enquadramento da miniatura, por exemplo `50% 15%`; a leitura preserva a imagem inteira.
- `imagem.miniatura` e `imagem.hero`: versões WebP opcionais para os cards e o destaque.
  Cada uma tem `src`, `largura`, `altura` e uma variante menor em `mobile`, com os
  mesmos campos. O navegador escolhe conforme o tamanho exibido e a densidade da tela.
  Os cards atuais usam imagens de 480 e 960 pixels em `assets/otimizadas/noticias/`.
  Ao trocar a foto, atualize ou remova essas variantes para não mostrar a imagem antiga.
  Sem variantes, ou se elas falharem, o site usa `imagem.src`.
- `paragrafos`: lista de textos da matéria.
- `demonstrativa`: `true` para exemplos; use `false` em notícias oficiais revisadas.

O site ordena as notícias pela data, mostra três na Home e seis por página na lista.
Registros incompletos, datas impossíveis e IDs duplicados são ignorados, preservando as
notícias válidas. A categoria e a página ficam na URL e são mantidas ao voltar da matéria.

No fim da matéria, Compartilhar link usa o menu do aparelho quando disponível.
Nos demais navegadores, oferece Copiar link; se a cópia for bloqueada, mostra
o endereço para seleção manual. O link contém apenas o identificador da matéria,
sem filtros ou página da listagem. As prévias individuais ficam para o backend;
por enquanto, o compartilhamento usa a prévia geral de `noticia.html`.

## Desempenho

Cada categoria contém `categoria`, `competicao`, `urlCompeticao`, `jogos` e `classificacao`.
As chaves atuais são `profissional`, `sub17`, `sub15` e `feminino-sub15`. O seletor é
montado a partir do JSON: novas categorias válidas aparecem sem editar HTML ou JavaScript.
Use chaves em minúsculas, com letras, números e hífens, e `categoria` como nome de exibição.

Metadados opcionais da categoria: `temporada`, `grupo`, `faseClassificacao`, `fonte` e
`atualizadoEm` (data e hora ISO 8601 com fuso, como `2026-10-01T16:55:04Z`). A atualização
é exibida no horário de Brasília. A fase da classificação é independente da fase dos jogos:
uma tabela classificatória pode permanecer disponível durante o mata-mata.
`logoCompeticao` é opcional e contém `src`, `largura` e `altura`. Ele permite indicar
o logo usado no destaque da próxima partida. Sem esse campo, o site usa o logo local
cadastrado para Gauchão Série A2, Gauchão Sub-17 A2, Gauchão Sub-15 ou Gauchão Feminino
Sub-15. Competições sem logo cadastrado exibem só o nome.
Os logos são obtidos da [página oficial de marcas da FGF](https://fgf.com.br/marcas/).
`assets/competicoes/` guarda os arquivos oficiais baixados e as cópias WebP sem perda para
exibição, preservando cores, transparência, proporções e resolução. A biblioteca também
inclui Série B, outras categorias de base, Copa FGF, Recopa, Gauchão Feminino e festivais.
Consulte o [catálogo de marcas](../assets/competicoes/README.md) para os arquivos,
variantes e edições específicas disponíveis. O logo Sub-17 A2
continua usando o arquivo já existente em `assets/otimizadas/`.
Cada jogo tem um `id` único e estável, uma `data` no formato `YYYY-MM-DD` e um `status`:

- `encerrado`: os dois placares são números inteiros maiores ou iguais a zero.
- `agendado`: `mandanteGols` e `visitanteGols` são `null`; a partida pode aparecer no destaque da próxima partida, mas não em “Últimos jogos”.

O ID identifica o jogo e deve permanecer igual mesmo se a data for alterada.
Na tela, a data aparece como `DD/MM`. Campos opcionais do jogo: `hora` (`HH:mm` ou `null`),
`rodada`, `fase` e `urlFonte`. “Últimos jogos” mostra até três partidas encerradas por
categoria, ordenadas da mais recente para a mais antiga. Jogos agendados ficam fora dessa lista.
Em confrontos de ida e volta, o scraper pode fornecer `partida` e `totalPartidas`
(por exemplo, `1` e `2`). Esses números são exibidos como “Partida 1 de 2”. Sem eles,
o site identifica pares em oitavas, quartas, semifinais e final quando há exatamente dois
jogos entre os mesmos clubes, na mesma competição, fase e ano, com mandos invertidos.
A ordem cronológica define a primeira e a segunda partida. Se só uma partida estiver
disponível ou o confronto for ambíguo, nenhum número é deduzido.
O destaque da próxima partida usa o primeiro jogo agendado entre todas as categorias,
independentemente da categoria selecionada. O scraper deve atualizar o status ao encerrar
uma partida; o site não transforma um jogo agendado em encerrado apenas pela data.
Registros inválidos são ignorados sem afetar os válidos.
Nas partidas encerradas, o site calcula vitória, empate ou derrota a partir dos placares.
Uma disputa por pênaltis usa `decisao: "penaltis"`, `mandantePenaltis` e
`visitantePenaltis`. O placar do jogo deve estar empatado, e os pênaltis precisam ser
inteiros não negativos e diferentes entre si. O site mantém o placar normal e mostra
separadamente os pênaltis e o vencedor da decisão.
Linhas de classificação têm clube, posição ordinal (por exemplo `1º`) e pontos inteiros.
O campo `guarani: true` destaca o clube. A Home exibe até seis linhas consecutivas ao redor
do Guarani, em ordem de posição. O trecho se ajusta quando o clube está perto do início ou
do fim da tabela; sem o Guarani, aparecem os primeiros seis clubes. O aviso de resumo
informa o total de clubes, e “Tabela completa” abre a aba Classificação da página Jogos
na categoria selecionada.
O endereço inclui `#painel-classificacao`: a página posiciona a tabela após
carregar os dados, com espaço para o cabeçalho.
A identificação da fonte e a data de atualização aparecem discretamente abaixo dos painéis.
Estatísticas adicionais do scraper, como jogos, vitórias e saldo de gols, permanecem no
JSON, mas não são colunas desse resumo. Escudos podem usar caminhos locais ou URLs HTTP(S).
O cadastro `escudosLocais` em `js/desempenho.js` dá prioridade aos escudos escolhidos
pelo clube em `assets/otimizadas/`, incluindo Guarani e Osoriense. Para adicionar
outro, cadastre o nome do clube sem acentos e em minúsculas, com o caminho da imagem.
Se o arquivo local não carregar, o site tenta o caminho recebido no JSON, depois a
URL original da FGF (`mandanteEscudoFonte`, `visitanteEscudoFonte` ou `escudoFonte`).
Se nenhuma imagem carregar, aparecem as iniciais do clube.

No scraper, o cadastro equivalente fica em `config.json`, no campo `escudos`.
As imagens preferidas ficam em `escudos-locais/assets/otimizadas/` e também entram
no pacote da Lambda. Ao substituir um escudo do site, atualize essa cópia no scraper
para que as próximas exportações e a Lambda usem a mesma versão.

## Elenco profissional

A Home apresenta atletas e comissão técnica em uma única fileira circular,
com nome e posição ou cargo sobre a foto. O link “Ver elenco completo” abre a
página organizada por grupos. Ambas leem o mesmo `elenco.json` e compartilham
o carrossel; atletas sem setor identificado ficam fora da apresentação.

`elenco.html` mostra a relação parcial de atletas da temporada, com busca por nome,
filtro por setor e fileiras de Goleiros, Defensores, Meio-campistas e Atacantes.
Cada fileira tem setas independentes, rolagem por toque e navegação por teclado.
Os cards usam fotos em retrato, na proporção 2:3. Sem foto, mostram a silhueta
compartilhada em `assets/otimizadas/atleta-silhueta.webp`, com aproximadamente 28 KB.
As fileiras visíveis avançam a cada 4,5 segundos e param ao receber interação
por mouse, toque ou teclado. O carrossel mantém a mesma direção: depois do último
atleta, o primeiro aparece em seguida, sem animar um retorno para trás. Cópias
visuais completam o ciclo, sem duplicar IDs ou atletas para leitores de tela.
As setas também percorrem o ciclo nos dois sentidos. A preferência por movimento reduzido
do dispositivo desativa o avanço automático. As setas aparecem ao passar o mouse
ou navegar pelo teclado; em telas de toque, permanecem visíveis.
A fonte fica em
`fontesDados.elenco` (`js/dados.js`) e recebe o envelope público de `dados/elenco.json`.
Os cards mostram nome, foto e número de referência.
Posição não é deduzida pelo número da camisa. Registros sem setor identificado ficam
preservados no JSON, mas não aparecem na página nem na contagem do elenco.
A comissão técnica aparece depois dos atacantes, com nome, cargo e a mesma
silhueta enquanto não houver foto. A busca inclui cargos, e o filtro permite
selecionar apenas a comissão.

Edite diretamente `dados/elenco.json`. O site não precisa de exportação nem
históricos de súmulas para atualizar o elenco. O mesmo arquivo é usado na Home e
na aba Elenco, e poderá ser servido pela API no futuro.

Cada item de `atletas` contém:

- `id`: identificador único e estável; mantenha o existente ao editar nomes ou fotos.
- `registro_cbf`: registro como texto, ou `null` quando desconhecido.
- `nome_exibicao`: nome ou apelido em destaque no card.
- `nome_completo`: nome completo confirmado, ou `null` quando ainda não conhecido.
- `idade`, `posicao` e `numero`: informações editoriais; campos desconhecidos usam `null`.
  O número é uma referência e pode mudar entre partidas.
- `grupo`: `goleiros`, `defensores`, `meio-campistas` ou `atacantes`.
  Um atleta com `grupo: null` fica guardado, mas não aparece nas fileiras.
- `ordem`: ordem dentro do grupo, começando em zero.
- `foto`: caminho público em `assets/` ou URL HTTP(S). Use `null` para a silhueta.
- `foto_800`: variante opcional de 800 × 1200 pixels. Quando informada, `foto`
  deve ter 480 × 720 pixels. O navegador escolhe pela largura do card e densidade
  da tela; uma falha na variante tenta `foto` antes de exibir a silhueta.

`comissao_tecnica` contém nome, cargo e, opcionalmente, `nome_exibicao`, `foto`
e `foto_800`, seguindo o mesmo padrão de imagens dos atletas.
Os cinco profissionais atuais ficam nesse mesmo arquivo.
`categoria`, `temporada`, `clube`, `fonte` e `parcial` descrevem o elenco;
`identificacoes_pendentes` guarda as informações ainda não confirmadas.
Os dados detalhados de coleta devem ficar no projeto do scraper. Uma integração
futura precisa preservar os nomes, fotos e demais informações revisadas deste JSON.

### Fotos de apresentação do Facebook

Os arquivos fornecidos ficam em `assets/originais/elenco/`, com um
`catalogo.json` que associa o nome do arquivo original ao ID do elenco. Um ID
`null` indica que a associação ainda precisa ser confirmada. Esse catálogo é
usado apenas para preparar as fotos; o site continua lendo somente `elenco.json`.

`scripts/preparar-fotos-elenco.py` usa segmentação local de retratos para remover
o fundo, os textos de apresentação e as decorações. Não gera novos rostos ou
uniformes. O RGB da foto original é conservado durante o recorte, seguido de
redimensionamento e compressão WebP. A transparência permite usar o fundo dos
cards do site. As saídas têm proporção 2:3 e larguras de 480 e 800 pixels.

Para preparar novas fotos, instale `rembg[cpu]` em um ambiente Python separado
e execute o script. O modelo é baixado na primeira execução; ferramentas e
modelo são usados apenas na preparação, sem carregar nada no navegador.
Confira cada recorte antes de preencher `foto` e `foto_800` no elenco.

```powershell
python scripts/preparar-fotos-elenco.py --nomes prezzi diogo-cruz
```

Sem `--nomes`, prepara todo o catálogo. Fotos existentes são preservadas; use
`--sobrescrever` para refazê-las. O campo opcional `corte_inferior` no catálogo
limita o recorte na coordenada vertical indicada, para artes com informações
sobre o fim do uniforme. Não altera os dados dos jogadores automaticamente.

## Heroes e carregamento

O hero de Notícias usa a notícia mais recente; `destaque: true` permite escolher
uma matéria. Se houver mais de um destaque, usa o mais recente. A foto respeita
`imagem.foco`, e o botão “Ler notícia” abre a matéria completa. Sem notícias válidas,
o cabeçalho mantém o título e a apresentação da página.
O hero de Jogos mostra a primeira partida agendada entre todas as categorias,
com a categoria identificada no card, independentemente dos filtros da lista.
Sem partidas agendadas, exibe “Próximas partidas em breve”. Ambos usam os JSONs
atuais, sem uma segunda fonte de dados.

Notícias e Jogos antecipam o JSON com `preload` no HTML. Ao trocar a URL da fonte
em `js/dados.js` pela API, atualize também esse link no HTML.
O carregamento dos JSONs tem limite de 15 segundos; em caso de falha, Notícias e
Jogos oferecem “Tentar novamente”. CSS e JavaScript usam uma versão na URL
(`?v=...`) para evitar arquivos antigos em cache. Após alterar esses arquivos,
execute `python scripts/atualizar-versoes.py` na raiz do projeto. O comando
atualiza todas as páginas com parte do SHA-256 dos arquivos.
As notícias podem fornecer `imagem.hero` com `src`, `largura`, `altura` e uma
variante `mobile` com os mesmos campos. O hero escolhe a versão conforme a tela;
sem variante, usa `imagem.src`. Os cards e a leitura conservam a imagem original.
Os arquivos menores ficam em `assets/otimizadas/heroes/`. Ao atualizar uma foto,
gere suas variantes novamente ou remova `imagem.hero` para usar a nova original.
Os logos conhecidos da FGF têm cópias pequenas cadastradas em
`logosCompeticoesOtimizados` no frontend. A correspondência usa a URL de origem,
e uma falha na cópia pequena tenta o caminho original recebido no JSON.

## Página de jogos

A página `jogos.html` usa o mesmo `desempenho.json` da Home, sem duplicar os dados.
Ela oferece filtros por categoria e status e paginação de oito partidas. Agendadas
ficam em ordem cronológica, antes dos resultados; encerradas aparecem da mais recente
para a mais antiga. Os filtros e a página ficam na URL para compartilhar e voltar.
O link “Ver todos” da Home abre os resultados da categoria selecionada.
A aba “Classificação” mostra todos os clubes da tabela fornecida no JSON, com
pontos, jogos, vitórias, empates, derrotas e saldo de gols. A fase e o grupo
identificam a tabela, mesmo durante o mata-mata. Estatísticas ausentes aparecem
como “—”. No celular, a tabela permite rolagem horizontal dentro do próprio quadro.
A aba selecionada também fica na URL (`aba=classificacao`).

## Testar localmente

O carregamento usa `fetch`, então abra o site por um servidor HTTP local.
No terminal, dentro da pasta do projeto, execute:

```powershell
python -m http.server 8000 --bind 127.0.0.1
```

Abra `http://127.0.0.1:8000/`. Para encerrar o servidor, pressione `Ctrl + C` no terminal.
O Live Server do VS Code também serve para testar. Abrir o HTML por `file://` não carrega os JSONs.

## Integração futura com a AWS

Os escudos revisados manualmente continuam tendo prioridade. As imagens
coletadas que já foram otimizadas têm um mapa `escudosOtimizados` em
`js/desempenho.js`, apontando para `assets/otimizadas/escudos/`. Uma coleta nova
com outro caminho funciona diretamente; para reduzir seu peso, gere uma variante
WebP sem ampliar a imagem e inclua o caminho no mapa. Preserve o original como
alternativa. Não é necessário modificar a saída do scraper para usar esse recurso.

`js/dados.js` concentra as URLs e a leitura das respostas JSON. Uma API poderá fornecer
os mesmos formatos, substituindo os arquivos locais como fonte para o site.

Os JSONs representam o formato consumido pelo site. A modelagem de chaves, índices e itens
do DynamoDB será definida ao implementar o backend; esses arquivos não são arquivos prontos
para importação direta pela API de baixo nível do DynamoDB.
