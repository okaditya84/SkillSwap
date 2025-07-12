import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import UserProfile from './pages/UserProfile';
import DetailedView from './pages/DetailedView';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import VerifyOtp from './components/VerifyOtp';
import PrivateRoute from './components/PrivateRoute';
import { SkillSwapProvider, useSkillSwap } from './contexts/SkillSwapContext';
import './App.css';

function AppContent() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState({
    id: 1,
    name: 'Current User',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
  });

  const { loading, error, clearError } = useSkillSwap();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading Skill Swap Platform...</p>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        {error && (
          <div className="error-container">
            <h3>⚠️ Error</h3>
            <p>{error}</p>
            <button className="btn-secondary" onClick={clearError}>
              Dismiss
            </button>
          </div>
        )}
        <Header isLoggedIn={isLoggedIn} currentUser={currentUser} setIsLoggedIn={setIsLoggedIn} />
          <Routes>
            <Route 
              path="/" 
              element={
                isLoggedIn ? (
                  <HomePage isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
                ) : (
                  <LoginForm setIsLoggedIn={setIsLoggedIn} />
                )
              } 
            />
            <Route 
              path="/login" 
              element={
                isLoggedIn ? (
                  <Navigate to="/" replace />
                ) : (
                  <LoginForm setIsLoggedIn={setIsLoggedIn} />
                )
              } 
            />
            <Route 
              path="/register" 
              element={
                isLoggedIn ? (
                  <Navigate to="/" replace />
                ) : (
                  <RegisterForm />
                )
              } 
            />
            <Route 
              path="/verify-otp/:userId" 
              element={<VerifyOtp setIsLoggedIn={setIsLoggedIn} />} 
            />
            <Route
              path="/profile"
              element={
                <PrivateRoute isLoggedIn={isLoggedIn}>
                  <UserProfile currentUser={currentUser} setCurrentUser={setCurrentUser} />
                </PrivateRoute>
              }
            />
            <Route
              path="/user/:id"
              element={
                <PrivateRoute isLoggedIn={isLoggedIn}>
                  <DetailedView isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
                </PrivateRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    );
  }
}

function App() {
  return (
    <SkillSwapProvider>
      <AppContent />
    </SkillSwapProvider>
  );
}

export default App;
