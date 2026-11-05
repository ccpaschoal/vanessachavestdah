# Vanessa Chaves · Site

Site da **Vanessa Chaves** (@vanessachaves_tdah), orientadora parental em TDAH e TEA, fonoaudióloga e psicóloga. Identidade visual e site por **Camilla Paschoal** (@camillapaschoal).

## Características

- **Identidade do Instagram**: roxo, amarelo e azul chapados, Montserrat Black em caixa alta, cantos retos
- **Transição de garrafas**: cada seção é uma tela; a atual fica grande no meio e as vizinhas aparecem menores em cima e embaixo
- **Carrosséis de garrafa**: as frases e os posts giram na horizontal (arrastar, setas ou teclado)
- **Títulos letra por letra** ao trocar de tela
- **Responsivo**: no celular, a tela rola por dentro antes de passar para a próxima
- **Acessível**: navegação por teclado, textos alternativos e respeito a "reduzir movimento"

## Estrutura

```
vanessachaves-site/
├── index.html          # conteúdo do site
├── styles/style.css    # cores, fontes e layout
├── scripts/app.js      # transição de garrafas e carrosséis
├── assets/img/         # fotos, logo, capas dos carrosséis, favicon
├── netlify.toml        # configuração do Netlify
└── README.md
```

## Modificações rápidas

**Cores** (`styles/style.css`, bloco `:root` no topo):
```css
--roxo: #AB71D5;
--amarelo: #FFD002;
--azul: #52A0E9;
--fundo: #E9E6EC;   /* fundo atrás das telas */
```

**Trocar a transição** (`scripts/app.js`, procure `const amostra`):
- `'a'` clássica · `'b'` empilhada · `'c'` inclinada

**Contato**: todos os botões abrem o direct do Instagram (`https://ig.me/m/vanessachaves_tdah`). Para usar WhatsApp, troque esse link no `index.html` por `https://wa.me/55DDDNUMERO`.

**Novo carrossel na seção Conteúdos**: coloque a capa em `assets/img/` (quadrada, 640 px) e copie uma linha `<a class="cf-item" ...>` no `index.html`.

**Depois de mudar CSS ou JS**: troque o `?v=` no `index.html` (ex.: `20261104a` → `20261104b`) para o navegador não mostrar a versão antiga.

## Publicar no Netlify

**Jeito rápido (arrastar a pasta):**
1. Entre em https://app.netlify.com/drop
2. Arraste a pasta `vanessachaves-site` inteira para a página
3. O site fica no ar num endereço `....netlify.app` (dá para renomear em *Site configuration → Change site name*)

**Pelo GitHub (atualiza sozinho a cada mudança):**
1. Crie um repositório no GitHub e envie esta pasta (pelo GitHub Desktop: *Add → Add existing repository*)
2. No Netlify: *Add new site → Import an existing project → GitHub* e escolha o repositório
3. Deixe *Build command* vazio e *Publish directory* como `.`

**Domínio próprio** (ex.: vanessachaves.com.br): *Domain management → Add a domain* no Netlify.

---

**Data**: Novembro 2026 · **Criado por**: Claude com Camilla Paschoal
