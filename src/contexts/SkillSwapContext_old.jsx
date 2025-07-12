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
  const [currentUser, setCurrentUser] = useState({
    id: 1,
    name: 'Current User',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
    skillsOffered: ['Graphic Design', 'Video Editing', 'Photoshop'],
    skillsWanted: ['Python', 'JavaScript', 'Management']
  })
  
  // Central user database - in a real app, this would come from a backend
  const [users] = useState([
    {
      id: 1,
      name: 'Current User',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
      skillsOffered: ['Graphic Design', 'Video Editing', 'Photoshop'],
      skillsWanted: ['Python', 'JavaScript', 'Management'],
      rating: 4.5,
      profileVisibility: 'Public',
      location: 'San Francisco, CA',
      availability: 'Weekends'
    },
    {
      id: 2,
      name: 'Marc Demo',
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
      skillsOffered: ['JavaScript', 'Python', 'React'],
      skillsWanted: ['Database', 'Graphic Design', 'UI/UX'],
      rating: 3.9,
      profileVisibility: 'Public',
      location: 'San Francisco, CA',
      availability: 'Weekends'
    },
    {
      id: 3,
      name: 'Michelle',
      avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
      skillsOffered: ['Graphic Design', 'Photoshop', 'Illustrator'],
      skillsWanted: ['Web Development', 'Marketing', 'Photography'],
      rating: 4.2,
      profileVisibility: 'Public',
      location: 'New York, NY',
      availability: 'Evenings'
    },
    {
      id: 4,
      name: 'Joe Wills',
      avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
      skillsOffered: ['Node.js', 'MongoDB', 'Express'],
      skillsWanted: ['Frontend', 'Design', 'DevOps'],
      rating: 4.0,
      profileVisibility: 'Public',
      location: 'Austin, TX',
      availability: 'Flexible'
    },
    {
      id: 5,
      name: 'Sarah Johnson',
      avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
      skillsOffered: ['Data Analysis', 'Excel', 'SQL'],
      skillsWanted: ['Machine Learning', 'Python', 'Statistics'],
      rating: 4.7,
      profileVisibility: 'Public',
      location: 'Seattle, WA',
      availability: 'Weekdays'
    },
    {
      id: 6,
      name: 'Alex Chen',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
      skillsOffered: ['UI/UX Design', 'Figma', 'Sketch'],
      skillsWanted: ['Frontend Development', 'Animation', 'Prototyping'],
      rating: 4.3,
      profileVisibility: 'Private',
      location: 'Los Angeles, CA',
      availability: 'Flexible'
    }
  ])

  // Load requests from localStorage on mount
  useEffect(() => {
    const savedRequests = localStorage.getItem('skillSwapRequests')
    if (savedRequests) {
      try {
        const parsedRequests = JSON.parse(savedRequests)
        setSkillSwapRequests(parsedRequests)
      } catch (error) {
        console.error('Error parsing saved requests:', error)
        localStorage.removeItem('skillSwapRequests')
      }
    }

    // Load current user from localStorage
    const savedUser = localStorage.getItem('currentUser')
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser)
        setCurrentUser(parsedUser)
      } catch (error) {
        console.error('Error parsing saved user:', error)
      }
    }
  }, [])

  // Save requests to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('skillSwapRequests', JSON.stringify(skillSwapRequests))
  }, [skillSwapRequests])

  // Save current user to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('currentUser', JSON.stringify(currentUser))
  }, [currentUser])

  // Generate unique ID for requests
  const generateRequestId = () => {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  // Send a skill swap request
  const sendSkillSwapRequest = (requestData) => {
    const newRequest = {
      id: generateRequestId(),
      fromUserId: currentUser.id,
      fromUserName: currentUser.name,
      fromUserAvatar: currentUser.avatar,
      toUserId: requestData.toUserId,
      toUserName: requestData.toUserName,
      toUserAvatar: requestData.toUserAvatar,
      offeredSkill: requestData.offeredSkill,
      wantedSkill: requestData.wantedSkill,
      message: requestData.message,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    setSkillSwapRequests(prev => [...prev, newRequest])
    return newRequest
  }

  // Get requests sent by current user
  const getSentRequests = () => {
    return skillSwapRequests.filter(request => request.fromUserId === currentUser.id)
  }

  // Get requests received by current user
  const getReceivedRequests = () => {
    return skillSwapRequests.filter(request => request.toUserId === currentUser.id)
  }

  // Get all requests for a specific user (both sent and received)
  const getUserRequests = (userId) => {
    return skillSwapRequests.filter(request => 
      request.fromUserId === userId || request.toUserId === userId
    )
  }

  // Accept a skill swap request
  const acceptSkillSwapRequest = (requestId) => {
    setSkillSwapRequests(prev => 
      prev.map(request => 
        request.id === requestId 
          ? { ...request, status: 'accepted', updatedAt: new Date().toISOString() }
          : request
      )
    )
  }

  // Reject a skill swap request
  const rejectSkillSwapRequest = (requestId) => {
    setSkillSwapRequests(prev => 
      prev.map(request => 
        request.id === requestId 
          ? { ...request, status: 'rejected', updatedAt: new Date().toISOString() }
          : request
      )
    )
  }

  // Cancel a skill swap request (for sender)
  const cancelSkillSwapRequest = (requestId) => {
    setSkillSwapRequests(prev => 
      prev.map(request => 
        request.id === requestId 
          ? { ...request, status: 'cancelled', updatedAt: new Date().toISOString() }
          : request
      )
    )
  }

  // Delete a skill swap request completely
  const deleteSkillSwapRequest = (requestId) => {
    setSkillSwapRequests(prev => prev.filter(request => request.id !== requestId))
  }

  // Check if current user has already sent a request to a specific user
  const hasExistingRequest = (toUserId) => {
    return skillSwapRequests.some(request => 
      request.fromUserId === currentUser.id && 
      request.toUserId === toUserId && 
      request.status === 'pending'
    )
  }

  // Get request status between current user and another user
  const getRequestStatus = (otherUserId) => {
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
  const updateCurrentUser = (updates) => {
    setCurrentUser(prev => {
      const updatedUser = { ...prev, ...updates }
      
      // Also update the user in the users array to keep data consistent
      const userIndex = users.findIndex(user => user.id === prev.id)
      if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], ...updates }
      }
      
      return updatedUser
    })
  }

  // Get all users (excluding current user for home page)
  const getAllUsers = (excludeCurrentUser = false) => {
    if (excludeCurrentUser) {
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

  const value = {
    // State
    skillSwapRequests,
    currentUser,
    users,

    // Actions
    sendSkillSwapRequest,
    acceptSkillSwapRequest,
    rejectSkillSwapRequest,
    cancelSkillSwapRequest,
    deleteSkillSwapRequest,
    updateCurrentUser,

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

    // Utilities
    formatTimestamp
  }

  return (
    <SkillSwapContext.Provider value={value}>
      {children}
    </SkillSwapContext.Provider>
  )
}
