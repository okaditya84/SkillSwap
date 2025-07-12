import { Link } from 'react-router-dom'
import SkillTag from './SkillTag'

function UserCard({ user, isLoggedIn, onRequestClick }) {
  const handleRequestClick = (e) => {
    if (!isLoggedIn) {
      e.preventDefault();
      onRequestClick();
    }
  };

  const handleCardClick = (e) => {
    // Don't navigate if clicking on the request button
    if (e.target.closest('.request-btn')) {
      return;
    }
    
    // Only navigate if profile is public
    if (user.profileVisibility === 'Public') {
      window.location.href = `/user/${user.id}`;
    }
  };
  return (
    <div 
      className={`user-card ${user.profileVisibility === 'Public' ? 'clickable' : ''}`}
      onClick={handleCardClick}
    >
      <div className="user-avatar">
        <img src={user.avatar} alt={user.name} />
        <div className="avatar-label">Profile Photo</div>
      </div>
      
      <div className="user-info">
        <h3 className="user-name">{user.name}</h3>
        
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
        {isLoggedIn ? (
          <Link to={`/user/${user.id}`} className="request-btn">
            Request
          </Link>
        ) : (
          <button className="request-btn" onClick={handleRequestClick}>
            Request
          </button>
        )}
        <div className="rating">
          <span>rating</span>
          <span className="rating-value">{user.rating}/5</span>
        </div>
      </div>
    </div>
  )
}

export default UserCard