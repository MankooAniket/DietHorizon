import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import api from '../services/api';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useUser();
  const navigate = useNavigate();

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get('/orders');
      setOrders(response.data.data || []);
      setLoading(false);
    } catch (err) {
      setError('Failed to load orders');
      console.error('Error fetching orders:', err);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    fetchOrders();
  }, [user, navigate, fetchOrders]);

  const getStatusColor = (status) => {
    if (!status) return '#636e72';
    const s = status.toLowerCase();
    switch (status) {
      case 'pending':
        return '#f9ca24'; // Yellow
      case 'processing':
        return '#0984e3'; // Blue
      case 'shipped':
        return '#6c5ce7'; // Purple
      case 'delivered':
        return '#00b894'; // Green
      case 'cancelled':
        return '#d63031'; // Red
      default:
        return '#636e72'; // Grey
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <p style={styles.loading}>Loading your orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <p style={styles.error}>{error}</p>
        <button
          onClick={() => fetchOrders()}
          style={styles.retryButton}
        >
          Try Again
        </button>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div style={styles.container}>
        <div style={styles.emptyMessage}>You haven't placed any orders yet.</div>
        <button
          onClick={() => navigate('/products')}
          style={styles.shopButton}
        >
          Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Your Orders</h1>

      <div style={styles.orderList}>
        {orders.map(order => (
          <div key={order._id} style={styles.orderCard}>
            <div style={styles.orderHeader}>
              <div>
                <h3 style={styles.orderTitle}>Order #{order._id.slice(-6)}</h3>
                <p style={styles.orderDate}>
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div style={{
                ...styles.statusBadge,
                backgroundColor: getStatusColor(order.status)
              }}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </div>
            </div>

            <div style={styles.orderDetails}>
              {order.cart && order.cart.items && order.cart.items.map(item => (
                <div key={item._id} style={styles.orderItem}>
                  <img
                    src={item.image || '/placeholder.png'}
                    alt={item.name}
                    style={styles.productImage}
                  />
                  <div style={styles.productInfo}>
                    <h4 style={styles.productName}>{item.name}</h4>
                    <p style={styles.productPrice}>
                      Rs {item.price.toFixed(2)} x {item.quantity}
                    </p>
                  </div>
                  <div style={styles.itemTotal}>
                    Rs {(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            <div style={styles.orderFooter}>
              <div style={styles.orderTotal}>
                <span>Total:</span>
                <span>Rs {(order.totalPrice || order.totalAmount || 0).toFixed(2)}</span>
              </div>
              {order.status === 'pending' && (
                <button
                  style={styles.cancelButton}
                  onClick={async () => {
                    try {
                      await api.put(`/orders/${order._id}/cancel`);
                      fetchOrders();
                    } catch (err) {
                      alert('Failed to cancel order. Please try again.');
                    }
                  }}
                >
                  Cancel Order
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
    maxWidth: '1000px',
    margin: '0 auto',
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    marginBottom: '20px',
    color: '#ffffff',
  },
  loading: {
    textAlign: 'center',
    fontSize: '18px',
    color: '#ddd',
    padding: '40px',
  },
  error: {
    textAlign: 'center',
    color: '#ff6b6b',
    fontSize: '18px',
    padding: '20px',
  },
  retryButton: {
    display: 'block',
    margin: '0 auto',
    padding: '10px 15px',
    backgroundColor: '#4b7bec',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  emptyMessage: {
    textAlign: 'center',
    fontSize: '18px',
    color: '#ddd',
    marginBottom: '20px',
  },
  shopButton: {
    display: 'block',
    margin: '0 auto',
    padding: '12px 24px',
    backgroundColor: '#00b894',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
  },
  orderList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  orderCard: {
    backgroundColor: '#1e1e1e',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  orderHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px 20px',
    borderBottom: '1px solid #333',
  },
  orderTitle: {
    fontSize: '18px',
    margin: '0 0 5px 0',
    fontWeight: 'bold',
  },
  orderDate: {
    fontSize: '14px',
    color: '#aaa',
    margin: 0,
  },
  statusBadge: {
    padding: '5px 10px',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: 'bold',
  },
  orderDetails: {
    padding: '15px 20px',
    borderBottom: '1px solid #333',
  },
  orderItem: {
    display: 'flex',
    margin: '10px 0',
    padding: '10px 0',
    borderBottom: '1px solid #333',
  },
  productImage: {
    width: '60px',
    height: '60px',
    objectFit: 'cover',
    borderRadius: '4px',
    marginRight: '15px',
  },
  productInfo: {
    flex: '1',
  },
  productName: {
    margin: '0 0 5px 0',
    fontSize: '16px',
  },
  productPrice: {
    color: '#aaa',
    margin: 0,
    fontSize: '14px',
  },
  itemTotal: {
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  orderFooter: {
    padding: '15px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderTotal: {
    fontWeight: 'bold',
    fontSize: '18px',
    display: 'flex',
    gap: '10px',
  },
  cancelButton: {
    padding: '8px 16px',
    backgroundColor: '#d63031',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
};

export default Orders;