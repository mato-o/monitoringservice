import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const renderBadge = (label: string, value: string, color: string) => {
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="120" height="20">
  <linearGradient id="b" x2="0" y2="100%">
    <stop offset="0" stop-color="#fff" stop-opacity=".7"/>
    <stop offset="1" stop-opacity=".7"/>
  </linearGradient>
  <mask id="a">
    <rect width="120" height="20" rx="3" fill="#fff"/>
  </mask>
  <g mask="url(#a)">
    <rect width="70" height="20" fill="#555"/>
    <rect x="70" width="50" height="20" fill="${color}"/>
    <rect width="120" height="20" fill="url(#b)"/>
  </g>
  <g fill="#fff" text-anchor="middle" font-family="Verdana" font-size="11">
    <text x="35" y="15">${label}</text>
    <text x="95" y="15">${value}</text>
  </g>
</svg>
`;
};

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
    const value = status === 'up' ? 'up' : 'down';
    const color = status === 'up' ? 'green' : 'red';

    res.setHeader('Content-Type', 'image/svg+xml');
    res.send(renderBadge(monitor.badgeLabel, value, color));
  } catch (err) {
    res.status(500).send('Failed to generate badge');
  }
};
