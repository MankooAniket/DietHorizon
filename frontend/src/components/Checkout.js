import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useUser } from '../context/UserContext';
import api from '../services/api';


function Checkout() {
  const navigate = useNavigate();
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { user } = useUser();
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!user) {
        alert('Please log in to place an order');
        navigate('/login');
        return;
      }

      if (!address) {
        alert('Please enter a shipping address');
        setLoading(false);
        return;
      }

      if (cartItems.length === 0) {
        alert('Your cart is empty');
        navigate('/products');
        return;
      }

      // Prepare the order data in the correct format
      const orderData = {
        items: cartItems.map(item => ({
          product: item.id || item._id || item.productId,
          name: item.name,
          image: item.img || item.image,
          quantity: item.quantity,
          // Strip "Rs " prefix if present so backend gets a number
          price: typeof item.price === 'string'
            ? parseFloat(item.price.replace('Rs ', ''))
            : item.price,
        })),
        shippingAddress: address,
        paymentMethod: paymentMethod,
      };

      // Log the complete order data for debugging
      console.log('Sending order data:', JSON.stringify(orderData, null, 2));

      const response = await api.post('/orders', orderData);
      console.log('Order success response:', response.data);

      clearCart();
      navigate('/order-success');
    } catch (error) {
      // Enhanced error logging
      console.error('Order error details:', error.response?.data);
      console.error('Full error object:', error);

      // Show a more helpful error message to the user
      if (error.response?.data?.error?.message) {
        alert(`Error: ${error.response.data.error.message}`);
      } else if (error.response?.data?.message) {
        alert(`Error: ${error.response.data.message}`);
      } else {
        alert('Failed to place order. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };
  
  if (cartItems.length === 0) {
    return (
      <div style={styles.container}>
        <h2 style={styles.heading}>Checkout</h2>
        <p style={styles.emptyMessage}>Your cart is empty</p>
        <button
          onClick={() => navigate('/products')}
          style={styles.shopButton}
        >
          Shop Now
        </button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Checkout</h2>
      
      <div style={styles.orderSummary}>
        <h3 style={styles.subheading}>Order Summary</h3>
        {cartItems.map(item => (
          <div key={item.id} style={styles.orderItem}>
            <span>{item.name} x {item.quantity}</span>
            <span>Rs {parseFloat(item.price.replace('Rs ', '')) * item.quantity}</span>
          </div>
        ))}
        <div style={styles.total}>
          <strong>Total:</strong>
          <strong>Rs {getCartTotal()}</strong>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Shipping Address</label>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            style={styles.textarea}
            required
            placeholder="Enter your full shipping address"
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Payment Method</label>
          <div style={styles.paymentOptions}>
            <label style={styles.paymentOption}>
              <input
                type="radio"
                value="cod"
                checked={paymentMethod === 'cod'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              Cash on Delivery
            </label>
          </div>
        </div>

        <button
          type="submit"
          style={styles.submitButton}
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Place Order'}
        </button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '2rem',
    color: '#fff',
  },
  heading: {
    fontSize: '2rem',
    fontWeight: 'bold',
    marginBottom: '2rem',
    textAlign: 'center',
  },
  subheading: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    marginBottom: '1rem',
  },
  orderSummary: {
    backgroundColor: '#1e1e1e',
    padding: '1.5rem',
    borderRadius: '8px',
    marginBottom: '2rem',
  },
  orderItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0.5rem 0',
    borderBottom: '1px solid #333',
  },
  total: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '1rem 0',
    marginTop: '1rem',
    borderTop: '2px solid #333',
    fontSize: '1.2rem',
  },
  form: {
    backgroundColor: '#1e1e1e',
    padding: '1.5rem',
    borderRadius: '8px',
  },
  formGroup: {
    marginBottom: '1.5rem',
  },
  label: {
    display: 'block',
    marginBottom: '0.5rem',
    fontSize: '1.1rem',
  },
  textarea: {
    width: '100%',
    padding: '0.75rem',
    borderRadius: '4px',
    backgroundColor: '#333',
    border: '1px solid #444',
    color: '#fff',
    minHeight: '100px',
  },
  paymentOptions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  paymentOption: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    cursor: 'pointer',
  },
  submitButton: {
    width: '100%',
    padding: '1rem',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1.1rem',
    transition: 'background-color 0.2s',
  },
  emptyMessage: {
    textAlign: 'center',
    fontSize: '1.2rem',
    marginBottom: '2rem',
  },
  shopButton: {
    display: 'block',
    margin: '0 auto',
    padding: '1rem 2rem',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1.1rem',
  },
};

export default Checkout; 