import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string; itemId: string }> }
) {
  const { id, itemId } = await params;
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
    await prisma.menuItem.update({
      where: { id: itemId },
      data: {
        price: body.price,
        image: body.image || null,
        originalPrice: body.originalPrice || null,
        isAvailable: body.isAvailable ?? true,
        isFeatured: body.isFeatured ?? false,
        featuredLabel: body.featuredLabel || null,
        categoryId: body.categoryId,
      },
    });

    // Update English translation
    const existingTranslation = await prisma.menuItemTranslation.findFirst({
      where: { menuItemId: itemId, locale: 'en' },
    });

    if (existingTranslation) {
      await prisma.menuItemTranslation.update({
        where: { id: existingTranslation.id },
        data: {
          name: body.name,
          description: body.description || null,
        },
      });
    } else {
      await prisma.menuItemTranslation.create({
        data: {
          menuItemId: itemId,
          locale: 'en',
          name: body.name,
          description: body.description || null,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string; itemId: string }> }
) {
  const { id, itemId } = await params;
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

  try {
    await prisma.menuItem.delete({
      where: { id: itemId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete' },
      { status: 500 }
    );
  }
}