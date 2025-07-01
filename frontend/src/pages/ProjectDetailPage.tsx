import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProjectById } from '../api/projectApi';
import type { Project, Monitor } from '../types/models';
import { createMonitor } from '../api/monitorApi';

export default function ProjectDetailPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [project, setProject] = useState<Project | null>(null);

const [newMonitor, setNewMonitor] = useState({
  label: '',
  periodicity: 60,
  type: '',
  badgeLabel: '',
  host: '',
  port: 80,
  url: '',
  checkStatus: false,
  keywords: '',
});

const handleCreateMonitor = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!projectId) return;

  const monitorData: any = {
    label: newMonitor.label,
    periodicity: newMonitor.periodicity,
    type: newMonitor.type,
    badgeLabel: newMonitor.badgeLabel,
  };

  if (newMonitor.type === 'ping') {
    monitorData.host = newMonitor.host;
    monitorData.port = newMonitor.port;
  }

  if (newMonitor.type === 'website') {
    monitorData.url = newMonitor.url;
    monitorData.checkStatus = newMonitor.checkStatus;
    monitorData.keywords = newMonitor.keywords
      ? newMonitor.keywords.split(',').map(k => k.trim()).filter(Boolean)
      : [];
  }

  try {
    const created = await createMonitor(projectId, monitorData);
    setProject(prev =>
      prev
        ? { ...prev, monitors: [...(prev.monitors || []), created] }
        : prev
    );
    setNewMonitor({
      label: '',
      periodicity: 60,
      type: '',
      badgeLabel: '',
      host: '',
      port: 80,
      url: '',
      checkStatus: false,
      keywords: '',
    });
    setIsModalOpen(false); // close popup
  } catch (err) {
    console.error('Failed to create monitor', err);
  }
};

  useEffect(() => {
    if (!projectId) return;
    console.log('Fetching project by ID:', projectId);

    getProjectById(projectId)
      .then((data) => {
        console.log('Got project:', data);
        setProject(data);
      })
      .catch((err) => {
        console.error('Failed to fetch project:', err);
      });
  }, [projectId]);

  if (!project) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{project.label}</h1>
      <p>{project.description}</p>
      <p>Tags: {project.tags?.join(', ')}</p>
      <Link to={`/projects/${project.id}/edit`}>
        <button>Edit Project</button>
      </Link>
      <button onClick={() => setIsModalOpen(true)}>+ Create Monitor</button>
      <h2>Monitors</h2>
      {project.monitors && project.monitors.length > 0 ? (
        <ul>
          {project.monitors.map((monitor: Monitor) => (
            <li key={monitor.id}>
              <Link to={`/monitors/${monitor.id}`}>{monitor.label}</Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>No monitors yet.</p>
      )}
{isModalOpen && (
  <div
    style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      color:'#000',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    }}
  >
    <div
      style={{
        background: '#f2f2f2',
        padding: '2rem',
        borderRadius: '12px',
        minWidth: '350px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
      }}
    >
      <h3 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Create Monitor</h3>

      <form onSubmit={handleCreateMonitor}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            alignItems: 'center',
          }}
        >
          {/* Type always shown first */}
          <label style={{ width: '100%' }}>
            Type:
            <select
              value={newMonitor.type}
              onChange={(e) => setNewMonitor({ ...newMonitor, type: e.target.value })}
              required
              style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
            >
              <option value="">Select type</option>
              <option value="ping">Ping</option>
              <option value="website">Website</option>
            </select>
          </label>

          {newMonitor.type && (
            <>
              <label style={{ width: '100%' }}>
                Label:
                <input
                  type="text"
                  value={newMonitor.label}
                  onChange={(e) => setNewMonitor({ ...newMonitor, label: e.target.value })}
                  required
                  style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
                />
              </label>

              <label style={{ width: '100%' }}>
                Periodicity (5–300s):
                <input
                  type="number"
                  min={5}
                  max={300}
                  value={newMonitor.periodicity}
                  onChange={(e) =>
                    setNewMonitor({ ...newMonitor, periodicity: parseInt(e.target.value) })
                  }
                  required
                  style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
                />
              </label>

              <label style={{ width: '100%' }}>
                Badge Label:
                <input
                  type="text"
                  value={newMonitor.badgeLabel}
                  onChange={(e) => setNewMonitor({ ...newMonitor, badgeLabel: e.target.value })}
                  required
                  style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
                />
              </label>

              {newMonitor.type === 'ping' && (
                <>
                  <label style={{ width: '100%' }}>
                    Host:
                    <input
                      type="text"
                      value={newMonitor.host || ''}
                      onChange={(e) => setNewMonitor({ ...newMonitor, host: e.target.value })}
                      required
                      style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
                    />
                  </label>

                  <label style={{ width: '100%' }}>
                    Port:
                    <input
                      type="number"
                      min={1}
                      max={65535}
                      value={newMonitor.port}
                      onChange={(e) => setNewMonitor({ ...newMonitor, port: parseInt(e.target.value) })}
                      required
                      style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
                    />
                  </label>
                </>
              )}

              {newMonitor.type === 'website' && (
                <>
                  <label style={{ width: '100%' }}>
                    URL:
                    <input
                      type="text"
                      value={newMonitor.url || ''}
                      onChange={(e) => setNewMonitor({ ...newMonitor, url: e.target.value })}
                      required
                      style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
                    />
                  </label>

                  <label style={{ width: '100%' }}>
                    Check status code (200–299):
                    <input
                      type="checkbox"
                      checked={newMonitor.checkStatus}
                      onChange={(e) => setNewMonitor({ ...newMonitor, checkStatus: e.target.checked })}
                      style={{ marginLeft: '0.5rem' }}
                    />
                  </label>

                  <label style={{ width: '100%' }}>
                    Keywords (comma-separated):
                    <input
                      type="text"
                      value={newMonitor.keywords}
                      onChange={(e) => setNewMonitor({ ...newMonitor, keywords: e.target.value })}
                      placeholder="e.g. Welcome,Dashboard"
                      style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
                    />
                  </label>
                </>
              )}
            </>
          )}

          {/* Submit + Cancel */}
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button
              type="submit"
              disabled={!newMonitor.type}
              style={{ padding: '0.5rem 1rem' }}
            >
              Create
            </button>
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              style={{ padding: '0.5rem 1rem' }}
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
)}

    </div>
   
  );
}
