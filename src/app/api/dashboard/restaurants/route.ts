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

  if (!body.name || typeof body.name !== 'string' || !body.name.trim()) {
    return NextResponse.json({ error: 'Name is required' }, { status: 400 });
  }

  const baseSlug =
    body.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') || 'restaurant';

  let slug = baseSlug;
  let suffix = 1;
  while (await prisma.restaurant.findUnique({ where: { slug }, select: { id: true } })) {
    slug = `${baseSlug}-${suffix++}`;
  }

  const template = typeof body.template === 'string' ? body.template : 'simple-list';

  try {
    const restaurant = await prisma.restaurant.create({
      data: {
        slug,
        category: 'RESTAURANT',
        ownerId: userId,
        translations: {
          create: {
            locale: 'en',
            name: body.name.trim(),
            description: body.description?.trim() || null,
          },
        },
        themeSettings: {
          create: {
            template,
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