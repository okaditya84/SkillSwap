import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Header from './components/Header'
import HomePage from './pages/HomePage'
import UserProfile from './pages/UserProfile'
import DetailedView from './pages/DetailedView'
import './App.css'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Main login state variable
  const [currentUser, setCurrentUser] = useState({
    id: 1,
    name: 'Current User',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
  });

  return (
    <Router>
      <div className="app">
        <Header 
          isLoggedIn={isLoggedIn} 
          currentUser={currentUser}
          setIsLoggedIn={setIsLoggedIn}
        />
        <main className="main-content">
          <Routes>
            <Route 
              path="/" 
              element={
                <HomePage 
                  isLoggedIn={isLoggedIn} 
                  setIsLoggedIn={setIsLoggedIn}
                />
              } 
            />
            <Route 
              path="/profile" 
              element={
                isLoggedIn ? (
                  <UserProfile 
                    currentUser={currentUser} 
                    setCurrentUser={setCurrentUser} 
                  />
                ) : (
                  <Navigate to="/" />
                )
              } 
            />
            <Route 
              path="/user/:id" 
              element={
                <DetailedView 
                  isLoggedIn={isLoggedIn}
                  setIsLoggedIn={setIsLoggedIn}
                />
              } 
            />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App