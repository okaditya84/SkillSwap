function SkillTag({ skill, onRemove, removable = false }) {
  return (
    <span className="skill-tag">
      {skill}
      {removable && (
        <button 
          className="remove-skill"
          onClick={onRemove}
          aria-label={`Remove ${skill}`}
        >
          ×
        </button>
      )}
    </span>
  )
}

export default SkillTag