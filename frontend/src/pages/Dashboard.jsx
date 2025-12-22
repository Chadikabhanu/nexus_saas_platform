import { useEffect, useState } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState({ name: '', description: '' });
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data } = await API.get('/projects');
      setProjects(data.data);
    } catch (err) {
      navigate('/login');
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await API.post('/projects', newProject);
      fetchProjects(); 
      setNewProject({ name: '', description: '' });
    } catch (err) {
      alert('Error creating project');
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>🚀 Workspace</h1>
        <button className="secondary" onClick={() => { localStorage.removeItem('token'); navigate('/login'); }}>
          Logout
        </button>
      </div>

      <div className="create-card">
        <h3 style={{marginBottom: '1rem'}}>Create New Project</h3>
        <form onSubmit={handleCreate} style={{ flexDirection: 'row' }}>
          <input 
            placeholder="Project Name" 
            value={newProject.name} 
            onChange={(e) => setNewProject({...newProject, name: e.target.value})} 
            style={{flex: 1}}
          />
          <input 
            placeholder="Description" 
            value={newProject.description} 
            onChange={(e) => setNewProject({...newProject, description: e.target.value})} 
            style={{flex: 2}}
          />
          <button type="submit" style={{width: 'auto'}}>+ Add</button>
        </form>
      </div>

      <h3 style={{marginBottom: '1rem'}}>Your Projects</h3>
      {projects.length === 0 ? (
        <p style={{color: '#888', fontStyle: 'italic'}}>No projects yet. Create one above!</p>
      ) : (
        <div className="project-list">
          {projects.map(p => (
            <div key={p.id} className="project-card">
              <h4>{p.name}</h4>
              <p>{p.description}</p>
              <div style={{marginTop: '10px', fontSize: '0.8rem', color: '#999'}}>
                ID: {p.id.substring(0, 8)}...
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
