import { useState } from 'react'

function SkillSwapRequestPopup({ onClose, onSubmit, currentUser, targetUser }) {
  const [selectedOfferedSkill, setSelectedOfferedSkill] = useState('')
  const [selectedWantedSkill, setSelectedWantedSkill] = useState('')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [validationErrors, setValidationErrors] = useState({})

  const validateForm = () => {
    const errors = {}
    
    if (!selectedOfferedSkill) {
      errors.offeredSkill = 'Please select a skill you offer'
    }
    
    if (!selectedWantedSkill) {
      errors.wantedSkill = 'Please select a skill they want'
    }
    
    if (message.trim().length < 10) {
      errors.message = 'Please provide a more detailed message (at least 10 characters)'
    }
    
    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      const requestData = {
        offeredSkill: selectedOfferedSkill,
        wantedSkill: selectedWantedSkill,
        message: message.trim(),
        targetUser: targetUser.name,
        timestamp: new Date().toISOString()
      }

      await onSubmit(requestData)
    } catch (error) {
      console.error('Error submitting request:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div className="popup-overlay" onClick={handleBackdropClick}>
      <div className="skill-swap-popup">
        <div className="popup-header">
          <h2>Send Skill Swap Request</h2>
          <p>to <strong>{targetUser.name}</strong></p>
          <button 
            className="close-popup-btn"
            onClick={onClose}
            disabled={isSubmitting}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="skill-swap-form">
          <div className="skill-selection-section">
            <label className="skill-selection-label">
              Choose one of your offered skills
            </label>
            <div className="custom-select-container">
              <select 
                className={`custom-select ${validationErrors.offeredSkill ? 'error' : ''}`}
                value={selectedOfferedSkill}
                onChange={(e) => {
                  setSelectedOfferedSkill(e.target.value)
                  if (validationErrors.offeredSkill) {
                    setValidationErrors(prev => ({...prev, offeredSkill: ''}))
                  }
                }}
                required
                disabled={isSubmitting}
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
            {validationErrors.offeredSkill && (
              <div className="validation-error">{validationErrors.offeredSkill}</div>
            )}
          </div>

          <div className="skill-selection-section">
            <label className="skill-selection-label">
              Choose one of their wanted skills
            </label>
            <div className="custom-select-container">
              <select 
                className={`custom-select ${validationErrors.wantedSkill ? 'error' : ''}`}
                value={selectedWantedSkill}
                onChange={(e) => {
                  setSelectedWantedSkill(e.target.value)
                  if (validationErrors.wantedSkill) {
                    setValidationErrors(prev => ({...prev, wantedSkill: ''}))
                  }
                }}
                required
                disabled={isSubmitting}
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
            {validationErrors.wantedSkill && (
              <div className="validation-error">{validationErrors.wantedSkill}</div>
            )}
          </div>

          <div className="message-section">
            <label className="message-label">
              Message
              <span className="char-count">({message.length}/500)</span>
            </label>
            <textarea
              className={`message-textarea ${validationErrors.message ? 'error' : ''}`}
              value={message}
              onChange={(e) => {
                if (e.target.value.length <= 500) {
                  setMessage(e.target.value)
                  if (validationErrors.message) {
                    setValidationErrors(prev => ({...prev, message: ''}))
                  }
                }
              }}
              placeholder="Write a message to introduce yourself and explain your skill exchange proposal..."
              rows={4}
              disabled={isSubmitting}
            />
            {validationErrors.message && (
              <div className="validation-error">{validationErrors.message}</div>
            )}
          </div>

          {selectedOfferedSkill && selectedWantedSkill && (
            <div className="exchange-preview">
              <h4>Exchange Preview:</h4>
              <div className="exchange-display">
                <span className="your-skill">Your: {selectedOfferedSkill}</span>
                <span className="exchange-arrow">⇄</span>
                <span className="their-skill">Their: {selectedWantedSkill}</span>
              </div>
            </div>
          )}

          <div className="popup-actions-swap">
            <button 
              type="button" 
              className="cancel-btn" 
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className={`submit-btn ${isSubmitting ? 'loading' : ''}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="btn-spinner"></div>
                  Sending...
                </>
              ) : (
                'Send Request'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SkillSwapRequestPopup