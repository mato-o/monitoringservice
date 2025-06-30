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

export const createMonitor = async (projectId: string, data: {
  label: string;
  periodicity: number;
  type: string;
  host?: string;
  url?: string;
  badgeLabel: string;
}) => {
  return monitorRepository.createMonitor(projectId, data);
};

export const updateMonitor = async (id: string, data: any) => {
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