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

  const category = await prisma.category.findFirst({
    where: { id: body.categoryId, restaurantId: id },
    select: { id: true },
  });

  if (!category) {
    return NextResponse.json({ error: 'Category not found' }, { status: 400 });
  }

  try {
    const lastItem = await prisma.menuItem.aggregate({
      where: { categoryId: body.categoryId },
      _max: { order: true },
    });

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
        order: (lastItem._max.order ?? -1) + 1,
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

export async function PATCH(
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

  const body = (await request.json().catch(() => null)) as
    | { type?: unknown; ids?: unknown; categoryId?: unknown }
    | null;

  if (
    !body ||
    !Array.isArray(body.ids) ||
    body.ids.some((entry) => typeof entry !== 'string') ||
    new Set(body.ids).size !== body.ids.length
  ) {
    return NextResponse.json({ error: 'Invalid order' }, { status: 400 });
  }

  const ids = body.ids as string[];

  try {
    if (body.type === 'category') {
      const categories = await prisma.category.findMany({
        where: { restaurantId: id },
        select: { id: true },
      });
      const ownedIds = new Set(categories.map((category) => category.id));

      if (
        ids.length !== categories.length ||
        ids.some((categoryId) => !ownedIds.has(categoryId))
      ) {
        return NextResponse.json({ error: 'Invalid order' }, { status: 400 });
      }

      await prisma.$transaction(
        ids.map((categoryId, index) =>
          prisma.category.update({
            where: { id: categoryId },
            data: { order: index },
          })
        )
      );
    } else if (body.type === 'item') {
      if (typeof body.categoryId !== 'string') {
        return NextResponse.json({ error: 'Invalid order' }, { status: 400 });
      }

      const category = await prisma.category.findFirst({
        where: { id: body.categoryId, restaurantId: id },
        select: { id: true },
      });

      if (!category) {
        return NextResponse.json({ error: 'Not found' }, { status: 404 });
      }

      const items = await prisma.menuItem.findMany({
        where: { categoryId: category.id },
        select: { id: true },
      });
      const ownedIds = new Set(items.map((item) => item.id));

      if (
        ids.length !== items.length ||
        ids.some((itemId) => !ownedIds.has(itemId))
      ) {
        return NextResponse.json({ error: 'Invalid order' }, { status: 400 });
      }

      await prisma.$transaction(
        ids.map((itemId, index) =>
          prisma.menuItem.update({
            where: { id: itemId },
            data: { order: index },
          })
        )
      );
    } else {
      return NextResponse.json({ error: 'Invalid order' }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to reorder' },
      { status: 500 }
    );
  }
}