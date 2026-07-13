import type { Metadata } from 'next';
import { SiteChrome } from '@/components/site-chrome';
import { ToastProvider } from '@/components/ui/toast';
import './globals.css';

export const metadata: Metadata = {
  title: { default: 'Histórias da Mamá', template: '%s | Histórias da Mamá' },
  description: 'Histórias infantis para imaginar, aprender e se encantar.',
  icons: {
    icon: '/icons/icon-compact.png',
    shortcut: '/icons/icon-compact.png',
    apple: '/icons/icon-compact.png',
  },
  openGraph: {
    title: 'Histórias da Mamá',
    description: 'Histórias infantis para imaginar, aprender e se encantar.',
    type: 'website',
  },
  manifest: '/manifest.json',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <ToastProvider>
          <SiteChrome>{children}</SiteChrome>
        </ToastProvider>
      </body>
    </html>
  );
}
