import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string; locale: string }> }
) {
  const { id, locale } = await params;
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user.id;

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Delete restaurant translation
    await prisma.restaurantTranslation.deleteMany({
      where: { restaurantId: id, locale },
    });

    // Delete category translations
    const categories = await prisma.category.findMany({
      where: { restaurantId: id },
      select: { id: true },
    });

    for (const cat of categories) {
      await prisma.categoryTranslation.deleteMany({
        where: { categoryId: cat.id, locale },
      });

      // Delete item translations for items in this category
      const items = await prisma.menuItem.findMany({
        where: { categoryId: cat.id },
        select: { id: true },
      });

      for (const item of items) {
        await prisma.menuItemTranslation.deleteMany({
          where: { menuItemId: item.id, locale },
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string; locale: string }> }
) {
  const { id, locale } = await params;
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user.id;

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();

  try {
    const existing = await prisma.restaurantTranslation.findFirst({
      where: { restaurantId: id, locale },
    });

    if (existing) {
      await prisma.restaurantTranslation.update({
        where: { id: existing.id },
        data: { isActive: body.isActive },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to toggle' }, { status: 500 });
  }
}