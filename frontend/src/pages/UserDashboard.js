import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import api from '../services/api';

function UserDashboard() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [orders, setOrders] = useState([]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const ordersResponse = await api.get('/orders');
      setOrders(ordersResponse.data.data || []);
      setLoading(false);
    } catch (err) {
      setError('Failed to load dashboard data. Please try again later.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>👋 Welcome back, {user?.name || 'User'}!</h2>
      <p style={styles.infoText}>
        Manage your diet plans, track your progress, and achieve your health goals.
      </p>

      {loading ? (
        <div style={styles.loader}>Loading your dashboard...</div>
      ) : error ? (
        <div style={styles.error}>{error}</div>
      ) : (
        <div style={styles.sectionGrid}>
          {/* Diet Plans Card */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>My Diet Plans</h3>
            <p style={styles.cardContent}>View and manage your personalized diet plans.</p>
            <button
              onClick={() => navigate('/diet-plans')}
              style={styles.button}
            >
              View Diet Plans
            </button>
          </div>

          {/* Orders Card */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>My Orders</h3>
            <p style={styles.cardContent}>
              {orders.length > 0
                ? `You have ${orders.length} order(s). View your order history.`
                : 'You have no orders yet. Browse our products.'}
            </p>
            <button
              onClick={() => navigate('/orders')}
              style={styles.button}
            >
              {orders.length > 0 ? 'View Orders' : 'Shop Now'}
            </button>
          </div>

          {/* Profile Card */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>My Profile</h3>
            <p style={styles.cardContent}>Update your personal information and preferences.</p>
            <button
              onClick={() => navigate('/profile')}
              style={styles.button}
            >
              Edit Profile
            </button>
          </div>

          {/* Progress Tracking Card */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Track Progress</h3>
            <p style={styles.cardContent}>Monitor your health metrics and achievements.</p>
            <button
              onClick={() => navigate('/progress')}
              style={styles.button}
            >
              View Progress
            </button>
          </div>

          {/* Workout Plans Card */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>My Workouts</h3>
            <p style={styles.cardContent}>Access your workout routines and training schedule.</p>
            <button
              onClick={() => navigate('/workouts')}
              style={styles.button}
            >
              View Workouts
            </button>
          </div>

          {/* BMI Calculator Card */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>BMI Calculator</h3>
            <p style={styles.cardContent}>Calculate and track your Body Mass Index.</p>
            <button
              onClick={() => navigate('/bmi-calculator')}
              style={styles.button}
            >
              Calculate BMI
            </button>
          </div>

          {/* AI Diet Creator Card */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>AI Recipe Generator</h3>
            <p style={styles.cardContent}>Generate Recipes with AI assistance.</p>
            <button
              onClick={() => navigate('/recipe-generator')}
              style={styles.button}
            >
              Create Diet Plan
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: '40px 20px',
    backgroundColor: '#050505',
    minHeight: 'calc(100vh - 72px)',
    color: '#fff',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  heading: {
    fontSize: '28px',
    fontWeight: '600',
    color: '#f0f0f0',
    marginBottom: '15px',
    textAlign: 'center',
  },
  infoText: {
    fontSize: '16px',
    color: '#cccccc',
    textAlign: 'center',
    marginBottom: '40px',
  },
  sectionGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
    gap: '20px',
  },
  card: {
    backgroundColor: '#1e1e1e',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 6px 12px rgba(0,0,0,0.5)',
    textAlign: 'center',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    color: '#e0e0e0',
  },
  cardTitle: {
    fontSize: '20px',
    fontWeight: '600',
    marginBottom: '10px',
    color: '#ffffff',
  },
  cardContent: {
    fontSize: '16px',
    color: '#bbbbbb',
    marginBottom: '15px',
  },
  button: {
    backgroundColor: '#00c896',
    color: '#fff',
    padding: '10px 16px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '500',
    transition: 'background-color 0.3s ease',
  },
  loader: {
    textAlign: 'center',
    padding: '40px',
    fontSize: '18px',
    color: '#cccccc',
  },
  error: {
    textAlign: 'center',
    padding: '20px',
    color: '#ff6b6b',
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    borderRadius: '8px',
    margin: '20px 0',
  },
};

export default UserDashboard;