import { useState, useEffect } from 'react'
import { useSkillSwap } from '../contexts/SkillSwapContext'

function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false)
  const { 
    notifications, 
    getUnreadNotificationCount, 
    markNotificationAsRead 
  } = useSkillSwap()

  const unreadCount = getUnreadNotificationCount()
  const sortedNotifications = [...notifications].sort((a, b) => 
    new Date(b.timestamp) - new Date(a.timestamp)
  )

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      markNotificationAsRead(notification.id)
    }
  }

  const formatNotificationTime = (timestamp) => {
    const now = new Date()
    const date = new Date(timestamp)
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    
    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`
    return date.toLocaleDateString()
  }

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'new_request':
        return '📩'
      case 'request_status_changed':
        return '🔔'
      default:
        return '💬'
    }
  }

  return (
    <div className="notification-center">
      <button 
        className={`notification-bell ${unreadCount > 0 ? 'has-notifications' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        title={`${unreadCount} unread notifications`}
      >
        🔔
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount}</span>
        )}
      </button>

      {isOpen && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <h3>Notifications</h3>
            <button 
              className="close-notifications"
              onClick={() => setIsOpen(false)}
            >
              ×
            </button>
          </div>

          <div className="notification-list">
            {sortedNotifications.length === 0 ? (
              <div className="no-notifications">
                <p>No notifications yet</p>
              </div>
            ) : (
              sortedNotifications.map(notification => (
                <div
                  key={notification.id}
                  className={`notification-item ${!notification.read ? 'unread' : ''}`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="notification-icon">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="notification-content">
                    <p className="notification-message">{notification.message}</p>
                    <span className="notification-time">
                      {formatNotificationTime(notification.timestamp)}
                    </span>
                  </div>
                  {!notification.read && (
                    <div className="unread-indicator"></div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default NotificationCenter
