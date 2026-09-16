/* VABS Company — animação de entrada (títulos, seções e cascatas) */
window.VabsUI = (() => {
  'use strict';

  const semMovimento = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- observador único ---------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add('is-in');
      io.unobserve(e.target);
    });
  }, { rootMargin: '0px 0px -10% 0px', threshold: .1 });

  const SELETOR = '.rv, .pain, .tl__item, .vabs__row, .casc, .anim-t, [data-chart]';

  /* ---------- títulos: uma palavra de cada vez ---------- */
  function animarTitulo(el, passo = 42) {
    if (el.dataset.split) return;
    el.dataset.split = '1';

    let i = 0;
    const percorrer = (no) => {
      [...no.childNodes].forEach((filho) => {
        if (filho.nodeType === Node.TEXT_NODE) {
          const frag = document.createDocumentFragment();
          filho.textContent.split(/(\s+)/).forEach((token) => {
            if (!token) return;
            if (!token.trim()) { frag.append(token); return; }
            const caixa = document.createElement('span');
            caixa.className = 'w';
            const palavra = document.createElement('span');
            palavra.textContent = token;
            palavra.style.transitionDelay = (i++ * passo) + 'ms';
            caixa.append(palavra);
            frag.append(caixa);
          });
          filho.replaceWith(frag);
        } else if (filho.nodeType === Node.ELEMENT_NODE && filho.tagName !== 'BR') {
          percorrer(filho);
        }
      });
    };

    percorrer(el);
    el.classList.add('anim-t');
  }

  /* ---------- cascata: filhos entram em sequência ---------- */
  function cascata(el, passo = 90) {
    el.classList.add('casc');
    [...el.children].forEach((filho, i) => {
      filho.style.transitionDelay = (i * passo) + 'ms';
    });
  }

  /* ---------- header dynamic island ---------- */
  function ilha() {
    const nav = document.querySelector('.nav');
    if (!nav) return;
    let ultimo = null;
    const aplicar = () => {
      const encolher = scrollY > 40;
      if (encolher !== ultimo) {
        nav.classList.toggle('is-shrunk', encolher);
        ultimo = encolher;
      }
    };
    addEventListener('scroll', () => requestAnimationFrame(aplicar), { passive: true });
    aplicar();
  }

  /* ---------- pop-up de imagem (lightbox) ---------- */
  let lb = null;
  function abrirLightbox(fotos, i) {
    if (!lb) {
      lb = document.createElement('dialog');
      lb.className = 'lb';
      lb.innerHTML = `
        <button class="lb__x" data-lb-fechar aria-label="Fechar">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
        </button>
        <figure class="lb__fig"><img alt=""></figure>
        <p class="lb__cap"><span data-lb-pos></span></p>
        <button class="lb__btn lb__prev" data-lb-prev aria-label="Foto anterior">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>
        </button>
        <button class="lb__btn lb__next" data-lb-next aria-label="Próxima foto">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
        </button>`;
      document.body.append(lb);

      lb.addEventListener('click', (ev) => {
        if (ev.target === lb || ev.target.closest('[data-lb-fechar]')) { lb.close(); return; }
        if (ev.target.closest('[data-lb-prev]')) mover(-1);
        if (ev.target.closest('[data-lb-next]')) mover(1);
      });
      addEventListener('keydown', (ev) => {
        if (!lb.open) return;
        if (ev.key === 'ArrowLeft') mover(-1);
        if (ev.key === 'ArrowRight') mover(1);
      });
    }

    const img = lb.querySelector('img');
    const pos = lb.querySelector('[data-lb-pos]');

    const mostrar = () => {
      img.src = lb._fotos[lb._i].src;
      img.alt = lb._fotos[lb._i].alt;
      pos.textContent = `${lb._i + 1} de ${lb._fotos.length}`;
    };
    const mover = (d) => {
      lb._i = (lb._i + d + lb._fotos.length) % lb._fotos.length;
      mostrar();
    };

    lb._fotos = fotos;
    lb._i = i;
    mostrar();
    if (!lb.open) lb.showModal();
  }

  /* ---------- carrossel infinito (setas, bolinhas e pop-up) ---------- */
  function carrossel(trilho) {
    const secao = trilho.closest('section') || document;
    const prev = secao.querySelector('[data-carousel-prev]');
    const next = secao.querySelector('[data-carousel-next]');
    const dots = secao.querySelector('[data-carousel-dots]');
    const originais = [...trilho.children];
    const n = originais.length;
    if (!n) return;

    /* as fotos que o pop-up navega (sem os clones) */
    const fotos = originais.map((el) => {
      const img = el.querySelector('img');
      return { src: img.src, alt: img.alt };
    });

    /* loop: um bloco de clones antes e outro depois */
    const clonar = (destino) => originais.forEach((el) => {
      const c = el.cloneNode(true);
      c.dataset.clone = '1';
      c.setAttribute('aria-hidden', 'true');
      destino(c);
    });
    clonar((c) => trilho.insertBefore(c, originais[0]));
    clonar((c) => trilho.append(c));

    const itens = [...trilho.children];
    const origem = (el) => el.offsetLeft - itens[0].offsetLeft;
    const bloco = () => origem(originais[0]);
    const passo = () => (origem(itens[1]) || originais[0].getBoundingClientRect().width);

    const semAnimacao = (fn) => {
      const antes = trilho.style.scrollBehavior;
      trilho.style.scrollBehavior = 'auto';
      fn();
      trilho.offsetHeight;                      // força o reflow antes de devolver
      trilho.style.scrollBehavior = antes;
    };

    const indice = () => Math.round(trilho.scrollLeft / (passo() || 1));
    const irPara = (i) => trilho.scrollTo({
      left: origem(itens[Math.min(Math.max(i, 0), itens.length - 1)]),
      behavior: semMovimento ? 'auto' : 'smooth'
    });

    /* volta ao bloco do meio quando passa de um extremo */
    const normalizar = () => {
      const b = bloco();
      if (!b) return;
      if (trilho.scrollLeft < b * 0.5) semAnimacao(() => { trilho.scrollLeft += b; });
      else if (trilho.scrollLeft > b * 1.5) semAnimacao(() => { trilho.scrollLeft -= b; });
    };

    if (dots) {
      dots.innerHTML = originais.map((_, i) =>
        `<button type="button" aria-label="Ir para a foto ${i + 1}" data-i="${i}"></button>`).join('');
      dots.addEventListener('click', (ev) => {
        const b = ev.target.closest('button');
        if (b) irPara(n + Number(b.dataset.i));
      });
    }

    const sincronizar = () => {
      normalizar();
      if (!dots) return;
      const i = ((indice() - n) % n + n) % n;
      [...dots.children].forEach((b, k) => b.setAttribute('aria-current', String(k === i)));
    };

    prev?.addEventListener('click', () => irPara(indice() - 1));
    next?.addEventListener('click', () => irPara(indice() + 1));
    trilho.addEventListener('scroll', () => requestAnimationFrame(sincronizar), { passive: true });
    addEventListener('resize', () => requestAnimationFrame(sincronizar));

    /* clique abre a foto em pop-up */
    trilho.addEventListener('click', (ev) => {
      const item = ev.target.closest('.gal4__item');
      if (item) abrirLightbox(fotos, itens.indexOf(item) % n);
    });
    itens.forEach((el, k) => {
      if (el.dataset.clone) return;
      el.tabIndex = 0;
      el.setAttribute('role', 'button');
      el.addEventListener('keydown', (ev) => {
        if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); abrirLightbox(fotos, k % n); }
      });
    });

    /* começa no bloco do meio */
    requestAnimationFrame(() => {
      semAnimacao(() => { trilho.scrollLeft = bloco(); });
      sincronizar();
    });
  }

  /* ---------- card 3D conforme a rolagem ----------
     mesmo efeito do ContainerScroll (rotateX 20°→0°, escala e parallax do texto),
     escrito sem React: um único rAF ligado ao scroll. */
  function cardScroll() {
    const palcos = [...document.querySelectorAll('[data-scroll-card]')];
    if (!palcos.length || semMovimento) return;

    const texto = document.querySelector('.hero__in');
    let pendente = false;

    const desenhar = () => {
      pendente = false;
      const vh = innerHeight;
      const mobile = innerWidth <= 768;
      const [s0, s1] = mobile ? [0.82, 0.96] : [1.05, 1];

      palcos.forEach((palco) => {
        const card = palco.querySelector('.panel-shell');
        if (!card) return;
        const r = palco.getBoundingClientRect();
        // 0 quando o topo do palco encosta na base da tela, 1 quando termina de subir
        const bruto = (vh - r.top) / (vh * 0.85 + r.height * 0.15);
        const p = Math.min(Math.max(bruto, 0), 1);
        const suave = 1 - Math.pow(1 - p, 3);

        card.style.transform =
          `rotateX(${(20 * (1 - suave)).toFixed(2)}deg) scale(${(s0 + (s1 - s0) * suave).toFixed(4)})`;

        if (texto && !mobile) {
          texto.style.transform = `translateY(${(-56 * suave).toFixed(1)}px)`;
          texto.style.opacity = (1 - suave * 0.35).toFixed(3);
        }
      });
    };

    const agendar = () => {
      if (pendente) return;
      pendente = true;
      requestAnimationFrame(desenhar);
    };

    addEventListener('scroll', agendar, { passive: true });
    addEventListener('resize', agendar);
    desenhar();
  }

  /* ---------- acende a seção em que estamos ---------- */
  function scrollspy() {
    const links = [...document.querySelectorAll('.nav__menu a[href^="#"]')];
    if (!links.length) return;

    const alvos = links
      .map((a) => ({ a, sec: document.querySelector(a.getAttribute('href')) }))
      .filter((x) => x.sec);
    if (!alvos.length) return;

    let atual = null;
    const acender = (a) => {
      if (atual === a) return;
      links.forEach((l) => l.classList.toggle('is-here', l === a));
      atual = a;
    };

    const spy = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        const item = alvos.find((x) => x.sec === e.target);
        item.visivel = e.isIntersecting ? e.intersectionRatio : 0;
      });
      const acesa = alvos.filter((x) => x.visivel).sort((a, b) => b.visivel - a.visivel)[0];
      acender(acesa ? acesa.a : null);
    }, { rootMargin: '-45% 0px -45% 0px', threshold: [0, .01, .5, 1] });

    alvos.forEach((x) => spy.observe(x.sec));
  }

  /* ---------- inicialização ---------- */
  function init(raiz = document) {
    if (!semMovimento) {
      raiz.querySelectorAll('[data-anim-title], .h-xl, .h-lg').forEach((h) => animarTitulo(h));
      raiz.querySelectorAll('[data-cascade]').forEach((el) => {
        cascata(el, Number(el.dataset.cascade) || 90);
      });
    }
    raiz.querySelectorAll('[data-carousel]').forEach(carrossel);
    raiz.querySelectorAll(SELETOR).forEach((el) => io.observe(el));
  }

  ilha();
  scrollspy();
  cardScroll();

  return { init, animarTitulo, cascata, carrossel, abrirLightbox, observar: (el) => io.observe(el), semMovimento };
})();
