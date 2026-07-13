import type { Metadata } from 'next';
import { SiteChrome } from '@/components/site-chrome';
import { ToastProvider } from '@/components/ui/toast';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://historias-da-mama.vercel.app'),
  title: { default: 'Histórias da Mamá', template: '%s | Histórias da Mamá' },
  description: 'Histórias infantis para imaginar, aprender e se encantar.',
  icons: {
    icon: '/icons/favicon-32x32.png',
    shortcut: '/icons/favicon-32x32.png',
    apple: '/icons/apple-touch-icon.png',
  },
  openGraph: {
    title: 'Histórias da Mamá',
    description: 'Histórias infantis para imaginar, aprender e se encantar.',
    type: 'website',
    images: ['/brand/logo-historias-da-mama-horizontal.png'],
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
