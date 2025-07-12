import { createContext, useContext, useState, useEffect } from 'react'
import skillSwapService from '../services/skillSwapService'

const SkillSwapContext = createContext()

export const useSkillSwap = () => {
  const context = useContext(SkillSwapContext)
  if (!context) {
    throw new Error('useSkillSwap must be used within a SkillSwapProvider')
  }
  return context
}

export const SkillSwapProvider = ({ children }) => {
  const [skillSwapRequests, setSkillSwapRequests] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [notifications, setNotifications] = useState([])
  const [currentUser, setCurrentUser] = useState(null)
  
  // Initialize data on mount
  useEffect(() => {
    const initializeData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Initialize default data
        await skillSwapService.initializeDefaultData()

        // Load users
        const loadedUsers = await skillSwapService.getUsers()
        setUsers(loadedUsers)

        // Load requests
        const loadedRequests = await skillSwapService.getRequests()
        setSkillSwapRequests(loadedRequests)

        // Load current user from localStorage if authenticated
        const token = localStorage.getItem('skillSwap_token')
        const savedUser = localStorage.getItem('skillSwap_currentUser')
        
        if (token && savedUser) {
          try {
            const parsedUser = JSON.parse(savedUser)
            // Verify token is still valid
            const verifiedUser = await skillSwapService.getCurrentUser(token)
            if (verifiedUser) {
              setCurrentUser(verifiedUser)
            } else {
              // Token invalid, clear localStorage
              localStorage.removeItem('skillSwap_token')
              localStorage.removeItem('skillSwap_currentUser')
            }
          } catch (error) {
            console.error('Error loading saved user:', error)
            localStorage.removeItem('skillSwap_token')
            localStorage.removeItem('skillSwap_currentUser')
          }
        }
        
        // Load notifications
        const loadedNotifications = await skillSwapService.getNotifications()
        setNotifications(loadedNotifications)

      } catch (err) {
        setError('Failed to initialize data: ' + err.message)
        console.error('Initialization error:', err)
      } finally {
        setLoading(false)
      }
    }

    initializeData()
  }, [])

  // Save current user to localStorage whenever it changes (only if user is logged in)
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('skillSwap_currentUser', JSON.stringify(currentUser))
    }
  }, [currentUser])

  // Refresh notifications periodically
  useEffect(() => {
    if (!currentUser) return

    const refreshNotifications = async () => {
      try {
        const userNotifications = await skillSwapService.getUserNotifications(currentUser.id)
        setNotifications(userNotifications)
      } catch (err) {
        console.error('Error refreshing notifications:', err)
      }
    }

    const interval = setInterval(refreshNotifications, 30000) // Refresh every 30 seconds
    return () => clearInterval(interval)
  }, [currentUser])

  // Send a skill swap request
  const sendSkillSwapRequest = async (requestData) => {
    if (!currentUser) {
      throw new Error('You must be logged in to send requests')
    }
    
    try {
      setError(null)
      
      const newRequest = await skillSwapService.createRequest({
        fromUserId: currentUser.id,
        fromUserName: currentUser.name,
        fromUserAvatar: currentUser.avatar,
        toUserId: requestData.toUserId,
        toUserName: requestData.toUserName,
        toUserAvatar: requestData.toUserAvatar,
        offeredSkill: requestData.offeredSkill,
        wantedSkill: requestData.wantedSkill,
        message: requestData.message
      })

      // Update local state
      setSkillSwapRequests(prev => [...prev, newRequest])
      
      return newRequest
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  // Get requests sent by current user
  const getSentRequests = () => {
    if (!currentUser) return []
    return skillSwapRequests.filter(request => request.fromUserId === currentUser.id)
  }

  // Get requests received by current user
  const getReceivedRequests = () => {
    if (!currentUser) return []
    return skillSwapRequests.filter(request => request.toUserId === currentUser.id)
  }

  // Get all requests for a specific user (both sent and received)
  const getUserRequests = (userId) => {
    return skillSwapRequests.filter(request => 
      request.fromUserId === userId || request.toUserId === userId
    )
  }

  // Accept a skill swap request
  const acceptSkillSwapRequest = async (requestId) => {
    try {
      setError(null)
      
      const updatedRequest = await skillSwapService.updateRequestStatus(
        requestId, 
        'accepted', 
        currentUser.id
      )

      setSkillSwapRequests(prev => 
        prev.map(request => 
          request.id === requestId ? updatedRequest : request
        )
      )

      return updatedRequest
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  // Reject a skill swap request
  const rejectSkillSwapRequest = async (requestId) => {
    try {
      setError(null)
      
      const updatedRequest = await skillSwapService.updateRequestStatus(
        requestId, 
        'rejected', 
        currentUser.id
      )

      setSkillSwapRequests(prev => 
        prev.map(request => 
          request.id === requestId ? updatedRequest : request
        )
      )

      return updatedRequest
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  // Cancel a skill swap request (for sender)
  const cancelSkillSwapRequest = async (requestId) => {
    try {
      setError(null)
      
      const updatedRequest = await skillSwapService.updateRequestStatus(
        requestId, 
        'cancelled', 
        currentUser.id
      )

      setSkillSwapRequests(prev => 
        prev.map(request => 
          request.id === requestId ? updatedRequest : request
        )
      )

      return updatedRequest
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  // Delete a skill swap request completely
  const deleteSkillSwapRequest = async (requestId) => {
    try {
      setError(null)
      
      await skillSwapService.deleteRequest(requestId)
      setSkillSwapRequests(prev => prev.filter(request => request.id !== requestId))
      
      return true
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  // Check if current user has already sent a request to a specific user
  const hasExistingRequest = (toUserId) => {
    if (!currentUser) return false
    return skillSwapRequests.some(request => 
      request.fromUserId === currentUser.id && 
      request.toUserId === toUserId && 
      request.status === 'pending'
    )
  }

  // Get request status between current user and another user
  const getRequestStatus = (otherUserId) => {
    if (!currentUser) return { type: 'none', status: null, request: null }
    
    const sentRequest = skillSwapRequests.find(request => 
      request.fromUserId === currentUser.id && 
      request.toUserId === otherUserId
    )
    const receivedRequest = skillSwapRequests.find(request => 
      request.fromUserId === otherUserId && 
      request.toUserId === currentUser.id
    )

    if (sentRequest) {
      return { type: 'sent', status: sentRequest.status, request: sentRequest }
    }
    if (receivedRequest) {
      return { type: 'received', status: receivedRequest.status, request: receivedRequest }
    }
    
    return { type: 'none', status: null, request: null }
  }

  // Update current user information
  const updateCurrentUser = async (updates) => {
    if (!currentUser) {
      throw new Error('You must be logged in to update profile')
    }
    
    try {
      setError(null)
      
      const updatedUser = await skillSwapService.updateUser(currentUser.id, updates)
      setCurrentUser(updatedUser)
      
      // Update user in users array
      setUsers(prev => 
        prev.map(user => 
          user.id === currentUser.id ? updatedUser : user
        )
      )
      
      return updatedUser
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  // Get all users (excluding current user for home page)
  const getAllUsers = (excludeCurrentUser = false) => {
    if (excludeCurrentUser && currentUser) {
      return users.filter(user => user.id !== currentUser.id)
    }
    return users
  }

  // Get user by ID
  const getUserById = (userId) => {
    return users.find(user => user.id === parseInt(userId))
  }

  // Get users with their current request status relative to current user
  const getUsersWithRequestStatus = () => {
    if (!currentUser) return users
    
    return users
      .filter(user => user.id !== currentUser.id)
      .map(user => {
        const requestStatus = getRequestStatus(user.id)
        return {
          ...user,
          requestStatus: requestStatus.status,
          requestType: requestStatus.type,
          request: requestStatus.request
        }
      })
  }

  // Filter users by request status
  const getUsersByRequestStatus = (status) => {
    const usersWithStatus = getUsersWithRequestStatus()
    
    switch (status) {
      case 'All':
        return usersWithStatus.filter(user => !user.requestStatus)
      case 'Pending':
        return usersWithStatus.filter(user => user.requestStatus === 'pending')
      case 'Accepted':
        return usersWithStatus.filter(user => user.requestStatus === 'accepted')
      case 'Rejected':
        return usersWithStatus.filter(user => user.requestStatus === 'rejected')
      case 'Cancelled':
        return usersWithStatus.filter(user => user.requestStatus === 'cancelled')
      default:
        return usersWithStatus
    }
  }

  // Mark notification as read
  const markNotificationAsRead = async (notificationId) => {
    if (!currentUser) return
    
    try {
      await skillSwapService.markNotificationAsRead(currentUser.id, notificationId)
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId ? { ...notif, read: true } : notif
        )
      )
    } catch (err) {
      console.error('Error marking notification as read:', err)
    }
  }

  // Get unread notification count
  const getUnreadNotificationCount = () => {
    return notifications.filter(notif => !notif.read).length
  }

  // Clear error
  const clearError = () => {
    setError(null)
  }

  // Format timestamp for display
  const formatTimestamp = (timestamp) => {
    const now = new Date()
    const date = new Date(timestamp)
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
    
    return date.toLocaleDateString()
  }

  // Authentication functions
  const login = async (credentials) => {
    try {
      setLoading(true)
      setError(null)
      
      const result = await skillSwapService.login(credentials)
      
      if (result.success) {
        setCurrentUser(result.user)
        return result
      } else {
        throw new Error(result.message || 'Login failed')
      }
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const register = async (userData) => {
    try {
      setLoading(true)
      setError(null)
      
      const result = await skillSwapService.register(userData)
      
      if (result.success) {
        setCurrentUser(result.user)
        return result
      } else {
        throw new Error(result.message || 'Registration failed')
      }
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      await skillSwapService.logout()
      setCurrentUser(null)
      localStorage.removeItem('skillSwap_token')
      localStorage.removeItem('skillSwap_currentUser')
      return { success: true, message: 'Logged out successfully' }
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  const isLoggedIn = () => {
    return currentUser !== null && localStorage.getItem('skillSwap_token') !== null
  }

  const value = {
    // State
    skillSwapRequests,
    currentUser,
    users,
    loading,
    error,
    notifications,

    // Actions
    sendSkillSwapRequest,
    acceptSkillSwapRequest,
    rejectSkillSwapRequest,
    cancelSkillSwapRequest,
    deleteSkillSwapRequest,
    updateCurrentUser,

    // Authentication
    login,
    register,
    logout,
    isLoggedIn,

    // Getters
    getSentRequests,
    getReceivedRequests,
    getUserRequests,
    hasExistingRequest,
    getRequestStatus,
    getAllUsers,
    getUserById,
    getUsersWithRequestStatus,
    getUsersByRequestStatus,

    // Notifications
    markNotificationAsRead,
    getUnreadNotificationCount,

    // Utilities
    formatTimestamp,
    clearError
  }

  return (
    <SkillSwapContext.Provider value={value}>
      {children}
    </SkillSwapContext.Provider>
  )
}
