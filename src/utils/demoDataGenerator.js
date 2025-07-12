// Demo data generator for testing the skill swap functionality
class DemoDataGenerator {
  constructor() {
    this.skillCategories = {
      'Programming': ['JavaScript', 'Python', 'React', 'Node.js', 'Java', 'C++', 'PHP', 'Ruby', 'Go', 'TypeScript'],
      'Design': ['Graphic Design', 'UI/UX Design', 'Photoshop', 'Illustrator', 'Figma', 'Sketch', 'InDesign', 'After Effects'],
      'Data Science': ['Data Analysis', 'Machine Learning', 'SQL', 'Excel', 'Tableau', 'Python', 'R', 'Statistics'],
      'Business': ['Project Management', 'Marketing', 'Sales', 'Business Analysis', 'Strategy', 'Leadership', 'Communication'],
      'Creative': ['Video Editing', 'Photography', 'Writing', 'Music Production', 'Animation', 'Illustration'],
      'Technical': ['DevOps', 'Cloud Computing', 'Cybersecurity', 'Database Management', 'System Administration']
    }

    this.sampleMessages = [
      "Hi! I'd love to learn {wantedSkill} from you. I have experience in {offeredSkill} and would be happy to share my knowledge in exchange.",
      "Hello! I've been looking to improve my {wantedSkill} skills and noticed you're interested in {offeredSkill}. Would you be interested in a skill exchange?",
      "Hi there! I'm passionate about {offeredSkill} and would love to teach you in exchange for learning {wantedSkill}. Let me know if you're interested!",
      "Hey! I saw your profile and think we could have a great skill exchange. I can help with {offeredSkill} if you can teach me {wantedSkill}.",
      "Hello! I'm a {offeredSkill} expert looking to expand into {wantedSkill}. Would you be interested in exchanging knowledge?"
    ]

    this.locations = [
      'San Francisco, CA', 'New York, NY', 'Seattle, WA', 'Austin, TX', 
      'Los Angeles, CA', 'Chicago, IL', 'Boston, MA', 'Denver, CO',
      'Portland, OR', 'Miami, FL', 'Atlanta, GA', 'Nashville, TN'
    ]

    this.availabilities = ['Weekdays', 'Weekends', 'Evenings', 'Flexible']
  }

  generateRandomSkills(exclude = []) {
    const allSkills = Object.values(this.skillCategories).flat()
    const availableSkills = allSkills.filter(skill => !exclude.includes(skill))
    
    const count = Math.floor(Math.random() * 3) + 2 // 2-4 skills
    const skills = []
    
    for (let i = 0; i < count; i++) {
      const randomSkill = availableSkills[Math.floor(Math.random() * availableSkills.length)]
      if (!skills.includes(randomSkill)) {
        skills.push(randomSkill)
      }
    }
    
    return skills
  }

  generateSampleRequests(users, count = 5) {
    const requests = []
    const statuses = ['pending', 'accepted', 'rejected', 'cancelled']
    
    for (let i = 0; i < count; i++) {
      const fromUser = users[Math.floor(Math.random() * users.length)]
      const toUser = users[Math.floor(Math.random() * users.length)]
      
      if (fromUser.id === toUser.id) continue
      
      const offeredSkill = fromUser.skillsOffered[Math.floor(Math.random() * fromUser.skillsOffered.length)]
      const wantedSkill = toUser.skillsWanted[Math.floor(Math.random() * toUser.skillsWanted.length)]
      
      const messageTemplate = this.sampleMessages[Math.floor(Math.random() * this.sampleMessages.length)]
      const message = messageTemplate
        .replace('{offeredSkill}', offeredSkill)
        .replace('{wantedSkill}', wantedSkill)
      
      const createdAt = new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000) // Random time in last 7 days
      
      requests.push({
        id: `demo_req_${Date.now()}_${i}`,
        fromUserId: fromUser.id,
        fromUserName: fromUser.name,
        fromUserAvatar: fromUser.avatar,
        toUserId: toUser.id,
        toUserName: toUser.name,
        toUserAvatar: toUser.avatar,
        offeredSkill,
        wantedSkill,
        message,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        createdAt: createdAt.toISOString(),
        updatedAt: createdAt.toISOString()
      })
    }
    
    return requests
  }

  generateSampleUsers(count = 10) {
    const names = [
      'Alex Chen', 'Maria Rodriguez', 'John Smith', 'Sarah Johnson', 
      'David Kim', 'Emma Wilson', 'Michael Brown', 'Lisa Davis',
      'James Miller', 'Jennifer Garcia', 'Robert Taylor', 'Jessica Anderson',
      'Christopher Martinez', 'Amanda Thompson', 'Daniel White', 'Ashley Jones'
    ]
    
    const avatarUrls = [
      'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
      'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
      'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
      'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
      'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
      'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
    ]
    
    const bios = [
      'Passionate about technology and always eager to learn new skills.',
      'Creative professional with a love for design and innovation.',
      'Data enthusiast who enjoys solving complex problems.',
      'Full-stack developer with expertise in modern web technologies.',
      'UX designer focused on creating intuitive user experiences.',
      'Business analyst with a background in strategic planning.',
      'Marketing specialist with digital and traditional experience.',
      'Project manager who thrives in collaborative environments.'
    ]
    
    const users = []
    
    for (let i = 0; i < count; i++) {
      const skillsOffered = this.generateRandomSkills()
      const skillsWanted = this.generateRandomSkills(skillsOffered)
      
      users.push({
        id: i + 100, // Start from 100 to avoid conflicts with default users
        name: names[i % names.length],
        avatar: avatarUrls[i % avatarUrls.length],
        skillsOffered,
        skillsWanted,
        rating: parseFloat((Math.random() * 2 + 3).toFixed(1)), // 3.0 - 5.0
        profileVisibility: Math.random() > 0.1 ? 'Public' : 'Private', // 90% public
        location: this.locations[Math.floor(Math.random() * this.locations.length)],
        availability: this.availabilities[Math.floor(Math.random() * this.availabilities.length)],
        email: `${names[i % names.length].toLowerCase().replace(' ', '.')}@example.com`,
        phone: `+1-555-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
        bio: bios[Math.floor(Math.random() * bios.length)],
        joinedDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
        completedSwaps: Math.floor(Math.random() * 25),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
    }
    
    return users
  }

  generateSampleNotifications(userId, count = 5) {
    const notificationTypes = ['new_request', 'request_status_changed']
    const messages = [
      'You received a new skill swap request!',
      'Your skill swap request has been accepted!',
      'Your skill swap request has been rejected.',
      'Someone is interested in your skills!',
      'A user wants to exchange skills with you.'
    ]
    
    const notifications = []
    
    for (let i = 0; i < count; i++) {
      const createdAt = new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000) // Random time in last 24 hours
      
      notifications.push({
        id: `demo_notif_${Date.now()}_${i}`,
        type: notificationTypes[Math.floor(Math.random() * notificationTypes.length)],
        message: messages[Math.floor(Math.random() * messages.length)],
        timestamp: createdAt.toISOString(),
        read: Math.random() > 0.3, // 70% read
        requestId: `demo_req_${Date.now()}_${i}`
      })
    }
    
    return notifications
  }

  // Load demo data into the system
  async loadDemoData() {
    try {
      console.log('🚀 Loading demo data...')
      
      // Generate sample users
      const sampleUsers = this.generateSampleUsers(15)
      
      // Get existing users and merge
      const existingUsers = JSON.parse(localStorage.getItem('skillSwap_users') || '[]')
      const allUsers = [...existingUsers, ...sampleUsers]
      
      // Generate sample requests
      const sampleRequests = this.generateSampleRequests(allUsers, 20)
      
      // Get existing requests and merge
      const existingRequests = JSON.parse(localStorage.getItem('skillSwap_requests') || '[]')
      const allRequests = [...existingRequests, ...sampleRequests]
      
      // Save to localStorage
      localStorage.setItem('skillSwap_users', JSON.stringify(allUsers))
      localStorage.setItem('skillSwap_requests', JSON.stringify(allRequests))
      
      // Generate notifications for current user (ID: 1)
      const sampleNotifications = this.generateSampleNotifications(1, 10)
      localStorage.setItem('notifications_1', JSON.stringify(sampleNotifications))
      
      console.log('✅ Demo data loaded successfully!')
      console.log(`📊 Added ${sampleUsers.length} users, ${sampleRequests.length} requests, ${sampleNotifications.length} notifications`)
      
      return {
        users: sampleUsers.length,
        requests: sampleRequests.length,
        notifications: sampleNotifications.length
      }
    } catch (error) {
      console.error('❌ Error loading demo data:', error)
      throw error
    }
  }

  // Clear all demo data
  clearDemoData() {
    localStorage.removeItem('skillSwap_users')
    localStorage.removeItem('skillSwap_requests')
    localStorage.removeItem('notifications_1')
    console.log('🧹 Demo data cleared!')
  }

  // Reset to original data
  resetToOriginal() {
    this.clearDemoData()
    console.log('🔄 Reset to original data!')
  }
}

// Global demo data generator instance
window.demoDataGenerator = new DemoDataGenerator()

// Helper functions for console use
window.loadDemoData = () => window.demoDataGenerator.loadDemoData()
window.clearDemoData = () => window.demoDataGenerator.clearDemoData()
window.resetDemoData = () => window.demoDataGenerator.resetToOriginal()

export default DemoDataGenerator
