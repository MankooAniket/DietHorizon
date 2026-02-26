import React, { useState } from 'react';

function BMICalculator() {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [bmi, setBmi] = useState(null);
  const [category, setCategory] = useState('');

  const calculateBMI = () => {
    const heightInMeters = height / 100;
    const bmiResult = weight / (heightInMeters * heightInMeters);
    setBmi(bmiResult.toFixed(2));

    if (bmiResult < 18.5) {
      setCategory('Underweight');
    } else if (bmiResult >= 18.5 && bmiResult < 24.9) {
      setCategory('Normal weight');
    } else if (bmiResult >= 25 && bmiResult < 29.9) {
      setCategory('Overweight');
    } else {
      setCategory('Obese');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.overlay}></div>
      <div style={styles.card}>
        <h1 style={styles.heading}>BMI Calculator</h1>
        <div style={styles.formGroup}>
          <label style={styles.label}>Weight (kg):</label>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            style={styles.input}
            placeholder="Enter weight in kg"
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Height (cm):</label>
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            style={styles.input}
            placeholder="Enter height in cm"
          />
        </div>
        <button onClick={calculateBMI} style={styles.button}>Calculate BMI</button>
        {bmi && (
          <div style={styles.result}>
            <h2>Your BMI: {bmi}</h2>
            <p>Category: {category}</p>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 'calc(100vh - 72px)',
    backgroundImage: 'url(/bmi.jpg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center center',
    padding: '20px',
    position: 'relative', // Make sure that the overlay is positioned correctly
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)', // Dark overlay to dull the background
    zIndex: 1, // Ensure it's behind the content
  },
  card: {
    backgroundColor: 'rgba(15, 15, 15, 0.9)',
    borderRadius: '16px',
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.7)',
    padding: '40px 60px',
    width: '100%',
    maxWidth: '400px',
    textAlign: 'center',
    zIndex: 2, // Ensure content is above the overlay
  },
  heading: {
    color: '#ffffff',
    fontSize: '26px',
    marginBottom: '20px',
  },
  formGroup: {
    marginBottom: '20px',
    textAlign: 'left',
  },
  label: {
    fontSize: '14px',
    color: '#e0e0e0',
    marginBottom: '5px',
    display: 'block',
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #333',
    borderRadius: '8px',
    fontSize: '15px',
    color: '#f5f5f5',
    backgroundColor: '#181818',
    outline: 'none',
  },
  button: {
    backgroundColor: '#00c896',
    color: 'white',
    padding: '12px 0',
    fontSize: '16px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    width: '100%',
    transition: 'background-color 0.3s ease',
  },
  buttonHover: {
    backgroundColor: '#45a049',
  },
  result: {
    marginTop: '20px',
    backgroundColor: 'rgba(0, 200, 150, 0.12)',
    padding: '16px',
    borderRadius: '10px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
  },
};

export default BMICalculator;
