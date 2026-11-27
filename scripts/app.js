/* Vanessa Chaves · seções de tela cheia que sobem uma sobre a outra, títulos animados e carrossel de posts.
   Sem JavaScript o site continua funcionando: as seções ficam uma embaixo da outra. */
(() => {
  const root = document.documentElement;
  root.classList.add('js');
  const reduz = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Medidas do carrossel: o item da frente no meio, os vizinhos menores atrás */
  const CARROSSEL = { dist: [0, .56, .98, 1.3], escala: [1, .74, .56, .44], opac: [1, .92, .6, 0], brilho: [1, .72, .58, .5] };
  const renders = [];
  const pad2 = (n) => String(n).padStart(2, '0');

  /* ── Títulos letra por letra ──
     O texto inteiro fica num span invisível para leitores de tela; as letras animadas ficam escondidas deles. */
  document.querySelectorAll('.split').forEach((el) => {
    let c = 0;
    const leitor = document.createElement('span');
    leitor.className = 'sr-only';
    leitor.textContent = el.textContent.replace(/\s+/g, ' ').trim();
    const walk = (node) => {
      [...node.childNodes].forEach((n) => {
        if (n.nodeType === Node.TEXT_NODE) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach((part) => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.append(' '); return; }
            const w = document.createElement('span');
            w.className = 'palavra-t';
            [...part].forEach((ch) => {
              const s = document.createElement('span');
              s.className = 'ch';
              s.textContent = ch;
              s.style.setProperty('--c', c++);
              w.append(s);
            });
            frag.append(w);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === Node.ELEMENT_NODE) {
          n.setAttribute('aria-hidden', 'true');
          walk(n);
        }
      });
    };
    walk(el);
    el.querySelectorAll(':scope > .palavra-t').forEach((w) => w.setAttribute('aria-hidden', 'true'));
    el.prepend(leitor);
    el.classList.add('is-split');
  });

  /* ── Carrossel horizontal ── */
  const seta = (dir) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'cf-btn';
    b.setAttribute('aria-label', dir < 0 ? 'Anterior' : 'Próximo');
    b.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" aria-hidden="true"><path d="${dir < 0 ? 'm15 18-6-6 6-6' : 'm9 18 6-6-6-6'}"/></svg>`;
    return b;
  };

  document.querySelectorAll('.cf').forEach((cf) => {
    const rail = cf.querySelector('.cf-rail');
    if (!rail) return; // carrossel sem faixa: ignora em vez de parar o script inteiro
    const items = [...rail.querySelectorAll('.cf-item')];
    if (!items.length) return;
    cf.setAttribute('role', 'region');
    cf.setAttribute('aria-roledescription', 'carrossel');

    if (cf.dataset.fundo) {
      const f = document.createElement('span');
      f.className = 'cf-fundo';
      f.setAttribute('aria-hidden', 'true');
      f.textContent = cf.dataset.fundo;
      cf.prepend(f);
    }
    const rod = document.createElement('div');
    rod.className = 'cf-rodape';
    const prev = seta(-1), next = seta(1);
    const conta = document.createElement('span');
    conta.className = 'cf-conta';
    conta.setAttribute('aria-live', 'polite');
    const barra = document.createElement('span');
    barra.className = 'cf-barra';
    barra.setAttribute('aria-hidden', 'true');
    barra.append(document.createElement('span'));
    rod.append(prev, conta, barra, next);
    cf.append(rod);

    let atual = Math.min(items.length - 1, Number(cf.dataset.inicio ?? Math.floor((items.length - 1) / 2)));
    let arrastou = false;

    // Medidas lidas só no início, no resize e no load (ler medida a cada arrasto força o navegador a recalcular o layout)
    let size = 0, alturaRail = 0;
    const medir = () => { size = items[0].offsetWidth; alturaRail = Math.max(...items.map((i) => i.offsetHeight)) + 16; };
    const render = () => {
      rail.style.height = `${alturaRail}px`;
      items.forEach((item, i) => {
        const d = i - atual, ad = Math.min(Math.abs(d), 3);
        const x = Math.sign(d) * CARROSSEL.dist[ad] * size;
        item.style.transform = `translateX(${x.toFixed(1)}px) scale(${CARROSSEL.escala[ad]})`;
        item.style.opacity = CARROSSEL.opac[ad];
        item.style.filter = ad ? `brightness(${CARROSSEL.brilho[ad]})` : 'none';
        item.style.zIndex = 10 - ad;
        item.style.visibility = Math.abs(d) > 3 ? 'hidden' : 'visible';
        item.setAttribute('aria-hidden', String(d !== 0)); // leitor de tela lê só o item da frente
        item.tabIndex = d === 0 ? 0 : -1; // os itens são links: só o da frente recebe o Tab
      });
      conta.textContent = `${pad2(atual + 1)} / ${pad2(items.length)}`;
      barra.style.setProperty('--cf-p', `${((atual + 1) / items.length) * 100}%`);
      // aria-disabled em vez de disabled: o botão desativado continua com o foco (senão o foco cai no body)
      prev.setAttribute('aria-disabled', String(atual === 0));
      next.setAttribute('aria-disabled', String(atual === items.length - 1));
    };
    const go = (i) => { atual = Math.max(0, Math.min(items.length - 1, i)); render(); };

    prev.addEventListener('click', () => { if (atual > 0) go(atual - 1); });
    next.addEventListener('click', () => { if (atual < items.length - 1) go(atual + 1); });
    items.forEach((item, i) => item.addEventListener('click', (e) => {
      if (arrastou || i !== atual) e.preventDefault();
      if (!arrastou && i !== atual) go(i);
    }));
    cf.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') { e.preventDefault(); go(atual - 1); }
      if (e.key === 'ArrowRight') { e.preventDefault(); go(atual + 1); }
    });

    // Arrastar com mouse ou dedo
    let x0 = null, y0 = null;
    rail.addEventListener('pointerdown', (e) => {
      if (e.button !== 0) return;
      x0 = e.clientX; y0 = e.clientY; arrastou = false;
    });
    rail.addEventListener('pointermove', (e) => {
      if (x0 === null) return;
      const dx = e.clientX - x0;
      if (Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(e.clientY - y0)) { arrastou = true; rail.classList.add('is-arrastando'); }
      if (arrastou && Math.abs(dx) > size * .4) { go(atual + (dx < 0 ? 1 : -1)); x0 = e.clientX; }
    });
    const solta = () => {
      x0 = null;
      rail.classList.remove('is-arrastando');
      setTimeout(() => { arrastou = false; }, 0);
    };
    ['pointerup', 'pointercancel', 'pointerleave'].forEach((ev) => rail.addEventListener(ev, solta));

    renders.push(() => { medir(); render(); });
    medir();
    render();
  });

  /* ── Seções empilhadas ──
     No computador cada seção gruda na tela (sticky) e a próxima sobe por cima, enquanto a de baixo
     encolhe e some. No celular, ou com "reduzir movimento", é só uma seção embaixo da outra. */
  const secoes = [...document.querySelectorAll('.screen')];
  const topo = document.querySelector('.topo');
  const contador = document.getElementById('contador');
  const main = document.querySelector('main');
  if (!secoes.length || !topo || !main) return;
  const largo = matchMedia('(min-width: 901px) and (min-height: 500px)');
  let atual = -1;

  const empilhada = () => root.classList.contains('empilha');
  // Posição de rolagem em que a seção começa (soma das alturas: o sticky não atrapalha a conta)
  const inicioDe = (i) => secoes.slice(0, i).reduce((y, t) => y + t.offsetHeight,
    empilhada() ? main.offsetTop : main.offsetTop + parseFloat(getComputedStyle(main).paddingTop) - topo.offsetHeight);

  const marca = () => {
    const vh = window.innerHeight;
    const caixas = secoes.map((t) => t.getBoundingClientRect()); // todas as leituras antes das escritas
    let i = 0;
    caixas.forEach((c, n) => {
      if (c.top <= vh / 2) i = n;
      if (c.top < vh * .85) secoes[n].classList.add('is-visto'); // anima títulos e blocos na primeira vez
      // quanto a seção seguinte já cobriu esta (0 a 1)
      const prox = caixas[n + 1];
      const saida = empilhada() && prox ? Math.min(1, Math.max(0, 1 - prox.top / vh)) : 0;
      secoes[n].style.setProperty('--saida', saida.toFixed(3));
    });
    if (window.scrollY + vh >= document.documentElement.scrollHeight - 2) i = secoes.length - 1;
    if (i === atual) return;
    const primeira = atual < 0;
    atual = i;
    secoes.forEach((t, n) => t.classList.toggle('is-current', n === i));
    const id = secoes[i].id;
    document.querySelectorAll('.nav a.link').forEach((l) => {
      const ativo = !!id && l.getAttribute('href') === `#${id}`;
      l.classList.toggle('is-ativo', ativo);
      if (ativo) l.setAttribute('aria-current', 'true'); else l.removeAttribute('aria-current');
    });
    topo.style.setProperty('--progresso', (i / (secoes.length - 1)).toFixed(4));
    if (contador) contador.textContent = `${pad2(i + 1)} / ${pad2(secoes.length)}`;
    // O endereço acompanha a seção (dá para copiar o link)
    if (!primeira) try { history.replaceState(null, '', id ? `#${id}` : location.pathname + location.search); } catch { /* ok */ }
  };

  const vai = (i, suave = !reduz) => window.scrollTo({ top: Math.max(0, inicioDe(i)), behavior: suave ? 'smooth' : 'instant' });
  const indiceDe = (id) => {
    const alvo = id ? document.getElementById(id) : null;
    return alvo ? secoes.indexOf(alvo.closest('.screen')) : -1;
  };
  const indiceDoHash = () => {
    try { return indiceDe(decodeURIComponent(location.hash.slice(1))); } catch { return -1; }
  };

  // Links internos: o salto nativo não funciona com seção grudada (ela já está no topo)
  document.querySelectorAll('a[href^="#"]:not(.pular)').forEach((a) => a.addEventListener('click', (e) => {
    const i = indiceDe(a.getAttribute('href').slice(1));
    if (i < 0) return;
    e.preventDefault();
    vai(i);
  }));
  // Navegando com Tab: se o foco cair numa seção coberta, ela volta para a frente
  document.addEventListener('focusin', (e) => {
    const i = secoes.findIndex((t) => t.contains(e.target));
    if (empilhada() && i >= 0 && i !== atual) vai(i, false);
  });

  // Seção mais alta que a janela rola inteira antes de grudar (top negativo), para nada ficar cortado
  const ajusta = () => {
    root.classList.toggle('empilha', largo.matches && !reduz);
    secoes.forEach((t) => { t.style.top = empilhada() ? `${Math.min(0, window.innerHeight - t.offsetHeight)}px` : ''; });
    renders.forEach((r) => r());
    marca();
  };

  let raf = 0;
  window.addEventListener('scroll', () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(marca); }, { passive: true });
  window.addEventListener('resize', ajusta);
  window.addEventListener('hashchange', () => { const i = indiceDoHash(); if (i >= 0) vai(i); });
  // Link de fora com #secao abre direto na seção certa
  window.addEventListener('load', () => { ajusta(); const i = indiceDoHash(); if (i >= 0) vai(i, false); });
  ajusta();
})();
