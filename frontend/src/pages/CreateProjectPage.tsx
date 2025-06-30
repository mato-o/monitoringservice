import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProject } from '../api/projectApi';

export default function CreateProjectPage() {
  const [label, setLabel] = useState('');
  const [description, setDescription] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!label.trim()) {
      setError('Project label is required.');
      return;
    }

    try {
      await createProject({ label: label.trim(), description: description.trim(), tags });
      navigate('/projects'); // redirect to project list after success
    } catch (err) {
      console.error('Failed to create project:', err);
      setError('Failed to create project');
    }
  };

  return (
    <div>
      <h1>Create New Project</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Label:</label>
          <input type="text" value={label} onChange={e => setLabel(e.target.value)} required />
        </div>

        <div>
          <label>Description:</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} />
        </div>

        <div>
          <label>Tags:</label>
          <input
            type="text"
            value={tagInput}
            onChange={e => setTagInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' ? (e.preventDefault(), handleAddTag()) : null}
          />
          <button type="button" onClick={handleAddTag}>Add Tag</button>
          <ul>
            {tags.map(tag => (
              <li key={tag}>
                {tag} <button type="button" onClick={() => handleRemoveTag(tag)}>x</button>
              </li>
            ))}
          </ul>
        </div>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <button type="submit">Create Project</button>
      </form>
    </div>
  );
}
