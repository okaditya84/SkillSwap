import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import SkillTag from '../components/SkillTag'
import LoginPopup from '../components/LoginPopup'
import SkillSwapRequestPopup from '../components/SkillSwapRequestPopup'
import NotificationBlock from '../components/NotificationBlock'
import { useSkillSwap } from '../contexts/SkillSwapContext'

function DetailedView({ isLoggedIn, setIsLoggedIn }) {
  const { id } = useParams()
  const [user, setUser] = useState(null)
  const [showLoginPopup, setShowLoginPopup] = useState(false)
  const [showSkillSwapPopup, setShowSkillSwapPopup] = useState(false)
  const [loading, setLoading] = useState(true)
  const [notification, setNotification] = useState(null)

  // Use SkillSwapContext
  const { 
    currentUser, 
    getUserById, 
    sendSkillSwapRequest,
    hasExistingRequest,
    getRequestStatus 
  } = useSkillSwap()

  useEffect(() => {
    // Get user from context
    const foundUser = getUserById(parseInt(id))
    setUser(foundUser)
    setLoading(false)
  }, [id, getUserById])

  const handleRequestClick = () => {
    if (!isLoggedIn) {
      setShowLoginPopup(true)
    } else {
      // Check if request already exists
      const existingRequest = hasExistingRequest(parseInt(id))
      if (existingRequest) {
        setNotification({
          message: `You already have a pending request with ${user.name}`,
          type: 'info'
        })
      } else {
        setShowSkillSwapPopup(true)
      }
    }
  }

  const handleSkillSwapSubmit = async (requestData) => {
    try {
      const newRequest = await sendSkillSwapRequest({
        toUserId: user.id,
        toUserName: user.name,
        toUserAvatar: user.avatar,
        offeredSkill: requestData.offeredSkill,
        wantedSkill: requestData.wantedSkill,
        message: requestData.message
      })

      setNotification({
        message: `Skill swap request sent to ${user.name}! Your ${requestData.offeredSkill} for their ${requestData.wantedSkill}`,
        type: 'success'
      })
      setShowSkillSwapPopup(false)
    } catch (error) {
      setNotification({
        message: error.message || 'Failed to send skill swap request. Please try again.',
        type: 'error'
      })
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

      {showSkillSwapPopup && (
        <SkillSwapRequestPopup 
          onClose={() => setShowSkillSwapPopup(false)}
          onSubmit={handleSkillSwapSubmit}
          currentUser={currentUser}
          targetUser={user}
        />
      )}

      {notification && (
        <NotificationBlock 
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  )
}

export default DetailedView
