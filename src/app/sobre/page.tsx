import type { Metadata } from 'next';
import { InstitutionalPage, InstitutionalSection } from '@/components/institutional-page';

export const metadata: Metadata = {
  title: 'Sobre | Histórias da Mamá',
  description: 'Conheça a proposta, a missão e o funcionamento da biblioteca infantil Histórias da Mamá.',
};

const sections = [
  { id: 'missao', title: 'Nossa missão' },
  { id: 'para-quem', title: 'Para quem é o site' },
  { id: 'como-funciona', title: 'Como funciona' },
  { id: 'responsabilidade', title: 'Conteúdo e responsabilidade' },
  { id: 'convite', title: 'Um convite à leitura' },
];

export default function SobrePage() {
  return (
    <InstitutionalPage
      intro="Um espaço digital feito para imaginar, aprender e se encantar."
      lastUpdated="Última atualização: 14 de julho de 2026"
      sections={sections}
      title="Sobre o Histórias da Mamá"
    >
      <InstitutionalSection id="missao" title="Nossa missão">
        <p>
          O Histórias da Mamá é uma biblioteca digital de histórias infantis criada para tornar a leitura mais próxima,
          divertida e acessível para crianças, famílias, educadores e pessoas que acreditam no poder da imaginação.
        </p>
        <p>
          Aqui, cada história é apresentada de forma visual e interativa, permitindo que pequenos leitores conheçam
          personagens, aventuras, valores e diferentes formas de enxergar o mundo.
        </p>
        <p>
          Nossa proposta é reunir narrativas que estimulem a criatividade, a curiosidade, a empatia, a amizade, o
          respeito e o prazer pela leitura.
        </p>
        <p>
          Nossa missão é criar um ambiente acolhedor no qual histórias possam ser descobertas, compartilhadas e
          apreciadas com facilidade.
        </p>
        <p>
          Buscamos oferecer uma experiência de leitura leve, segura e encantadora, utilizando recursos visuais que ajudem
          a aproximar as crianças dos livros e da literatura.
        </p>
      </InstitutionalSection>

      <InstitutionalSection id="para-quem" title="Para quem é o site">
        <p>O Histórias da Mamá foi pensado para:</p>
        <ul>
          <li>crianças acompanhadas por seus familiares ou responsáveis;</li>
          <li>famílias que procuram novas histórias para compartilhar;</li>
          <li>professores e educadores;</li>
          <li>projetos de incentivo à leitura;</li>
          <li>espaços culturais, educativos e terapêuticos;</li>
          <li>autores e colaboradores interessados em divulgar histórias infantis.</li>
        </ul>
      </InstitutionalSection>

      <InstitutionalSection id="como-funciona" title="Como funciona">
        <p>As histórias publicadas podem ser acessadas gratuitamente na biblioteca do site.</p>
        <p>Os visitantes não precisam criar conta para realizar a leitura.</p>
        <p>
          O site possui uma área pública de envio de histórias. Os materiais enviados por esse formulário devem ser
          analisados antes de qualquer publicação.
        </p>
        <p>O envio de uma história não garante sua publicação automática.</p>
      </InstitutionalSection>

      <InstitutionalSection id="responsabilidade" title="Conteúdo e responsabilidade">
        <p>Buscamos selecionar conteúdos adequados à proposta infantil e familiar do projeto.</p>
        <p>
          As informações de faixa etária e categoria possuem caráter orientativo. Familiares, responsáveis e educadores
          devem avaliar se determinada história é apropriada para cada criança.
        </p>
      </InstitutionalSection>

      <InstitutionalSection id="convite" title="Um convite à leitura">
        <p>
          Histórias têm o poder de aproximar pessoas, despertar sentimentos e transformar momentos simples em lembranças
          especiais.
        </p>
        <p>Esperamos que cada visita ao Histórias da Mamá seja o começo de uma nova aventura.</p>
      </InstitutionalSection>
    </InstitutionalPage>
  );
}
