import type { Metadata } from 'next';
import { SiteChrome } from '@/components/site-chrome';
import './globals.css';

export const metadata: Metadata = {
  title: { default: 'Histórias da Mamá', template: '%s | Histórias da Mamá' },
  description: 'Histórias infantis para imaginar, aprender e se encantar.',
  openGraph: {
    title: 'Histórias da Mamá',
    description: 'Biblioteca digital infantil premium.',
    type: 'website',
  },
  manifest: '/manifest.json',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
