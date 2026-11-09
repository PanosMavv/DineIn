'use client';

import { useEffect, useRef, useState } from 'react';
import { Check, Link as LinkIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ui } from '@/lib/ui';

interface Props {
  slug: string;
  label?: string;
  variant?: 'primary' | 'ghost';
}

async function copyText(text: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
}

export function CopyLinkButton({ slug, label, variant = 'ghost' }: Props) {
  const t = useTranslations('dashboard.common');
  const [copied, setCopied] = useState(false);
  const [failed, setFailed] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const handleCopy = async () => {
    setFailed(false);

    try {
      await copyText(`${window.location.origin}/${slug}`);
      setCopied(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      setFailed(true);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleCopy}
        className={variant === 'primary' ? ui.btnPrimary : ui.btnGhost}
      >
        {copied ? <Check className="w-4 h-4" aria-hidden="true" /> : <LinkIcon className="w-4 h-4" aria-hidden="true" />}
        {failed ? t('copyFailed') : copied ? t('copied') : label ?? t('copyLink')}
      </button>
      <span className="sr-only" role="status" aria-live="polite">
        {copied ? t('copied') : failed ? t('copyFailed') : ''}
      </span>
    </>
  );
}
