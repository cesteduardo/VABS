/* VABS Company · Política de Privacidade e Termos de Uso em modal
   Os textos descrevem o que a página realmente faz. Onde falta um dado
   jurídico da empresa, fica um marcador entre colchetes para preencher. */
window.VabsLegal = (() => {
  'use strict';

  const EMPRESA   = '[RAZÃO SOCIAL DA VABS COMPANY]';
  const CNPJ      = '[CNPJ]';
  const ENDERECO  = '[ENDEREÇO COMPLETO]';
  const EMAIL     = '[E-MAIL DE CONTATO]';
  const ATUALIZADO = 'setembro de 2026';

  const PRIVACIDADE = `
    <p class="legal__meta">Última atualização: ${ATUALIZADO}</p>
    <p>Esta Política explica como a ${EMPRESA}, inscrita no CNPJ ${CNPJ}, com sede em ${ENDERECO}
    ("Vabs"), trata os dados pessoais coletados neste site, em conformidade com a Lei nº 13.709/2018
    (Lei Geral de Proteção de Dados Pessoais).</p>

    <h3>1. Quem é o controlador</h3>
    <p>A Vabs é a controladora dos dados pessoais coletados aqui, ou seja, é quem decide sobre a
    finalidade e a forma do tratamento. Contato para qualquer assunto relacionado a dados pessoais:
    ${EMAIL}.</p>

    <h3>2. Quais dados coletamos</h3>
    <p>Este site tem duas partes: as páginas de apresentação, que você navega sem se identificar, e o
    Raio-X V.A.B.S., que é um questionário opcional. Coletamos dados pessoais apenas quando você
    preenche o formulário ao final do Raio-X.</p>
    <ul>
      <li><strong>Dados que você informa no formulário:</strong> nome completo, WhatsApp, nome da
      empresa e e-mail.</li>
      <li><strong>Respostas do questionário:</strong> as alternativas escolhidas nas seis etapas do
      Raio-X, incluindo a faixa de faturamento mensal declarada, e a nota calculada a partir delas.</li>
      <li><strong>Data e hora</strong> em que o formulário foi enviado.</li>
    </ul>
    <p>Não pedimos CPF, endereço, dados bancários, dados de cartão nem qualquer dado sensível na
    acepção do art. 5º, II, da LGPD. Se você enviar dados desse tipo por conta própria em um campo
    livre, eles serão apagados.</p>

    <h3>3. Para que usamos</h3>
    <ul>
      <li>Calcular e mostrar na tela o resultado do seu Raio-X V.A.B.S.</li>
      <li>Entrar em contato com você, por WhatsApp ou e-mail, para apresentar o diagnóstico e a
      proposta comercial da Vabs.</li>
      <li>Registrar o histórico do atendimento comercial.</li>
    </ul>
    <p>Não usamos os seus dados para decisões automatizadas com efeito jurídico, não fazemos perfil
    publicitário e não enviamos disparos em massa não solicitados.</p>

    <h3>4. Base legal</h3>
    <p>O tratamento se apoia no <strong>consentimento</strong> (art. 7º, I), manifestado quando você
    preenche e envia o formulário de forma voluntária, e nos <strong>procedimentos preliminares
    relacionados a contrato</strong> a pedido do titular (art. 7º, V), já que o preenchimento tem
    como objetivo receber uma proposta comercial.</p>

    <h3>5. Com quem compartilhamos</h3>
    <p>Não vendemos, alugamos nem cedemos dados pessoais. O compartilhamento se limita ao necessário
    para operar o atendimento:</p>
    <ul>
      <li><strong>Ferramenta de atendimento e CRM da Vabs</strong> [INFORMAR A FERRAMENTA UTILIZADA],
      para onde os dados do formulário são enviados a fim de gerar o contato comercial.</li>
      <li><strong>WhatsApp,</strong> quando o contato com você acontece por esse canal, sujeito às
      políticas do próprio aplicativo.</li>
      <li><strong>Autoridades públicas,</strong> apenas mediante obrigação legal ou ordem judicial.</li>
    </ul>

    <h3>6. Tecnologias de rastreamento e armazenamento no seu navegador</h3>
    <p>Este site <strong>não utiliza cookies</strong>, não tem pixel de anúncio, não tem Google
    Analytics e não tem gerenciador de tags instalado. Usamos apenas dois recursos de armazenamento
    local do seu próprio navegador, que ficam no seu aparelho e não são lidos por nós à distância:</p>
    <ul>
      <li><code>sessionStorage</code>: guarda que você fechou a faixa de aviso do topo, para ela não
      reaparecer na mesma sessão. É apagado ao fechar o navegador.</li>
      <li><code>localStorage</code>: guarda uma cópia do formulário preenchido no Raio-X, para que o
      seu resultado continue disponível caso o envio falhe. Você pode apagar essa cópia a qualquer
      momento limpando os dados do site no seu navegador.</li>
    </ul>
    <p>As fontes tipográficas da página são carregadas do serviço Google Fonts
    (fonts.googleapis.com e fonts.gstatic.com). Nessa requisição, o seu endereço IP é transmitido ao
    Google, que é uma operação necessária para exibir a página conforme projetada e está sujeita à
    política de privacidade do Google.</p>

    <h3>7. Armazenamento e segurança</h3>
    <p>Mantemos os dados enquanto durar o relacionamento comercial e, depois disso, pelo prazo
    necessário para cumprir obrigações legais ou para defesa em processo, conforme o art. 16 da LGPD.
    Adotamos medidas técnicas e administrativas razoáveis de proteção, como acesso restrito às
    pessoas envolvidas no atendimento e transmissão por conexão segura (HTTPS). Nenhum sistema é
    totalmente imune, e nos comprometemos a comunicar você e a Autoridade Nacional de Proteção de
    Dados caso ocorra incidente de segurança relevante.</p>

    <h3>8. Seus direitos</h3>
    <p>Nos termos do art. 18 da LGPD, você pode a qualquer momento pedir: confirmação da existência
    de tratamento; acesso aos dados; correção de dados incompletos, inexatos ou desatualizados;
    anonimização, bloqueio ou eliminação de dados desnecessários ou tratados em desconformidade;
    portabilidade; eliminação dos dados tratados com base no consentimento; informação sobre
    compartilhamento; informação sobre a possibilidade de não consentir e as consequências disso; e
    revogação do consentimento.</p>
    <p>Para exercer qualquer desses direitos, escreva para ${EMAIL}. Respondemos no prazo legal.</p>

    <h3>9. Menores de idade</h3>
    <p>Este site é dirigido a empresas e profissionais. Não coletamos intencionalmente dados de
    crianças ou adolescentes. Se identificarmos um cadastro nessa condição, ele será eliminado.</p>

    <h3>10. Mudanças nesta Política</h3>
    <p>Esta Política pode ser atualizada para refletir mudanças na operação do site ou na legislação.
    A versão vigente é sempre a publicada nesta página, com a data de atualização no topo.</p>`;

  const TERMOS = `
    <p class="legal__meta">Última atualização: ${ATUALIZADO}</p>
    <p>Estes Termos regem o uso deste site, mantido pela ${EMPRESA}, CNPJ ${CNPJ} ("Vabs"). Ao
    navegar ou preencher o Raio-X V.A.B.S., você declara que leu e concorda com as condições abaixo.</p>

    <h3>1. O que este site é</h3>
    <p>Este é um site de apresentação comercial. Ele descreve o Método V.A.B.S. e os serviços de
    estruturação comercial da Vabs, e oferece um questionário gratuito de autodiagnóstico. O site não
    é uma loja: nada é vendido, cobrado ou pago aqui dentro.</p>

    <h3>2. O Raio-X V.A.B.S.</h3>
    <p>O Raio-X é uma ferramenta de orientação. A nota e o plano de prioridades são calculados
    automaticamente a partir das alternativas que você escolhe, servem para indicar por onde começar
    e <strong>não constituem consultoria, auditoria, parecer contábil, jurídico ou financeiro</strong>.
    O resultado depende da sinceridade e da exatidão das respostas informadas por você.</p>

    <h3>3. Resultados citados na página</h3>
    <p>Os números, depoimentos, prints de campanha e casos apresentados referem-se a clientes
    específicos, em contextos, mercados, verbas e períodos específicos. Servem como ilustração do
    trabalho realizado e <strong>não são promessa, garantia ou previsão de resultado</strong> para
    quem contratar. Resultado comercial depende de fatores fora do controle da Vabs, como produto,
    preço, mercado, concorrência, verba investida e execução do time do próprio cliente.</p>

    <h3>4. Condições comerciais</h3>
    <p>Valores, prazos, escopo e compromissos eventualmente citados nesta página são informativos e
    podem mudar sem aviso. O que vale entre as partes é exclusivamente a proposta comercial assinada
    ou aceita por escrito. A verba de anúncio, quando houver, é contratada e paga pelo cliente
    diretamente às plataformas de mídia e não integra os valores dos planos.</p>

    <h3>5. Uso adequado</h3>
    <p>Você concorda em não usar este site para fins ilícitos, não tentar obter acesso não autorizado
    a sistemas, não inserir dados falsos ou de terceiros no formulário, não empregar robôs ou
    raspagem automatizada e não sobrecarregar a infraestrutura do site.</p>

    <h3>6. Propriedade intelectual</h3>
    <p>A marca Vabs, o nome e a metodologia V.A.B.S., os textos, o layout, as imagens e o código
    desta página pertencem à Vabs ou foram licenciados a ela, e não podem ser copiados, reproduzidos
    ou usados sem autorização prévia por escrito.</p>

    <h3>7. Links e serviços de terceiros</h3>
    <p>A página contém links para serviços de terceiros, como WhatsApp e redes sociais. A Vabs não
    controla e não responde pelo conteúdo, pela disponibilidade nem pelas políticas desses serviços.</p>

    <h3>8. Disponibilidade</h3>
    <p>Procuramos manter o site sempre no ar, mas ele pode ficar indisponível por manutenção, falha
    técnica ou motivo alheio à nossa vontade, sem que isso gere qualquer obrigação de indenizar.</p>

    <h3>9. Privacidade</h3>
    <p>O tratamento dos dados pessoais coletados aqui está descrito na Política de Privacidade, que
    integra estes Termos.</p>

    <h3>10. Alterações e foro</h3>
    <p>Estes Termos podem ser alterados a qualquer momento, valendo a versão publicada nesta página.
    Aplica-se a legislação brasileira, e fica eleito o foro da comarca de ${ENDERECO} para dirimir
    controvérsias, com renúncia a qualquer outro.</p>`;

  const DOCS = {
    privacidade: { titulo: 'Política de Privacidade', corpo: PRIVACIDADE },
    termos: { titulo: 'Termos de Uso', corpo: TERMOS }
  };

  let dlg = null, voltarPara = null;

  function montar() {
    dlg = document.createElement('dialog');
    dlg.className = 'legal';
    dlg.setAttribute('aria-labelledby', 'legal-t');
    dlg.innerHTML = `
      <div class="legal__bar">
        <h2 class="legal__t" id="legal-t"></h2>
        <button class="legal__x" type="button" data-legal-fechar aria-label="Fechar">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
        </button>
      </div>
      <div class="legal__corpo" tabindex="0"></div>`;
    document.body.append(dlg);

    dlg.addEventListener('click', (ev) => {
      if (ev.target === dlg || ev.target.closest('[data-legal-fechar]')) dlg.close();
    });
    dlg.addEventListener('close', () => {
      document.documentElement.style.overflow = '';
      if (voltarPara) { voltarPara.focus(); voltarPara = null; }
    });
  }

  function abrir(chave, origem) {
    const doc = DOCS[chave];
    if (!doc) return;
    if (!dlg) montar();
    voltarPara = origem || null;
    dlg.querySelector('.legal__t').textContent = doc.titulo;
    const corpo = dlg.querySelector('.legal__corpo');
    corpo.innerHTML = doc.corpo;
    corpo.scrollTop = 0;
    if (!dlg.open) dlg.showModal();
    document.documentElement.style.overflow = 'hidden';
    corpo.focus();
  }

  document.addEventListener('click', (ev) => {
    const a = ev.target.closest('[data-legal]');
    if (!a) return;
    ev.preventDefault();
    abrir(a.dataset.legal, a);
  });

  return { abrir };
})();
