import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user.id;

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const restaurant = await prisma.restaurant.findFirst({
    where: { id, ownerId: userId },
  });

  if (!restaurant) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const body = await request.json();

  try {
    const item = await prisma.menuItem.create({
      data: {
        price: body.price,
        image: body.image || null,
        originalPrice: body.originalPrice || null,
        isAvailable: body.isAvailable ?? true,
        isFeatured: body.isFeatured ?? false,
        featuredLabel: body.featuredLabel || null,
        restaurantId: id,
        categoryId: body.categoryId,
        translations: {
          create: {
            locale: 'en',
            name: body.name,
            description: body.description || null,
          },
        },
      },
    });

    return NextResponse.json(item);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create' },
      { status: 500 }
    );
  }
}