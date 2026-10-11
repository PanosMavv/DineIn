'use client';

import { authClient } from '@/lib/auth-client';
import { useTranslations } from 'next-intl';

export default function ProfilePage() {
  const { data: session } = authClient.useSession();
  const t = useTranslations('dashboard.profile');

  if (!session) return null;

  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">
        {t('header')}
      </h1>

      <div className="max-w-lg bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
        {/* Avatar */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
            {session.user.image ? (
              <img
                src={session.user.image}
                alt={session.user.name || 'User'}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-full h-full bg-blue-500 flex items-center justify-center text-white text-2xl font-bold">
                {session.user.name?.charAt(0) || 'U'}
              </div>
            )}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              {session.user.name}
            </h2>
            <p className="text-gray-500">{session.user.email}</p>
          </div>
        </div>

        {/* Info */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('name')}
            </label>
            <input
              type="text"
              value={session.user.name || ''}
              readOnly
              className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('email')}
            </label>
            <input
              type="email"
              value={session.user.email || ''}
              readOnly
              className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300"
            />
          </div>
        </div>
      </div>
    </div>
  );
}