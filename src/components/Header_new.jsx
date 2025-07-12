import { use } from 'react';
import { Link, useLocation } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import NotificationCenter from './NotificationCenter';

function Header({ isLoggedIn, currentUser, setIsLoggedIn }) {
  const location = useLocation();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    localStorage.removeItem('token'); // Clear the stored token
    setIsLoggedIn(false);
  };

  const handleLogin = () => {
    navigate('/login');
  };
  
  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo">
          Skill Swap Platform
        </Link>
        
        <nav className="nav">
          {isLoggedIn ? (
            <>
              <Link 
                to="/profile" 
                className={`nav-link ${location.pathname === '/profile' ? 'active' : ''}`}
              >
                Swap request
              </Link>
              
              <Link 
                to="/" 
                className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
              >
                Home
              </Link>
              
              <NotificationCenter />
              
              <Link to="/profile" className="user-avatar">
                <img src={currentUser.avatar} alt="Profile" />
              </Link>
              
              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <button className="login-btn" onClick={handleLogin}>
              Login
            </button>
          )}
        </nav>
      </div>
    </header>
  )
}

export default Header
