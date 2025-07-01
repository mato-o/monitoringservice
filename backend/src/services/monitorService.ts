import * as monitorRepository from '../repositories/monitorRepository';

export const listMonitors = async (opts: {
  projectId: string;
  label?: string;
  type?: string;
  status?: string;
  offset: number;
  limit: number;
}) => {
  return monitorRepository.getMonitors(opts);
};

export const createMonitor = async (projectId: string, data: any) => {
  if (data.type === 'ping') {
    if (!data.host || data.port == null) {
      throw new Error('Ping monitor requires host and port');
    }
  }
  if (data.type === 'website') {
    if (!data.url) {
      throw new Error('Website monitor requires URL');
    }
  }
  return monitorRepository.createMonitor(projectId, data);
};

export const updateMonitor = async (id: string, data: any) => {
  if (data.type === 'ping') {
    if (!data.host || data.port == null) {
      throw new Error('Ping monitor requires host and port');
    }
  }
  if (data.type === 'website') {
    if (!data.url) {
      throw new Error('Website monitor requires URL');
    }
  }
  return monitorRepository.updateMonitor(id, data);
};


export const deleteMonitor = async (id: string) => {
  return monitorRepository.deleteMonitor(id);
};

export const getStatuses = async (
  monitorId: string,
  opts: { from?: Date; to?: Date; status?: string }
) => {
  return monitorRepository.getStatuses(monitorId, opts);
};

export async function getMonitorById(id: string) {
  return monitorRepository.findMonitorById(id);
}