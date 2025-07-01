import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { makeBadge } from 'badge-maker';

const prisma = new PrismaClient();

export const getBadgeSvg = async (req: Request, res: Response): Promise<void> => {
  const { monitorId } = req.params;

  try {
    const monitor = await prisma.monitor.findUnique({
      where: { id: monitorId },
      select: {
        badgeLabel: true,
        statuses: {
          orderBy: { time: 'desc' },
          take: 1,
          select: { status: true },
        },
      },
    });

    if (!monitor) {
      res.status(404).send('Monitor not found');
      return;
    }

    const status = monitor.statuses[0]?.status ?? 'down';
    const color = status === 'up' ? 'brightgreen' : 'red';

    const svg = makeBadge({
      label: monitor.badgeLabel,
      message: status,
      color,
      style: 'flat', // you can also try 'flat-square', 'plastic', etc.
    });

    res.setHeader('Content-Type', 'image/svg+xml');
    res.send(svg);
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to generate badge');
  }
};
