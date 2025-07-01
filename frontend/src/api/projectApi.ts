import type { Project } from '../types/models';

const API = 'http://localhost:3000';

export async function getProjects(): Promise<Project[]> {
  const response = await fetch(`${API}/projects`);
  if (!response.ok) {
    throw new Error('Failed to fetch projects');
  }
  const data = await response.json();
  console.log('Fetched projects:', data); 
  return data.items;
}

export async function updateProject(id: string, data: { label: string; description?: string; tags?: string[] }) {
  const res = await fetch(`${API}/projects/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update project');
  return res.json();
}

export async function getProjectById(id: string): Promise<Project> {
  const response = await fetch(`http://localhost:3000/projects/${id}`);
  console.log('Response status:', response.status); // <-- Log response
  const data = await response.json();
  console.log('Fetched project:', data);            // <-- Log result
  return data;
}

export async function createProject(data: {
  label: string;
  description?: string;
  tags?: string[];
}) {
  const response = await fetch('http://localhost:3000/projects', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to create project');
  return response.json();
}

export async function deleteProject(id: string): Promise<void> {
  const res = await fetch(`http://localhost:3000/projects/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete project');
}



