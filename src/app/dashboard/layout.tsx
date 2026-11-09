'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import { Sidebar } from '@/components/Dashboard/Layout/Sidebar';
import { BottomTabBar } from '@/components/Dashboard/Layout/BottomTabBar';
import { Logo } from '@/components/Misc/Logo';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (!isPending && !session) {
      router.push('/sign-in');
    }
  }, [session, isPending, router]);

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-(--color-surface-2)">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ink" />
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="min-h-screen bg-(--color-surface-2) flex">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile top bar */}
        <div className="md:hidden bg-surface border-b border-hairline px-4 py-3 flex items-center justify-center">
          <Logo size="sm" showDashboard href="/dashboard" />
        </div>

        <div className="flex-1 px-4 py-6 pb-24 md:px-8 md:pb-8">
          <div className="mx-auto max-w-6xl">
            {children}
          </div>
        </div>

        <BottomTabBar />
      </div>
    </div>
  );
}