import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { RestaurantForm } from '@/components/Dashboard/RestaurantForm';

export default async function NewRestaurantPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user.id;

  if (!userId) return null;

  return (
    <div>
      <Link
        href="/dashboard/restaurants"
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Restaurants
      </Link>

      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">
        Create Restaurant
      </h1>

      <RestaurantForm />
    </div>
  );
}