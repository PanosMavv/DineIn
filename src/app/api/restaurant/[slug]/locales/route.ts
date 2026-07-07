import { getRestaurantLocales } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const locales = await getRestaurantLocales(slug);
  return NextResponse.json({ locales });
}