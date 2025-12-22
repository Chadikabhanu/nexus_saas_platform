import { useState } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [formData, setFormData] = useState({
    tenantName: '',
    subdomain: '',
    adminEmail: '',
    adminPassword: '',
    adminFullName: ''
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/auth/register-tenant', formData);
      alert('Registration Successful! Please Login.');
      navigate('/login');
    } catch (err) {
      alert('Error: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="auth-container">
      <h2>Get Started</h2>
      <p style={{marginBottom: '20px', color: '#666'}}>Create your company workspace</p>
      <form onSubmit={handleSubmit}>
        <input placeholder="Company Name" onChange={(e) => setFormData({...formData, tenantName: e.target.value})} />
        <input placeholder="Subdomain (e.g. google)" onChange={(e) => setFormData({...formData, subdomain: e.target.value})} />
        <input placeholder="Admin Name" onChange={(e) => setFormData({...formData, adminFullName: e.target.value})} />
        <input placeholder="Admin Email" onChange={(e) => setFormData({...formData, adminEmail: e.target.value})} />
        <input type="password" placeholder="Password" onChange={(e) => setFormData({...formData, adminPassword: e.target.value})} />
        <button type="submit">Create Account</button>
      </form>
      <span className="link-text" onClick={() => navigate('/login')}>
        Already have an account? Login
      </span>
    </div>
  );
}

export default Register;
