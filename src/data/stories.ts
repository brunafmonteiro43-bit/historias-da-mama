import type { Category, Story } from '@/types';
import { slugify } from '@/lib/utils';

export const categories: Category[] = [
  {
    name: 'Aventura',
    slug: 'aventura',
    description: 'Viagens, descobertas e coragem.',
    color: '#BFE7FF',
    accentColor: '#2F80ED',
  },
  {
    name: 'Fantasia',
    slug: 'fantasia',
    description: 'Magia, castelos e mundos encantados.',
    color: '#DCCBFF',
    accentColor: '#7C5CC4',
  },
  {
    name: 'Amizade',
    slug: 'amizade',
    description: 'Empatia, respeito e convivência.',
    color: '#FFE8A3',
    accentColor: '#D99000',
  },
  {
    name: 'Natureza',
    slug: 'natureza',
    description: 'Flores, jardins e cuidado com o planeta.',
    color: '#BDEFE7',
    accentColor: '#118A7E',
  },
  {
    name: 'Inclusão',
    slug: 'inclusao',
    description: 'Aceitação, autonomia e diversidade.',
    color: '#FFD6E8',
    accentColor: '#C0477C',
  },
];

const themes = ['imaginação', 'coragem', 'amizade', 'autonomia', 'cooperação'];

const createStory = (title: string, index: number, category: string): Story => {
  const theme = themes[index % themes.length];
  const categoryData = categories.find((item) => item.name === category) ?? categories[0];
  const readingMinutes = 5 + index;

  return {
    id: `demo-${index + 1}`,
    slug: slugify(title),
    title,
    description: `Uma história ilustrada e acolhedora sobre ${theme}, criada para leitura compartilhada em casa, na escola ou em atendimentos terapêuticos.`,
    author: index < 2 ? 'Alunos 2M2' : 'Histórias da Mamá',
    category,
    categorySlug: categoryData.slug,
    ageRange: index % 3 === 0 ? '4 a 6 anos' : index % 3 === 1 ? '6 a 8 anos' : '8 a 10 anos',
    readingTime: `${readingMinutes} min`,
    readingMinutes,
    theme,
    hasColoringVersion: index % 2 === 0,
    status: 'published',
    popular: index % 2 === 0,
    color: categoryData.color,
    accentColor: categoryData.accentColor,
    createdAt: `2026-0${Math.min(index + 1, 9)}-12T09:00:00.000Z`,
    readCount: 120 + index * 37,
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

export const publishedStories = stories.filter((story) => story.status === 'published');
export const featured = stories.slice(0, 4);
