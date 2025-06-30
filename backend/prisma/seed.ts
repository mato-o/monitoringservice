import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Create two projects
  const project1 = await prisma.project.create({
    data: {
      label: 'Uptime Watcher',
      description: 'Monitoring tool for uptime',
      tags: ['monitoring', 'backend'],
    },
  });

  const project2 = await prisma.project.create({
    data: {
      label: 'Frontend Health',
      description: 'Checks status of frontend servers',
      tags: ['frontend', 'status'],
    },
  });

  // Add monitors to project1
  const monitor1 = await prisma.monitor.create({
    data: {
      label: 'API Ping',
      periodicity: 60,
      type: 'ping',
      host: 'example.com',
      badgeLabel: 'api',
      projectId: project1.id,
    },
  });

  const monitor2 = await prisma.monitor.create({
    data: {
      label: 'Main Website',
      periodicity: 120,
      type: 'website',
      url: 'https://example.com',
      badgeLabel: 'main-site',
      projectId: project1.id,
    },
  });

  // Add some status entries
  await prisma.status.createMany({
    data: [
      {
        monitorId: monitor1.id,
        time: new Date(Date.now() - 3600_000 * 2),
        status: 'up',
        responseTime: 100,
      },
      {
        monitorId: monitor1.id,
        time: new Date(Date.now() - 3600_000),
        status: 'down',
        responseTime: 0,
      },
      {
        monitorId: monitor2.id,
        time: new Date(),
        status: 'up',
        responseTime: 250,
      },
    ],
  });

  console.log('Seeding complete');
}

main()
  .catch((e) => {
    console.error('Seed error', e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
