import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

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

  const body = await request.json();

  try {
    const existing = await prisma.restaurantTheme.findUnique({
      where: { restaurantId: id },
    });

    if (existing) {
      await prisma.restaurantTheme.update({
        where: { restaurantId: id },
        data: body,
      });
    } else {
      await prisma.restaurantTheme.create({
        data: {
          restaurantId: id,
          ...body,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update theme' }, { status: 500 });
  }
}