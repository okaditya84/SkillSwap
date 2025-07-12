// Simulated backend service for skill swap operations
class SkillSwapService {
  constructor() {
    this.apiUrl = 'http://localhost:3001/api' // Simulated API endpoint
    this.isOnline = false // Simulate offline mode for development
  }

  // Generate unique IDs
  generateId() {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  // Simulate network delay
  async simulateNetworkDelay(ms = 500) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  // Get all users
  async getUsers() {
    await this.simulateNetworkDelay()
    
    if (this.isOnline) {
      // In a real app, this would be a fetch call
      // const response = await fetch(`${this.apiUrl}/users`)
      // return response.json()
    }

    // Fallback to localStorage
    const users = localStorage.getItem('skillSwap_users')
    return users ? JSON.parse(users) : this.getDefaultUsers()
  }

  // Get user by ID
  async getUserById(userId) {
    const users = await this.getUsers()
    return users.find(user => user.id === parseInt(userId))
  }

  // Update user
  async updateUser(userId, updates) {
    await this.simulateNetworkDelay()
    
    const users = await this.getUsers()
    const userIndex = users.findIndex(user => user.id === parseInt(userId))
    
    if (userIndex === -1) {
      throw new Error('User not found')
    }

    users[userIndex] = { ...users[userIndex], ...updates, updatedAt: new Date().toISOString() }
    localStorage.setItem('skillSwap_users', JSON.stringify(users))
    
    return users[userIndex]
  }

  // Get all skill swap requests
  async getRequests() {
    await this.simulateNetworkDelay()
    
    const requests = localStorage.getItem('skillSwap_requests')
    return requests ? JSON.parse(requests) : []
  }

  // Create new skill swap request
  async createRequest(requestData) {
    await this.simulateNetworkDelay()
    
    const requests = await this.getRequests()
    
    // Check for duplicate requests
    const existingRequest = requests.find(req => 
      req.fromUserId === requestData.fromUserId && 
      req.toUserId === requestData.toUserId && 
      req.status === 'pending'
    )
    
    if (existingRequest) {
      throw new Error('A pending request already exists between these users')
    }

    const newRequest = {
      id: this.generateId(),
      ...requestData,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    requests.push(newRequest)
    localStorage.setItem('skillSwap_requests', JSON.stringify(requests))
    
    // Create notification for the recipient
    await this.notifyUser(requestData.toUserId, {
      type: 'new_request',
      message: `You received a new skill swap request from ${requestData.fromUserName}`,
      requestId: newRequest.id
    })
    
    return newRequest
  }

  // Update request status
  async updateRequestStatus(requestId, status, updatedBy = null) {
    await this.simulateNetworkDelay()
    
    const requests = await this.getRequests()
    const requestIndex = requests.findIndex(req => req.id === requestId)
    
    if (requestIndex === -1) {
      throw new Error('Request not found')
    }

    const validStatuses = ['pending', 'accepted', 'rejected', 'cancelled']
    if (!validStatuses.includes(status)) {
      throw new Error(`Invalid status: ${status}`)
    }

    requests[requestIndex] = {
      ...requests[requestIndex],
      status,
      updatedAt: new Date().toISOString(),
      ...(updatedBy && { updatedBy })
    }

    localStorage.setItem('skillSwap_requests', JSON.stringify(requests))
    
    // Notify the other user about status change
    const request = requests[requestIndex]
    const targetUserId = updatedBy === request.fromUserId ? request.toUserId : request.fromUserId
    
    await this.notifyUser(targetUserId, {
      type: 'request_status_changed',
      message: `Your skill swap request has been ${status}`,
      requestId: request.id,
      status
    })
    
    return requests[requestIndex]
  }

  // Delete request
  async deleteRequest(requestId) {
    await this.simulateNetworkDelay()
    
    const requests = await this.getRequests()
    const filteredRequests = requests.filter(req => req.id !== requestId)
    
    localStorage.setItem('skillSwap_requests', JSON.stringify(filteredRequests))
    return true
  }

  // Get requests for specific user
  async getUserRequests(userId, type = 'all') {
    const requests = await this.getRequests()
    
    switch (type) {
      case 'sent':
        return requests.filter(req => req.fromUserId === parseInt(userId))
      case 'received':
        return requests.filter(req => req.toUserId === parseInt(userId))
      case 'all':
      default:
        return requests.filter(req => 
          req.fromUserId === parseInt(userId) || req.toUserId === parseInt(userId)
        )
    }
  }

  // Simulate real-time notifications
  async notifyUser(userId, notification) {
    // Create notification using the centralized notification system
    try {
      await this.createNotification({
        userId: userId,
        ...notification
      })
    } catch (error) {
      console.error('Error creating notification:', error)
    }
  }

  // Notification methods
  async getNotifications() {
    await this.simulateNetworkDelay(200)
    
    const notifications = localStorage.getItem('skillSwap_notifications')
    return notifications ? JSON.parse(notifications) : []
  }

  async getUserNotifications(userId) {
    await this.simulateNetworkDelay(200)
    
    const allNotifications = await this.getNotifications()
    return allNotifications.filter(notification => notification.userId === userId)
  }

  async createNotification(notification) {
    await this.simulateNetworkDelay(200)
    
    const notifications = await this.getNotifications()
    const newNotification = {
      id: this.generateId(),
      ...notification,
      timestamp: new Date().toISOString(),
      read: false,
      createdAt: new Date().toISOString()
    }
    
    notifications.push(newNotification)
    localStorage.setItem('skillSwap_notifications', JSON.stringify(notifications))
    
    return newNotification
  }

  async markNotificationAsRead(userId, notificationId) {
    await this.simulateNetworkDelay(200)
    
    const notifications = await this.getNotifications()
    const updatedNotifications = notifications.map(notification => {
      if (notification.id === notificationId && notification.userId === userId) {
        return { ...notification, read: true, readAt: new Date().toISOString() }
      }
      return notification
    })
    
    localStorage.setItem('skillSwap_notifications', JSON.stringify(updatedNotifications))
    return true
  }

  async deleteNotification(notificationId) {
    await this.simulateNetworkDelay(200)
    
    const notifications = await this.getNotifications()
    const filteredNotifications = notifications.filter(notification => notification.id !== notificationId)
    
    localStorage.setItem('skillSwap_notifications', JSON.stringify(filteredNotifications))
    return true
  }

  // Get default users for initial setup
  getDefaultUsers() {
    return [
      {
        id: 1,
        name: 'Current User',
        avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
        skillsOffered: ['Graphic Design', 'Video Editing', 'Photoshop'],
        skillsWanted: ['Python', 'JavaScript', 'Management'],
        rating: 4.5,
        profileVisibility: 'Public',
        location: 'San Francisco, CA',
        availability: 'Weekends',
        email: 'current@example.com',
        phone: '+1-555-0101',
        bio: 'Passionate designer looking to expand into programming',
        joinedDate: '2024-01-15T10:00:00.000Z',
        completedSwaps: 12,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
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
        availability: 'Weekends',
        email: 'marc@example.com',
        phone: '+1-555-0102',
        bio: 'Full-stack developer with 5 years experience',
        joinedDate: '2024-02-20T10:00:00.000Z',
        completedSwaps: 8,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
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
        availability: 'Evenings',
        email: 'michelle@example.com',
        phone: '+1-555-0103',
        bio: 'Creative designer specializing in brand identity',
        joinedDate: '2024-01-30T10:00:00.000Z',
        completedSwaps: 15,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
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
        availability: 'Flexible',
        email: 'joe@example.com',
        phone: '+1-555-0104',
        bio: 'Backend specialist looking to learn frontend technologies',
        joinedDate: '2024-03-10T10:00:00.000Z',
        completedSwaps: 6,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
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
        availability: 'Weekdays',
        email: 'sarah@example.com',
        phone: '+1-555-0105',
        bio: 'Data analyst transitioning to machine learning',
        joinedDate: '2024-02-05T10:00:00.000Z',
        completedSwaps: 20,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
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
        availability: 'Flexible',
        email: 'alex@example.com',
        phone: '+1-555-0106',
        bio: 'UX designer focused on user-centered design',
        joinedDate: '2024-01-20T10:00:00.000Z',
        completedSwaps: 10,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]
  }

  // Initialize default data if not exists
  async initializeDefaultData() {
    const existingUsers = localStorage.getItem('skillSwap_users')
    if (!existingUsers) {
      const defaultUsers = this.getDefaultUsers()
      localStorage.setItem('skillSwap_users', JSON.stringify(defaultUsers))
    }

    const existingRequests = localStorage.getItem('skillSwap_requests')
    if (!existingRequests) {
      localStorage.setItem('skillSwap_requests', JSON.stringify([]))
    }

    const existingNotifications = localStorage.getItem('skillSwap_notifications')
    if (!existingNotifications) {
      localStorage.setItem('skillSwap_notifications', JSON.stringify([]))
    }
  }

  // Authentication methods
  async login(credentials) {
    await this.simulateNetworkDelay()
    
    const { email, mobile, name, password } = credentials
    
    // Simple validation - in a real app, this would be secure
    if (!password) {
      throw new Error('Password is required')
    }
    
    if (!email && !mobile && !name) {
      throw new Error('Please provide email, mobile, or name')
    }
    
    // For demo purposes, accept any credentials
    // In a real app, this would verify against a secure database
    const users = await this.getUsers()
    let user = null
    
    if (email) {
      user = users.find(u => u.email && u.email.toLowerCase() === email.toLowerCase())
    } else if (mobile) {
      user = users.find(u => u.phone && u.phone.includes(mobile.replace('+91', '')))
    } else if (name) {
      user = users.find(u => u.name && u.name.toLowerCase().includes(name.toLowerCase()))
    }
    
    // If user not found, create a new demo user
    if (!user) {
      const newUser = {
        id: Date.now(),
        name: name || 'Demo User',
        email: email || `demo${Date.now()}@example.com`,
        phone: mobile || '+1-555-0000',
        avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
        skillsOffered: ['Demo Skill'],
        skillsWanted: ['Learning'],
        rating: 5.0,
        profileVisibility: 'Public',
        location: 'Demo City',
        availability: 'Flexible',
        bio: 'New to SkillSwap!',
        joinedDate: new Date().toISOString(),
        completedSwaps: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      users.push(newUser)
      localStorage.setItem('skillSwap_users', JSON.stringify(users))
      user = newUser
    }
    
    // Generate a simple token
    const token = btoa(JSON.stringify({ userId: user.id, timestamp: Date.now() }))
    
    return {
      success: true,
      message: 'Login successful! Redirecting...',
      userId: user.id,
      token: token,
      user: user,
      requiresOTP: false // Skip OTP for demo
    }
  }

  async register(userData) {
    await this.simulateNetworkDelay()
    
    const { email, mobile, name, password } = userData
    
    // Simple validation
    if (!name) {
      throw new Error('Name is required')
    }
    
    if (!password) {
      throw new Error('Password is required')
    }
    
    if (!email && !mobile) {
      throw new Error('Please provide either email or mobile number')
    }
    
    const users = await this.getUsers()
    
    // Check if user already exists
    if (email) {
      const existingUser = users.find(u => u.email && u.email.toLowerCase() === email.toLowerCase())
      if (existingUser) {
        throw new Error('User with this email already exists')
      }
    }
    
    if (mobile) {
      const existingUser = users.find(u => u.phone && u.phone.includes(mobile.replace('+91', '')))
      if (existingUser) {
        throw new Error('User with this mobile number already exists')
      }
    }
    
    // Create new user
    const newUser = {
      id: Date.now(),
      name: name,
      email: email || `user${Date.now()}@example.com`,
      phone: mobile || '+1-555-0000',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
      skillsOffered: [],
      skillsWanted: [],
      rating: 5.0,
      profileVisibility: 'Public',
      location: 'Not specified',
      availability: 'Flexible',
      bio: 'New to SkillSwap!',
      joinedDate: new Date().toISOString(),
      completedSwaps: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    users.push(newUser)
    localStorage.setItem('skillSwap_users', JSON.stringify(users))
    
    // Generate a simple token
    const token = btoa(JSON.stringify({ userId: newUser.id, timestamp: Date.now() }))
    
    return {
      success: true,
      message: 'Registration successful! Welcome to SkillSwap!',
      userId: newUser.id,
      token: token,
      user: newUser,
      requiresOTP: false // Skip OTP for demo
    }
  }

  async verifyOTP(userId, otp) {
    await this.simulateNetworkDelay(300)
    
    // For demo purposes, accept any OTP
    // In a real app, this would verify a secure OTP
    if (!otp || otp.length < 4) {
      throw new Error('Please enter a valid OTP')
    }
    
    const user = await this.getUserById(userId)
    if (!user) {
      throw new Error('User not found')
    }
    
    // Generate a simple token
    const token = btoa(JSON.stringify({ userId: user.id, timestamp: Date.now() }))
    
    return {
      success: true,
      message: 'Account verified successfully!',
      token: token,
      user: user
    }
  }

  async getCurrentUser(token) {
    if (!token) {
      return null
    }
    
    try {
      const decoded = JSON.parse(atob(token))
      const user = await this.getUserById(decoded.userId)
      return user
    } catch (error) {
      console.error('Invalid token:', error)
      return null
    }
  }

  async logout() {
    // Clear any stored tokens
    localStorage.removeItem('skillSwap_token')
    localStorage.removeItem('skillSwap_currentUser')
    return { success: true, message: 'Logged out successfully' }
  }
}

export default new SkillSwapService()
