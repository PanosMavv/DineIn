import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { CategoryForm } from '@/components/Dashboard/CategoryForm';

export default async function NewCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user.id;

  if (!userId) return null;

  const t = await getTranslations('dashboard.management.categories');

  const restaurant = await prisma.restaurant.findFirst({
    where: { id, ownerId: userId },
    include: { translations: { where: { locale: 'en' } } },
  });

  if (!restaurant) notFound();

  return (
    <div>
      <Link
        href={`/dashboard/restaurants/${id}/menu`}
        className="mb-4 inline-flex items-center gap-2 text-sm text-ink-muted hover:text-ink"
      >
        <ArrowLeft className="w-4 h-4" />
        {t('add.back')}
      </Link>

      <h1 className="text-2xl md:text-3xl font-bold text-ink mb-6">
        {t('add.header')}
      </h1>

      <CategoryForm restaurantId={id} />
    </div>
  );
}