import type { Monitor, Status } from '../types/models';

const API = 'http://localhost:3000';

export async function getMonitorById(id: string): Promise<Monitor> {
  const response = await fetch(`${API}/monitors/${id}`);
  if (!response.ok) throw new Error('Failed to fetch monitor');
  return await response.json();
}

export async function getMonitorStatuses(
  monitorId: string,
  options: { offset?: number; limit?: number; status?: string }
): Promise<{ items: Status[]; total: number }> {
  const params = new URLSearchParams();
  if (options.offset) params.append('offset', String(options.offset));
  if (options.limit) params.append('limit', String(options.limit));
  if (options.status) params.append('status', options.status);

  const response = await fetch(`http://localhost:3000/monitors/${monitorId}/statuses?${params}`);
  if (!response.ok) throw new Error('Failed to fetch statuses');

  const data = await response.json(); // this is just the array
  return {
    items: data,
    total: data.length // manually set total since API doesn't return it
  };
}


export async function createMonitor(projectId: string, data: Partial<Monitor>): Promise<Monitor> {
  const res = await fetch(`${API}/monitors/project/${projectId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create monitor');
  return res.json();
}

export async function updateMonitor(monitorId: string, data: Partial<Monitor>): Promise<Monitor> {
  const res = await fetch(`${API}/monitors/${monitorId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update monitor');
  return res.json();
}

export async function deleteMonitor(monitorId: string): Promise<void> {
  const res = await fetch(`${API}/monitors/${monitorId}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete monitor');
}
