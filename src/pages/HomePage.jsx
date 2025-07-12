import { useState } from 'react';
import UserCard from '../components/UserCard';
import LoginPopup from '../components/LoginPopup';
import { useNavigate } from 'react-router-dom';
import { useSkillSwap } from '../contexts/SkillSwapContext';

function HomePage({ isLoggedIn, setIsLoggedIn }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [availability, setAvailability] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const navigate = useNavigate();
  
  // Use SkillSwapContext
  const { 
    getUsersWithRequestStatus, 
    getUsersByRequestStatus,
    acceptSkillSwapRequest, 
    rejectSkillSwapRequest 
  } = useSkillSwap();

  const usersPerPage = 3;
  
  // Normalize search term for better matching
  const normalizeString = (str) => {
    return str.toLowerCase().trim().replace(/\s+/g, ' ');
  };

  // Enhanced search function
  const searchUsers = (users, searchTerm) => {
    if (!searchTerm.trim()) return users;
    
    const normalizedSearch = normalizeString(searchTerm);
    
    return users.filter(user => {
      // Search in name
      const nameMatch = normalizeString(user.name).includes(normalizedSearch);
      
      // Search in skills offered
      const skillsOfferedMatch = user.skillsOffered.some(skill => 
        normalizeString(skill).includes(normalizedSearch)
      );
      
      // Search in skills wanted
      const skillsWantedMatch = user.skillsWanted.some(skill => 
        normalizeString(skill).includes(normalizedSearch)
      );
      
      return nameMatch || skillsOfferedMatch || skillsWantedMatch;
    });
  };

  // Filter users based on availability and search
  const filteredUsers = (() => {
    // Get users with their request status from context
    const usersWithStatus = getUsersByRequestStatus(availability);
    
    // Then apply search filter
    return searchUsers(usersWithStatus, searchTerm);
  })();

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const handleSearch = () => {
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleSearchInputChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when typing
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    setCurrentPage(1);
  };

  const handleRequestClick = () => {
    if (!isLoggedIn) {
      setShowLoginPopup(true);
    }
  };

  const handleAcceptRequest = async (userId) => {
    try {
      // Find the pending request for this user
      const usersWithStatus = getUsersWithRequestStatus();
      const targetUser = usersWithStatus.find(user => user.id === userId);
      
      if (targetUser && targetUser.request) {
        await acceptSkillSwapRequest(targetUser.request.id);
      }
    } catch (error) {
      console.error('Error accepting request:', error)
    }
  };

  const handleRejectRequest = async (userId) => {
    try {
      // Find the pending request for this user
      const usersWithStatus = getUsersWithRequestStatus();
      const targetUser = usersWithStatus.find(user => user.id === userId);
      
      if (targetUser && targetUser.request) {
        await rejectSkillSwapRequest(targetUser.request.id);
      }
    } catch (error) {
      console.error('Error rejecting request:', error)
    }
  };

  const renderPagination = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button
          key={i}
          className={`pagination-btn ${currentPage === i ? 'active' : ''}`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      );
    }
    return pages;
  };

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

  return (
    <div className="home-page">
      <div className="page-header">
        <h1>Discover Skills & Connect</h1>
        <p className="page-subtitle">Find talented people to exchange skills with</p>
      </div>

      <div className="search-section">
        <div className="search-controls">
          <select 
            className="availability-select"
            value={availability}
            onChange={(e) => setAvailability(e.target.value)}
          >
            <option value="All">All Users</option>
            <option value="Pending">Pending Requests</option>
            <option value="Accepted">Accepted Requests</option>
            <option value="Weekdays">Weekdays</option>
            <option value="Weekends">Weekends</option>
            <option value="Evenings">Evenings</option>
          </select>
          
          <div className="search-input-group">
            <input
              type="text"
              className="search-input"
              placeholder="Search skills or names..."
              value={searchTerm}
              onChange={handleSearchInputChange}
              onKeyPress={handleKeyPress}
            />
            <button className="search-btn" onClick={handleSearch}>
              Search
            </button>
            {searchTerm && (
              <button className="clear-btn" onClick={clearSearch}>
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {searchTerm && (
        <div className="search-results-info">
          <p>
            {filteredUsers.length} result{filteredUsers.length !== 1 ? 's' : ''} 
            found for "{searchTerm}"
          </p>
        </div>
      )}

      <div className="users-list">
        {paginatedUsers.map(user => (
          <UserCard 
            key={user.id} 
            user={user} 
            isLoggedIn={isLoggedIn}
            onRequestClick={handleRequestClick}
            onAcceptRequest={handleAcceptRequest}
            onRejectRequest={handleRejectRequest}
            viewMode={availability}
          />
        ))}
      </div>

      {filteredUsers.length === 0 && searchTerm && (
        <div className="no-results">
          <p>No results found for "{searchTerm}".</p>
          <p>Try searching for different skills or names.</p>
        </div>
      )}

      {filteredUsers.length === 0 && !searchTerm && (
        <div className="no-results">
          <p>No {availability.toLowerCase()} requests found.</p>
        </div>
      )}

      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="pagination-btn"
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            ‹
          </button>
          {renderPagination()}
          <button
            className="pagination-btn"
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            ›
          </button>
        </div>
      )}

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

export default HomePage;