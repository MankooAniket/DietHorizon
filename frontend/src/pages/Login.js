import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import api from '../services/api'; // Import the API service

function Login() {
  // State variables remain the same
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { setUser } = useUser();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    try {
      setLoading(true);

      // Use the API service instead of axios directly
      const response = await api.post('/auth/login', { email, password });

      // Store authentication token in localStorage
      localStorage.setItem('token', response.data.token);

      // Update the user context with returned user data
      setUser(response.data.data);

      // Redirect based on user role
      if (response.data.data.role === 'admin') {
        navigate('/admin');
      } else if (response.data.data.role === 'trainer') {
        navigate('/trainer');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2 style={styles.title}>Diet Horizon</h2>

        {/* Display error message if any */}
        {error && <div style={styles.error}>{error}</div>}

        <div style={styles.inputGroup}>
          <label htmlFor="email" style={styles.label}>Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            style={styles.input}
            required
          />
        </div>

        <button
          type="submit"
          style={styles.button}
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <p style={styles.linkContainer}>
          Don't have an account? <span onClick={() => navigate('/register')} style={styles.link}>Register</span>
        </p>
        <p style={styles.linkContainer}>
          Forgot password? <span onClick={() => navigate('/forgot-password')} style={styles.link}>Reset</span>
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
    textAlign: 'center',
    marginBottom: '15px',
    padding: '8px',
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    borderRadius: '4px',
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

export default Login;