import { useState } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '', subdomain: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post('/auth/login', formData);
      localStorage.setItem('token', data.token);
      navigate('/dashboard');
    } catch (err) {
      alert('Login Failed: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="auth-container">
      {/* BRAND LOGO ADDED HERE */}
      <img 
        src="https://cdn-icons-png.flaticon.com/512/1680/1680412.png" 
        alt="Logo" 
        style={{ width: '60px', marginBottom: '15px' }} 
      />
      
      <h2>Nexus SaaS</h2>
      <p style={{marginBottom: '20px', color: '#666'}}>Login to your workspace</p>
      
      <form onSubmit={handleSubmit}>
        <input placeholder="Subdomain (e.g. google)" onChange={(e) => setFormData({...formData, subdomain: e.target.value})} />
        <input placeholder="Email" onChange={(e) => setFormData({...formData, email: e.target.value})} />
        <input type="password" placeholder="Password" onChange={(e) => setFormData({...formData, password: e.target.value})} />
        <button type="submit">Sign In</button>
      </form>
      
      <span className="link-text" onClick={() => navigate('/register')}>
        Don't have an account? Register here
      </span>
    </div>
  );
}

export default Login;
