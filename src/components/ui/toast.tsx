'use client';

import * as ToastPrimitives from '@radix-ui/react-toast';
import { X } from 'lucide-react';
import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { cn } from '@/lib/utils';

type Toast = {
  id: string;
  title: string;
  description?: string;
};

type ToastContextValue = {
  toast: (toast: Omit<Toast, 'id'>) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((nextToast: Omit<Toast, 'id'>) => {
    const id = crypto.randomUUID();
    setToasts((current) => [...current, { ...nextToast, id }]);
  }, []);

  const value = useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={value}>
      <ToastPrimitives.Provider duration={2600} swipeDirection="right">
        {children}
        {toasts.map((item) => (
          <ToastPrimitives.Root
            className={cn(
              'grid w-full max-w-sm gap-1 rounded-2xl border border-white/70 bg-white p-4 text-ink shadow-soft',
              'data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)]',
            )}
            key={item.id}
            onOpenChange={(open) => {
              if (!open) {
                setToasts((current) => current.filter((toastItem) => toastItem.id !== item.id));
              }
            }}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <ToastPrimitives.Title className="font-black">{item.title}</ToastPrimitives.Title>
                {item.description ? (
                  <ToastPrimitives.Description className="mt-1 text-sm leading-6 text-slate-600">
                    {item.description}
                  </ToastPrimitives.Description>
                ) : null}
              </div>
              <ToastPrimitives.Close className="rounded-full p-1 text-slate-500 transition hover:bg-slate-100" aria-label="Fechar aviso">
                <X className="h-4 w-4" />
              </ToastPrimitives.Close>
            </div>
          </ToastPrimitives.Root>
        ))}
        <ToastPrimitives.Viewport className="fixed bottom-5 right-5 z-[100] flex w-[calc(100%-2.5rem)] max-w-sm flex-col gap-3 outline-none" />
      </ToastPrimitives.Provider>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast must be used inside ToastProvider.');
  }

  return context;
}
