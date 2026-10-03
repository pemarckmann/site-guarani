# Revisão de desempenho e acessibilidade

Implementada em 02/10/2026, após autorização do responsável pelo site.
O vermelho da marca foi preservado; não foi adotado o vermelho claro rejeitado.
Após a revisão, as demais cores dos textos também foram restauradas a pedido
do responsável. Permanecem os tamanhos maiores e o sublinhado vermelho do menu.
As anotações anteriores estão em [melhorias-planejadas.md](melhorias-planejadas.md).

## Alterações concluídas

- Reserva de espaço para a próxima partida na Home e em Jogos, para o destaque
  de Notícias, filtros, contagens e fileiras do Elenco. Os blocos decorativos
  de carregamento não duplicam conteúdo editorial do JSON e são removidos
  em caso de lista vazia ou falha.
- Heroes responsivos da Home, Sócio e Clube, com preloads nas mesmas condições
  do CSS. Apenas a variante da tela atual é solicitada. Os arquivos anteriores
  foram preservados em `assets/originais/`.
- Miniaturas responsivas das notícias, escudo e patrocinadores. A leitura da
  matéria mantém a imagem original. Variantes opcionais das notícias retornam
  à imagem original se houver falha.
- Escudos coletados com variantes em `assets/otimizadas/escudos/`. A prioridade
  continua sendo a imagem revisada manualmente, seguida da variante otimizada,
  da imagem coletada e da fonte externa. Caminhos novos do scraper continuam
  funcionando sem uma variante otimizada.
- Imagens do rodapé carregadas sob demanda, com espaço reservado para o escudo.
- Carrossel com réplicas apenas nas bordas, suficientes para a área visível.
  A Home passou de 99 cards para 39 em 393 px e 45 em 1440 px. As dimensões são
  medidas na inicialização/redimensionamento e reaproveitadas durante a rolagem.
  Movimento circular, toque, setas, teclado e redução de movimento foram mantidos.
- Textos auxiliares menores que 12 px foram ampliados. O item ativo do menu usa
  sublinhado vermelho; as cores originais dos textos foram restauradas.
  Campos ficam desativados enquanto carregam.
- Rótulos ARIA inadequados em elementos genéricos foram substituídos por texto
  acessível, incluindo o número de referência dos atletas e o código da página 404.

### Exemplos de redução de imagens

Valores arredondados em KB decimais, referentes aos arquivos. A densidade da
tela também influencia o `srcset`.

| Imagem | Antes | Celular | Computador |
| --- | ---: | ---: | ---: |
| Hero da Home, revisão inicial | 309 KB | 92 KB | 186 KB |
| Hero de Sócio, revisão inicial | 253 KB | 84 KB | 155 KB |
| Hero de Clube, revisão inicial | 150 KB | 50 KB | 92 KB |
| Escudo do Guarani | 70 KB | Variantes de 5 e 10 KB | Variante maior de 19 KB |

Patrocinadores têm variantes com até 240 e 480 pixels, respeitando a largura
original. Fotos pequenas dos atletas não foram ampliadas nem recomprimidas.

### Hero da Home em telas grandes — 03/10/2026

A foto original fornecida tem 5104 × 3403 pixels. Foram geradas novas versões
diretamente dela, evitando ampliar ou recomprimir as versões reduzidas anteriores.
O hero usa `<picture>` e preload compatível: celular recebe 960 pixels (108 KB),
e desktop pode selecionar 960, 1600 (306 KB), 1920 (422 KB), 2560 (804 KB) ou
3840 pixels (1,53 MB), conforme largura e densidade da tela. A imagem é escolhida
desde o início, sem baixar uma versão leve e substituí-la depois. O arquivo
original de 11,3 MB é preservado, sem participar do carregamento da página.

### Demais heroes com as originais — 03/10/2026

Clube e Sócio passaram a usar `<picture>`, com preload nas mesmas condições e
versões de 960, 1600, 1920, 2560 e 3840 pixels. As fotos de 5388 × 3592 pixels
ficam preservadas em `assets/originais/`; não são baixadas pelo visitante.
No celular, as versões de 960 pixels têm 58 KB (Clube) e 97 KB (Sócio).
Em 4K, as versões de 3840 pixels têm 768 KB e 1,05 MB, respectivamente.

Elenco usa versões de 640, 960, 1280 e 1600 pixels, com 960 pixels no celular
(150 KB). O destaque Guarani–União de Notícias usa versões de 640 e 1350 pixels
(38 KB e 159 KB), selecionadas pelo `srcset` de acordo com largura e densidade.
Essas duas fotos não foram ampliadas além das dimensões originais. As versões
anteriores substituídas foram removidas, mantendo os originais para novas edições.

Validação em navegador local: quatro páginas nas larguras 393, 1440, 1920 e
3840 pixels, com densidade 2,75 no celular. Todos os 16 casos baixaram uma única
imagem para o hero, sem erro JavaScript, rolagem horizontal ou deslocamento de
layout durante o carregamento observado (CLS 0). Recortes e gradientes mantidos.

## Verificação local

O teste de estabilidade atrasou as respostas dos JSONs em 1,5 segundo, usando
viewport de 393 × 900 e 1440 × 900, sem interação durante o carregamento.

| Página | CLS antes, celular / computador | CLS depois, celular / computador |
| --- | --- | --- |
| Home | 0,173 / 0,028 | 0 / 0 |
| Notícias | 0,369 / 0,253 | 0 / 0 |
| Jogos | 0,520 / 0,174 | Abaixo de 0,001 / abaixo de 0,001 |
| Elenco | 0,178 / 0,102 | 0,003 / 0 |

São medições locais, não novas notas do PageSpeed. O objetivo é CLS até 0,1,
conforme a [documentação do Google](https://web.dev/articles/optimize-cls).

Também foram verificados:

- As nove páginas em larguras de 320, 393, 768 e 1440 px, incluindo menu e imagens,
  sem rolagem horizontal da página nem exceções de JavaScript.
- Miniaturas em densidade 2,75 e retorno à imagem original quando variantes falham.
- Um ciclo inteiro de 33 integrantes para cada lado do carrossel, nas duas
  larguras, filtros do elenco e os cinco integrantes da comissão técnica.
- Filtros de notícias, navegação direta à classificação, lista vazia e falhas
  de carregamento com opção de tentar novamente.
- Integrante selecionado preservado ao redimensionar, navegação por teclado,
  título longo em 320 px e apresentação sem JavaScript.
- Antes da restauração das cores, Axe-core, regras WCAG A/AA, nas nove páginas
  em 393 e 1440 px: nenhuma violação automática encontrada. Esse resultado não
  representa o contraste da versão com as cores originais restauradas, nem
  substitui a avaliação manual de teclado, leitor de tela e fotografias.

Após publicar, repetir PageSpeed e WAVE na mesma versão. O relatório enviado
como Clube usou `oclube.html` e recebeu HTTP 404; o endereço correto é
`clube.html`. O `noindex` da página 404 continua adequado.

As folhas necessárias ao primeiro desenho continuam bloqueadoras: carregá-las
depois poderia recriar saltos de layout. Cada página segue carregando apenas
os módulos que utiliza.

## Configurações para a AWS

Estas etapas dependem da hospedagem e continuam pendentes:

- Habilitar compressão dos arquivos de texto na distribuição, quando aplicável.
- Definir cache longo para assets com nomes versionados e imutáveis.
  Arquivos que mantêm o mesmo nome precisam de revalidação ou invalidação ao
  publicar; não aplicar cache imutável longo indiscriminadamente.
- Tratar HTML e JSON com políticas próprias, para evitar resultados antigos.
  A frequência do scraper deve orientar a validade do cache dos resultados.
- Se o cache usar o parâmetro `v` de CSS/JS, incluí-lo na chave de cache da
  distribuição, ou adotar nomes de arquivo com hash na publicação.
- Medir novamente depois da migração. HTML e JavaScript não configuram os
  cabeçalhos HTTP de cache do GitHub Pages.
