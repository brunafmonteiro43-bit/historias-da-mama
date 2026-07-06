export type StoryStatus = 'draft' | 'published' | 'pending_review' | 'rejected';

export type Story = {
  id?: string;
  slug: string;
  title: string;
  description: string;
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
  color: string;
  accentColor: string;
  createdAt: string;
  readCount: number;
  pages: string[];
};

export type Category = {
  name: string;
  slug: string;
  description: string;
  color: string;
  accentColor: string;
};
