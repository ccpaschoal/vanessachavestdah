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
├── sitemap.xml         # URL canônica pública
├── .env.example        # explica a ausência de variáveis obrigatórias
└── README.md
```

## Modificações rápidas

**Cores** (`styles/style.css`, bloco `:root` no topo):
```css
--roxo: #954CCA;   /* tom da marca ajustado para contraste WCAG AA */
--amarelo: #FFD002;
--azul: #1A78CF;   /* tom da marca ajustado para contraste WCAG AA */
--fundo: #E9E6EC;   /* fundo atrás das telas */
```

**Trocar a transição** (`scripts/app.js`, procure `const amostra`):
- `'a'` clássica · `'b'` empilhada · `'c'` inclinada

**Contato**: todos os botões abrem o direct do Instagram (`https://ig.me/m/vanessachaves_tdah`). Para usar WhatsApp, troque esse link no `index.html` por `https://wa.me/55DDDNUMERO`.

**Novo carrossel na seção Conteúdos**: coloque a capa em `assets/img/` (quadrada, 640 px) e copie uma linha `<a class="cf-item" ...>` no `index.html`.

**Depois de mudar CSS ou JS**: troque o `?v=` no `index.html` (ex.: `20261104a` → `20261104b`) para o navegador não mostrar a versão antiga.

## Publicar no Netlify

O site atual está no GitHub Pages: `https://ccpaschoal.github.io/vanessachavestdah/`.
O arquivo `netlify.toml` é apenas uma configuração opcional para uma futura migração.

**Jeito rápido (arrastar somente arquivos públicos):**
1. Entre em https://app.netlify.com/drop
2. Prepare uma pasta separada contendo somente `index.html`, `styles/`, `scripts/`, `assets/`, `sitemap.xml` e `netlify.toml`; arraste essa cópia para a página. Nunca inclua `.git`, `.env`, backups, logs ou credenciais locais.
3. O site fica no ar num endereço `....netlify.app` (dá para renomear em *Site configuration → Change site name*)

**Pelo GitHub (atualiza sozinho a cada mudança):**
1. Crie um repositório no GitHub e envie esta pasta (pelo GitHub Desktop: *Add → Add existing repository*)
2. No Netlify: *Add new site → Import an existing project → GitHub* e escolha o repositório
3. Deixe *Build command* vazio e *Publish directory* como `.`

**Domínio próprio** (ex.: vanessachaves.com.br): *Domain management → Add a domain* no Netlify.

Em uma migração, atualize canonical, Open Graph, dados estruturados e sitemap juntos.
O `robots.txt` efetivo é o da raiz do domínio; um arquivo dentro de
`/vanessachavestdah/` não controla os buscadores. O sitemap pode ser informado
ao Search Console ou ao `robots.txt` da raiz, com acesso do responsável pelo domínio.

## Configurações e segurança

HTML, CSS e JavaScript puros, sem framework, dependências de produção, build,
backend, autenticação ou APIs. Os links de Instagram são navegação pública.
Não há variáveis de ambiente ou chaves a cadastrar na produção. O `.env.example`
contém somente instruções; não crie variáveis fictícias ou um `.env` sem finalidade.

Conteúdo/contatos ficam em `index.html`; tokens visuais em `:root` de
`styles/style.css`; configurações de interação em `scripts/app.js`.
Não há armazenamento de tokens no navegador. Nunca coloque segredos no frontend,
URLs ou logs: uma variável substituída no build também fica pública.
Uma integração futura com credencial privada exigirá execução no servidor e
permissões mínimas; não há motivo para criar esse servidor antecipadamente.

O `.gitignore` evita versionar `.env` e variantes, preservando `.env.example`.
Isso não controla acesso HTTP: o bloqueio adicional em `netlify.toml` só vale
na Netlify, e não substitui a exclusão de arquivos privados da pasta publicada.
Remover uma credencial vazada do código não resolve o vazamento anterior:
avalie revogação/rotação no serviço com autorização do responsável.

Para visualizar localmente, abra `index.html` ou use:

```powershell
python -m http.server 8000 --bind 127.0.0.1
node --check scripts/app.js
```

O servidor Python serve a pasta inteira, inclusive metadados Git; use-o apenas
em `localhost` e não exponha essa porta à rede. Não há lint/build configurados.
Os testes de navegador compartilhados ficam em `Desktop/6 - TESTES E2E`:

```powershell
npx.cmd --no-install playwright test estaticos.spec.js --grep "Vanessa"
```

Revise teclado, movimento reduzido e leitor de tela além dos testes automáticos.
Em novembro de 2026, a auditoria local por padrões de segredo cobriu 9 commits e
24 versões textuais sem encontrar correspondências; isso não certifica referências
remotas ou arquivos binários. Foram corrigidas a troca de telas ao alterar o fragmento
da URL e a inicialização com fragmentos malformados, sem mudar conteúdo ou identidade visual.

---

**Data**: Novembro 2026 · **Criado por**: Claude com Camilla Paschoal
