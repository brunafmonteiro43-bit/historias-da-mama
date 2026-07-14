import type { Metadata } from 'next';
import { InstitutionalPage, InstitutionalSection } from '@/components/institutional-page';

export const metadata: Metadata = {
  title: 'Termos de Uso',
  description: 'Conheça as regras e condições para utilização do site Histórias da Mamá.',
};

const sections = [
  { id: 'finalidade', title: '1. Finalidade' },
  { id: 'acesso', title: '2. Acesso público' },
  { id: 'uso', title: '3. Uso adequado' },
  { id: 'direitos-autorais', title: '4. Direitos autorais' },
  { id: 'envio', title: '5. Envio de histórias' },
  { id: 'licenca', title: '6. Licença para publicação' },
  { id: 'infantil', title: '7. Conteúdo infantil' },
  { id: 'disponibilidade', title: '8. Disponibilidade' },
  { id: 'terceiros', title: '9. Serviços de terceiros' },
  { id: 'responsabilidade', title: '10. Responsabilidade' },
  { id: 'solicitacoes', title: '11. Solicitações' },
  { id: 'alteracoes', title: '12. Alterações' },
  { id: 'legislacao', title: '13. Legislação' },
];

export default function TermosDeUsoPage() {
  return (
    <InstitutionalPage
      intro="Estes Termos de Uso estabelecem as condições para acesso e utilização do site Histórias da Mamá. Ao utilizar o site, o visitante declara estar ciente destas condições."
      lastUpdated="Última atualização: 14 de julho de 2026"
      sections={sections}
      title="Termos de Uso"
    >
      <InstitutionalSection id="finalidade" title="1. Finalidade do site">
        <p>O Histórias da Mamá é uma biblioteca digital voltada à divulgação e leitura de histórias infantis.</p>
        <p>O conteúdo possui finalidade cultural, educativa, recreativa e de incentivo à leitura.</p>
      </InstitutionalSection>

      <InstitutionalSection id="acesso" title="2. Acesso público">
        <p>Os visitantes podem acessar as histórias publicadas sem a necessidade de criar uma conta.</p>
        <p>A gestão do conteúdo é restrita a pessoas autorizadas.</p>
        <p>
          É proibido tentar acessar áreas protegidas, contornar mecanismos de autenticação ou interferir no funcionamento
          do sistema.
        </p>
      </InstitutionalSection>

      <InstitutionalSection id="uso" title="3. Uso adequado">
        <p>O visitante concorda em:</p>
        <ul>
          <li>utilizar o site de forma lícita;</li>
          <li>respeitar os direitos de autores e colaboradores;</li>
          <li>não copiar ou distribuir conteúdos de forma indevida;</li>
          <li>não tentar comprometer a segurança do site;</li>
          <li>não enviar códigos maliciosos;</li>
          <li>não utilizar o site para práticas abusivas, fraudulentas ou ilegais.</li>
        </ul>
      </InstitutionalSection>

      <InstitutionalSection id="direitos-autorais" title="4. Direitos autorais">
        <p>
          As histórias, textos, ilustrações, capas, personagens, marcas, identidade visual e demais conteúdos podem estar
          protegidos por direitos autorais e outros direitos de propriedade intelectual.
        </p>
        <p>A disponibilização para leitura no site não significa transferência desses direitos.</p>
        <p>
          O conteúdo não poderá ser reproduzido, vendido, alterado, distribuído ou utilizado comercialmente sem
          autorização do respectivo titular, salvo nas hipóteses permitidas pela legislação.
        </p>
      </InstitutionalSection>

      <InstitutionalSection id="envio" title="5. Envio de histórias">
        <p>O site possui um formulário público para sugestão de histórias. Caso uma pessoa envie conteúdo, declara que:</p>
        <ul>
          <li>possui autorização para enviar o conteúdo;</li>
          <li>o material não viola direitos autorais;</li>
          <li>possui autorização sobre imagens e ilustrações utilizadas, se existirem;</li>
          <li>o conteúdo não viola direitos de imagem, privacidade ou personalidade;</li>
          <li>as informações fornecidas são verdadeiras;</li>
          <li>possui autorização de responsáveis quando o conteúdo envolver menores.</li>
        </ul>
        <p>O envio não garante publicação.</p>
        <p>A equipe responsável poderá analisar, solicitar ajustes, recusar, despublicar ou remover conteúdos incompatíveis com a proposta do site.</p>
        <p>
          Também poderá remover conteúdos após reclamação fundamentada de direitos autorais ou violação de direitos de
          terceiros.
        </p>
      </InstitutionalSection>

      <InstitutionalSection id="licenca" title="6. Licença para publicação">
        <p>
          Caso uma história seja aprovada, o responsável autoriza sua exibição no site pelo período em que permanecer
          publicada.
        </p>
        <p>
          Não há, nestes termos, cessão ampla ou irrevogável de direitos. Qualquer licença mais específica deverá ser
          tratada em documento próprio, quando necessário.
        </p>
        <p>A autoria deverá ser preservada conforme as informações fornecidas e as autorizações existentes.</p>
      </InstitutionalSection>

      <InstitutionalSection id="infantil" title="7. Conteúdo infantil">
        <p>As classificações por categoria e faixa etária são orientativas.</p>
        <p>
          Pais, responsáveis e educadores devem acompanhar a utilização do site e avaliar a adequação de cada conteúdo.
        </p>
      </InstitutionalSection>

      <InstitutionalSection id="disponibilidade" title="8. Disponibilidade">
        <p>Buscamos manter o site disponível e funcionando corretamente.</p>
        <p>Contudo, o acesso poderá ser interrompido temporariamente devido a:</p>
        <ul>
          <li>manutenção;</li>
          <li>atualizações;</li>
          <li>falhas técnicas;</li>
          <li>indisponibilidade de serviços externos;</li>
          <li>questões de segurança;</li>
          <li>eventos fora do controle do projeto.</li>
        </ul>
        <p>Não garantimos funcionamento ininterrupto.</p>
      </InstitutionalSection>

      <InstitutionalSection id="terceiros" title="9. Serviços de terceiros">
        <p>
          O funcionamento do site pode depender de serviços externos de hospedagem, banco de dados, autenticação e
          armazenamento.
        </p>
        <p>Falhas nesses serviços poderão afetar temporariamente o acesso.</p>
      </InstitutionalSection>

      <InstitutionalSection id="responsabilidade" title="10. Limitação de responsabilidade">
        <p>
          O Histórias da Mamá busca manter informações e conteúdos adequados, mas não garante que todos os materiais
          estarão permanentemente disponíveis ou livres de erros.
        </p>
        <p>O site não se responsabiliza pelo uso inadequado dos conteúdos ou por ações realizadas em páginas externas.</p>
        <p>Esta cláusula não exclui responsabilidades que não possam ser afastadas pela legislação.</p>
      </InstitutionalSection>

      <InstitutionalSection id="solicitacoes" title="11. Denúncias e solicitações">
        <p>Pedidos de remoção, relatos de violação de direitos autorais ou outras solicitações podem ser enviados para:</p>
        <p>
          <strong>[COLOCAR E-MAIL REAL DE CONTATO]</strong>
        </p>
        <p>A solicitação deve, sempre que possível, identificar:</p>
        <ul>
          <li>conteúdo envolvido;</li>
          <li>motivo do pedido;</li>
          <li>titular do direito;</li>
          <li>informações que permitam a análise.</li>
        </ul>
      </InstitutionalSection>

      <InstitutionalSection id="alteracoes" title="12. Alterações nos termos">
        <p>Estes Termos de Uso poderão ser atualizados conforme o projeto evoluir.</p>
        <p>A versão vigente será a publicada nesta página, acompanhada da data da última atualização.</p>
      </InstitutionalSection>

      <InstitutionalSection id="legislacao" title="13. Legislação aplicável">
        <p>
          Estes termos serão interpretados de acordo com a legislação brasileira, respeitados os direitos garantidos pela
          legislação aplicável.
        </p>
      </InstitutionalSection>
    </InstitutionalPage>
  );
}
