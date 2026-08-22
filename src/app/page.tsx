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
    { icon: Globe, title: 'Multilingual Menus', description: 'Serve your customers in their language with instant translations' },
    { icon: Palette, title: 'Beautiful Themes', description: 'Choose from multiple stunning templates that match your brand' },
    { icon: Zap, title: 'Fast & Reliable', description: 'Lightning-fast loading times keep your customers happy' },
    { icon: Sparkles, title: 'Combos & Deals', description: 'Highlight special offers and combo meals to boost sales' },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* ==================== NAVBAR ==================== */}
      <Navbar />

      {/* ==================== HERO ==================== */}
      <div className="px-4 py-16 md:py-24 text-center max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 dark:text-gray-100 mb-6 leading-tight">
          Beautiful digital menus for your restaurant
        </h1>
        <p className="text-lg md:text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mb-10">
          Create stunning, mobile-friendly menus that your customers will love. Multilingual support, beautiful themes, and easy management — all in one place.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="#pricing"
            className="px-8 py-4 bg-black text-white rounded-full font-semibold hover:bg-gray-800 transition-colors"
          >
            Get Started
          </Link>
          <Link
            href="#restaurants"
            className="px-8 py-4 border border-gray-300 rounded-full font-semibold hover:bg-gray-50 transition-colors"
          >
            View Demo Menus
          </Link>
        </div>
      </div>

      {/* ==================== FEATURES ==================== */}
      <div className="px-4 pb-12 max-w-6xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 dark:text-gray-100 mb-12">
          Everything your menu needs
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800"
            >
              <feature.icon className="w-8 h-8 text-blue-600 dark:text-blue-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ==================== PRICING ==================== */}
      <div id="pricing" className="px-4 bg-gray-50 dark:bg-gray-900/50 py-12 scroll-mt-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 dark:text-gray-100">
            Simple pricing
          </h2>
          <p className="text-center text-gray-500 dark:text-gray-400 mb-12">
            Choose the plan that fits your needs
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* DIY Plan */}
            <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 p-8 flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                <Wrench className="w-6 h-6 text-gray-500" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">DIY Plan</h3>
              </div>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                You manage everything yourself with our easy-to-use dashboard.
              </p>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-4xl font-extrabold text-gray-900 dark:text-gray-100">€15</span>
                <span className="text-gray-500">/month</span>
              </div>
              <p className="text-sm text-gray-400 mb-8">
                or €120/year <span className="text-green-600 font-semibold">(save €60)</span>
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  'Unlimited menu items',
                  'Two languages',
                  'Multiple menu themes',
                  'Combo deals & offers',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <Check className="w-4 h-4 text-green-500 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/sign-in?plan=diy"
                className="block text-center px-6 py-3 border border-gray-300 rounded-full font-semibold hover:bg-gray-50 transition-colors mt-auto"
              >
                Start DIY Plan
              </Link>
            </div>

            {/* Full Service Plan */}
            <div className="bg-black text-white rounded-3xl p-8 relative flex flex-col">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-blue-600 text-xs font-bold rounded-full">
                MOST POPULAR
              </span>
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="w-6 h-6 text-yellow-400" />
                <h3 className="text-xl font-bold">Full Service</h3>
              </div>
              <p className="text-gray-300 mb-6">
                We create and manage your menu for you. Just send us your content.
              </p>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-4xl font-extrabold">€30</span>
                <span className="text-gray-400">/month</span>
              </div>
              <p className="text-sm text-gray-400 mb-8">
                or €220/year <span className="text-green-400 font-semibold">(save €140)</span>
              </p>
              {/* Full Service Plan */}
              <ul className="space-y-3 mb-8">
                {[
                  'Everything in DIY',
                  'Unlimited languages',
                  'Our team builds your menu',
                  'Menu updates on request',
                  'Email support',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                    <span>
                      {item}
                      {item === 'Unlimited languages' && (
                        <span className="block text-xs text-gray-400 mt-0.5">
                          +€5/month per additional language translated
                        </span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
              <Link
                href="/sign-up?plan=full"
                className="block text-center px-6 py-3 bg-white text-black rounded-full font-semibold hover:bg-gray-100 transition-colors mt-auto"
              >
                Start Full Service
              </Link>
            </div>

            {/* Custom Design Plan */}
            <div className="bg-white dark:bg-gray-900 rounded-3xl border-2 border-blue-600 p-8 relative flex flex-col">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-blue-600 text-xs font-bold rounded-full">
                PREMIUM
              </span>
              <div className="flex items-center gap-3 mb-4">
                <Palette className="w-6 h-6 text-blue-600" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Custom Design</h3>
              </div>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                A bespoke menu design tailored to your brand.
              </p>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-4xl font-extrabold text-gray-900 dark:text-gray-100">€50</span>
                <span className="text-gray-500">/month</span>
              </div>
              <p className="text-sm text-gray-400 mb-8">
                or €450/year <span className="text-green-600 font-semibold">(save €150)</span>
              </p>
              {/* Custom Design Plan */}
              <ul className="space-y-3 mb-8">
                {[
                  'Everything in Full Service',
                  'Unlimited languages',
                  'Fully custom menu design',
                  'Monthly design revisions',
                  'Priority email support',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                    <Check className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span>
                      {item}
                      {item === 'Unlimited languages' && (
                        <span className="block text-xs text-gray-400 mt-0.5">
                          +€5/month per additional language translated
                        </span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
              <Link
                href="/sign-up?plan=custom"
                className="block text-center px-6 py-3 border border-blue-600 text-blue-600 rounded-full font-semibold hover:bg-blue-50 transition-colors mt-auto"
              >
                Start Custom Plan
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ==================== DEMO RESTAURANTS ==================== */}
      <div id="restaurants" className="px-4 py-12 max-w-4xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 dark:text-gray-100 mb-12">
          Try our demo menus
        </h2>
        <div className="grid gap-4">
          {restaurants.map((restaurant) => {
            const name = restaurant.translations[0]?.name || restaurant.slug;
            return (
              <Link
                key={restaurant.id}
                href={`/${restaurant.slug}`}
                className="flex items-center gap-4 p-4 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-colors"
              >
                <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0">
                  {restaurant.themeSettings?.logoImage ? (
                    <Image src={restaurant.themeSettings.logoImage} alt={name} width={56} height={56} className="object-cover w-full h-full" unoptimized />
                  ) : (
                    <span className="text-lg font-bold text-gray-400">{name.charAt(0)}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                    {name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {restaurant._count.menuItems} items · {restaurant.category.replace('_', ' ')}
                  </p>
                </div>
                <span className="text-gray-400">→</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}