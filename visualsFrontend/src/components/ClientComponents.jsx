import React from 'react';

/**
 * ============================================================================
 * FRONTEND CLIENT DASHBOARD COMPONENTS
 * Reusable components for client-facing views
 * Professional Monochrome Palette: #000000, #131313, #f3f3f3, #ffffff only
 * ============================================================================
 */

// ============================================================================
// OverviewCard - Large stat cards showing key metrics
// ============================================================================
export const OverviewCard = ({
  icon: Icon,
  label,
  value,
  subtext,
  color = 'gray',
  trend,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className="p-6 rounded-lg border hover:border-gray-600 transition-all duration-300 cursor-pointer group"
      style={{ backgroundColor: '#131313', borderColor: '#f3f3f3' }}
    >
      <div className="flex items-start justify-between mb-4">
        {Icon && (
          <div className="p-3 rounded-lg" style={{ backgroundColor: '#000000' }}>
            <Icon className="w-6 h-6" style={{ color: '#f3f3f3' }} />
          </div>
        )}
        {trend && (
          <span className="text-xs font-medium" style={{ color: '#f3f3f3' }}>
            {trend.positive ? '↑' : '↓'} {trend.value}
          </span>
        )}
      </div>
      <p className="text-sm font-medium mb-2" style={{ color: '#f3f3f3' }}>{label}</p>
      <p className="text-3xl font-semibold mb-1" style={{ color: '#ffffff' }}>{value}</p>
      {subtext && <p className="text-xs" style={{ color: '#f3f3f3' }}>{subtext}</p>}
    </div>
  );
};

// ============================================================================
// ProjectCard - Card display for individual projects (read-only)
// ============================================================================
export const ProjectCard = ({
  projectName,
  type,
  packageType,
  status,
  progress,
  deadline,
  pendingAction,
  completedReels,
  totalReels,
  onClick,
}) => {
  const getStatusColor = (status) => {
    const colors = {
      'Planning': '#f3f3f3',
      'In Progress': '#ffffff',
      'First Draft Ready': '#ffffff',
      'In Revision': '#f3f3f3',
      'Completed': '#ffffff',
      'On Hold': '#f3f3f3',
    };
    return colors[status] || '#f3f3f3';
  };

  const deadlineDate = new Date(deadline);
  const today = new Date();
  const daysRemaining = Math.ceil((deadlineDate - today) / (1000 * 60 * 60 * 24));
  const isUrgent = daysRemaining <= 3;

  return (
    <div
      onClick={onClick}
      className="p-6 rounded-lg border transition-all duration-300 cursor-pointer group"
      style={{ backgroundColor: '#131313', borderColor: '#f3f3f3' }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="font-semibold text-lg mb-1 transition-colors" style={{ color: '#ffffff' }}>
            {projectName}
          </h3>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2 py-1 text-xs rounded" style={{ backgroundColor: '#000000', color: '#f3f3f3' }}>
              {type}
            </span>
            <span className="px-2 py-1 text-xs rounded" style={{ backgroundColor: '#000000', color: '#f3f3f3' }}>
              {packageType}
            </span>
          </div>
        </div>
        <div
          className="text-right text-xs font-medium"
          style={{ color: isUrgent ? '#ffffff' : '#f3f3f3' }}
        >
          {isUrgent && <p className="mb-1">⚠ Urgent</p>}
          <p>{daysRemaining} days left</p>
        </div>
      </div>

      {/* Status & Progress */}
      <div className="mb-4 space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium" style={{ color: getStatusColor(status) }}>
            {status}
          </p>
          <span className="text-xs font-medium" style={{ color: '#f3f3f3' }}>{Math.round(progress)}%</span>
        </div>
        <div className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: '#000000' }}>
          <div
            className="h-full transition-all duration-300"
            style={{ width: `${progress}%`, backgroundColor: '#f3f3f3' }}
          />
        </div>
      </div>

      {/* Details */}
      <div className="space-y-2 mb-4 pb-4 border-b" style={{ borderColor: '#f3f3f3' }}>
        {completedReels !== undefined && totalReels !== undefined && (
          <div className="flex justify-between items-center text-xs">
            <span style={{ color: '#f3f3f3' }}>Progress</span>
            <span style={{ color: '#ffffff' }}>
              {completedReels}/{totalReels} reels
            </span>
          </div>
        )}
        <div className="flex justify-between items-center text-xs">
          <span style={{ color: '#f3f3f3' }}>Deadline</span>
          <span style={{ color: isUrgent ? '#ffffff' : '#f3f3f3' }}>
            {deadlineDate.toLocaleDateString('en-IN', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </span>
        </div>
      </div>

      {/* Pending Action */}
      {pendingAction && (
        <div
          className="p-3 rounded-lg text-xs"
          style={{ backgroundColor: '#000000', color: '#f3f3f3' }}
        >
          <p className="mb-1" style={{ color: '#f3f3f3' }}>Next Step</p>
          <p className="font-medium" style={{ color: '#ffffff' }}>{pendingAction}</p>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// PendingActionAlert - Prominent alert for client actions needed
// ============================================================================
export const PendingActionAlert = ({
  title = 'Action Required',
  message,
  actionLabel = 'View Details',
  onAction,
  icon: Icon = null,
  priority = 'medium',
}) => {
  return (
    <div
      className="p-6 rounded-lg border cursor-pointer hover:border-gray-600 transition-all"
      style={{ borderColor: '#f3f3f3', backgroundColor: '#131313' }}
    >
      <div className="flex gap-4">
        {Icon && (
          <div className="flex-shrink-0">
            <Icon className="w-6 h-6" style={{ color: '#f3f3f3' }} />
          </div>
        )}
        <div className="flex-1">
          <h3 className="font-semibold mb-1" style={{ color: '#ffffff' }}>{title}</h3>
          <p className="text-sm mb-4" style={{ color: '#f3f3f3' }}>{message}</p>
          <button
            onClick={onAction}
            className="text-sm font-medium transition-colors hover:opacity-80"
            style={{ color: '#f3f3f3' }}
          >
            {actionLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// BillingCycleCard - Shows billing information in a visual card
// ============================================================================
export const BillingCycleCard = ({
  packageName,
  totalAmount,
  paidAmount,
  remainingAmount,
  completedReels,
  totalReels,
  dueDate,
}) => {
  const calculatedRemaining = remainingAmount !== undefined ? remainingAmount : (totalAmount - paidAmount);
  const paymentProgress = totalAmount ? (paidAmount / totalAmount) * 100 : 0;
  const projectProgress = totalReels ? (completedReels / totalReels) * 100 : 0;

  return (
    <div
      className="p-6 rounded-lg border"
      style={{ backgroundColor: '#131313', borderColor: '#f3f3f3' }}
    >
      <h3 className="font-semibold text-lg mb-6" style={{ color: '#ffffff' }}>{packageName}</h3>

      {/* Amount Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6 p-4 rounded-lg" style={{ backgroundColor: '#000000' }}>
        <div>
          <p className="text-xs mb-1" style={{ color: '#f3f3f3' }}>Total</p>
          <p className="font-semibold" style={{ color: '#ffffff' }}>₹{totalAmount?.toLocaleString('en-IN')}</p>
        </div>
        <div>
          <p className="text-xs mb-1" style={{ color: '#f3f3f3' }}>Paid</p>
          <p className="font-semibold" style={{ color: '#ffffff' }}>₹{paidAmount?.toLocaleString('en-IN')}</p>
        </div>
        <div>
          <p className="text-xs mb-1" style={{ color: '#f3f3f3' }}>Remaining</p>
          <p className="font-semibold" style={{ color: '#f3f3f3' }}>₹{calculatedRemaining?.toLocaleString('en-IN')}</p>
        </div>
      </div>

      {/* Payment Progress */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <p className="text-xs" style={{ color: '#f3f3f3' }}>Payment Progress</p>
          <p className="text-xs font-medium" style={{ color: '#f3f3f3' }}>{Math.round(paymentProgress)}%</p>
        </div>
        <div className="w-full h-2.5 rounded-full overflow-hidden" style={{ backgroundColor: '#000000' }}>
          <div
            className="h-full transition-all duration-300"
            style={{ width: `${paymentProgress}%`, backgroundColor: '#f3f3f3' }}
          />
        </div>
      </div>

      {/* Project Progress */}
      {totalReels > 0 && (
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <p className="text-xs" style={{ color: '#f3f3f3' }}>Project Completion</p>
            <p className="text-xs font-medium" style={{ color: '#f3f3f3' }}>
              {completedReels}/{totalReels} reels
            </p>
          </div>
          <div className="w-full h-2.5 rounded-full overflow-hidden" style={{ backgroundColor: '#000000' }}>
            <div
              className="h-full transition-all duration-300"
              style={{ width: `${projectProgress}%`, backgroundColor: '#f3f3f3' }}
            />
          </div>
        </div>
      )}

      {/* Next Payment Due */}
      {dueDate && (
        <div className="pt-4 border-t" style={{ borderColor: '#f3f3f3' }}>
          <p className="text-xs mb-1" style={{ color: '#f3f3f3' }}>Payment Due</p>
          <p className="font-medium" style={{ color: '#ffffff' }}>
            {new Date(dueDate).toLocaleDateString('en-IN', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </p>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// InstructionsCard - Displays client instructions and delivery timeline
// ============================================================================
export const InstructionsCard = ({
  deliveryTime,
  clientInstructions,
  adminContact,
  whatsappNumber,
}) => {
  return (
    <div
      className="p-6 rounded-lg border"
      style={{ backgroundColor: '#131313', borderColor: '#f3f3f3' }}
    >
      <h3 className="font-semibold text-lg mb-6" style={{ color: '#ffffff' }}>Project Details</h3>

      {/* Delivery Time */}
      <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: '#000000' }}>
        <p className="text-xs mb-2" style={{ color: '#f3f3f3' }}>Expected Delivery</p>
        <p className="text-base font-semibold" style={{ color: '#ffffff' }}>{deliveryTime}</p>
      </div>

      {/* Instructions */}
      {clientInstructions && (
        <div className="mb-6">
          <p className="text-sm font-medium mb-3" style={{ color: '#f3f3f3' }}>Important Notes</p>
          <div className="p-4 rounded-lg border" style={{ backgroundColor: '#000000', borderColor: '#f3f3f3', color: '#f3f3f3' }}>
            <p className="text-sm leading-relaxed">{clientInstructions}</p>
          </div>
        </div>
      )}

      {/* Contact Section */}
      <div className="pt-6 space-y-3 border-t" style={{ borderColor: '#f3f3f3' }}>
        <p className="text-sm font-medium" style={{ color: '#f3f3f3' }}>Have questions?</p>
        <div className="flex gap-3">
          {whatsappNumber && (
            <a
              href={`https://wa.me/${whatsappNumber.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 px-4 py-2 rounded-lg border text-center text-sm font-medium transition-colors"
              style={{ borderColor: '#f3f3f3', color: '#f3f3f3' }}
              onMouseEnter={(e) => e.target.style.color = '#ffffff'}
              onMouseLeave={(e) => e.target.style.color = '#f3f3f3'}
            >
              WhatsApp
            </a>
          )}
          {adminContact && (
            <a
              href={`mailto:${adminContact}`}
              className="flex-1 px-4 py-2 rounded-lg border text-center text-sm font-medium transition-colors"
              style={{ borderColor: '#f3f3f3', color: '#f3f3f3' }}
              onMouseEnter={(e) => e.target.style.color = '#ffffff'}
              onMouseLeave={(e) => e.target.style.color = '#f3f3f3'}
            >
              Email
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// StatusBadge - Small badge showing project status
// ============================================================================
export const StatusBadge = ({ status, size = 'md' }) => {
  const getStatusStyle = (status) => {
    const styles = {
      'Planning': { bg: '#000000', color: '#f3f3f3' },
      'In Progress': { bg: '#000000', color: '#ffffff' },
      'First Draft Ready': { bg: '#000000', color: '#ffffff' },
      'In Revision': { bg: '#000000', color: '#f3f3f3' },
      'Completed': { bg: '#131313', color: '#ffffff' },
      'On Hold': { bg: '#000000', color: '#f3f3f3' },
    };
    return styles[status] || { bg: '#000000', color: '#f3f3f3' };
  };

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  const style = getStatusStyle(status);

  return (
    <span
      className={`font-medium rounded-full inline-block ${sizeClasses[size]}`}
      style={{ backgroundColor: style.bg, color: style.color }}
    >
      {status}
    </span>
  );
};

// ============================================================================
// EmptyState - Display when no projects or data exist
// ============================================================================
export const EmptyState = ({
  icon: Icon,
  title = 'No Data',
  message = 'You have no projects yet',
  actionLabel,
  onAction,
}) => {
  return (
    <div
      className="p-12 rounded-lg border text-center"
      style={{ backgroundColor: '#131313', borderColor: '#f3f3f3' }}
    >
      {Icon && (
        <div className="flex justify-center mb-4">
          <Icon className="w-12 h-12" style={{ color: '#f3f3f3' }} />
        </div>
      )}
      <h3 className="text-lg font-semibold mb-2" style={{ color: '#ffffff' }}>{title}</h3>
      <p className="text-sm mb-6" style={{ color: '#f3f3f3' }}>{message}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-6 py-2 rounded-lg text-sm font-medium transition-colors"
          style={{ backgroundColor: '#000000', color: '#f3f3f3', borderColor: '#f3f3f3' }}
          onMouseEnter={(e) => e.target.style.color = '#ffffff'}
          onMouseLeave={(e) => e.target.style.color = '#f3f3f3'}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

// ============================================================================
// LoadingSpinner - Loading state indicator
// ============================================================================
export const LoadingSpinner = ({
  text = 'Loading your projects...',
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div
        className={`${sizeClasses[size]} border-2 rounded-full animate-spin`}
        style={{ borderColor: '#000000', borderTopColor: '#f3f3f3' }}
      />
      <p className="text-sm mt-4" style={{ color: '#f3f3f3' }}>{text}</p>
    </div>
  );
};
