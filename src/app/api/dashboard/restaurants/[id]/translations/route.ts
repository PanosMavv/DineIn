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

  const body = await request.json();

  try {
    // Restaurant translation
    await prisma.restaurantTranslation.create({
      data: {
        restaurantId: id,
        locale: body.locale,
        name: body.restaurant.name,
        description: body.restaurant.description || null,
      },
    });

    // Category translations
    for (const [categoryId, name] of Object.entries(body.categories)) {
      if (name) {
        await prisma.categoryTranslation.create({
          data: {
            categoryId,
            locale: body.locale,
            name: name as string,
          },
        });
      }
    }

    // Item translations
    for (const [itemId, data] of Object.entries(body.items)) {
      const itemData = data as { name: string; description: string };
      if (itemData.name) {
        await prisma.menuItemTranslation.create({
          data: {
            menuItemId: itemId,
            locale: body.locale,
            name: itemData.name,
            description: itemData.description || null,
          },
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to save translations' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user.id;

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();

  try {
    // Update restaurant translation
    const existingRestaurant = await prisma.restaurantTranslation.findFirst({
      where: { restaurantId: id, locale: body.locale },
    });

    if (existingRestaurant) {
      await prisma.restaurantTranslation.update({
        where: { id: existingRestaurant.id },
        data: {
          name: body.restaurant.name,
          description: body.restaurant.description || null,
        },
      });
    } else if (body.restaurant?.name) {
      // A locale can exist through category/item rows without a restaurant
      // translation. Editing it should make it publishable.
      await prisma.restaurantTranslation.create({
        data: {
          restaurantId: id,
          locale: body.locale,
          name: body.restaurant.name,
          description: body.restaurant.description || null,
        },
      });
    }

    // Update/upsert category translations
    for (const [categoryId, name] of Object.entries(body.categories)) {
      const existingCategory = await prisma.categoryTranslation.findFirst({
        where: { categoryId, locale: body.locale },
      });

      if (existingCategory) {
        await prisma.categoryTranslation.update({
          where: { id: existingCategory.id },
          data: { name: name as string },
        });
      } else if (name) {
        await prisma.categoryTranslation.create({
          data: {
            categoryId,
            locale: body.locale,
            name: name as string,
          },
        });
      }
    }

    // Update/upsert item translations
    for (const [itemId, data] of Object.entries(body.items)) {
      const itemData = data as { name: string; description: string };
      const existingItem = await prisma.menuItemTranslation.findFirst({
        where: { menuItemId: itemId, locale: body.locale },
      });

      if (existingItem) {
        await prisma.menuItemTranslation.update({
          where: { id: existingItem.id },
          data: {
            name: itemData.name,
            description: itemData.description || null,
          },
        });
      } else if (itemData.name) {
        await prisma.menuItemTranslation.create({
          data: {
            menuItemId: itemId,
            locale: body.locale,
            name: itemData.name,
            description: itemData.description || null,
          },
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to update translations' }, { status: 500 });
  }
}