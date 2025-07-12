import { Link } from 'react-router-dom'
import SkillTag from './SkillTag'

function UserCard({ user, isLoggedIn, onRequestClick, onAcceptRequest, onRejectRequest, viewMode }) {
  const handleRequestClick = (e) => {
    if (!isLoggedIn) {
      e.preventDefault();
      onRequestClick();
    }
  };

  const handleCardClick = (e) => {
    // Don't navigate if clicking on action buttons
    if (e.target.closest('.request-btn') || e.target.closest('.action-buttons')) {
      return;
    }
    
    // Only navigate if profile is public
    if (user.profileVisibility === 'Public') {
      window.location.href = `/user/${user.id}`;
    }
  };

  const handleAccept = (e) => {
    e.stopPropagation();
    onAcceptRequest(user.id);
  };

  const handleReject = (e) => {
    e.stopPropagation();
    onRejectRequest(user.id);
  };

  const getStatusBadge = () => {
    if (!user.requestStatus) return null;
    
    const statusColors = {
      pending: 'status-pending',
      accepted: 'status-accepted'
    };

    return (
      <div className={`status-badge ${statusColors[user.requestStatus]}`}>
        {user.requestStatus.charAt(0).toUpperCase() + user.requestStatus.slice(1)}
      </div>
    );
  };

  const renderActionButtons = () => {
    // Show accept/reject buttons only for pending requests
    if (user.requestStatus === 'pending') {
      return (
        <div className="action-buttons">
          <button 
            className="accept-btn"
            onClick={handleAccept}
          >
            Accept
          </button>
          <button 
            className="reject-btn"
            onClick={handleReject}
          >
            Reject
          </button>
        </div>
      );
    }

    // Show regular request button for normal users
    if (!user.requestStatus) {
      return (
        <>
          {isLoggedIn ? (
            <Link to={`/user/${user.id}`} className="request-btn">
              Request
            </Link>
          ) : (
            <button className="request-btn" onClick={handleRequestClick}>
              Request
            </button>
          )}
        </>
      );
    }

    // For accepted requests, show a message or different action
    if (user.requestStatus === 'accepted') {
      return (
        <div className="accepted-message">
          <Link to={`/user/${user.id}`} className="view-profile-btn">
            View Profile
          </Link>
        </div>
      );
    }

    return null;
  };

  return (
    <div 
      className={`user-card ${user.profileVisibility === 'Public' ? 'clickable' : ''} ${user.requestStatus ? `request-${user.requestStatus}` : ''}`}
      onClick={handleCardClick}
    >
      <div className="user-avatar">
        <img src={user.avatar} alt={user.name} />
        <div className="avatar-label">Profile Photo</div>
      </div>
      
      <div className="user-info">
        <div className="user-header">
          <h3 className="user-name">{user.name}</h3>
          {getStatusBadge()}
        </div>
        
        <div className="skills-row">
          <div className="skills-group">
            <span className="skills-label">Skills Offered</span>
            <div className="skills-tags">
              {user.skillsOffered.map((skill, index) => (
                <SkillTag key={index} skill={skill} />
              ))}
            </div>
          </div>
        </div>
        
        <div className="skills-row">
          <div className="skills-group">
            <span className="skills-label">Skill wanted</span>
            <div className="skills-tags">
              {user.skillsWanted.map((skill, index) => (
                <SkillTag key={index} skill={skill} />
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="user-actions">
        {renderActionButtons()}
        <div className="rating">
          <span>rating</span>
          <span className="rating-value">{user.rating}/5</span>
        </div>
      </div>
    </div>
  )
}

export default UserCard