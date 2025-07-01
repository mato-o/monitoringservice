export type Project = {
  id: string;
  label: string;
  description?: string;
  tags?: string[];
  monitors?: Monitor[];
};

export type Monitor = {
  id: string;
  label: string;
  periodicity: number;
  type: 'ping' | 'website';
  badgeLabel: string;
  projectId: string;
  host?: string;
  port?: number;
  url?: string;
  checkStatus?: boolean;
  keywords?: string[];
};

export type MonitorInput = {
  id?: string;
  type: 'ping' | 'website' | '';
  label: string;
  badgeLabel: string;
  periodicity: number;
  projectId: string;

  host?: string;
  port?: number;

  url?: string;
  checkStatus?: boolean;
  keywords?: string[];
};

export type Status = {
  id: string;
  time: string;
  status: 'up' | 'down';
  responseTime?: number;
};
