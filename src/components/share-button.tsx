'use client';

import { Check, Copy, Facebook, Mail, MessageCircle, Share2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useToast } from '@/components/ui/toast';
import { cn } from '@/lib/utils';

type ShareButtonProps = {
  storyTitle: string;
  storySlug: string;
  className?: string;
  label?: string;
  menuAlign?: 'left' | 'right';
  menuPlacement?: 'bottom' | 'top';
  showLabel?: boolean;
};

export function ShareButton({
  className,
  label = 'Compartilhar',
  menuAlign = 'right',
  menuPlacement = 'top',
  showLabel = false,
  storySlug,
  storyTitle,
}: ShareButtonProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const storyUrl = typeof window === 'undefined' ? `/historias/${storySlug}` : `${window.location.origin}/historias/${storySlug}`;
  const shareText = `Leia "${storyTitle}" no Histórias da Mamá`;
  const encodedText = encodeURIComponent(`${shareText}: ${storyUrl}`);
  const encodedUrl = encodeURIComponent(storyUrl);
  const encodedEmailBody = encodeURIComponent(`${shareText}\n\n${storyUrl}`);

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  async function handleShare() {
    if (navigator.share) {
      try {
        await navigator.share({
          title: storyTitle,
          text: shareText,
          url: storyUrl,
        });
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return;
        }
      }
    }

    setIsMenuOpen((current) => !current);
  }

  async function copyLink() {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(storyUrl);
    } else {
      const input = document.createElement('textarea');
      input.value = storyUrl;
      input.setAttribute('readonly', '');
      input.style.position = 'fixed';
      input.style.opacity = '0';
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
    }

    setCopied(true);
    setIsMenuOpen(false);
    toast({ title: 'Link copiado!' });
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className="relative" ref={wrapperRef}>
      <button
        aria-expanded={isMenuOpen}
        aria-haspopup="menu"
        aria-label={`${label} ${storyTitle}`}
        className={cn(
          'inline-flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-ink transition hover:bg-sun focus:outline-none focus:ring-4 focus:ring-violet-100',
          showLabel && 'w-auto gap-2 px-4 font-black',
          className,
        )}
        onClick={handleShare}
        type="button"
      >
        {copied ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
        {showLabel ? <span>{label}</span> : null}
      </button>

      {isMenuOpen ? (
        <div
          aria-label={`Opções para compartilhar ${storyTitle}`}
          className={cn(
            'absolute z-40 grid min-w-56 gap-1 rounded-2xl border border-slate-100 bg-white p-2 text-sm font-bold text-ink shadow-soft',
            menuAlign === 'right' ? 'right-0' : 'left-0',
            menuPlacement === 'top' ? 'bottom-full mb-3' : 'top-full mt-3',
          )}
          role="menu"
        >
          <button
            className="inline-flex items-center gap-3 rounded-xl px-3 py-2 text-left transition hover:bg-slate-50"
            onClick={copyLink}
            role="menuitem"
            type="button"
          >
            <Copy className="h-4 w-4 text-violet-700" />
            Copiar link
          </button>
          <a
            className="inline-flex items-center gap-3 rounded-xl px-3 py-2 transition hover:bg-slate-50"
            href={`https://wa.me/?text=${encodedText}`}
            rel="noreferrer"
            role="menuitem"
            target="_blank"
          >
            <MessageCircle className="h-4 w-4 text-emerald-600" />
            WhatsApp
          </a>
          <a
            className="inline-flex items-center gap-3 rounded-xl px-3 py-2 transition hover:bg-slate-50"
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
            rel="noreferrer"
            role="menuitem"
            target="_blank"
          >
            <Facebook className="h-4 w-4 text-blue-700" />
            Facebook
          </a>
          <a
            className="inline-flex items-center gap-3 rounded-xl px-3 py-2 transition hover:bg-slate-50"
            href={`mailto:?subject=${encodeURIComponent('Leia esta história')}&body=${encodedEmailBody}`}
            role="menuitem"
          >
            <Mail className="h-4 w-4 text-rose-600" />
            E-mail
          </a>
        </div>
      ) : null}
    </div>
  );
}
