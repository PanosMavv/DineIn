import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string; categoryId: string }> }
) {
  const { id, categoryId } = await params;
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user.id;

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();

  try {
    // Update translation
    const translation = await prisma.categoryTranslation.findFirst({
      where: { categoryId, locale: 'en' },
    });

    if (translation) {
      await prisma.categoryTranslation.update({
        where: { id: translation.id },
        data: { name: body.name },
      });
    }

    // Update theme
    const theme = await prisma.categoryTheme.findFirst({
      where: { categoryId },
    });

    if (theme) {
      await prisma.categoryTheme.update({
        where: { id: theme.id },
        data: {
          image: body.image || null,
          emoji: body.emoji || null,
        },
      });
    } else {
      await prisma.categoryTheme.create({
        data: {
          categoryId,
          image: body.image || null,
          emoji: body.emoji || null,
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
  { params }: { params: Promise<{ id: string; categoryId: string }> }
) {
  const { id, categoryId } = await params;
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user.id;

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await prisma.category.delete({
      where: { id: categoryId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete' },
      { status: 500 }
    );
  }
}