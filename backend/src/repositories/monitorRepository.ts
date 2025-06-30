import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getMonitors = async ({
  projectId, label, type, status, offset, limit,
}: {
  projectId: string;
  label?: string;
  type?: string;
  status?: string;
  offset: number;
  limit: number;
}) => {
  const where: any = { projectId };
  if (label) where.label = { contains: label, mode: 'insensitive' };
  if (type) where.type = type;

  const monitors = await prisma.monitor.findMany({
    where,
    include: {
      statuses: {
        take: 1,
        orderBy: { time: 'desc' },
      },
    },
    skip: offset,
    take: limit,
  });

  // Filter by latest status if needed
  //if (status) {
  //  return monitors.filter((m) => m.statuses[0]?.status === status);
  //}

  return monitors;
};

export async function findMonitorById(id: string) {
  return prisma.monitor.findUnique({
    where: { id },
    
  });
}


export const createMonitor = async (projectId: string, data: any) => {
  return prisma.monitor.create({
    data: { ...data, projectId },
  });
};

export const updateMonitor = async (id: string, data: any) => {
  return prisma.monitor.update({ where: { id }, data });
};

export const deleteMonitor = async (id: string) => {
  return prisma.monitor.delete({ where: { id } });
};

export const getStatuses = async (
  monitorId: string,
  opts: { from?: Date; to?: Date; status?: string }
) => {
  const where: any = { monitorId };

  if (opts.from || opts.to) {
    where.time = {};
    if (opts.from) where.time.gte = opts.from;
    if (opts.to) where.time.lte = opts.to;
  }

  if (opts.status) {
    where.status = opts.status;
  }

  return prisma.status.findMany({
    where,
    orderBy: { time: 'desc' },
  });
};
