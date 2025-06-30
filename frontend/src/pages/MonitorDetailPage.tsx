import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getMonitorById, getMonitorStatuses } from '../api/monitorApi';
import type { Monitor, Status } from '../types/models';
import { Line } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  TimeScale,
  Tooltip,
  Legend,
} from 'chart.js';
import {
  eachDayOfInterval,
  format,
  subMonths,
  startOfMonth,
  endOfMonth,
} from 'date-fns';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, TimeScale, Tooltip, Legend);

function getStatusColor(day: Date, statuses: Status[]): string {
  const dayStatuses = statuses.filter(s => {
    const statusDate = new Date(s.time);
    return statusDate.toDateString() === day.toDateString();
  });

  const failureCount = dayStatuses.filter(s => s.status === 'down').length;
  const total = dayStatuses.length;

  if (total === 0) return 'gray';
  const failureRate = failureCount / total;

  if (failureRate === 0) return 'green';
  if (failureRate <= 0.05) return 'orange';
  return 'red';
}

export default function MonitorDetailPage() {
  const { monitorId } = useParams<{ monitorId: string }>();
  const [monitor, setMonitor] = useState<Monitor | null>(null);
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [offset, setOffset] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [mode, setMode] = useState<'list' | 'calendar' | 'graph'>('list');
  const limit = 10;

  const fetchStatuses = async () => {
    if (!monitorId) return;
    try {
      const { items, total } = await getMonitorStatuses(monitorId, {
        offset,
        limit,
        status: statusFilter || undefined,
      });
      setStatuses(items);
      setTotal(total);
    } catch (err) {
      console.error('Failed to fetch statuses', err);
    }
  };

  useEffect(() => {
    if (!monitorId) return;
    getMonitorById(monitorId).then(setMonitor);
  }, [monitorId]);

  useEffect(() => {
    fetchStatuses();
    const interval = setInterval(fetchStatuses, 5000);
    return () => clearInterval(interval);
  }, [monitorId, offset, statusFilter]);

  if (!monitor) return <div>Loading monitor...</div>;

  return (
    <div>
      <h1>{monitor.label}</h1>
      <p>Type: {monitor.type}</p>

      <div>
        <button onClick={() => setMode('list')}>List</button>
        <button onClick={() => setMode('calendar')}>Calendar</button>
        <button onClick={() => setMode('graph')}>Graph</button>
      </div>

      {mode === 'list' && (
        <>
          <label>
            Filter by status:
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option value="">All</option>
              <option value="up">Up</option>
              <option value="down">Down</option>
            </select>
          </label>

          <ul>
            {statuses.map(status => (
              <li key={status.id}>
                {new Date(status.time).toLocaleString()} - {status.status} ({status.responseTime ?? 'N/A'} ms)
              </li>
            ))}
          </ul>

          <div>
            <button disabled={offset === 0} onClick={() => setOffset(offset - limit)}>Prev</button>
            <span>{offset + 1} - {Math.min(offset + limit, total)} of {total}</span>
            <button disabled={offset + limit >= total} onClick={() => setOffset(offset + limit)}>Next</button>
          </div>
        </>
      )}

      {mode === 'calendar' && (
        <div>
          {[0, 1, 2].map(offsetMonth => {
            const month = subMonths(new Date(), offsetMonth);
            const days = eachDayOfInterval({
              start: startOfMonth(month),
              end: endOfMonth(month),
            });

            return (
              <div key={offsetMonth}>
                <h3>{format(month, 'MMMM yyyy')}</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                  {days.map(day => (
                    <div
                      key={day.toISOString()}
                      title={day.toDateString()}
                      style={{
                        width: 20,
                        height: 20,
                        backgroundColor: getStatusColor(day, statuses),
                        borderRadius: 3,
                      }}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {mode === 'graph' && (
        <Line
            key={`chart-${monitorId}-${statuses.length}`} // triggers remount
            data={{
                labels: statuses.map(s => new Date(s.time)),
                datasets: [{
                label: 'Response Time (ms)',
                data: statuses.map(s => s.responseTime ?? 0),
                fill: false,
                borderColor: 'blue',
                tension: 0.1,
                }],
            }}
            options={{
                responsive: true,
                scales: {
                x: {
                    type: 'time',
                    time: {
                    tooltipFormat: 'PPpp', 
                    },
                    title: { display: true, text: 'Time' },
                },
                y: {
                    title: { display: true, text: 'Response Time (ms)' },
                },
                },
            }}
            />
      )}
    </div>
  );
}
