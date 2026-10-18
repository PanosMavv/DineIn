import { getTranslations } from 'next-intl/server';

interface Restaurant {
  id: string;
  slug: string;
  _count: { menuItems: number };
  translations: { name: string }[];
  themeSettings?: { logoImage: string | null } | null;
}

interface Props {
  restaurant: Restaurant;
}

export async function RestaurantListItem({ restaurant }: Props) {
  const t = await getTranslations('dashboard.restaurantCard');
  const name = restaurant.translations[0]?.name || restaurant.slug;

  return (
    <div className="flex items-center gap-4 flex-1 min-w-0">
      <div className="w-14 h-14 rounded-full overflow-hidden bg-surface-2 flex items-center justify-center shrink-0">
        {restaurant.themeSettings?.logoImage ? (
          <img
            src={restaurant.themeSettings.logoImage}
            alt={name}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-lg font-bold text-ink-subtle">{name.charAt(0)}</span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-base font-semibold text-ink truncate">{name}</h3>
        <p className="text-sm text-ink-subtle">
          {restaurant._count.menuItems} {t('items')}
        </p>
      </div>
    </div>
  );
}