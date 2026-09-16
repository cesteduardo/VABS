/* VABS Company — comportamento da home */
(() => {
  'use strict';

  /* ---------- marquee de segmentos ---------- */
  const SEGMENTOS = ['Clínicas','Estéticas','Restaurantes','Lojas de roupa','Pet shops',
    'Imobiliárias','Advogados','Móveis','Cosméticos','Escolas','Óticas','Academias','Joalherias'];

  const track = document.getElementById('marquee');
  if (track) {
    const linha = SEGMENTOS.map((s) => `<span>${s}</span>`).join('');
    track.innerHTML = linha + linha; // duplicado para o loop contínuo
  }

  /* ---------- FAQ ---------- */
  const FAQ = [
    ['Para quem é a Vabs?',
     'Para qualquer empresa que já tem time comercial e já recebe contato, mas perde venda por desorganização. Não importa o segmento: o que importa é ter alguém para vender e demanda chegando.'],
    ['O que é o Método V.A.B.S.?',
     'É a estruturação comercial completa em 90 dias em quatro pilares: Visão (gestão e números), Aquisição (demanda qualificada), Base (CRM e follow-up) e Sistema (playbook, script e time treinado).'],
    ['Por que o tráfego é a última etapa?',
     'Porque o dinheiro não some no anúncio, some depois dele. Primeiro arrumamos visão, base e sistema. Só então abrimos a torneira do tráfego — senão você paga para perder lead mais rápido.'],
    ['Qual o valor mínimo para começar?',
     'A partir de R$ 2.500 por mês. Montar esse time dentro de casa (gestor de tráfego, designer, editor, consultor comercial, CRM e encargos) custa perto de R$ 18 mil por mês.'],
    ['Em quanto tempo vejo resultado?',
     'Temos compromissos com prazo: CRM rodando em 25 dias, time comercial treinado em 40 dias, 1 reunião de resultado por mês e resposta em 24h úteis. O ciclo mínimo é de 90 dias.'],
    ['A verba de anúncio está inclusa na mensalidade?',
     'Não. A verba de anúncio é sua, vai 100% para as plataformas e nunca entra no valor do plano.'],
    ['Como eu acompanho os resultados?',
     'Você tem painel de números, dashboard por vendedor dentro do CRM e uma reunião de resultado por mês com a meta e a matemática reversa na mesa.'],
    ['Preciso trocar meu time de vendas?',
     'Não. A gente treina o time que você já tem, com playbook, script, cadência de follow-up e banco de objeções.']
  ];

  const faqList = document.getElementById('faq-list');
  if (faqList) {
    faqList.innerHTML = FAQ.map(([q, a], i) => `
      <div class="faq__i rv">
        <h3 style="margin:0">
          <button class="faq__q" aria-expanded="false" aria-controls="faq-a${i}" id="faq-q${i}">
            <span>${q}</span><span class="faq__ic" aria-hidden="true">+</span>
          </button>
        </h3>
        <div class="faq__a" id="faq-a${i}" role="region" aria-labelledby="faq-q${i}">
          <div><p>${a}</p></div>
        </div>
      </div>`).join('');
    VabsUI.init(faqList);

    faqList.addEventListener('click', (ev) => {
      const btn = ev.target.closest('.faq__q');
      if (!btn) return;
      const item = btn.closest('.faq__i');
      const aberto = item.classList.contains('is-open');
      faqList.querySelectorAll('.faq__i.is-open').forEach((el) => {
        el.classList.remove('is-open');
        el.querySelector('.faq__q').setAttribute('aria-expanded', 'false');
      });
      if (!aberto) {
        item.classList.add('is-open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  }

  /* ---------- contador do painel ---------- */
  const contar = (el) => {
    const alvo = Number(el.dataset.count);
    const prefixo = el.dataset.prefix || '';
    const fmt = new Intl.NumberFormat('pt-BR');
    const dur = 1600, t0 = performance.now();
    const passo = (t) => {
      const p = Math.min((t - t0) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = prefixo + fmt.format(Math.round(alvo * eased));
      if (p < 1) requestAnimationFrame(passo);
    };
    requestAnimationFrame(passo);
  };

  const semMovimento = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ioNum = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      if (!semMovimento) contar(e.target);
      ioNum.unobserve(e.target);
    });
  }, { threshold: .5 });
  document.querySelectorAll('[data-count]').forEach((el) => ioNum.observe(el));

  /* ---------- barra de anúncio ---------- */
  const bar = document.getElementById('topbar');
  const fechar = document.querySelector('[data-close-bar]');
  try {
    if (bar && sessionStorage.getItem('vabs:bar') === 'off') bar.remove();
  } catch (e) { /* storage bloqueado */ }
  if (fechar) fechar.addEventListener('click', () => {
    bar.remove();
    try { sessionStorage.setItem('vabs:bar', 'off'); } catch (e) {}
  });

  /* ---------- rolagem suave ---------- */
  document.addEventListener('click', (ev) => {
    const a = ev.target.closest('a[href^="#"]');
    if (!a) return;
    const alvo = document.querySelector(a.getAttribute('href'));
    if (!alvo) return;
    ev.preventDefault();
    const topo = alvo.getBoundingClientRect().top + scrollY - 60;
    scrollTo({ top: topo, behavior: semMovimento ? 'auto' : 'smooth' });
  });

  VabsUI.init();
})();
