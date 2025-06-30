import * as monitorStatusRepository from '../repositories/monitorStatusRepository';

interface PaginationOptions {
  limit: number;
  offset: number;
}

export const getStatusesForMonitor = async (
  monitorId: string,
  options: PaginationOptions
) => {
  return monitorStatusRepository.getStatusesForMonitor(monitorId, options);
};
