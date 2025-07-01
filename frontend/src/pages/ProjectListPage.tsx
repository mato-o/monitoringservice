import { useEffect, useState } from 'react';
import type { Project } from '../types/models';
import { getProjects, deleteProject } from '../api/projectApi';
import { Link } from 'react-router-dom';

const ProjectListPage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getProjects()
      .then(data => setProjects(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading projects...</p>;
  if (error) return <p>Error loading projects: {error}</p>;

  return (
    <div>
      <h2>Projects</h2>
      <ul>
        {projects.map(project => (
          <li key={project.id}>
            <Link to={`/projects/${project.id}`}>{project.label}</Link>
            <button
              onClick={async () => {
                if (confirm(`Delete project "${project.label}"? This cannot be undone.`)) {
                  await deleteProject(project.id);
                  // Remove it from the list
                  setProjects(prev => prev.filter(p => p.id !== project.id));
                }
              }}
              style={{ marginLeft: '1rem' }}
            >
              Delete
            </button>
          </li>
        ))}
        <Link to="/projects/create">
          <button>Create New Project</button>
        </Link>
      </ul>
    </div>
  );
};

export default ProjectListPage;
