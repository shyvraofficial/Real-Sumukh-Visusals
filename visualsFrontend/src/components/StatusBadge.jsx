import React from 'react';

// ============================================================================
// THEME - Professional monochrome palette
// ============================================================================
const THEME = {
  colors: {
    primary: '#ffffff',      // Primary (white)
    secondary: '#000000',    // Secondary (black)
    tertiary: '#131313',     // Tertiary (dark gray)
    text: '#f3f3f3',         // Text (light gray)
  },
};

// ============================================================================
// StatusBadge - Elegant grayscale status indicator
// ============================================================================
/**
 * Status Badge Component
 * 
 * Statuses:
 * - "not_started" → Light text, transparent bg, subtle border
 * - "in_progress" → Bold text, light gray bg, thin border
 * - "first_draft_ready" → Semibold text, dark bg, prominent border
 * - "revision_phase" → Semibold text, medium gray bg, no border
 * - "delivered" → Bold text, white bg, black text
 */
export const StatusBadge = ({ status = 'not_started', size = 'sm' }) => {
  const statusConfig = {
    not_started: {
      label: 'Not Started',
      backgroundColor: 'transparent',
      color: THEME.colors.text,
      borderColor: THEME.colors.text,
      borderWidth: '1px',
      fontWeight: 'normal',
      opacity: 0.7,
      textTransform: 'none',
    },
    in_progress: {
      label: 'In Progress',
      backgroundColor: THEME.colors.text,
      color: THEME.colors.secondary,
      borderColor: THEME.colors.text,
      borderWidth: '1px',
      fontWeight: 'semibold',
      opacity: 1,
      textTransform: 'none',
    },
    first_draft_ready: {
      label: 'First Draft Ready',
      backgroundColor: THEME.colors.tertiary,
      color: THEME.colors.text,
      borderColor: THEME.colors.text,
      borderWidth: '1.5px',
      fontWeight: 'semibold',
      opacity: 1,
      textTransform: 'none',
    },
    revision_phase: {
      label: 'Revision Phase',
      backgroundColor: THEME.colors.text,
      color: THEME.colors.secondary,
      borderColor: 'transparent',
      borderWidth: '0px',
      fontWeight: 'semibold',
      opacity: 0.5,
      textTransform: 'none',
    },
    delivered: {
      label: 'Delivered',
      backgroundColor: THEME.colors.primary,
      color: THEME.colors.secondary,
      borderColor: THEME.colors.primary,
      borderWidth: '1.5px',
      fontWeight: 'bold',
      opacity: 1,
      textTransform: 'none',
    },
  };

  const config = statusConfig[status] || statusConfig.not_started;

  // Size variants
  const sizeClasses = {
    xs: 'px-2 py-0.5 text-xs',
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-1.5 text-base',
    lg: 'px-5 py-2 text-lg',
  };

  const sizeClass = sizeClasses[size] || sizeClasses.sm;

  return (
    <span
      className={`
        inline-flex items-center justify-center rounded-full font-${config.fontWeight}
        transition-all duration-300
        hover:opacity-100 cursor-default
        ${sizeClass}
      `}
      style={{
        backgroundColor: config.backgroundColor,
        color: config.color,
        borderWidth: config.borderWidth,
        borderColor: config.borderColor,
        borderStyle: config.borderWidth !== '0px' ? 'solid' : 'none',
        opacity: config.opacity,
        fontWeight: config.fontWeight === 'normal' ? 400 : 
                    config.fontWeight === 'semibold' ? 600 : 
                    config.fontWeight === 'bold' ? 700 : 400,
      }}
      title={config.label}
    >
      {config.label}
    </span>
  );
};

// ============================================================================
// StatusBadgeGrid - Multiple status examples
// ============================================================================
export const StatusBadgeGrid = ({ size = 'sm' }) => {
  const statuses = [
    'not_started',
    'in_progress',
    'first_draft_ready',
    'revision_phase',
    'delivered',
  ];

  return (
    <div className="flex flex-wrap gap-3">
      {statuses.map(status => (
        <StatusBadge key={status} status={status} size={size} />
      ))}
    </div>
  );
};

// ============================================================================
// StatusBadgeComparison - Visual comparison table
// ============================================================================
export const StatusBadgeComparison = () => {
  const statuses = [
    { key: 'not_started', label: 'Not Started', description: 'Transparent bg, light border, reduced opacity' },
    { key: 'in_progress', label: 'In Progress', description: 'Light gray bg, black text, prominent' },
    { key: 'first_draft_ready', label: 'First Draft Ready', description: 'Dark bg, light text, thick border' },
    { key: 'revision_phase', label: 'Revision Phase', description: 'Light gray bg, semi-transparent, reduced opacity' },
    { key: 'delivered', label: 'Delivered', description: 'White bg, black text, bold weight' },
  ];

  return (
    <div className="space-y-3">
      {statuses.map(({ key, label, description }) => (
        <div key={key} className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: THEME.colors.tertiary, borderColor: THEME.colors.text, borderWidth: '1px' }}>
          <div>
            <p className="font-semibold" style={{ color: THEME.colors.primary }}>{label}</p>
            <p className="text-sm" style={{ color: THEME.colors.text }}>{description}</p>
          </div>
          <StatusBadge status={key} size="sm" />
        </div>
      ))}
    </div>
  );
};

// ============================================================================
// Export
// ============================================================================
export default StatusBadge;
