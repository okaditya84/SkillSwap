function LoginPopup({ onClose, onLogin }) {
  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <div className="popup-header">
          <h2>Login Required</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="popup-body">
          <p>You need to login to send skill swap requests.</p>
          
          <div className="popup-actions">
            <button className="login-popup-btn" onClick={onLogin}>
              Login
            </button>
            <button className="signup-popup-btn" onClick={onLogin}>
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPopup