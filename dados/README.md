# Dados de exemplo do site

Edite o conteúdo nestes arquivos JSON, sem alterar os scripts de apresentação:

- `noticias.json`: lista de notícias usada na Home, na lista e na leitura completa.
- `desempenho.json`: jogos e classificação das categorias `profissional` e `sub17`.

Os dados atuais são demonstrativos. Eles ainda não representam uma integração com a AWS.

## Notícias

Cada notícia contém:

- `id`: identificador único e estável, usado no endereço da matéria.
- `titulo`, `resumo`, `categoria` e `data`: data no formato `YYYY-MM-DD`.
- `imagem`: `src`, `largura`, `altura`, `alt` e `foco`.
- `foco`: enquadramento da miniatura, por exemplo `50% 15%`; a leitura preserva a imagem inteira.
- `paragrafos`: lista de textos da matéria.
- `demonstrativa`: `true` para exemplos; use `false` em notícias oficiais revisadas.

O site ordena as notícias pela data, mostra três na Home e seis por página na lista.
Registros incompletos, datas impossíveis e IDs duplicados são ignorados, preservando as
notícias válidas. A categoria e a página ficam na URL e são mantidas ao voltar da matéria.

## Desempenho

Cada categoria contém `categoria`, `competicao`, `urlCompeticao`, `jogos` e `classificacao`.
Cada jogo tem um `id` único e estável, uma `data` no formato `YYYY-MM-DD` e um `status`:

- `encerrado`: os dois placares são números inteiros maiores ou iguais a zero.
- `agendado`: `mandanteGols` e `visitanteGols` são `null`; o site exibe “Agendado”, sem calcular resultado.

O ID identifica o jogo e deve permanecer igual mesmo se a data for alterada.
Na tela, a data aparece como `DD/MM`. O site ordena os jogos pela data e mostra os três
mais recentes de cada categoria. Registros inválidos são ignorados sem afetar os válidos.
Nas partidas encerradas, o site calcula vitória, empate ou derrota a partir dos placares.
Linhas de classificação têm clube, posição ordinal (por exemplo `1º`) e pontos inteiros.

## Testar localmente

O carregamento usa `fetch`, então abra o site por um servidor HTTP local.
No terminal, dentro da pasta do projeto, execute:

```powershell
python -m http.server 8000 --bind 127.0.0.1
```

Abra `http://127.0.0.1:8000/`. Para encerrar o servidor, pressione `Ctrl + C` no terminal.
O Live Server do VS Code também serve para testar. Abrir o HTML por `file://` não carrega os JSONs.

## Integração futura com a AWS

`js/dados.js` concentra as URLs e a leitura das respostas JSON. Uma API poderá fornecer
os mesmos formatos, substituindo os arquivos locais como fonte para o site.

Os JSONs representam o formato consumido pelo site. A modelagem de chaves, índices e itens
do DynamoDB será definida ao implementar o backend; esses arquivos não são arquivos prontos
para importação direta pela API de baixo nível do DynamoDB.
