import type { Metadata } from 'next';
import { InstitutionalPage, InstitutionalSection } from '@/components/institutional-page';

export const metadata: Metadata = {
  title: 'Política de Privacidade | Histórias da Mamá',
  description:
    'Saiba como o Histórias da Mamá trata informações e protege a privacidade de visitantes, autores e colaboradores.',
};

const sections = [
  { id: 'sobre', title: '1. Sobre esta política' },
  { id: 'acesso', title: '2. Quem pode acessar' },
  { id: 'informacoes', title: '3. Informações tratadas' },
  { id: 'finalidades', title: '4. Finalidades' },
  { id: 'criancas', title: '5. Crianças e adolescentes' },
  { id: 'cookies', title: '6. Cookies' },
  { id: 'prestadores', title: '7. Prestadores de serviço' },
  { id: 'seguranca', title: '8. Segurança' },
  { id: 'conservacao', title: '9. Conservação' },
  { id: 'direitos', title: '10. Direitos' },
  { id: 'solicitacoes', title: '11. Solicitações' },
  { id: 'links', title: '12. Links externos' },
  { id: 'alteracoes', title: '13. Alterações' },
];

export default function PoliticaDePrivacidadePage() {
  return (
    <InstitutionalPage
      intro="A sua privacidade é importante para o Histórias da Mamá. Esta Política de Privacidade explica, de forma clara, quais informações podem ser tratadas durante o uso do site, por que elas são utilizadas e quais direitos os titulares possuem."
      lastUpdated="Última atualização: 14 de julho de 2026"
      sections={sections}
      title="Política de Privacidade"
    >
      <InstitutionalSection id="sobre" title="1. Sobre esta política">
        <p>Esta política se aplica ao site Histórias da Mamá e às suas páginas, formulários e áreas restritas.</p>
        <p>
          O site utiliza serviços tecnológicos de terceiros para hospedagem, banco de dados, autenticação e armazenamento
          de arquivos.
        </p>
      </InstitutionalSection>

      <InstitutionalSection id="acesso" title="2. Quem pode acessar o site">
        <p>A biblioteca pública pode ser acessada sem a criação de uma conta.</p>
        <p>Contas e credenciais de acesso são destinadas somente a pessoas autorizadas a administrar o conteúdo.</p>
        <p>
          Crianças devem utilizar o site preferencialmente com acompanhamento de pais, familiares, responsáveis ou
          educadores.
        </p>
      </InstitutionalSection>

      <InstitutionalSection id="informacoes" title="3. Informações que podem ser tratadas">
        <h3 className="text-lg font-black text-plum">3.1. Dados de navegação</h3>
        <p>
          Durante o acesso ao site, os serviços de hospedagem, banco de dados, autenticação e segurança podem registrar
          automaticamente informações técnicas, como:
        </p>
        <ul>
          <li>endereço IP;</li>
          <li>data e horário de acesso;</li>
          <li>tipo de navegador;</li>
          <li>sistema operacional;</li>
          <li>páginas acessadas;</li>
          <li>registros de erros;</li>
          <li>informações necessárias para prevenção de abuso e segurança.</li>
        </ul>
        <p>Esses registros são utilizados para funcionamento, proteção, diagnóstico de problemas e melhoria do site.</p>

        <h3 className="pt-3 text-lg font-black text-plum">3.2. Dados enviados voluntariamente</h3>
        <p>
          O código atual possui um formulário público para envio de histórias. Esse formulário solicita, no navegador, os
          seguintes campos:
        </p>
        <ul>
          <li>nome de autoria;</li>
          <li>e-mail para retorno;</li>
          <li>título da história;</li>
          <li>categoria sugerida;</li>
          <li>texto da história.</li>
        </ul>
        <p>
          No código analisado, esse formulário não possui campo de upload de imagens, PDFs ou documentos e não foi
          confirmada integração de armazenamento ou envio desses dados para uma base externa. TODO: confirmar a política
          operacional real para recebimento, análise e conservação das histórias enviadas.
        </p>

        <h3 className="pt-3 text-lg font-black text-plum">3.3. Dados de pessoas autorizadas</h3>
        <p>Usuários autorizados a gerenciar conteúdo podem ter dados de autenticação tratados pelo Supabase, como:</p>
        <ul>
          <li>e-mail;</li>
          <li>identificador de usuário;</li>
          <li>registros de autenticação;</li>
          <li>informações necessárias para segurança da sessão.</li>
        </ul>
        <p>Senhas não são armazenadas diretamente pelo código do site.</p>
      </InstitutionalSection>

      <InstitutionalSection id="finalidades" title="4. Finalidades">
        <p>As informações podem ser utilizadas para:</p>
        <ul>
          <li>disponibilizar as histórias;</li>
          <li>permitir o funcionamento da área restrita de gestão de conteúdo;</li>
          <li>autenticar pessoas autorizadas;</li>
          <li>receber e analisar histórias enviadas, quando esse fluxo estiver efetivamente integrado;</li>
          <li>armazenar capas, PDFs e imagens cadastrados na gestão do conteúdo;</li>
          <li>responder a solicitações;</li>
          <li>prevenir fraudes, abusos e acessos não autorizados;</li>
          <li>corrigir erros;</li>
          <li>melhorar a estabilidade e a experiência do site;</li>
          <li>cumprir obrigações legais.</li>
        </ul>
      </InstitutionalSection>

      <InstitutionalSection id="criancas" title="5. Dados de crianças e adolescentes">
        <p>
          O Histórias da Mamá é um site de conteúdo infantil, mas não pretende criar perfis de crianças nem solicitar
          diretamente dados pessoais de menores para permitir a leitura.
        </p>
        <p>A leitura pública não exige cadastro.</p>
        <p>
          Crianças não devem enviar nome completo, endereço, telefone, escola, fotografias pessoais ou outras informações
          que permitam sua identificação.
        </p>
        <p>Formulários de envio de histórias devem ser utilizados por adultos, responsáveis ou pessoas autorizadas.</p>
        <p>
          Caso sejam identificados dados pessoais de uma criança enviados sem autorização adequada, eles poderão ser
          removidos.
        </p>
      </InstitutionalSection>

      <InstitutionalSection id="cookies" title="6. Cookies e tecnologias semelhantes">
        <p>
          O site pode utilizar recursos técnicos necessários para manter sessões restritas, segurança e funcionamento da
          aplicação.
        </p>
        <p>
          Não foi encontrado, no código analisado, uso de Google Analytics, Meta Pixel ou ferramenta semelhante de
          publicidade, perfilamento ou análise comportamental.
        </p>
        <p>
          Não utilizamos cookies publicitários ou de perfilamento, salvo se essa prática for implementada e informada
          previamente nesta política.
        </p>
      </InstitutionalSection>

      <InstitutionalSection id="prestadores" title="7. Compartilhamento com prestadores de serviço">
        <p>Para permitir o funcionamento do site, informações técnicas e arquivos podem ser processados por prestadores como:</p>
        <ul>
          <li>Vercel, responsável pela hospedagem e disponibilização da aplicação;</li>
          <li>Supabase, responsável por banco de dados, autenticação e armazenamento de arquivos;</li>
          <li>GitHub, utilizado para armazenamento e versionamento do código do projeto.</li>
        </ul>
        <p>Não foi identificado envio de dados de visitantes ao GitHub pelo código do site.</p>
        <p>Não vendemos dados pessoais.</p>
      </InstitutionalSection>

      <InstitutionalSection id="seguranca" title="8. Armazenamento e segurança">
        <p>
          São adotadas medidas técnicas e organizacionais razoáveis para proteger os dados contra acesso não autorizado,
          destruição, perda, alteração ou divulgação indevida.
        </p>
        <p>
          Nenhum sistema conectado à internet é totalmente livre de riscos, mas buscamos utilizar recursos de
          autenticação, controle de acesso e políticas de segurança adequadas.
        </p>
      </InstitutionalSection>

      <InstitutionalSection id="conservacao" title="9. Prazo de conservação">
        <p>
          Os dados serão mantidos somente durante o período necessário para atender às finalidades informadas, garantir
          segurança, cumprir obrigações legais ou exercer direitos.
        </p>
        <p>
          TODO: definir a política interna real para prazo de conservação de materiais enviados e não publicados, caso o
          fluxo de envio passe a armazenar dados.
        </p>
      </InstitutionalSection>

      <InstitutionalSection id="direitos" title="10. Direitos dos titulares">
        <p>Nos termos da legislação aplicável, o titular pode solicitar:</p>
        <ul>
          <li>confirmação da existência de tratamento;</li>
          <li>acesso aos seus dados;</li>
          <li>correção de informações;</li>
          <li>informações sobre o uso e compartilhamento;</li>
          <li>eliminação, quando cabível;</li>
          <li>revogação de consentimento, quando aplicável;</li>
          <li>oposição a tratamento realizado em desacordo com a legislação.</li>
        </ul>
      </InstitutionalSection>

      <InstitutionalSection id="solicitacoes" title="11. Solicitações de privacidade">
        <p>Para solicitar informações, correções ou exclusão de dados, utilize:</p>
        <p>
          <strong>[COLOCAR E-MAIL REAL DE PRIVACIDADE]</strong>
        </p>
        <p>
          A solicitação poderá exigir informações suficientes para confirmar a identidade do solicitante e evitar que
          dados sejam entregues ou alterados por terceiros.
        </p>
      </InstitutionalSection>

      <InstitutionalSection id="links" title="12. Links externos">
        <p>O site pode conter links para serviços de terceiros.</p>
        <p>
          O Histórias da Mamá não controla as práticas de privacidade de páginas externas. Recomendamos a leitura das
          respectivas políticas.
        </p>
      </InstitutionalSection>

      <InstitutionalSection id="alteracoes" title="13. Alterações nesta política">
        <p>
          Esta Política de Privacidade poderá ser atualizada para refletir mudanças no site, nos serviços utilizados ou na
          legislação.
        </p>
        <p>A data da última atualização será informada no início desta página.</p>
      </InstitutionalSection>
    </InstitutionalPage>
  );
}
