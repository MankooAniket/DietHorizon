import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { useCart } from '../context/CartContext';

function Navbar() {
  const navigate = useNavigate();
  const { user, setUser } = useUser();
  const { cartItems } = useCart();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.logo}>
        <Link to="/" style={styles.logoText}>🌿 Diet Horizon</Link>
      </div>

      <ul style={styles.navLinks}>
        <li><Link to="/" style={styles.link}>Home</Link></li>
        <li><Link to="/products" style={styles.link}>Products</Link></li>
        <li>
          <Link to="/cart" style={styles.cartLink}>
            🛒 Cart {cartItems.length > 0 && <span style={styles.cartBadge}>{cartItems.length}</span>}
          </Link>
        </li>
        <li><Link to="/bmi-calculator" style={styles.link}>BMI Calculator</Link></li>
        <li><Link to="/recipe-generator" style={styles.link}>AI Recipe Generator</Link></li>

        {user?.role === 'admin' && (
          <li><Link to="/admin" style={styles.adminLink}>Admin Dashboard</Link></li>
        )}

        {user?.role === 'trainer' && (
          <li><Link to="/trainer" style={styles.link}>Trainer Dashboard</Link></li>
        )}

        {(user?.role === 'user' || user?.role === 'guest') && (
          <li><Link to="/dashboard" style={styles.link}>Dashboard</Link></li>
        )}

        {user?.name && (
          <li>
            <button onClick={handleLogout} style={styles.logoutButton}>Logout</button>
          </li>
        )}

        {/* Profile Dropdown */}
        <li style={{ position: 'relative' }}>
          <button onClick={toggleDropdown} style={styles.profileButton}>
            <span style={styles.profileIcon}>{user?.name ? '👋' : '👤'}</span> {user?.name || 'Guest'}
            <span style={{ ...styles.dropdownArrow, transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</span>
          </button>

          {dropdownOpen && (
            <div style={styles.dropdown}>
              {!user?.name && <Link to="/login" style={styles.dropdownItem}>Login</Link>}
              {!user?.name && <Link to="/register" style={styles.dropdownItem}>Register</Link>}
              {user?.name && (
                <div style={styles.dropdownRole}>
                  Role: <strong>{user?.role}</strong>
                </div>
              )}
            </div>
          )}
        </li>
      </ul>
    </nav>
  );
}

const styles = {
  navbar: {
    background: 'linear-gradient(to right, #070707, #1e1e1e)',
    padding: '12px 40px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'sticky',
    top: 0,
    zIndex: 999,
    boxShadow: '0 4px 12px rgba(0,0,0,0.6)',
    borderBottom: '1px solid #1f1f1f',
  },
  logoText: {
    textDecoration: 'none',
    color: '#00e676',
    fontWeight: 'bold',
    fontSize: '24px',
  },
  navLinks: {
    display: 'flex',
    listStyle: 'none',
    gap: '18px',
    alignItems: 'center',
    margin: 0,
    padding: 0,
  },
  link: {
    textDecoration: 'none',
    color: '#ffffff',
    fontSize: '16px',
    padding: '8px 14px',
    borderRadius: '6px',
    transition: 'background 0.3s ease-in-out, color 0.3s ease-in-out',
  },
  cartLink: {
    textDecoration: 'none',
    color: '#ffffff',
    fontSize: '16px',
    padding: '8px 14px',
    borderRadius: '6px',
    transition: 'background 0.3s ease-in-out, color 0.3s ease-in-out',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  cartBadge: {
    backgroundColor: '#4CAF50',
    color: 'white',
    borderRadius: '50%',
    padding: '2px 6px',
    fontSize: '12px',
    fontWeight: 'bold',
  },
  linkHover: {
    background: '#4CAF50',
    color: '#fff',
  },
  adminLink: {
    textDecoration: 'none',
    color: '#ff9800',
    fontWeight: 'bold',
    fontSize: '16px',
    padding: '8px 14px',
    borderRadius: '6px',
    backgroundColor: '#333',
    transition: 'background 0.3s ease-in-out',
  },
  adminLinkHover: {
    backgroundColor: '#ff9800',
    color: '#fff',
  },
  logoutButton: {
    backgroundColor: '#ff3d00',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    fontSize: '14px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '500',
    transition: 'background 0.3s ease-in-out',
  },
  logoutButtonHover: {
    backgroundColor: '#e64a19',
  },
  profileButton: {
    backgroundColor: '#333',
    color: '#fff',
    border: '1px solid #555',
    padding: '8px 14px',
    fontSize: '14px',
    borderRadius: '20px',
    cursor: 'pointer',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    position: 'relative',
  },
  profileIcon: {
    fontSize: '16px',
  },
  dropdownArrow: {
    fontSize: '12px',
    marginLeft: '5px',
    transition: 'transform 0.3s ease-in-out',
  },
  dropdown: {
    position: 'absolute',
    top: '40px',
    right: 0,
    backgroundColor: '#222',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
    padding: '10px 15px',
    display: 'flex',
    flexDirection: 'column',
    minWidth: '160px',
    zIndex: 1000,
  },
  dropdownItem: {
    color: '#eee',
    textDecoration: 'none',
    padding: '8px 0',
    fontSize: '14px',
    borderBottom: '1px solid #444',
  },
  dropdownRole: {
    marginTop: '8px',
    fontSize: '13px',
    color: '#aaa',
  },
};

export default Navbar;
