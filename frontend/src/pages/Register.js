import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api'; 

function Register() {
  // State remains the same
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Form change handler remains the same
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.name || !formData.email || !formData.password) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);

      // Use the API service instead of axios directly
      const response = await api.post('/auth/register', formData);

      setSuccess(response.data.message || 'Registration successful!');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2 style={styles.title}>Create Account</h2>

        {/* Display error message if any */}
        {error && <div style={styles.error}>{error}</div>}

        {/* Display success message if any */}
        {success && <div style={styles.success}>{success}</div>}

        <div style={styles.inputGroup}>
          <label htmlFor="name" style={styles.label}>Full Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your full name"
            style={styles.input}
            required
          />
        </div>

        <div style={styles.inputGroup}>
          <label htmlFor="email" style={styles.label}>Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            style={styles.input}
            required
          />
        </div>

        <div style={styles.inputGroup}>
          <label htmlFor="password" style={styles.label}>Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Create a password"
            style={styles.input}
            required
          />
        </div>

        <div style={styles.inputGroup}>
          <label htmlFor="role" style={styles.label}>Account Type</label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            style={styles.select}
          >
            <option value="user">Regular User</option>
            <option value="trainer">Trainer</option>
          </select>
        </div>

        <button
          type="submit"
          style={styles.button}
          disabled={loading}
        >
          {loading ? 'Creating account...' : 'Create Account'}
        </button>

        <p style={styles.linkContainer}>
          Already have an account? <span onClick={() => navigate('/login')} style={styles.link}>Login</span>
        </p>
      </form>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#121212',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
  },
  form: {
    backgroundColor: '#1e1e1e',
    color: 'white',
    padding: '30px',
    borderRadius: '12px',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.6)',
    width: '100%',
    maxWidth: '400px',
  },
  title: {
    textAlign: 'center',
    marginBottom: '20px',
    color: 'white',
    fontSize: '24px',
  },
  error: {
    color: '#ff6b6b',
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    padding: '10px',
    borderRadius: '4px',
    textAlign: 'center',
    marginBottom: '15px',
  },
  success: {
    color: '#4CAF50',
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    padding: '10px',
    borderRadius: '4px',
    textAlign: 'center',
    marginBottom: '15px',
  },
  inputGroup: {
    marginBottom: '15px',
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    fontSize: '14px',
    marginBottom: '6px',
    color: '#e0e0e0',
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    backgroundColor: '#1c1c1c',
    border: '1px solid #333',
    borderRadius: '6px',
    color: 'white',
    marginTop: '2px',
    outline: 'none',
  },
  select: {
    width: '100%',
    padding: '10px 12px',
    backgroundColor: '#1c1c1c',
    border: '1px solid #333',
    borderRadius: '6px',
    color: 'white',
    marginTop: '2px',
    outline: 'none',
  },
  button: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginTop: '20px',
    fontWeight: 'bold',
    transition: 'background-color 0.2s',
  },
  linkContainer: {
    marginTop: '15px',
    textAlign: 'center',
    fontSize: '14px',
  },
  link: {
    color: '#4CAF50',
    cursor: 'pointer',
    textDecoration: 'underline',
  }
};

export default Register;
