# Imagens do site

- `otimizadas/`: versões para exibição no site; fotos de cabeçalho em `heroes/`.
- `originais/`: fotos, escudos, ícones e patrocinadores preservados antes da otimização.
- `coletadas/`: arquivos do scraper. Copie junto com o JSON, preservando os caminhos.
- `competicoes/`: catálogo completo de marcas da FGF, com originais e variantes.

Os originais não são carregados pelas páginas. Ao editar uma imagem, gere novamente
a versão usada pelo site; mantenha proporções, transparência e dimensões declaradas
no HTML ou JSON. WebP é usado para fotos e logos, com PNG no favicon.

Os escudos escolhidos pelo clube continuam em `otimizadas/` e têm prioridade no
cadastro `escudosLocais` de `js/desempenho.js`. O catálogo de competições foi
preservado para categorias futuras; não exclua arquivos apenas porque não são
exibidos nas categorias atuais.
