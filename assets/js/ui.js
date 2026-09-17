/* VABS Company · animação de entrada (títulos, seções e cascatas) */
window.VabsUI = (() => {
  'use strict';

  const semMovimento = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Um único frame atende todos os efeitos ligados ao scroll da janela. */
  const tarefasDeScroll = new Set();
  let quadroDeScroll = 0;
  const executarScroll = () => {
    quadroDeScroll = 0;
    tarefasDeScroll.forEach((tarefa) => tarefa());
  };
  const agendarScroll = () => {
    if (!quadroDeScroll) quadroDeScroll = requestAnimationFrame(executarScroll);
  };
  addEventListener('scroll', agendarScroll, { passive: true });
  const aoRolar = (tarefa) => tarefasDeScroll.add(tarefa);

  /* ---------- observador único ---------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add('is-in');
      io.unobserve(e.target);
    });
  }, { rootMargin: '0px 0px -7% 0px', threshold: .08 });

  const SELETOR = '.rv, .pain, .tl, .tl__item, .vabs__row, .casc, .anim-t, [data-chart]';

  /* ---------- títulos: uma palavra de cada vez ---------- */
  function animarTitulo(el, passo = 30) {
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
    aoRolar(aplicar);
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

  /* ---------- grade de imagens que abre no pop-up ---------- */
  function grupoLightbox(grade) {
    const figuras = [...grade.querySelectorAll('figure')];
    const fotos = figuras.map((f) => {
      const img = f.querySelector('img');
      return { src: img.currentSrc || img.src, alt: img.alt || '' };
    });
    if (!fotos.length) return;

    figuras.forEach((f, i) => {
      f.tabIndex = 0;
      f.setAttribute('role', 'button');
      f.setAttribute('aria-label', `Ampliar imagem ${i + 1} de ${fotos.length}`);
      f.addEventListener('click', () => abrirLightbox(fotos, i));
      f.addEventListener('keydown', (ev) => {
        if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); abrirLightbox(fotos, i); }
      });
    });
  }

  /* ---------- carrossel infinito de verdade ----------
     O trilho guarda 3 blocos iguais (1 antes, o real, 1 depois) e a cada
     rolagem volta para o bloco do meio. Como o salto é de exatamente um
     bloco, o conteúdo sob o dedo é o mesmo pixel: não há começo nem fim,
     nem para as setas, nem para o arrasto, nem para a rolagem por inércia. */
  function carrossel(trilho) {
    const secao = trilho.closest('section') || document;
    const prev = secao.querySelector('[data-carousel-prev]');
    const next = secao.querySelector('[data-carousel-next]');
    const dots = secao.querySelector('[data-carousel-dots]');
    const originais = [...trilho.children];
    const n = originais.length;
    if (!n) return;

    const ANTES = 1, DEPOIS = 1;            // um bloco de segurança de cada lado

    /* as fotos que o pop-up navega (sem os clones) */
    const fotos = originais.map((el) => {
      const img = el.querySelector('img');
      return { src: img.src, alt: img.alt };
    });

    /* degrau da cascata, preso ao índice real: o clone repete o degrau do original */
    const degrau = (k) => Math.round(22 * Math.sin(Math.PI * (k % n) / (n - 1 || 1)));
    originais.forEach((el, k) => el.style.setProperty('--step', degrau(k) + 'px'));

    /* blocos de clones antes e depois.
       Cada bloco é montado em um fragmento e inserido de uma vez: inserir
       item a item antes do firstChild inverteria a ordem do bloco, e a
       última foto do bloco anterior cairia colada na primeira do seguinte. */
    const blocoNovo = () => {
      const frag = document.createDocumentFragment();
      originais.forEach((el, k) => {
        const c = el.cloneNode(true);
        c.dataset.clone = '1';
        c.setAttribute('aria-hidden', 'true');
        c.removeAttribute('id');
        c.style.setProperty('--step', degrau(k) + 'px');
        frag.append(c);
      });
      return frag;
    };
    const primeiroOriginal = originais[0];
    for (let b = 0; b < ANTES; b++) trilho.insertBefore(blocoNovo(), trilho.firstChild);
    for (let b = 0; b < DEPOIS; b++) trilho.append(blocoNovo());
    void primeiroOriginal;

    const itens = [...trilho.children];
    const origem = (el) => el.offsetLeft - itens[0].offsetLeft;
    const larguraBloco = () => origem(itens[n]) || 1;
    const passo = () => origem(itens[1]) || originais[0].getBoundingClientRect().width || 1;
    const inicio = () => origem(itens[n * ANTES]);

    let travaScroll = 0;                     // rolagem suave em andamento

    const semAnimacao = (fn) => {
      const antes = trilho.style.scrollBehavior;
      trilho.style.scrollBehavior = 'auto';
      fn();
      trilho.offsetHeight;                   // força o reflow antes de devolver
      trilho.style.scrollBehavior = antes;
    };

    /* traz a rolagem de volta ao bloco do meio, quantos blocos forem precisos */
    const rebase = () => {
      const L = larguraBloco(), meio = inicio();
      if (L < 2) return;
      const d = trilho.scrollLeft - meio;
      if (Math.abs(d) < L * 0.5) return;
      const voltas = Math.round(d / L);
      semAnimacao(() => { trilho.scrollLeft -= voltas * L; });
    };

    const indice = () => Math.round(trilho.scrollLeft / passo());

    /* Rebase ANTES de andar, sempre. Assim o alvo nunca sai dos blocos
       clonados, por mais rápido que o usuário clique: cada avanço parte
       do bloco do meio e no máximo um item o ultrapassa. */
    const andarPara = (alvoIndice) => {
      rebase();
      const i = Math.min(Math.max(alvoIndice(), 0), itens.length - 1);
      const alvo = origem(itens[i]);
      if (semMovimento) { semAnimacao(() => { trilho.scrollLeft = alvo; }); sincronizar(); return; }
      travaScroll++;
      trilho.scrollTo({ left: alvo, behavior: 'smooth' });
      clearTimeout(andarPara._t);
      andarPara._t = setTimeout(() => { travaScroll = 0; rebase(); sincronizar(); }, 700);
    };
    const andar = (d) => andarPara(() => indice() + d);
    const irPara = (i) => andarPara(() => n * ANTES + i);

    if (dots) {
      dots.innerHTML = originais.map((_, i) =>
        `<button type="button" aria-label="Ir para a foto ${i + 1}" data-i="${i}"></button>`).join('');
      dots.addEventListener('click', (ev) => {
        const b = ev.target.closest('button');
        if (b) irPara(Number(b.dataset.i));
      });
    }

    function sincronizar() {
      if (!dots) return;
      const i = ((indice() % n) + n) % n;
      [...dots.children].forEach((b, k) => b.setAttribute('aria-current', String(k === i)));
    }

    prev?.addEventListener('click', () => andar(-1));
    next?.addEventListener('click', () => andar(1));

    /* durante o arrasto e a inércia a normalização é imediata: o salto cai
       em cima de um item idêntico, então o olho não vê corte */
    trilho.addEventListener('scroll', () => requestAnimationFrame(() => {
      if (!travaScroll) rebase();
      sincronizar();
    }), { passive: true });
    addEventListener('resize', () => requestAnimationFrame(() => {
      semAnimacao(() => { trilho.scrollLeft = inicio(); });
      sincronizar();
    }));

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

    /* começa no bloco do meio, já com as imagens medidas */
    const assentar = () => { semAnimacao(() => { trilho.scrollLeft = inicio(); }); sincronizar(); };
    requestAnimationFrame(assentar);
    addEventListener('load', assentar);
  }

  /* ---------- card 3D conforme a rolagem ----------
     mesmo efeito do ContainerScroll (rotateX 20°→0°, escala e parallax do texto),
     escrito sem React: um único rAF ligado ao scroll. */
  function cardScroll() {
    const palcos = [...document.querySelectorAll('[data-scroll-card]')];
    const raiz = document.documentElement;
    const fundo = document.querySelector('.hero__bg');
    const hero = fundo?.closest('.hero');
    const temProgresso = !!document.querySelector('.prog');
    if (!palcos.length && !temProgresso) return;

    const texto = document.querySelector('.hero__in');
    const estados = new WeakMap();
    let ultimoProgresso = '', ultimoParallax = '', ultimoTexto = '';

    const desenhar = () => {
      const vh = innerHeight;

      /* fio de progresso: quanto da página já passou */
      if (temProgresso) {
        const max = Math.max(1, raiz.scrollHeight - vh);
        const valor = Math.min(1, Math.max(0, scrollY / max)).toFixed(4);
        if (valor !== ultimoProgresso) {
          ultimoProgresso = valor;
          raiz.style.setProperty('--sp', valor);
        }
      }
      /* a foto do topo anda mais devagar que o texto */
      if (fundo && !semMovimento && (!hero || hero.getBoundingClientRect().bottom > -80)) {
        const valor = (scrollY * 0.14).toFixed(1) + 'px';
        if (valor !== ultimoParallax) {
          ultimoParallax = valor;
          fundo.style.setProperty('--par', valor);
        }
      }
      if (semMovimento) return;

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

        const transform = `rotateX(${(20 * (1 - suave)).toFixed(2)}deg) scale(${(s0 + (s1 - s0) * suave).toFixed(4)})`;
        if (estados.get(card) !== transform) {
          estados.set(card, transform);
          card.style.transform = transform;
        }

        if (texto && !mobile) {
          const estadoTexto = `${(-56 * suave).toFixed(1)}|${(1 - suave * 0.35).toFixed(3)}`;
          if (estadoTexto !== ultimoTexto) {
            ultimoTexto = estadoTexto;
            texto.style.transform = `translateY(${(-56 * suave).toFixed(1)}px)`;
            texto.style.opacity = (1 - suave * 0.35).toFixed(3);
          }
        }
      });
    };

    aoRolar(desenhar);
    addEventListener('resize', desenhar, { passive: true });
    desenhar();
  }

  /* ---------- pausa animações fora da tela ---------- */
  function animacoesVisiveis() {
    const alvos = [...document.querySelectorAll('.hero,.marquee,[data-chart]')];
    if ('IntersectionObserver' in window) {
      const observador = new IntersectionObserver((entries) => {
        entries.forEach((e) => e.target.classList.toggle('motion-active', e.isIntersecting));
      }, { rootMargin: '20% 0px', threshold: 0 });
      alvos.forEach((el) => observador.observe(el));
    } else alvos.forEach((el) => el.classList.add('motion-active'));

    const visibilidade = () => document.documentElement.classList.toggle('page-hidden', document.hidden);
    document.addEventListener('visibilitychange', visibilidade, { passive: true });
    visibilidade();
  }

  /* ---------- luz que segue o ponteiro nos cartões ----------
     Um ouvinte só, no documento, escrevendo duas variáveis no cartão sob o
     cursor. Sem listener por card e sem trabalho fora do quadro. */
  function luzDoPonteiro() {
    if (!matchMedia('(hover:hover)').matches) return;
    const ALVO = '.pain,.plan,.vs__col,.quote,.founder,.q-opt,.res-p';
    let alvo = null, x = 0, y = 0, pendente = false;

    const pintar = () => {
      pendente = false;
      if (!alvo) return;
      const r = alvo.getBoundingClientRect();
      alvo.style.setProperty('--mx', (((x - r.left) / r.width) * 100).toFixed(2) + '%');
      alvo.style.setProperty('--my', (((y - r.top) / r.height) * 100).toFixed(2) + '%');
    };

    addEventListener('pointermove', (ev) => {
      if (ev.pointerType !== 'mouse') return;
      const card = ev.target.closest?.(ALVO);
      if (!card) { alvo = null; return; }
      alvo = card; x = ev.clientX; y = ev.clientY;
      if (!pendente) { pendente = true; requestAnimationFrame(pintar); }
    }, { passive: true });
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

  /* ---------- seções claras empilhadas ----------
     Equivalente sem framework ao StickyCard do componente fornecido. Seções
     que cabem na viewport ganham um palco com curso extra e ficam sticky;
     seções longas preservam o fluxo e escalam apenas ao sair da tela. */
  function parallaxClaro() {
    if (semMovimento) return;
    const secoes = [...document.querySelectorAll('.sec.t-light,.sec.t-mist')];
    if (!secoes.length) return;

    const vhInicial = innerHeight;
    const estados = secoes.map((el, indice) => {
      el.classList.add('light-parallax');
      const altura = el.offsetHeight;
      let palco = null, curso = 0, topo = 0;

      if (altura <= vhInicial * .92) {
        palco = document.createElement('div');
        palco.className = 'white-stack-stage';
        const estilo = getComputedStyle(el);
        palco.style.marginTop = estilo.marginTop;
        palco.style.marginBottom = estilo.marginBottom;
        el.parentNode.insertBefore(palco, el);
        palco.append(el);
        el.style.margin = '0';
        curso = Math.min(520, Math.max(260, vhInicial * .46));
        topo = Math.max(12, (vhInicial - altura) * .5);
        palco.style.setProperty('--stack-top', topo.toFixed(1) + 'px');
        palco.style.height = (altura + curso) + 'px';
        palco.style.zIndex = String(2 + indice);
      }

      return { el, palco, curso, topo, atual: 0, alvo: 0, velocidade: 0 };
    });
    let quadro = 0, anterior = 0;

    const medir = () => {
      const vh = innerHeight;
      estados.forEach((s) => {
        if (s.palco) {
          const r = s.palco.getBoundingClientRect();
          s.alvo = Math.min(1, Math.max(0, (s.topo - r.top) / s.curso));
        } else {
          const r = s.el.getBoundingClientRect();
          const inicio = vh * .92;
          const curso = Math.min(vh * .76, Math.max(320, r.height * .24));
          s.alvo = Math.min(1, Math.max(0, (inicio - r.bottom) / curso));
        }
      });
    };

    const animar = (agora) => {
      const dt = anterior ? Math.min((agora - anterior) / 1000, .032) : .016;
      anterior = agora;
      let movendo = false;

      estados.forEach((s) => {
        const parado = Math.abs(s.alvo - s.atual) < .0004 && Math.abs(s.velocidade) < .0008;
        if (parado) {
          s.atual = s.alvo;s.velocidade = 0;
          return;
        }
        s.velocidade += ((110 * (s.alvo - s.atual) - 22 * s.velocidade) / .7) * dt;
        s.atual += s.velocidade * dt;
        if (Math.abs(s.alvo - s.atual) < .0004 && Math.abs(s.velocidade) < .0008) {
          s.atual = s.alvo;s.velocidade = 0;
        } else movendo = true;
        s.el.style.setProperty('--light-p', Math.min(1, Math.max(0, s.atual)).toFixed(4));
      });

      if (movendo) quadro = requestAnimationFrame(animar);
      else { quadro = 0;anterior = 0; }
    };

    const atualizar = () => {
      medir();
      if (!quadro) quadro = requestAnimationFrame(animar);
    };
    aoRolar(atualizar);
    addEventListener('resize', atualizar, { passive: true });
    atualizar();
  }

  /* ---------- transição contínua entre seções ----------
     O progresso vem da posição geométrica, não de um gatilho. Portanto voltar
     a rolagem reverte exatamente o fade e o deslocamento. A caixa da seção não
     se move: somente uma camada interna é transformada, evitando layout shift. */
  function transicaoSecoes() {
    if (semMovimento) return;
    const secoes = [...document.querySelectorAll('main > .sec,main > .white-stack-stage > .sec')];
    if (!secoes.length) return;

    const estados = secoes.map((secao) => {
      const camada = document.createElement('div');
      camada.className = 'section-scroll-content';
      [...secao.children].forEach((filho) => {
        if (!filho.classList.contains('final__glow')) camada.append(filho);
      });
      secao.append(camada);
      const host = secao.parentElement?.classList.contains('white-stack-stage') ? secao.parentElement : secao;
      return { secao, camada, host, ultimo: '' };
    });

    const limitar = (n) => Math.min(1, Math.max(0, n));
    const suavizar = (n) => n * n * (3 - 2 * n);

    const desenhar = () => {
      const vh = innerHeight;
      const curso = Math.max(220, vh * .36);
      const fimSaida = vh - curso;

      estados.forEach((s) => {
        const r = s.host.getBoundingClientRect();
        const entrada = suavizar(limitar((vh - r.top) / curso));
        const saida = suavizar(limitar((r.bottom - fimSaida) / curso));
        const opacidade = Math.min(entrada, saida);
        const y = 30 * (1 - entrada) - 30 * (1 - saida);
        const estado = `${opacidade.toFixed(3)}|${y.toFixed(2)}`;
        if (estado === s.ultimo) return;
        s.ultimo = estado;
        s.camada.style.setProperty('--section-opacity', opacidade.toFixed(3));
        s.camada.style.setProperty('--section-y', y.toFixed(2) + 'px');
      });
    };

    aoRolar(desenhar);
    addEventListener('resize', desenhar, { passive: true });
    desenhar();
  }

  /* ---------- inicialização ---------- */
  function init(raiz = document) {
    if (!semMovimento) {
      raiz.querySelectorAll('[data-cascade]').forEach((el) => {
        cascata(el, Number(el.dataset.cascade) || 90);
      });
    }
    raiz.querySelectorAll('[data-carousel]').forEach(carrossel);
    raiz.querySelectorAll('[data-lightbox]').forEach(grupoLightbox);
    raiz.querySelectorAll(SELETOR).forEach((el) => io.observe(el));
  }

  ilha();
  scrollspy();
  cardScroll();
  parallaxClaro();
  transicaoSecoes();
  animacoesVisiveis();
  luzDoPonteiro();

  return { init, animarTitulo, cascata, carrossel, abrirLightbox, observar: (el) => io.observe(el), semMovimento };
})();
