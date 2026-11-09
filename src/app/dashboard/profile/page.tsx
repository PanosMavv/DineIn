'use client';

import { authClient } from '@/lib/auth-client';
import { useTranslations } from 'next-intl';

export default function ProfilePage() {
  const { data: session } = authClient.useSession();
  const t = useTranslations('dashboard.profile');
  const tc = useTranslations('dashboard.common');

  if (!session) return null;

  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold text-ink mb-8">
        {t('header')}
      </h1>

      <div className="max-w-lg bg-surface rounded-2xl border border-hairline p-6">
        {/* Avatar */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 rounded-full overflow-hidden bg-surface-2">
            {session.user.image ? (
              <img
                src={session.user.image}
                alt={session.user.name || tc('user')}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-full h-full bg-accent-brand flex items-center justify-center text-white text-2xl font-bold">
                {session.user.name?.charAt(0) || 'U'}
              </div>
            )}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-ink">
              {session.user.name}
            </h2>
            <p className="text-ink-muted">{session.user.email}</p>
          </div>
        </div>

        {/* Info */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-ink mb-1">
              {t('name')}
            </label>
            <input
              type="text"
              value={session.user.name || ''}
              readOnly
              className="w-full px-4 py-2 bg-surface-2 rounded-xl border border-hairline text-ink"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-1">
              {t('email')}
            </label>
            <input
              type="email"
              value={session.user.email || ''}
              readOnly
              className="w-full px-4 py-2 bg-surface-2 rounded-xl border border-hairline text-ink"
            />
          </div>
        </div>
      </div>
    </div>
  );
}