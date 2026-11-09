import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { Sidebar } from '@/components/Dashboard/Layout/Sidebar';
import { BottomTabBar } from '@/components/Dashboard/Layout/BottomTabBar';
import { Logo } from '@/components/Misc/Logo';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect('/sign-in');
  }

  return (
    <div className="flex min-h-screen bg-(--color-surface-2)">
      <Sidebar
        user={{
          name: session.user.name,
          email: session.user.email,
          image: session.user.image ?? null,
        }}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile top bar */}
        <div className="flex items-center justify-center border-b border-hairline bg-surface px-4 py-3 md:hidden">
          <Logo size="sm" showDashboard href="/dashboard" />
        </div>

        <div className="flex-1 px-4 py-6 pb-24 md:px-8 md:pb-8">
          <div className="mx-auto max-w-6xl">{children}</div>
        </div>

        <BottomTabBar />
      </div>
    </div>
  );
}
