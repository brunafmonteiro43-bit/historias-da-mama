'use client';

import { useId } from 'react';

type BrandIllustrationProps = {
  className?: string;
  compact?: boolean;
  title?: string;
};

export function BrandIllustration({ className = '', compact = false, title = 'Livro aberto em um balao de pensamento' }: BrandIllustrationProps) {
  const id = useId();
  const bubbleId = `${id}-bubble`;
  const pageId = `${id}-page`;
  const shadowId = `${id}-shadow`;

  return (
    <svg className={className} role="img" viewBox="0 0 520 420" xmlns="http://www.w3.org/2000/svg">
      <title>{title}</title>
      <defs>
        <linearGradient id={bubbleId} x1="98" x2="430" y1="48" y2="340">
          <stop stopColor="#BFEAF5" />
          <stop offset="0.48" stopColor="#F8D8EA" />
          <stop offset="1" stopColor="#FFF8EA" />
        </linearGradient>
        <linearGradient id={pageId} x1="160" x2="360" y1="206" y2="330">
          <stop stopColor="#FFF8EA" />
          <stop offset="1" stopColor="#FFE7A3" />
        </linearGradient>
        <filter id={shadowId} colorInterpolationFilters="sRGB" x="-20%" y="-20%" width="140%" height="150%">
          <feDropShadow dx="0" dy="22" floodColor="#3B246B" floodOpacity=".16" stdDeviation="18" />
        </filter>
      </defs>

      <g filter={`url(#${shadowId})`}>
        <path
          d="M122 293c-50 0-86-35-86-79 0-29 16-55 42-69-5-47 34-87 84-85 21-42 68-63 116-50 25 7 47 23 62 45 52-18 108 15 115 69 46 5 81 41 81 84 0 50-45 87-100 80-18 37-59 58-104 49-24 31-72 35-102 8-36 18-83-3-96-41-4-7-7-11-12-11Z"
          fill={`url(#${bubbleId})`}
          stroke="#3B246B"
          strokeLinejoin="round"
          strokeWidth="9"
        />
        <circle cx="378" cy="354" r="28" fill="#FFFFFF" stroke="#3B246B" strokeWidth="8" />
        <circle cx="332" cy="380" r="17" fill="#FFFFFF" stroke="#3B246B" strokeWidth="7" />
        <circle cx="292" cy="395" r="10" fill="#FFFFFF" stroke="#3B246B" strokeWidth="6" />
      </g>

      {!compact ? (
        <>
          <g className="brand-float">
            <path d="M142 154h88v74h-88z" fill="#F36F91" opacity=".72" />
            <path d="M154 126h64l-15 28h-34z" fill="#7F54B8" />
            <path d="M168 101h36v25h-36z" fill="#F9B1C5" />
            <path d="M171 100h30l-15-20z" fill="#B79BEF" />
            <path d="M179 186c0-12 15-12 15 0v42h-15z" fill="#3B246B" opacity=".72" />
            <path d="M209 135l21 8-21 8z" fill="#F36F91" />
          </g>
          <g className="brand-butterfly">
            <path d="M347 95c-25-36-54 5-19 19-39 11-7 51 19 18 25 34 58-7 18-18 35-15 7-54-18-19Z" fill="#F8AEC3" stroke="#F36F91" strokeWidth="4" />
            <path d="M348 94c4 20 2 38-10 54" stroke="#3B246B" strokeLinecap="round" strokeWidth="4" />
          </g>
          <g>
            <path d="M396 194c22-34 74-23 78 18 26 3 42 22 41 44H344c5-31 25-50 52-62Z" fill="#FFFFFF" opacity=".78" />
            <path d="M409 256c0-38 76-40 76 0" fill="none" stroke="#8FD8CF" strokeLinecap="round" strokeWidth="16" />
            <path d="M448 177v83M421 203l28 24 33-31M430 246l-31 24M453 232l42 24" stroke="#9F6C4D" strokeLinecap="round" strokeWidth="8" />
          </g>
        </>
      ) : null}

      <g>
        <path d="M126 248c50-25 95-24 134 7v101c-40-30-86-32-134-7z" fill={`url(#${pageId})`} stroke="#B98869" strokeWidth="4" />
        <path d="M260 255c39-31 84-32 134-7v101c-48-25-94-23-134 7z" fill={`url(#${pageId})`} stroke="#B98869" strokeWidth="4" />
        <path d="M126 248l-20 43 129 29 25 36v-101c-39-31-84-32-134-7Z" fill="#FFF1C7" opacity=".82" />
        <path d="M394 248l20 43-129 29-25 36v-101c39-31 84-32 134-7Z" fill="#FFF1C7" opacity=".82" />
        <path d="M105 291l130 31 25 34 25-34 130-31" fill="none" stroke="#3B246B" strokeLinecap="round" strokeLinejoin="round" strokeWidth="11" />
        <path d="M260 255v101" stroke="#F36F91" strokeLinecap="round" strokeWidth="4" />
        <path d="M161 267c25-7 47-5 68 5M154 286c28-6 52-4 73 7M292 272c24-10 46-11 68-4M293 294c27-9 52-9 76 0" stroke="#EECDAF" strokeLinecap="round" strokeWidth="4" />
        <circle cx="260" cy="357" r="16" fill="#C34B78" stroke="#8A3572" strokeWidth="5" />
      </g>

      <g fill="#FFE7A3">
        <path className="brand-twinkle" d="M91 193l10 25 25 10-25 10-10 25-10-25-25-10 25-10z" />
        <path className="brand-twinkle-delay" d="M408 98l9 23 23 9-23 9-9 23-9-23-23-9 23-9z" />
        <path d="M315 183l8 20 20 8-20 8-8 20-8-20-20-8 20-8z" />
      </g>
      <g fill="#FFFFFF">
        <path d="M267 114l8 21 21 8-21 8-8 21-8-21-21-8 21-8z" />
        <circle cx="206" cy="95" r="3" />
        <circle cx="387" cy="166" r="4" />
        <circle cx="114" cy="132" r="4" />
      </g>
    </svg>
  );
}
