# Melhorias planejadas

> Registro anterior à autorização de implementação. O estado atual e os testes
> estão em [melhorias-implementadas.md](melhorias-implementadas.md); os itens
> abaixo preservam as observações originais dos relatórios.

Anotações de 02/10/2026, a partir dos relatórios WAVE e PageSpeed enviados pelo
usuário e da leitura do código. Implementar somente quando solicitado.

## Preferências e limites

- Preservar o vermelho e a identidade visual atuais. O usuário descartou as
  alterações de contraste, tamanhos de texto e acessibilidade da última revisão.
- Priorizar desempenho sem alterar o visual final das páginas.
- As configurações de hospedagem e cache ficam para a integração com a AWS.
- Separar causas confirmadas de hipóteses; medir antes e depois de cada ajuste.

## Prioridade alta: estabilidade da página de notícias

O relatório de `noticias.html` mostra:

| Métrica | Celular | Computador |
| --- | --- | --- |
| Desempenho | 75 | 84 |
| CLS | 0,403 | 0,313 |

Meta de CLS: até 0,1. Referência:
[orientações do Google sobre CLS](https://web.dev/articles/optimize-cls).

- [ ] Medir os deslocamentos durante o carregamento, incluindo rede lenta.
- [ ] Reservar espaço no hero para o conteúdo recebido do JSON. No código, a
  apresentação inicial é substituída pela foto, categoria, título, resumo e botão;
  essa mudança pode aumentar a altura. A contribuição exata ao CLS ainda precisa
  ser medida.
- [ ] Evitar deslocamentos quando aparecem os filtros e o aviso de notícias
  demonstrativas, atualmente ocultos antes do carregamento.
- [ ] Reservar espaço para a listagem: o estado inicial de carregamento é
  substituído pelos cards. Tratar também lista vazia e falha de carregamento,
  sem deixar espaços desnecessários no estado final.
- [ ] Conferir títulos longos, imagens verticais e horizontais, diferentes
  larguras e ampliação de texto, sem cortar conteúdo.

## Prioridade média: imagens

- [ ] Avaliar versões menores do escudo do Guarani, hoje com aproximadamente
  70 KB, e dos patrocinadores, cujos arquivos atuais têm aproximadamente
  32–64 KB. Considerar o tamanho exibido e a densidade da tela para preservar
  nitidez e transparência.
- [ ] Verificar quais imagens coletadas pelo scraper são realmente baixadas
  em cada página e filtro. Arquivos grandes existentes no repositório não
  significam, por si só, que estejam pesando no carregamento.
- [ ] Reavaliar os heroes das outras páginas e a imagem de destaque das notícias
  após publicar as otimizações locais já preparadas.

## Relatórios adicionais recebidos por link

Testes de 02/10/2026, aproximadamente às 22:23, horário de Brasília. Os dados
originais dos relatórios incluem celular e computador, inclusive para Elenco,
cujo link enviado selecionava apenas computador. São medições dessa execução,
não uma garantia de resultados futuros.

| Página | Desempenho celular | Desempenho computador | CLS celular | CLS computador | LCP celular |
| --- | --- | --- | --- | --- | --- |
| Sócios | 98 | 100 | 0 | 0 | 2,4 s |
| Elenco | 92 | 84 | 0,161 | 0,334 | 2,3 s |
| Jogos | 80 | 83 | 0,478 | 0,338 | 1,4 s |

Fontes recebidas:

- [Sócios — celular](https://pagespeed.web.dev/analysis/https-pemarckmann-github-io-site-guarani-socio-html/pkzjlfmpwa?hl=pt-br&form_factor=mobile)
  e [computador](https://pagespeed.web.dev/analysis/https-pemarckmann-github-io-site-guarani-socio-html/pkzjlfmpwa?hl=pt-br&form_factor=desktop).
- [Elenco — relatório compartilhado](https://pagespeed.web.dev/analysis/https-pemarckmann-github-io-site-guarani-elenco-html/z9pq82n2o8?hl=pt-br&form_factor=desktop).
- [Jogos — celular](https://pagespeed.web.dev/analysis/https-pemarckmann-github-io-site-guarani-jogos-html/1uh5ddk6sn?hl=pt-br&form_factor=mobile)
  e [computador](https://pagespeed.web.dev/analysis/https-pemarckmann-github-io-site-guarani-jogos-html/1uh5ddk6sn?hl=pt-br&form_factor=desktop).

### Jogos: prioridade alta

- [ ] Investigar e reduzir o CLS, principalmente no celular. O relatório aponta
  deslocamento da seção de agenda e resultados; no computador, aponta o painel
  de partidas. Isso identifica elementos afetados, sem comprovar isoladamente
  qual alteração os empurrou.
- [ ] Medir a altura inicial e final do destaque da próxima partida e dos
  controles/lista após receber o JSON; planejar reservas de espaço compatíveis
  com cada largura, categoria e estado de carregamento.
- [ ] Reduzir o tamanho dos escudos efetivamente usados na página. O relatório
  estima economia de imagens de 342 KiB no celular e 351 KiB no computador,
  incluindo o escudo do rodapé e os escudos nas partidas. São estimativas do
  Lighthouse, não valores já economizados.

### Elenco: prioridade alta para estabilidade

- [ ] Investigar o deslocamento de `#elenco-lista`, identificado no relatório
  como elemento afetado pelo salto, e o aparecimento dos filtros/contagens
  após carregar o JSON.
- [ ] Conferir o escudo do rodapé: o relatório o lista como possível imagem sem
  tamanho reservado, apesar de o HTML mostrado já conter `width` e `height`.
  Verificar o CSS e reproduzir a medição antes de atribuir a causa à imagem.
- [ ] Investigar os recálculos forçados de layout e a estrutura dos carrosséis,
  preservando o ciclo contínuo e as formas de interação.
- [ ] Avaliar o tamanho do hero, da silhueta e das fotos conforme o uso real.
  Economia estimada de imagens: 201 KiB no celular e 225 KiB no computador.
  Preservar a nitidez das fotos pequenas; não comprimir indiscriminadamente.

### Sócios: prioridade menor

- Não há salto de layout nesse teste: CLS zero nas duas modalidades, desempenho
  98 no celular e 100 no computador. Evitar alterações extensas nessa página.
- [ ] Otimizar escudo e patrocinadores compartilhados. Economia estimada de
  imagens: 265 KiB no celular e 282 KiB no computador.
- [ ] Conferir a descoberta/prioridade do hero, apontada pelo relatório, e as
  requisições de estilos bloqueadoras. Medir o ganho antes de mudar o carregamento.
- A acessibilidade ficou em 95 nas duas modalidades; os alertas de contraste
  incluem descrição dos planos, títulos dos patrocinadores e rodapé. Manter
  essa pendência registrada, respeitando a decisão de não mudar as cores agora.

### Clube: teste precisa ser repetido no endereço correto

O [relatório enviado como Clube](https://pagespeed.web.dev/analysis/https-pemarckmann-github-io-site-guarani-oclube-html/ul3uk4vqkk?hl=pt-br&form_factor=desktop)
testou `oclube.html` e registrou **HTTP 404**, nas duas modalidades. As notas 100
de desempenho e 45 de SEO correspondem à resposta de erro, não à página do clube.

- [ ] Repetir o teste de
  [clube.html](https://pemarckmann.github.io/site-guarani/clube.html).
- Não tratar o `noindex` da página 404 como problema de SEO da página Clube.
  Não remover a configuração da 404 para melhorar esse relatório.

## Investigações adicionais

- [ ] Medir possíveis saltos na Home quando chegam a próxima partida, as
  notícias e o elenco, antes de escolher como reservar espaço.
- [ ] Medir o custo do carrossel: ele mantém uma fileira original e duas cópias
  para o movimento circular. Investigar menos elementos e menos leituras de
  dimensões durante a rolagem, preservando toque, setas, teclado e continuidade.
- [ ] Identificar as requisições apontadas como bloqueadoras de renderização
  antes de mudar a ordem de carregamento dos estilos.
- [ ] Repetir os testes em celular e computador com a mesma versão publicada;
  não atribuir toda variação da nota a uma alteração específica sem comparar
  as métricas.

## Para a AWS

- [ ] Configurar cache adequado de imagens, CSS e JavaScript, com atualização
  segura dos arquivos quando houver novas versões.
- [ ] Definir a política de atualização dos JSONs separadamente dos arquivos
  estáticos, para não manter resultados e notícias antigos no navegador.

## Já preparado localmente

Estas mudanças já existem no workspace e devem ser preservadas:

- Hero da Home com versões WebP para celular e computador: aproximadamente
  92 KB e 186 KB, respectivamente; a imagem anterior tinha 309 KB.
- Preloads do hero condicionados à largura da tela.
- Miniaturas de notícias com variantes de 480 e 960 pixels, seleção responsiva
  e retorno à imagem principal se uma variante falhar.
- Imagem principal preservada na leitura completa da matéria.

Os relatórios do GitHub Pages precisam ser repetidos após a publicação para
avaliar o efeito dessas mudanças. Até esta anotação, elas ainda não foram
commitadas nem publicadas nesta sessão.

## Acessibilidade: pendências registradas, sem implementação autorizada agora

- [ ] Reavaliar os alertas de contraste e textos pequenos sem adotar o vermelho
  mais claro que o usuário rejeitou. Propor uma solução visual antes de alterar.
- [ ] Reavaliar os atributos ARIA apontados como incompatíveis. As correções
  da última revisão também foram desfeitas a pedido do usuário.
- Os alertas de `noscript` e links redundantes precisam de análise contextual;
  não remover recursos úteis somente para reduzir a contagem do relatório.
