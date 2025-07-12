import { useState } from 'react'
import SkillTag from '../components/SkillTag'

function UserProfile({ currentUser, setCurrentUser }) {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: currentUser.name || 'Current User',
    location: 'San Francisco, CA',
    skillsOffered: ['Graphic Design', 'Video Editing', 'Photoshop'],
    skillsWanted: ['Python', 'Java Script', 'Manager'],
    availability: 'weekends',
    profileVisibility: 'Public'
  })
  const [newSkillOffered, setNewSkillOffered] = useState('')
  const [newSkillWanted, setNewSkillWanted] = useState('')

  // Mock data for user's sent requests
  const [myRequests] = useState([
    {
      id: 1,
      targetUser: 'Marc Demo',
      targetAvatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
      offeredSkill: 'Graphic Design',
      wantedSkill: 'Python',
      message: 'Hi Marc! I\'d love to exchange my graphic design skills for your Python expertise. I have 5 years of experience in design.',
      status: 'pending',
      sentDate: '2024-01-15',
      timestamp: '2 days ago'
    },
    {
      id: 2,
      targetUser: 'Joe Wills',
      targetAvatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
      offeredSkill: 'Video Editing',
      wantedSkill: 'Frontend',
      message: 'Hello Joe! I can help you with video editing in exchange for frontend development knowledge.',
      status: 'accepted',
      sentDate: '2024-01-10',
      timestamp: '1 week ago'
    },
    {
      id: 3,
      targetUser: 'Sarah Chen',
      targetAvatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
      offeredSkill: 'Photoshop',
      wantedSkill: 'Manager',
      message: 'Hi Sarah! I\'d like to learn management skills and can offer my Photoshop expertise in return.',
      status: 'declined',
      sentDate: '2024-01-05',
      timestamp: '2 weeks ago'
    }
  ])
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const addSkillOffered = () => {
    if (newSkillOffered.trim() && !formData.skillsOffered.includes(newSkillOffered.trim())) {
      setFormData(prev => ({
        ...prev,
        skillsOffered: [...prev.skillsOffered, newSkillOffered.trim()]
      }))
      setNewSkillOffered('')
    }
  }

  const addSkillWanted = () => {
    if (newSkillWanted.trim() && !formData.skillsWanted.includes(newSkillWanted.trim())) {
      setFormData(prev => ({
        ...prev,
        skillsWanted: [...prev.skillsWanted, newSkillWanted.trim()]
      }))
      setNewSkillWanted('')
    }
  }

  const removeSkillOffered = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      skillsOffered: prev.skillsOffered.filter(skill => skill !== skillToRemove)
    }))
  }

  const removeSkillWanted = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      skillsWanted: prev.skillsWanted.filter(skill => skill !== skillToRemove)
    }))
  }

  const handleSave = () => {
    setCurrentUser(prev => ({
      ...prev,
      name: formData.name
    }))
    setIsEditing(false)
    // Here you would typically save to backend
  }

  const handleDiscard = () => {
    setFormData({
      name: currentUser.name || 'Current User',
      location: 'San Francisco, CA',
      skillsOffered: ['Graphic Design', 'Video Editing', 'Photoshop'],
      skillsWanted: ['Python', 'Java Script', 'Manager'],
      availability: 'weekends',
      profileVisibility: 'Public'
    })
    setIsEditing(false)
  }

  return (
    <div className="user-profile">
      <div className="profile-header">
        <div className="profile-actions">
          <button 
            className={`profile-action-btn save-btn ${isEditing ? 'active' : ''}`}
            onClick={handleSave}
          >
            Save
          </button>
          <button 
            className={`profile-action-btn discard-btn ${isEditing ? 'active' : ''}`}
            onClick={handleDiscard}
          >
            Discard
          </button>
        </div>
        
        <div className="profile-photo-section">
          <div className="profile-photo-container">
            <img src={currentUser.avatar} alt="Profile" className="profile-photo" />
            <div className="profile-photo-label">Profile Photo</div>
            <button className="edit-photo-btn">Add/Edit Remove</button>
          </div>
        </div>
      </div>

      <div className="profile-form">
        <div className="form-row">
          <label className="form-label">Name</label>
          <input
            type="text"
            className="form-input"
            value={formData.name}
            onChange={(e) => {
              handleInputChange('name', e.target.value)
              setIsEditing(true)
            }}
            placeholder="Enter your name"
          />
        </div>

        <div className="form-row">
          <label className="form-label">Location</label>
          <input
            type="text"
            className="form-input"
            value={formData.location}
            onChange={(e) => {
              handleInputChange('location', e.target.value)
              setIsEditing(true)
            }}
            placeholder="Enter your location"
          />
        </div>

        <div className="form-row skills-row">
          <div className="skills-section">
            <label className="form-label">Skills Offered</label>
            <div className="skills-container">
              <div className="skills-tags">
                {formData.skillsOffered.map((skill, index) => (
                  <SkillTag 
                    key={index} 
                    skill={skill} 
                    removable={true}
                    onRemove={() => {
                      removeSkillOffered(skill)
                      setIsEditing(true)
                    }}
                  />
                ))}
              </div>
              <div className="add-skill-container">
                <input
                  type="text"
                  className="add-skill-input"
                  value={newSkillOffered}
                  onChange={(e) => setNewSkillOffered(e.target.value)}
                  placeholder="Add new skill"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      addSkillOffered()
                      setIsEditing(true)
                    }
                  }}
                />
                <button 
                  className="add-skill-btn"
                  onClick={() => {
                    addSkillOffered()
                    setIsEditing(true)
                  }}
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <div className="skills-section">
            <label className="form-label">Skills wanted</label>
            <div className="skills-container">
              <div className="skills-tags">
                {formData.skillsWanted.map((skill, index) => (
                  <SkillTag 
                    key={index} 
                    skill={skill} 
                    removable={true}
                    onRemove={() => {
                      removeSkillWanted(skill)
                      setIsEditing(true)
                    }}
                  />
                ))}
              </div>
              <div className="add-skill-container">
                <input
                  type="text"
                  className="add-skill-input"
                  value={newSkillWanted}
                  onChange={(e) => setNewSkillWanted(e.target.value)}
                  placeholder="Add new skill"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      addSkillWanted()
                      setIsEditing(true)
                    }
                  }}
                />
                <button 
                  className="add-skill-btn"
                  onClick={() => {
                    addSkillWanted()
                    setIsEditing(true)
                  }}
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="form-row">
          <label className="form-label">Availability</label>
          <select
            className="form-select"
            value={formData.availability}
            onChange={(e) => {
              handleInputChange('availability', e.target.value)
              setIsEditing(true)
            }}
          >
            <option value="weekdays">Weekdays</option>
            <option value="weekends">Weekends</option>
            <option value="evenings">Evenings</option>
            <option value="flexible">Flexible</option>
          </select>
        </div>

        <div className="form-row">
          <label className="form-label">Profile</label>
          <select
            className="form-select"
            value={formData.profileVisibility}
            onChange={(e) => {
              handleInputChange('profileVisibility', e.target.value)
              setIsEditing(true)
            }}
          >
            <option value="Public">Public</option>
            <option value="Private">Private</option>
            <option value="Friends Only">Friends Only</option>
          </select>
        </div>
      </div>

      <div className="my-requests-section">
        <h2 className="section-title">My Requests</h2>
        <div className="requests-list">
          {myRequests.length > 0 ? (
            myRequests.map(request => (
              <div key={request.id} className="request-card">
                <div className="request-header">
                  <div className="request-user-info">
                    <img src={request.targetAvatar} alt={request.targetUser} className="request-avatar" />
                    <div className="request-user-details">
                      <h3 className="request-user-name">{request.targetUser}</h3>
                      <span className="request-timestamp">{request.timestamp}</span>
                    </div>
                  </div>
                  <div className={`request-status ${request.status}`}>
                    {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                  </div>
                </div>
                
                <div className="request-skills">
                  <div className="skill-exchange">
                    <span className="skill-label">Your Skill:</span>
                    <SkillTag skill={request.offeredSkill} />
                    <span className="exchange-arrow">⇄</span>
                    <span className="skill-label">Their Skill:</span>
                    <SkillTag skill={request.wantedSkill} />
                  </div>
                </div>
                
                <div className="request-message">
                  <span className="message-label">Message:</span>
                  <p className="message-text">{request.message}</p>
                </div>
                
                <div className="request-actions">
                  {request.status === 'pending' && (
                    <button className="cancel-request-btn">Cancel Request</button>
                  )}
                  {request.status === 'accepted' && (
                    <button className="contact-btn">Contact User</button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="no-requests">
              <p>You haven't sent any skill swap requests yet.</p>
              <p>Browse users and start exchanging skills!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default UserProfile