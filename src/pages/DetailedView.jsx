import { useState, useEffect } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import SkillTag from '../components/SkillTag'
import LoginPopup from '../components/LoginPopup'

function DetailedView({ isLoggedIn, setIsLoggedIn }) {
  const { id } = useParams()
  const [user, setUser] = useState(null)
  const [showLoginPopup, setShowLoginPopup] = useState(false)
  const [loading, setLoading] = useState(true)

  // Mock user data - in real app this would come from API
  const users = [
    {
      id: 1,
      name: 'Marc Demo',
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=1',
      skillsOffered: ['Java Script', 'Python', 'React'],
      skillsWanted: ['Database', 'Graphic Designer', 'UI/UX'],
      rating: 3.9,
      profileVisibility: 'Public',
      location: 'San Francisco, CA',
      availability: 'Weekends'
    },
    {
      id: 2,
      name: 'Michell',
      avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=1',
      skillsOffered: ['Graphic Design', 'Photoshop'],
      skillsWanted: ['Web Development', 'Marketing'],
      rating: 2.5,
      profileVisibility: 'Private',
      location: 'New York, NY',
      availability: 'Evenings'
    },
    {
      id: 3,
      name: 'Joe Wills',
      avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=1',
      skillsOffered: ['Node.js', 'MongoDB'],
      skillsWanted: ['Frontend', 'Design'],
      rating: 4.0,
      profileVisibility: 'Public',
      location: 'Austin, TX',
      availability: 'Flexible'
    }
  ]

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const foundUser = users.find(u => u.id === parseInt(id))
      setUser(foundUser)
      setLoading(false)
    }, 500)
  }, [id])

  const handleRequestClick = () => {
    if (!isLoggedIn) {
      setShowLoginPopup(true)
    } else {
      // Handle skill swap request
      alert('Skill swap request sent!')
    }
  }

  if (loading) {
    return (
      <div className="detailed-view">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="detailed-view">
        <div className="error-container">
          <h2>User Not Found</h2>
          <p>The user profile you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  if (user.profileVisibility !== 'Public') {
    return (
      <div className="detailed-view">
        <div className="private-profile-container">
          <div className="private-profile-icon">🔒</div>
          <h2>Private Profile</h2>
          <p>This user's profile is set to private and cannot be viewed.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="detailed-view">
      <div className="detailed-profile-card">
        <div className="profile-header-section">
          <button 
            className="request-btn-detailed"
            onClick={handleRequestClick}
          >
            Request
          </button>
          
          <div className="profile-info-section">
            <h1 className="profile-name">{user.name}</h1>
            
            <div className="profile-photo-section">
              <div className="profile-photo-container-detailed">
                <img src={user.avatar} alt={user.name} className="profile-photo-detailed" />
                <div className="profile-photo-label-detailed">Profile Photo</div>
              </div>
            </div>
          </div>
        </div>

        <div className="profile-details-section">
          <div className="detail-row">
            <label className="detail-label">Location</label>
            <span className="detail-value">{user.location}</span>
          </div>

          <div className="skills-section-detailed">
            <div className="skills-group-detailed">
              <label className="detail-label">Skills Offered</label>
              <div className="skills-tags-detailed">
                {user.skillsOffered.map((skill, index) => (
                  <SkillTag key={index} skill={skill} />
                ))}
              </div>
            </div>

            <div className="skills-group-detailed">
              <label className="detail-label">Skills wanted</label>
              <div className="skills-tags-detailed">
                {user.skillsWanted.map((skill, index) => (
                  <SkillTag key={index} skill={skill} />
                ))}
              </div>
            </div>
          </div>

          <div className="detail-row">
            <label className="detail-label">Availability</label>
            <span className="detail-value">{user.availability}</span>
          </div>

          <div className="rating-feedback-section">
            <h3 className="section-title">Rating and Feedback</h3>
            <div className="rating-display">
              <span className="rating-value-detailed">{user.rating}/5</span>
              <div className="rating-stars">
                {[...Array(5)].map((_, i) => (
                  <span 
                    key={i} 
                    className={`star ${i < Math.floor(user.rating) ? 'filled' : ''}`}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>
            <p className="feedback-placeholder">
              No feedback available yet. Be the first to work with {user.name.split(' ')[0]}!
            </p>
          </div>
        </div>
      </div>

      {showLoginPopup && (
        <LoginPopup 
          onClose={() => setShowLoginPopup(false)}
          onLogin={() => {
            setIsLoggedIn(true);
            setShowLoginPopup(false);
          }}
        />
      )}
    </div>
  )
}

export default DetailedView