import { useState } from 'react'

function SkillSwapRequestPopup({ onClose, onSubmit, currentUser, targetUser }) {
  const [selectedOfferedSkill, setSelectedOfferedSkill] = useState('')
  const [selectedWantedSkill, setSelectedWantedSkill] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!selectedOfferedSkill || !selectedWantedSkill) {
      alert('Please select both skills for the exchange')
      return
    }

    const requestData = {
      offeredSkill: selectedOfferedSkill,
      wantedSkill: selectedWantedSkill,
      message: message.trim(),
      targetUser: targetUser.name,
      timestamp: new Date().toISOString()
    }

    onSubmit(requestData)
  }

  return (
    <div className="popup-overlay">
      <div className="skill-swap-popup">
        <form onSubmit={handleSubmit} className="skill-swap-form">
          <div className="skill-selection-section">
            <label className="skill-selection-label">
              Choose one of your offered skills
            </label>
            <div className="custom-select-container">
              <select 
                className="custom-select"
                value={selectedOfferedSkill}
                onChange={(e) => setSelectedOfferedSkill(e.target.value)}
                required
              >
                <option value="">Select a skill you offer</option>
                {currentUser.skillsOffered?.map((skill, index) => (
                  <option key={index} value={skill}>{skill}</option>
                ))}
              </select>
              <div className="select-arrow">
                <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                  <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>

          <div className="skill-selection-section">
            <label className="skill-selection-label">
              Choose one of their wanted skills
            </label>
            <div className="custom-select-container">
              <select 
                className="custom-select"
                value={selectedWantedSkill}
                onChange={(e) => setSelectedWantedSkill(e.target.value)}
                required
              >
                <option value="">Select a skill they want</option>
                {targetUser.skillsWanted?.map((skill, index) => (
                  <option key={index} value={skill}>{skill}</option>
                ))}
              </select>
              <div className="select-arrow">
                <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                  <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>

          <div className="message-section">
            <label className="message-label">Message</label>
            <textarea
              className="message-textarea"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write a message to introduce yourself and explain your skill exchange proposal..."
              rows={4}
            />
          </div>

          <div className="popup-actions-swap">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="submit-btn">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SkillSwapRequestPopup