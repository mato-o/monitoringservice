import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <main style={{ padding: '2rem' }}>
      <h1>Monitoring app</h1>
      <p>See projects, monitors and their statuses.</p>
      <Link to="/projects">View Projects</Link>
    </main>
  );
}
