import { useState } from 'react';
import UserCard from '../components/UserCard';
import LoginPopup from '../components/LoginPopup';
import { useNavigate } from 'react-router-dom';

function HomePage({ isLoggedIn, setIsLoggedIn }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [availability, setAvailability] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const navigate = useNavigate();

  const users = [
    {
      id: 1,
      name: 'Marc Demo',
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
      skillsOffered: ['Java Script', 'Python'],
      skillsWanted: ['Database', 'Graphic Designer'],
      rating: 3.9,
      profileVisibility: 'Public',
      requestStatus: null // null for regular users, 'pending' or 'accepted' for requests
    },
    {
      id: 2,
      name: 'Michell',
      avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
      skillsOffered: ['Java Script', 'Python'],
      skillsWanted: ['Database', 'Graphic Designer'],
      rating: 2.5,
      profileVisibility: 'Private',
      requestStatus: 'pending'
    },
    {
      id: 3,
      name: 'Joe wills',
      avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
      skillsOffered: ['Java Script', 'Python'],
      skillsWanted: ['Database', 'Graphic Designer'],
      rating: 4.0,
      profileVisibility: 'Public',
      requestStatus: 'accepted'
    }
  ];

  const usersPerPage = 3;
  
  // Filter users based on availability selection
  const filteredUsers = users.filter(user => {
    if (availability === 'All') return user.requestStatus === null;
    if (availability === 'Pending') return user.requestStatus === 'pending';
    if (availability === 'Accepted') return user.requestStatus === 'accepted';
    return true; // For other availability options like Weekdays, Weekends, etc.
  });

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const handleRequestClick = () => {
    if (!isLoggedIn) {
      setShowLoginPopup(true);
    }
  };

  const handleAcceptRequest = (userId) => {
    // Handle accept request logic here
    console.log(`Accepting request from user ${userId}`);
    // You would typically make an API call here
  };

  const handleRejectRequest = (userId) => {
    // Handle reject request logic here
    console.log(`Rejecting request from user ${userId}`);
    // You would typically make an API call here
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
              placeholder="Search skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="search-btn">Search</button>
          </div>
        </div>
      </div>

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

      {filteredUsers.length === 0 && (
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