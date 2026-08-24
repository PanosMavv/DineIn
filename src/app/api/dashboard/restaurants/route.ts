import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user.id;

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();

  // Generate slug from name
  const slug = body.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  try {
    const restaurant = await prisma.restaurant.create({
      data: {
        slug,
        category: body.type,
        ownerId: userId,
        translations: {
          create: {
            locale: 'en',
            name: body.name,
            description: body.description || null,
          },
        },
        themeSettings: {
          create: {
            template: 'simple-list',
            heroStyle: 'default',
          },
        },
      },
    });

    return NextResponse.json(restaurant);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create restaurant' }, { status: 500 });
  }
}