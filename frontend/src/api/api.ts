const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export async function fetchProjects() {
  const res = await fetch(`${BASE_URL}/projects`);
  return res.json();
}
