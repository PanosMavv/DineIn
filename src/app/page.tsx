import { getTranslations } from 'next-intl/server';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import Image from 'next/image';
import { Check, Sparkles, Wrench, Zap, Globe, Palette } from 'lucide-react';
import { Navbar } from '@/components/Homepage/Navbar';

export default async function HomePage() {
  const t = await getTranslations('home');

  const restaurants = await prisma.restaurant.findMany({
    include: {
      translations: {
        where: { locale: 'en' },
      },
      themeSettings: true,
      _count: {
        select: { menuItems: true },
      },
    },
    orderBy: { slug: 'asc' },
  });

  const features = [
    { icon: Globe, key: 'multilingual' },
    { icon: Palette, key: 'themes' },
    { icon: Zap, key: 'fast' },
    { icon: Sparkles, key: 'combos' },
  ] as const;

  const diyFeatures = ['feature1', 'feature2', 'feature3', 'feature4'] as const;
  const fullFeatures = ['feature1', 'feature2', 'feature3', 'feature4', 'feature5'] as const;
  const customFeatures = ['feature1', 'feature2', 'feature3', 'feature4', 'feature5'] as const;

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />

      {/* ==================== HERO ==================== */}
      <div className="px-4 py-16 md:py-24 text-center max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-extrabold text-ink mb-6 leading-tight">
          {t('hero.title')}
        </h1>
        <p className="text-lg md:text-xl text-ink-muted max-w-2xl mx-auto mb-10">
          {t('hero.description')}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="#pricing"
            className="px-8 py-4 bg-ink text-[color:var(--color-surface)] rounded-full font-semibold hover:opacity-90 transition-opacity"
          >
            {t('hero.getStarted')}
          </Link>
          <Link
            href="#restaurants"
            className="px-8 py-4 border border-hairline rounded-full font-semibold text-ink hover:bg-surface-2 transition-colors"
          >
            {t('hero.viewDemos')}
          </Link>
        </div>
      </div>

      {/* ==================== FEATURES ==================== */}
      <div className="px-4 pb-12 max-w-6xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-ink mb-12">
          {t('features.heading')}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <div
              key={feature.key}
              className="p-6 bg-surface rounded-2xl border border-hairline"
            >
              <feature.icon className="w-8 h-8 text-accent-brand mb-4" />
              <h3 className="text-lg font-semibold text-ink mb-2">
                {t(`features.${feature.key}.title`)}
              </h3>
              <p className="text-sm text-ink-muted">
                {t(`features.${feature.key}.description`)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ==================== PRICING ==================== */}
      <div id="pricing" className="px-4 bg-surface-2 py-12 scroll-mt-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-ink">
            {t('pricing.heading')}
          </h2>
          <p className="text-center text-ink-muted mb-12">
            {t('pricing.subtitle')}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* DIY Plan */}
            <div className="bg-surface rounded-3xl border border-hairline p-8 flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                <Wrench className="w-6 h-6 text-ink-muted" />
                <h3 className="text-xl font-bold text-ink">
                  {t('pricing.diy.name')}
                </h3>
              </div>
              <p className="text-ink-muted mb-6">
                {t('pricing.diy.description')}
              </p>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-4xl font-extrabold text-ink">€15</span>
                <span className="text-ink-muted">{t('pricing.perMonth')}</span>
              </div>
              <p className="text-sm text-ink-subtle mb-8">
                €120/{t('pricing.perYear')} <span className="text-success font-semibold">({t('pricing.save')} €60)</span>
              </p>
              <ul className="space-y-3 mb-8">
                {diyFeatures.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-ink">
                    <Check className="w-4 h-4 text-success shrink-0" />
                    {t(`pricing.diy.${feature}`)}
                  </li>
                ))}
              </ul>
              <Link
                href="/sign-in?plan=diy"
                className="block text-center px-6 py-3 border border-hairline rounded-full font-semibold text-ink hover:bg-surface-2 transition-colors mt-auto"
              >
                {t('pricing.diy.cta')}
              </Link>
            </div>

            {/* Full Service Plan */}
            <div className="bg-ink text-[color:var(--color-surface)] rounded-3xl p-8 relative flex flex-col">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-accent-brand text-[color:var(--color-surface)] text-xs font-bold rounded-full">
                {t('pricing.full.badge')}
              </span>
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="w-6 h-6 text-yellow-400" />
                <h3 className="text-xl font-bold">{t('pricing.full.name')}</h3>
              </div>
              <p className="text-ink-subtle mb-6">
                {t('pricing.full.description')}
              </p>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-4xl font-extrabold">€30</span>
                <span className="text-ink-subtle">{t('pricing.perMonth')}</span>
              </div>
              <p className="text-sm text-ink-subtle mb-8">
                €220/{t('pricing.perYear')} <span className="text-green-400 font-semibold">({t('pricing.save')} €140)</span>
              </p>
              <ul className="space-y-3 mb-8">
                {fullFeatures.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                    <span>
                      {t(`pricing.full.${feature}`)}
                      {feature === 'feature2' && (
                        <span className="block text-xs text-ink-subtle mt-0.5">
                          {t('pricing.full.feature2Note')}
                        </span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
              <Link
                href="/sign-up?plan=full"
                className="block text-center px-6 py-3 bg-surface text-ink rounded-full font-semibold hover:bg-surface-2 transition-colors mt-auto"
              >
                {t('pricing.full.cta')}
              </Link>
            </div>

            {/* Custom Design Plan */}
            <div className="bg-surface rounded-3xl border-2 border-accent-brand p-8 relative flex flex-col">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-accent-brand text-[color:var(--color-surface)] text-xs font-bold rounded-full">
                {t('pricing.custom.badge')}
              </span>
              <div className="flex items-center gap-3 mb-4">
                <Palette className="w-6 h-6 text-accent-brand" />
                <h3 className="text-xl font-bold text-ink">
                  {t('pricing.custom.name')}
                </h3>
              </div>
              <p className="text-ink-muted mb-6">
                {t('pricing.custom.description')}
              </p>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-4xl font-extrabold text-ink">€50</span>
                <span className="text-ink-muted">{t('pricing.perMonth')}</span>
              </div>
              <p className="text-sm text-ink-subtle mb-8">
                €450/{t('pricing.perYear')} <span className="text-success font-semibold">({t('pricing.save')} €150)</span>
              </p>
              <ul className="space-y-3 mb-8">
                {customFeatures.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-ink">
                    <Check className="w-4 h-4 text-accent-brand shrink-0 mt-0.5" />
                    <span>
                      {t(`pricing.custom.${feature}`)}
                      {feature === 'feature2' && (
                        <span className="block text-xs text-ink-subtle mt-0.5">
                          {t('pricing.custom.feature2Note')}
                        </span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
              <Link
                href="/sign-up?plan=custom"
                className="block text-center px-6 py-3 border border-accent-brand text-accent-brand rounded-full font-semibold hover:bg-accent-brand/10 transition-colors mt-auto"
              >
                {t('pricing.custom.cta')}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ==================== DEMO RESTAURANTS ==================== */}
      <div id="restaurants" className="px-4 py-12 max-w-4xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-ink mb-12">
          {t('demos.heading')}
        </h2>
        <div className="grid gap-4">
          {restaurants.map((restaurant) => {
            const name = restaurant.translations[0]?.name || restaurant.slug;
            return (
              <Link
                key={restaurant.id}
                href={`/${restaurant.slug}`}
                className="flex items-center gap-4 p-4 bg-surface rounded-2xl border border-hairline hover:border-ink-subtle transition-colors"
              >
                <div className="w-14 h-14 rounded-full overflow-hidden bg-surface-2 flex items-center justify-center shrink-0">
                  {restaurant.themeSettings?.logoImage ? (
                    <Image src={restaurant.themeSettings.logoImage} alt={name} width={56} height={56} className="object-cover w-full h-full" unoptimized />
                  ) : (
                    <span className="text-lg font-bold text-ink-subtle">{name.charAt(0)}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold text-ink">
                    {name}
                  </h3>
                  <p className="text-sm text-ink-muted">
                    {restaurant._count.menuItems} {t('demos.itemsCount')}
                  </p>
                </div>
                <span className="text-ink-subtle">→</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}