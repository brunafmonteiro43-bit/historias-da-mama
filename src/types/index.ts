export type StoryStatus = 'draft' | 'published';

export type Story = {
  id?: string;
  slug: string;
  title: string;
  description: string;
  fullDescription?: string;
  author: string;
  category: string;
  categorySlug: string;
  ageRange: string;
  readingTime: string;
  readingMinutes: number;
  theme: string;
  hasColoringVersion: boolean;
  status: StoryStatus;
  popular: boolean;
  storyOfWeek?: boolean;
  color: string;
  accentColor: string;
  createdAt: string;
  readCount: number;
  pages: string[];
  pageImages?: Array<string | null>;
  coverUrl?: string | null;
  pdfUrl?: string | null;
};

export type Category = {
  name: string;
  slug: string;
  description: string;
  color: string;
  accentColor: string;
};
