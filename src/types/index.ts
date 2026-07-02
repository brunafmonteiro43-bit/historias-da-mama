export type StoryStatus = 'draft' | 'published';

export type Story = {
  slug: string;
  title: string;
  description: string;
  author: string;
  category: string;
  ageRange: string;
  readingTime: string;
  theme: string;
  hasColoringVersion: boolean;
  status: StoryStatus;
  popular: boolean;
  color: string;
  pages: string[];
};

export type Category = {
  name: string;
  icon: string;
  description: string;
};
