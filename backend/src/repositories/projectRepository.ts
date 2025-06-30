import { PrismaClient, Prisma } from '@prisma/client';
const prisma = new PrismaClient();

type ListOptions = {
  offset: number;
  limit: number;
  label?: string;
  tags?: string[];
  sort?: string;
};

export const getProjects = async ({ offset, limit, label, tags, sort }: ListOptions) => {
  const where = {} as any;

  if (label) {
    where.label = { contains: label, mode: 'insensitive' };
  }

  if (tags && tags.length > 0) {
    where.tags = { hasSome: tags };
  }

  /*const orderBy =
    sort === 'label_desc'
      ? { label: 'desc' }
      : sort === 'label_asc'
      ? { label: 'asc' }
      : undefined;*/

  const [items, total] = await Promise.all([
    prisma.project.findMany({ where, skip: offset, take: limit }), //orderBy
    prisma.project.count({ where }),
  ]);

  return { items, total };
};

export const getProjectById = async (id: string) => {
  return prisma.project.findUnique({
    where: { id },
    include: {
      monitors: true, 
    },
  });
};


export const createProject = async (data: {
  label: string;
  description?: string;
  tags?: string[];
}) => {
  return prisma.project.create({ data });
};

export const updateProject = async (
  id: string,
  data: { label?: string; description?: string; tags?: string[] }
) => {
  return prisma.project.update({
    where: { id },
    data,
  });
};

export const deleteProject = async (id: string) => {
  return prisma.project.delete({ where: { id } });
};
