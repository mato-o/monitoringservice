import * as projectRepository from '../repositories/projectRepository';

type ListOptions = {
  offset: number;
  limit: number;
  label?: string;
  tags?: string[];
  sort?: string; // 'label_asc' or 'label_desc'
};

export const listProjects = async (options: ListOptions) => {
  return projectRepository.getProjects(options);
};

export const createProject = async (data: {
  label: string;
  description?: string;
  tags?: string[];
}) => {
  if (!data.label) throw new Error('Label is required');
  return projectRepository.createProject(data);
};

export const getProject = async (id: string) => {
  return projectRepository.getProjectById(id);
};

export const getProjects = (options: any) => {
  return projectRepository.getProjects(options);
};

export const updateProject = async (
  id: string,
  data: { label?: string; description?: string; tags?: string[] }
) => {
  return projectRepository.updateProject(id, data);
};

export const deleteProject = async (id: string) => {
  return projectRepository.deleteProject(id);
};
