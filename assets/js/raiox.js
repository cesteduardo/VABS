/* VABS Company — Raio-X V.A.B.S. (diagnóstico em 6 etapas) */
(() => {
  'use strict';

  /* Para enviar os leads a um CRM/webhook, coloque a URL aqui.
     Vazio = o lead fica só no navegador (localStorage) e o resultado aparece na hora. */
  const ENDPOINT = '';

  /* ---------- conteúdo ---------- */
  const PERGUNTAS = [
    {
      pilar: 'V',
      q: 'Quantos leads o seu negócio precisa por mês para bater a meta?',
      hint: 'Sem esse número não existe previsão de venda',
      opts: [['Sei exatamente', 10], ['Tenho uma ideia', 5], ['Nunca fiz essa conta', 0]]
    },
    {
      pilar: 'A',
      q: 'Dos contatos que chegam hoje, quantos têm dinheiro e urgência?',
      hint: 'Volume sem qualificação só ocupa o tempo do time',
      opts: [['Mais de 50%', 10], ['Entre 30 e 50%', 7], ['Menos de 30%', 3], ['Não sei medir', 0]]
    },
    {
      pilar: 'B',
      q: 'Em quanto tempo você me manda a lista de quem pediu orçamento e não comprou?',
      hint: 'É nessa lista que está o dinheiro que some depois do anúncio',
      opts: [['Na hora, tenho CRM', 10], ['Demoraria, está em planilha', 4], ['Não tenho esse controle', 0]]
    },
    {
      pilar: 'S',
      q: 'Quantas vezes seu time tenta contato antes de desistir de um lead?',
      hint: 'A maior parte das vendas acontece depois da terceira tentativa',
      opts: [['Temos cadência definida', 10], ['Depende do vendedor', 4], ['Não existe número definido', 0]]
    },
    {
      pilar: null,
      q: 'Qual é o faturamento mensal da sua empresa hoje?',
      hint: 'Usamos isso só para calibrar as prioridades do seu plano',
      opts: [['Até R$ 50 mil por mês', 0], ['De R$ 50 mil a R$ 100 mil por mês', 0],
             ['De R$ 100 mil a R$ 300 mil por mês', 0], ['Acima de R$ 300 mil por mês', 0]]
    }
  ];

  const PILARES = {
    V: { nome: 'Visão — meta e números',
         fix: 'Começamos pela matemática reversa: quantos leads, a que custo e com que taxa de fechamento a sua meta exige. Daí sai o painel de números e a reunião mensal de resultado.' },
    A: { nome: 'Aquisição — demanda qualificada',
         fix: 'Meta e Google Ads com filtro de qualificação, landing page e remarketing. Essa é a última etapa: a torneira só abre depois que a estrutura está de pé.' },
    B: { nome: 'Base — CRM e follow-up',
         fix: 'CRM implantado e integrado em até 25 dias, automação de follow-up e dashboard por vendedor. É aqui que para de sumir o orçamento que não fechou.' },
    S: { nome: 'Sistema — time e cadência',
         fix: 'Playbook, script, cadência de follow-up e banco de objeções, com o time comercial treinado em até 40 dias. Todo vendedor passa a vender do mesmo jeito.' }
  };

  const ETAPAS = [
    'Faltam 5 etapas — cerca de 75 segundos',
    'Faltam 4 etapas — cerca de 60 segundos',
    'Faltam 3 etapas — cerca de 45 segundos',
    'Faltam 2 etapas — cerca de 30 segundos',
    'Falta 1 etapa — cerca de 30 segundos',
    'Última etapa — menos de 30 segundos'
  ];

  const TOTAL = 6;
  const LETRAS = ['A', 'B', 'C', 'D'];

  /* ---------- estado ---------- */
  let etapa = 0;                 // 0..5 (5 = formulário)
  const respostas = [];          // { pilar, label, pontos }

  const $ = (id) => document.getElementById(id);
  const telaIntro = $('tela-intro');
  const telaQuiz = $('tela-quiz');
  const telaRes = $('tela-resultado');
  const card = $('q-card');

  VabsUI.init();

  /* ---------- navegação ---------- */
  $('btn-comecar').addEventListener('click', (ev) => {
    ev.preventDefault();
    telaIntro.hidden = true;
    telaQuiz.hidden = false;
    etapa = 0;
    render();
    scrollTo({ top: 0 });
  });

  $('btn-voltar').addEventListener('click', () => {
    if (etapa === 0) {
      telaQuiz.hidden = true;
      telaIntro.hidden = false;
      return;
    }
    etapa -= 1;
    respostas.length = etapa;
    render();
  });

  function progresso() {
    $('q-step').textContent = `Etapa ${etapa + 1} de ${TOTAL}`;
    $('q-bar').style.width = Math.round(((etapa + 1) / TOTAL) * 100) + '%';
    $('q-eta').textContent = ETAPAS[etapa];
  }

  function render() {
    progresso();
    card.innerHTML = '';
    etapa < PERGUNTAS.length ? renderPergunta(PERGUNTAS[etapa]) : renderFormulario();
    card.firstElementChild.classList.add('q-fade');
    VabsUI.init(card);
  }

  /* ---------- pergunta ---------- */
  function renderPergunta(p) {
    const bloco = document.createElement('div');
    bloco.innerHTML = `
      <h2 class="q-q" data-anim-title>${p.q}</h2>
      <p class="q-hint">${p.hint}</p>
      <div class="q-opts" data-cascade="70" role="group" aria-label="Opções de resposta">
        ${p.opts.map(([label], i) => `
          <button class="q-opt" data-i="${i}">
            <span class="q-opt__k">${LETRAS[i]}</span><span>${label}</span>
          </button>`).join('')}
      </div>`;
    card.appendChild(bloco);

    bloco.querySelectorAll('.q-opt').forEach((btn) => {
      btn.addEventListener('click', () => {
        const [label, pontos] = p.opts[Number(btn.dataset.i)];
        btn.classList.add('is-sel');
        respostas[etapa] = { pilar: p.pilar, label, pontos };
        setTimeout(() => { etapa += 1; render(); }, 260);
      });
    });
  }

  /* ---------- formulário ---------- */
  function renderFormulario() {
    const bloco = document.createElement('div');
    bloco.innerHTML = `
      <p class="tiny center" style="margin-bottom:22px">Seus dados são 100% seguros</p>
      <h2 class="q-q" data-anim-title>Seu raio-x está pronto.</h2>
      <p class="q-hint">Preencha para liberar a sua nota e o plano de prioridades:</p>

      <div class="rx-demo" style="margin:30px 0 0;max-width:none">
        <span class="mono-label">Raio-X V.A.B.S.</span>
        <p class="small" style="margin:10px 0 18px">Seu resultado está pronto — preencha abaixo para desbloquear</p>
        <div class="rx-row"><span>Nota do comercial (0 a 40)</span><span class="chip chip--ok">Pronto</span></div>
        <div class="rx-row"><span>Diagnóstico dos 4 pilares</span><span class="chip chip--ok">Pronto</span></div>
        <div class="rx-row"><span>Plano de prioridades</span><span class="chip chip--ok">Pronto</span></div>
      </div>

      <form class="f-grid" id="f-lead" data-cascade="70" novalidate>
        <div class="f-field">
          <label for="f-nome">Nome completo *</label>
          <input id="f-nome" name="nome" type="text" autocomplete="name" placeholder="Como podemos te chamar" required>
        </div>
        <div class="f-field">
          <label for="f-zap">WhatsApp *</label>
          <input id="f-zap" name="whatsapp" type="tel" inputmode="tel" autocomplete="tel" placeholder="(00) 00000-0000" required>
        </div>
        <div class="f-field">
          <label for="f-emp">Nome da empresa *</label>
          <input id="f-emp" name="empresa" type="text" autocomplete="organization" placeholder="Razão social ou nome fantasia" required>
        </div>
        <div class="f-field">
          <label for="f-mail">E-mail (opcional)</label>
          <input id="f-mail" name="email" type="email" autocomplete="email" placeholder="voce@empresa.com.br">
        </div>
        <button class="btn btn--lg btn--block" type="submit">Ver meu resultado <span class="arw">→</span></button>
      </form>
      <p class="f-note">Não enviamos spam. Você pode cancelar quando quiser.</p>`;
    card.appendChild(bloco);

    /* máscara de WhatsApp */
    const zap = bloco.querySelector('#f-zap');
    zap.addEventListener('input', () => {
      const d = zap.value.replace(/\D/g, '').slice(0, 11);
      zap.value = d.length <= 2 ? d
        : d.length <= 6 ? `(${d.slice(0, 2)}) ${d.slice(2)}`
        : d.length <= 10 ? `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`
        : `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
    });

    bloco.querySelector('#f-lead').addEventListener('submit', (ev) => {
      ev.preventDefault();
      const form = ev.currentTarget;
      if (!form.checkValidity()) { form.reportValidity(); return; }

      const lead = Object.fromEntries(new FormData(form).entries());
      lead.respostas = respostas.map((r, i) => ({ pergunta: PERGUNTAS[i].q, resposta: r.label }));
      lead.nota = notaTotal();
      lead.criadoEm = new Date().toISOString();

      const btn = form.querySelector('button[type=submit]');
      btn.disabled = true;
      btn.textContent = 'Calculando…';

      enviar(lead).finally(mostrarResultado);
    });
  }

  function enviar(lead) {
    try {
      const fila = JSON.parse(localStorage.getItem('vabs:leads') || '[]');
      fila.push(lead);
      localStorage.setItem('vabs:leads', JSON.stringify(fila));
    } catch (e) { /* storage bloqueado */ }

    if (!ENDPOINT) return Promise.resolve();
    return fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lead)
    }).catch(() => { /* falha de rede não trava o resultado */ });
  }

  /* ---------- resultado ---------- */
  const notaTotal = () =>
    respostas.filter((r) => r.pilar).reduce((soma, r) => soma + r.pontos, 0);

  const status = (n) =>
    n >= 8 ? ['Forte', 'ok'] : n >= 4 ? ['Atenção', 'warn'] : ['Crítico', 'bad'];

  function mostrarResultado() {
    const nota = notaTotal();
    telaQuiz.hidden = true;
    telaRes.hidden = false;
    scrollTo({ top: 0 });

    $('res-nota').textContent = nota;
    $('res-frase').textContent =
      nota >= 30 ? 'Sua estrutura já está de pé. O ganho agora vem de afinar a máquina — e só então abrir a torneira do tráfego.'
      : nota >= 18 ? 'Você tem parte da estrutura, mas ainda perde venda no meio do caminho. Dá pra arrumar dentro de um ciclo de 90 dias.'
      : 'Hoje o seu comercial depende de sorte e de memória. É exatamente esse cenário que o Método V.A.B.S. resolve em 90 dias.';

    const pilares = respostas
      .filter((r) => r.pilar)
      .map((r) => ({ id: r.pilar, pontos: r.pontos, ...PILARES[r.pilar] }));

    $('res-pilares').innerHTML = pilares.map((p) => {
      const [rotulo, classe] = status(p.pontos);
      return `
        <div class="res-p">
          <div class="res-p__top">
            <span class="res-p__n">${p.nome}</span>
            <span class="chip chip--${classe}">${rotulo}</span>
          </div>
          <div class="res-p__bar"><i data-w="${p.pontos * 10}"></i></div>
        </div>`;
    }).join('');

    requestAnimationFrame(() => {
      document.querySelectorAll('.res-p__bar i').forEach((b) => { b.style.width = b.dataset.w + '%'; });
    });

    const pior = pilares.slice().sort((a, b) => a.pontos - b.pontos)[0];
    $('res-prio').textContent = `Comece por: ${pior.nome}`;
    $('res-prio-d').textContent = pior.fix;

    VabsUI.init(telaRes);
  }
})();
