import React, { useState } from 'react';

// ============================================================================
// THEME - Professional monochrome palette
// ============================================================================
const THEME = {
  colors: {
    primary: '#ffffff',      // Primary headings
    secondary: '#000000',    // Pure black backgrounds
    tertiary: '#131313',     // Card backgrounds
    text: '#f3f3f3',         // Labels, descriptions
  },
};

// ============================================================================
// StatusBadge - Status indicator component
// ============================================================================
const StatusBadge = ({ status }) => {
  // Normalize status to lowercase with underscores
  const normalizeStatus = (s) => {
    if (!s) return 'pending';
    return s
      .toLowerCase()
      .replace(/\s+/g, '_')
      .replace(/-/g, '_');
  };

  const normalizedStatus = normalizeStatus(status);

  const statusConfig = {
    in_progress: { label: 'In Progress', bg: THEME.colors.text, text: THEME.colors.secondary },
    awaiting_review: { label: 'Awaiting Review', bg: THEME.colors.tertiary, text: THEME.colors.text },
    awaiting_approval: { label: 'Awaiting Approval', bg: THEME.colors.secondary, text: THEME.colors.text },
    awaiting_assets: { label: 'Awaiting Assets', bg: THEME.colors.text, text: THEME.colors.secondary },
    delivered: { label: 'Delivered', bg: THEME.colors.primary, text: THEME.colors.secondary },
    first_draft_ready: { label: 'First Draft Ready', bg: THEME.colors.tertiary, text: THEME.colors.text },
    pending: { label: 'Pending', bg: THEME.colors.secondary, text: THEME.colors.text },
    planning: { label: 'Planning', bg: THEME.colors.secondary, text: THEME.colors.text },
    completed: { label: 'Completed', bg: THEME.colors.text, text: THEME.colors.secondary },
    on_hold: { label: 'On Hold', bg: THEME.colors.secondary, text: THEME.colors.text },
  };

  const config = statusConfig[normalizedStatus] || statusConfig.pending;

  return (
    <span
      className="inline-block px-3 py-1 rounded-full text-xs font-semibold transition-opacity hover:opacity-80"
      style={{
        backgroundColor: config.bg,
        color: config.text,
      }}
    >
      {config.label}
    </span>
  );
};

// ============================================================================
// ClientProjectCard - Comprehensive project display card
// ============================================================================
export const ClientProjectCard = ({
  projectName = 'Untitled Project',
  projectType = 'Video Editing',
  packageType = 'Premium',
  deadline = null,
  status = 'pending',
  completed = 0,
  total = 0,
  pendingAction = null,
  onViewProject = () => {},
  onMessage = () => {},
  isUrgent = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isMessageHovered, setIsMessageHovered] = useState(false);
  const [isViewHovered, setIsViewHovered] = useState(false);

  // Calculate progress percentage
  const progressPercentage = total > 0 ? (completed / total) * 100 : 0;

  // Parse deadline if it's a date
  let deadlineDate = null;
  let formattedDeadline = null;
  let daysRemaining = null;

  try {
    if (deadline) {
      deadlineDate = new Date(deadline);
      // Check if date is valid
      if (!isNaN(deadlineDate.getTime())) {
        formattedDeadline = deadlineDate.toLocaleDateString('en-IN', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        });
        // Calculate days remaining
        const now = new Date();
        daysRemaining = Math.ceil((deadlineDate - now) / (1000 * 60 * 60 * 24));
      }
    }
  } catch (error) {
  }

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        p-6 rounded-xl border transition-all duration-300
        shadow-lg
      `}
      style={{
        backgroundColor: THEME.colors.tertiary,
        borderColor: THEME.colors.text,
        borderWidth: '1px',
        transform: 'translateY(0)',
      }}
    >
      {/* Header Section */}
      <div className="mb-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1">
            <h3
              className="text-lg font-bold mb-1 line-clamp-2"
              style={{ color: THEME.colors.primary }}
            >
              {projectName}
            </h3>
            {/* Metadata Line */}
            <p className="text-xs font-medium" style={{ color: THEME.colors.text }}>
              {projectType} • {packageType}
            </p>
          </div>
          <StatusBadge status={status} />
        </div>
      </div>

      {/* Progress Section */}
      <div className="mb-5 pb-5 border-b" style={{ borderColor: THEME.colors.text }}>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold" style={{ color: THEME.colors.text }}>
            Progress
          </span>
          <span
            className="text-sm font-bold"
            style={{ color: THEME.colors.primary }}
          >
            {completed}/{total}
          </span>
        </div>

        {/* Progress Bar */}
        <div
          className="w-full h-2.5 rounded-full overflow-hidden mb-2"
          style={{ backgroundColor: THEME.colors.secondary }}
        >
          <div
            className="h-full transition-all duration-500 ease-out"
            style={{
              width: `${progressPercentage}%`,
              backgroundColor: THEME.colors.text,
            }}
          />
        </div>

        {/* Progress Text */}
        <p className="text-xs" style={{ color: THEME.colors.text }}>
          {Math.round(progressPercentage)}% Complete
        </p>
      </div>

      {/* Info Section */}
      <div className="mb-5 space-y-2">
        {/* Deadline */}
        {formattedDeadline && (
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium" style={{ color: THEME.colors.text }}>
                Deadline
              </span>
              <span
                className="text-sm font-semibold"
                style={{
                  color: isUrgent || (daysRemaining && daysRemaining <= 7) 
                    ? THEME.colors.text 
                    : THEME.colors.text,
                }}
              >
                {formattedDeadline}
              </span>
            </div>
            {daysRemaining !== null && (
              <div className="flex items-center justify-between px-0">
                <span className="text-xs" style={{ color: THEME.colors.text }}></span>
                <span 
                  className="text-xs font-medium"
                  style={{ 
                    color: daysRemaining <= 7 ? THEME.colors.text : THEME.colors.text 
                  }}
                >
                  {daysRemaining > 0 ? `${daysRemaining}d left` : 'Overdue'}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Pending Action */}
        {pendingAction && (
          <div
            className="p-4 rounded-lg border"
            style={{ backgroundColor: THEME.colors.secondary, borderColor: THEME.colors.text, borderWidth: '1px' }}
          >
            <p className="text-xs font-semibold mb-2" style={{ color: THEME.colors.text }}>
              Action Needed
            </p>
            <p className="text-sm" style={{ color: THEME.colors.primary }}>
              {pendingAction}
            </p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        {/* View Project Button */}
        <button
          onClick={onViewProject}
          onMouseEnter={() => setIsViewHovered(true)}
          onMouseLeave={() => setIsViewHovered(false)}
          className="flex-1 px-4 py-2.5 rounded-lg font-semibold text-sm transition-all duration-300"
          style={{
            backgroundColor: 'transparent',
            color: THEME.colors.text,
            border: `1.5px solid ${THEME.colors.text}`,
            opacity: isViewHovered ? 0.8 : 1,
          }}
        >
          View Project
        </button>

        {/* Message Button */}
        <button
          onClick={onMessage}
          onMouseEnter={() => setIsMessageHovered(true)}
          onMouseLeave={() => setIsMessageHovered(false)}
          className="flex-1 px-4 py-2.5 rounded-lg font-semibold text-sm transition-all duration-300"
          style={{
            backgroundColor: 'transparent',
            color: THEME.colors.primary,
            border: `1.5px solid ${THEME.colors.primary}`,
            opacity: isMessageHovered ? 0.8 : 1,
          }}
        >
          Message
        </button>
      </div>

      {/* Urgent Badge (Optional) */}
      {isUrgent && (
        <div
          className="mt-4 p-2 rounded-lg text-center text-xs font-bold"
          style={{
            backgroundColor: THEME.colors.secondary,
            color: THEME.colors.text,
          }}
        >
          ⚠ This project requires urgent attention
        </div>
      )}
    </div>
  );
};

// ============================================================================
// ProjectCardGrid - Container for multiple project cards
// ============================================================================
export const ProjectCardGrid = ({ children, columns = 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-3' }) => {
  return <div className={`grid ${columns} gap-6`}>{children}</div>;
};

// ============================================================================
// Export
// ============================================================================
export default ClientProjectCard;
