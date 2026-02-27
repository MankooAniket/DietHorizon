import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import UserDashboard from './pages/UserDashboard';
import TrainerDashboard from './pages/TrainerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import BMICalculator from './pages/BMICalculator';
import ProfileSettings from './pages/ProfileSettings';
import Workouts from './pages/Workouts';
import Progress from './pages/Progress';
import ProductList from './components/ProductList';
import ProtectedRoute from './routes/ProtectedRoute';
import AdminRoute from './routes/AdminRoute';
import DietPlans from './pages/DietPlans';
import AiRecipeGenerator from './pages/AiRecipeGenerator';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import Orders from './pages/Orders';
import AdminUsers from './pages/AdminUsers';
import ProductDetails from './pages/ProductDetails';
import WorkoutPlanForm from './components/WorkoutPlanForm';
import DietPlanForm from './components/DietPlanForm';
import TrainerClients from './pages/TrainerClients';
import ClientDetail from './pages/ClientDetail';

function App() {
  return (
    <Router>
      <CartProvider>
        <div style={styles.background}>
          <Navbar />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/bmi-calculator" element={<BMICalculator />} />
            <Route path="/product/:id" element={<ProductDetails />} />

            {/* Protected User Routes */}
            <Route path="/dashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
            <Route path="/diet-plans" element={<ProtectedRoute><DietPlans /></ProtectedRoute>} />
            <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><ProfileSettings /></ProtectedRoute>} />
            <Route path="/products" element={<ProtectedRoute><ProductList /></ProtectedRoute>} />
            <Route path="/workouts" element={<ProtectedRoute><Workouts /></ProtectedRoute>} />
            <Route path="/progress" element={<ProtectedRoute><Progress /></ProtectedRoute>} />
            <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
            <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
            <Route path="/order-success" element={<ProtectedRoute><OrderSuccess /></ProtectedRoute>} />
            <Route path="/recipes-generator" element={<ProtectedRoute><AiRecipeGenerator /></ProtectedRoute>} />

            {/* Trainer Routes */}
            <Route path="/trainer" element={<ProtectedRoute><TrainerDashboard /></ProtectedRoute>} />
            <Route path="/trainer/diet-plans" element={<ProtectedRoute><DietPlans /></ProtectedRoute>} />
            <Route path="/trainer/workouts" element={<ProtectedRoute><Workouts /></ProtectedRoute>} />
            <Route path="/trainer/clients" element={<ProtectedRoute><TrainerClients /></ProtectedRoute>} />
            <Route path="/trainer/diet-plans/create" element={<ProtectedRoute><DietPlanForm /></ProtectedRoute>} />
            <Route path="/trainer/workouts/create" element={<ProtectedRoute><WorkoutPlanForm /></ProtectedRoute>} />
            <Route path="/trainer/clients/:id" element={<ProtectedRoute><ClientDetail /></ProtectedRoute>} />

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
          </Routes>
        </div>
      </CartProvider>
    </Router>
  );
}

const styles = {
  background: {
    backgroundColor: '#121212',
    minHeight: '100vh',
    color: 'white'
  }
};

export default App;