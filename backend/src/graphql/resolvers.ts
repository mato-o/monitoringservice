import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const resolvers = {
  Query: {
    projects: async () => {
      const projects = await prisma.project.findMany({
        include: { monitors: true },
      });

      return projects.map((project) => ({
        identifier: project.id,
        label: project.label,
        description: project.description,
        monitors: project.monitors.map((m) => ({
          identifier: m.id,
          periodicity: m.periodicity,
          label: m.label,
          type: m.type,
          host: m.host,
          url: m.url,
          badgeUrl: `http://localhost:3000/badge/${m.id}.svg`,
        })),
      }));
    },

    status: async (
      _: any,
      args: { monitorIdentifier: string; from?: number; to?: number }
    ) => {
      const { monitorIdentifier, from, to } = args;

      const where: any = { monitorId: monitorIdentifier };

      if (from || to) {
        where.time = {};
        if (from) where.time.gte = new Date(from);
        if (to) where.time.lte = new Date(to);
      }

      const statuses = await prisma.status.findMany({
        where,
        orderBy: { time: "desc" },
      });

      return statuses.map((s) => ({
        date: s.time.toISOString(),
        ok: s.status === "up",
        responseTime: s.responseTime ?? null,
      }));
    },
  },
};
