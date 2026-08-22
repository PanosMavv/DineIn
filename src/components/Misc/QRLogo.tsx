interface Props {
  className?: string;
}

export function QRLogo({ className = 'w-8 h-8' }: Props) {
  return (
    <svg className={`${className} text-gray-900 dark:text-gray-100`} viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2" />
      <rect x="5.5" y="5.5" width="2" height="2" rx="0.5" fill="currentColor" />

      <rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2" />
      <rect x="16.5" y="5.5" width="2" height="2" rx="0.5" fill="currentColor" />

      <rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2" />
      <rect x="5.5" y="16.5" width="2" height="2" rx="0.5" fill="currentColor" />

      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
      <circle cx="17" cy="17" r="1.5" fill="currentColor" />
      <circle cx="7" cy="12" r="1" fill="currentColor" />
      <circle cx="12" cy="7" r="1" fill="currentColor" />
      <circle cx="17" cy="12" r="1" fill="currentColor" />
      <circle cx="12" cy="17" r="1" fill="currentColor" />
      <circle cx="14" cy="14" r="0.8" fill="currentColor" />
      <circle cx="10" cy="14" r="0.8" fill="currentColor" />
      <circle cx="14" cy="10" r="0.8" fill="currentColor" />
      <circle cx="10" cy="10" r="0.8" fill="currentColor" />
    </svg>
  );
}