import Link from 'next/link';
import {
  EyeOff,
  FolderPlus,
  Share2,
  UtensilsCrossed,
} from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { ui } from '@/lib/ui';
import { NextStepCard } from '@/components/Dashboard/Hub/NextStepCard';
import { CopyLinkButton } from '@/components/Dashboard/shared/CopyLinkButton';

export type NextStepId = 'categories' | 'menu' | 'soldout' | 'share';

interface Props {
  nextId: NextStepId;
  restaurantId: string;
  slug: string;
}

export async function NextStepSection({ nextId, restaurantId, slug }: Props) {
  const t = await getTranslations('dashboard.hub');
  const tc = await getTranslations('dashboard.common');
  const menuHref = `/dashboard/restaurants/${restaurantId}/menu`;

  const content = {
    categories: {
      icon: FolderPlus,
      title: t('nextCategoryTitle'),
      body: t('nextCategoryBody'),
      action: (
        <Link href={menuHref} className={ui.btnPrimary}>
          {t('nextCategoryCta')}
        </Link>
      ),
    },
    menu: {
      icon: UtensilsCrossed,
      title: t('nextDishTitle'),
      body: t('nextDishBody'),
      action: (
        <Link href={menuHref} className={ui.btnPrimary}>
          {t('nextDishCta')}
        </Link>
      ),
    },
    soldout: {
      icon: EyeOff,
      title: t('nextSoldOutTitle'),
      body: t('nextSoldOutBody'),
      action: (
        <Link href={menuHref} className={ui.btnPrimary}>
          {t('nextSoldOutCta')}
        </Link>
      ),
    },
    share: {
      icon: Share2,
      title: t('nextShareTitle'),
      body: t('nextShareBody'),
      action: (
        <CopyLinkButton
          slug={slug}
          label={t('nextShareCta')}
          variant="primary"
        />
      ),
    },
  }[nextId];

  return (
    <NextStepCard
      eyebrow={tc('nextStep')}
      title={content.title}
      body={content.body}
      icon={content.icon}
      action={content.action}
      secondary={
        <a
          href={`/${slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className={ui.btnGhost}
        >
          {tc('preview')}
        </a>
      }
    />
  );
}
