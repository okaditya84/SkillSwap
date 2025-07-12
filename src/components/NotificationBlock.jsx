import { useState, useEffect } from 'react'

function NotificationBlock({ message, type = 'success', onClose, duration = 3000 }) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onClose, 300) // Wait for fade out animation
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(onClose, 300)
  }

  return (
    <div className={`notification-block ${type} ${isVisible ? 'visible' : 'hidden'}`}>
      <div className="notification-content">
        <div className="notification-icon">
          {type === 'success' ? '✓' : type === 'error' ? '⚠' : 'ℹ'}
        </div>
        <span className="notification-message">{message}</span>
        <button className="notification-close" onClick={handleClose}>
          ×
        </button>
      </div>
    </div>
  )
}

export default NotificationBlock