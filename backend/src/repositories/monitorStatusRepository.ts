import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface PaginationOptions {
  limit: number;
  offset: number;
}

export const getStatusesForMonitor = async (
  monitorId: string,
  { limit, offset }: PaginationOptions
) => {
  const [items, total] = await Promise.all([
    prisma.status.findMany({
      where: { monitorId },
      orderBy: { time: 'desc' }, // was checkedAt
      skip: offset,
      take: limit,
    }),
    prisma.status.count({
      where: { monitorId },
    }),
  ]);

  return { items, total };
};
