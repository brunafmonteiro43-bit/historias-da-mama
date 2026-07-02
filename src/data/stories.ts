import type { Category, Story } from '@/types';

export const categories: Category[] = [
  { name: 'Aventura', icon: '🧭', description: 'Viagens, descobertas e coragem.' },
  { name: 'Fantasia', icon: '🏰', description: 'Magia, castelos e mundos encantados.' },
  { name: 'Amizade', icon: '💛', description: 'Empatia, respeito e convivência.' },
  { name: 'Natureza', icon: '🌿', description: 'Animais, flores e cuidado com o planeta.' },
  { name: 'Inclusão', icon: '🦋', description: 'Aceitação, autonomia e diversidade.' },
];

const palette = ['#BFE7FF', '#DCCBFF', '#FFE8A3', '#FFD6E8', '#BDEFE7'];
const themes = ['imaginação', 'coragem', 'amizade', 'autonomia', 'cooperação'];

const slugify = (title: string) =>
  title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const createStory = (title: string, index: number, category: string): Story => {
  const theme = themes[index % themes.length];

  return {
    slug: slugify(title),
    title,
    description: `Uma história ilustrada e acolhedora sobre ${theme}, criada para leitura compartilhada em casa, na escola ou em atendimentos terapêuticos.`,
    author: index < 2 ? 'Alunos 2M2' : 'Histórias da Mamá',
    category,
    ageRange: index % 3 === 0 ? '4 a 6 anos' : index % 3 === 1 ? '6 a 8 anos' : '8 a 10 anos',
    readingTime: `${5 + index} min`,
    theme,
    hasColoringVersion: index % 2 === 0,
    status: 'published',
    popular: index % 2 === 0,
    color: palette[index % palette.length],
    pages: [
      `Era uma vez ${title}, uma aventura pronta para começar.`,
      'No caminho, pequenas escolhas revelaram grandes aprendizados.',
      'E todos descobriram que imaginar também é uma forma de crescer.',
    ],
  };
};

export const stories: Story[] = [
  'Viagem no Tempo dos Alunos 2M2',
  'Viagem no Tempo: O Retorno das Toupeiras',
  'O Pintinho Corajoso',
  'O Chapéu do Leo',
  'Liberdade: Aceitação e Amizade',
  'As Três Garotas e a Flor Radiante',
  'As Meninas Mágicas em um Mundo Encantado',
  'A Abelha Xixa e a Poção Mágica',
].map((title, index) => createStory(title, index, categories[index % categories.length].name));

export const featured = stories.slice(0, 4);
