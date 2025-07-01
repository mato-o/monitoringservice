import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProjectById, updateProject } from '../api/projectApi';
import { createMonitor, updateMonitor, deleteMonitor } from '../api/monitorApi';
import type { Project, Monitor } from '../types/models';
import type { MonitorInput } from '../types/models';

export default function EditProjectPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [editingMonitor, setEditingMonitor] = useState<Monitor | null>(null);
  const [newMonitor, setNewMonitor] = useState(false);

  useEffect(() => {
    if (!projectId) return;
    getProjectById(projectId).then(setProject);
  }, [projectId]);

  const handleProjectChange = (field: keyof Project, value: any) => {
    if (!project) return;
    setProject({ ...project, [field]: value });
  };

  const handleProjectSubmit = async () => {
    if (!projectId || !project) return;
    await updateProject(projectId, {
      label: project.label,
      description: project.description,
      tags: project.tags,
    });
    navigate(`/projects/${projectId}`);
  };

const handleMonitorSubmit = async (monitor: MonitorInput) => {
  const cleaned: any = {
    label: monitor.label,
    badgeLabel: monitor.badgeLabel,
    periodicity: monitor.periodicity,
    type: monitor.type,
  };

  if (monitor.type === 'ping') {
    cleaned.host = monitor.host;
    cleaned.port = monitor.port;
  }

  if (monitor.type === 'website') {
    cleaned.url = monitor.url;
    cleaned.checkStatus = monitor.checkStatus;
    cleaned.keywords = monitor.keywords;
  }

  if (monitor.id) {
    await updateMonitor(monitor.id, cleaned);
  } else {
    await createMonitor(projectId!, cleaned);
  }

  const updated = await getProjectById(projectId!);
  setProject(updated);
  setEditingMonitor(null);
  setNewMonitor(false);
};

  const handleDeleteMonitor = async (id: string) => {
    await deleteMonitor(id);
    const updated = await getProjectById(projectId!);
    setProject(updated);
  };

  if (!project) return <div>Loading...</div>;

  return (
    <div style={{ maxWidth: 600, margin: 'auto' }}>
      <h1>Edit Project</h1>
      
      Label:     
      <input
        placeholder="Label"
        value={project.label}
        onChange={e => handleProjectChange('label', e.target.value)}
      />
      <br />
      Description: 
      <textarea
        placeholder="Description"
        value={project.description}
        onChange={e => handleProjectChange('description', e.target.value)}
      />
      <br />
      Comma-separated tags:
      <input
        placeholder="Comma-separated tags"
        value={project.tags?.join(', ') || ''}
        onChange={e =>
          handleProjectChange(
            'tags',
            e.target.value.split(',').map(tag => tag.trim())
          )
        }
      />
      <br />
      <button onClick={handleProjectSubmit}>Save Project</button>

      <h2>Monitors</h2>
      <ul>
        {project.monitors?.map(m => (
          <li key={m.id}>
            <strong>{m.label}</strong> ({m.type}) every {m.periodicity}s
            <button onClick={() => setEditingMonitor(m)}>Edit</button>
            <button onClick={() => handleDeleteMonitor(m.id)}>Delete</button>
          </li>
        ))}
      </ul>

      {/*<button onClick={() => setNewMonitor(true)}>Create Monitor</button>*/}

      {(editingMonitor || newMonitor) && (
        <ModalWrapper>
          <MonitorEditor
            monitor={
              editingMonitor
                ? {
                    ...editingMonitor,
                    type: editingMonitor.type as "" | "ping" | "website",
                    host: editingMonitor.host || "",
                    port: editingMonitor.port ?? 80,
                    url: editingMonitor.url || "",
                    checkStatus: editingMonitor.checkStatus ?? false,
                    keywords: editingMonitor.keywords ?? [],
                  }
                : {
                    label: "",
                    type: "",
                    periodicity: 60,
                    badgeLabel: "",
                    projectId: projectId!,
                    host: "",
                    port: 80,
                    url: "",
                    checkStatus: false,
                    keywords: [],
                  }
            }
            onCancel={() => {
              setEditingMonitor(null);
              setNewMonitor(false);
            }}
            onSave={handleMonitorSubmit}
          />
        </ModalWrapper>
      )}


    </div>
  );
}function MonitorEditor({
  monitor,
  onCancel,
  onSave,
}: {
  monitor: MonitorInput;
  onCancel: () => void;
  onSave: (monitor: MonitorInput) => void;
}) {
  const [local, setLocal] = useState<MonitorInput>(monitor);

  const handleChange = (field: keyof MonitorInput, value: any) => {
    setLocal({ ...local, [field]: value });
  };

  const disabled = !local.type;

  return (
    <div style={{ background: '#eee', padding: 16, marginTop: 16, borderRadius: 6 }}>
      <h3>{monitor.id ? 'Edit Monitor' : 'New Monitor'}</h3>

      Type:
      <select
        value={local.type}
        onChange={(e) => handleChange('type', e.target.value as 'ping' | 'website')}
      >
        <option value="">Select monitor type</option>
        <option value="ping">Ping</option>
        <option value="website">Website</option>
      </select>
      <br /><br />

      Label:
      <input
        placeholder="Label"
        value={local.label}
        disabled={disabled}
        onChange={(e) => handleChange('label', e.target.value)}
      />
      <br /><br />

      Badge Label:
      <input
        placeholder="Badge Label"
        value={local.badgeLabel}
        disabled={disabled}
        onChange={(e) => handleChange('badgeLabel', e.target.value)}
      />
      <br /><br />

      Periodicity:
      <input
        type="number"
        min={5}
        max={300}
        placeholder="Periodicity (5–300 sec)"
        value={local.periodicity}
        disabled={disabled}
        onChange={(e) => handleChange('periodicity', +e.target.value)}
      />
      <br /><br />

      {/* Ping Monitor */}
      {local.type === 'ping' && (
        <>
          Host (IP or name):
          <input
            placeholder="Host (IP or name)"
            value={local.host || ''}
            onChange={(e) => handleChange('host', e.target.value)}
          />
          <br /><br />
         Port:
          <input
            type="number"
            placeholder="Port"
            value={local.port || ''}
            onChange={(e) => handleChange('port', +e.target.value)}
          />
          <br /><br />
        </>
      )}

      {/* Website Monitor */}
      {local.type === 'website' && (
        <>
          URL:
          <input
            placeholder="URL"
            value={local.url || ''}
            onChange={(e) => handleChange('url', e.target.value)}
          />
          <br /><br />
          <label>
            <input
              type="checkbox"
              checked={!!local.checkStatus}
              onChange={(e) => handleChange('checkStatus', e.target.checked)}
            />
            {' '}Check Status Code
          </label>
          <br /><br />
          Keywords:
          <input
            placeholder="Keywords (comma-separated)"
            value={(local.keywords || []).join(', ')}
            onChange={(e) =>
              handleChange(
                'keywords',
                e.target.value.split(',').map(s => s.trim()).filter(Boolean)
              )
            }
          />
          <br /><br />
        </>
      )}

      <button onClick={() => onSave(local)} disabled={disabled}>Save</button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  );
}

function ModalWrapper({ children }: { children: React.ReactNode }) {
  return (
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
          background: "#f2f2f2",
          padding: "2rem",
          borderRadius: "8px",
          minWidth: "350px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
          color:'#000'
        }}
      >
        {children}
      </div>
    </div>
  );
}


