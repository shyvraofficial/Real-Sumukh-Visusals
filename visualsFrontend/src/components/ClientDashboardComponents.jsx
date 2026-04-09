import React, { useState } from 'react';

// ============================================================================
// THEME CONSTANTS - Professional monochrome palette
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
// OverviewCard - Key metrics display with optional trend
// ============================================================================
export const OverviewCard = ({
  title,
  value,
  subtitle = null,
  trend = null,
  onClick = null,
  isHighlight = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        p-6 rounded-lg border transition-all duration-300 cursor-pointer
        ${onClick ? 'hover:border-opacity-100' : ''}
      `}
      style={{
        backgroundColor: isHighlight ? THEME.colors.secondary : THEME.colors.tertiary,
        borderColor: isHovered ? THEME.colors.primary : THEME.colors.text,
        borderWidth: '1px',
      }}
    >
      <p className="text-sm mb-3 font-medium" style={{ color: THEME.colors.text }}>
        {title}
      </p>
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-3xl font-bold mb-1" style={{ color: THEME.colors.primary }}>
            {value}
          </p>
          {subtitle && (
            <p className="text-xs" style={{ color: THEME.colors.text }}>
              {subtitle}
            </p>
          )}
        </div>
        {trend && (
          <div className="text-right">
            <p
              className="text-sm font-semibold"
              style={{ color: trend.positive ? THEME.colors.text : THEME.colors.text }}
            >
              {trend.text}
            </p>
            <p className="text-xs" style={{ color: THEME.colors.text }}>
              {trend.subtext}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// StatusBadge - Status indicator with consistent styling
// ============================================================================
export const StatusBadge = ({ status, size = 'sm' }) => {
  const statusConfig = {
    active: { label: 'Active', bg: THEME.colors.text, text: THEME.colors.secondary },
    pending: { label: 'Pending', bg: THEME.colors.secondary, text: THEME.colors.text },
    completed: { label: 'Completed', bg: THEME.colors.text, text: THEME.colors.secondary },
    on_hold: { label: 'On Hold', bg: THEME.colors.secondary, text: THEME.colors.text },
    urgent: { label: 'Urgent', bg: THEME.colors.text, text: THEME.colors.secondary },
  };

  const config = statusConfig[status] || statusConfig.pending;
  const sizeClasses = size === 'sm' ? 'px-2.5 py-1 text-xs' : 'px-3 py-1.5 text-sm';

  return (
    <span
      className={`inline-block rounded-full font-semibold ${sizeClasses} transition-opacity hover:opacity-80`}
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
// ProjectCard - Individual project display card
// ============================================================================
export const ProjectCard = ({
  projectName,
  projectType,
  status,
  daysRemaining,
  completionPercentage,
  onClick,
  isUrgent = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="p-6 rounded-lg border transition-all duration-300 cursor-pointer"
      style={{
        backgroundColor: THEME.colors.tertiary,
        borderColor: isHovered ? THEME.colors.primary : THEME.colors.text,
        borderWidth: '1px',
      }}
    >
      <div className="mb-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-semibold mb-1" style={{ color: THEME.colors.primary }}>
              {projectName}
            </h3>
            <p className="text-xs" style={{ color: THEME.colors.text }}>
              {projectType}
            </p>
          </div>
          <StatusBadge status={status} size="sm" />
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs" style={{ color: THEME.colors.text }}>
            Progress
          </span>
          <span className="text-sm font-semibold" style={{ color: THEME.colors.text }}>
            {completionPercentage}%
          </span>
        </div>
        <div
          className="w-full h-2 rounded-full overflow-hidden"
          style={{ backgroundColor: THEME.colors.secondary }}
        >
          <div
            className="h-full transition-all duration-300"
            style={{ width: `${completionPercentage}%`, backgroundColor: THEME.colors.text }}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div>
          {isUrgent ? (
            <p className="text-xs font-semibold" style={{ color: THEME.colors.text }}>
              ⚠ {daysRemaining} days left
            </p>
          ) : (
            <p className="text-xs" style={{ color: THEME.colors.text }}>
              {daysRemaining} days remaining
            </p>
          )}
        </div>
        <p className="text-xs font-medium" style={{ color: THEME.colors.text }}>
          View Details →
        </p>
      </div>
    </div>
  );
};

// ============================================================================
// BillingSummaryCard - Payment status and breakdown
// ============================================================================
export const BillingSummaryCard = ({
  packageName,
  totalAmount,
  paidAmount,
  remainingAmount,
  dueDate = null,
}) => {
  const paymentProgress = (paidAmount / totalAmount) * 100;

  return (
    <div
      className="p-6 rounded-lg border"
      style={{
        backgroundColor: THEME.colors.tertiary,
        borderColor: THEME.colors.text,
        borderWidth: '1px',
      }}
    >
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-1" style={{ color: THEME.colors.primary }}>
          {packageName}
        </h3>
        {dueDate && (
          <p className="text-xs" style={{ color: THEME.colors.text }}>
            Due: {dueDate}
          </p>
        )}
      </div>

      {/* Amount Breakdown Grid */}
      <div
        className="grid grid-cols-3 gap-3 mb-6 p-4 rounded-lg"
        style={{ backgroundColor: THEME.colors.secondary }}
      >
        <div>
          <p className="text-xs mb-1" style={{ color: THEME.colors.text }}>
            Total
          </p>
          <p className="text-lg font-bold" style={{ color: THEME.colors.primary }}>
            ₹{totalAmount?.toLocaleString('en-IN')}
          </p>
        </div>
        <div>
          <p className="text-xs mb-1" style={{ color: THEME.colors.text }}>
            Paid
          </p>
          <p className="text-lg font-bold" style={{ color: THEME.colors.primary }}>
            ₹{paidAmount?.toLocaleString('en-IN')}
          </p>
        </div>
        <div>
          <p className="text-xs mb-1" style={{ color: THEME.colors.text }}>
            Remaining
          </p>
          <p className="text-lg font-bold" style={{ color: THEME.colors.text }}>
            ₹{remainingAmount?.toLocaleString('en-IN')}
          </p>
        </div>
      </div>

      {/* Payment Progress Bar */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium" style={{ color: THEME.colors.text }}>
            Payment Progress
          </p>
          <span className="text-sm font-semibold" style={{ color: THEME.colors.text }}>
            {Math.round(paymentProgress)}%
          </span>
        </div>
        <div
          className="w-full h-3 rounded-full overflow-hidden"
          style={{ backgroundColor: THEME.colors.secondary }}
        >
          <div
            className="h-full transition-all duration-300"
            style={{ width: `${paymentProgress}%`, backgroundColor: THEME.colors.text }}
          />
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// PendingActionCard - Highlight important client actions
// ============================================================================
export const PendingActionCard = ({
  title,
  message,
  actionLabel = 'Take Action',
  onAction,
  priority = 'medium',
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const priorityBorder = priority === 'high' ? THEME.colors.text : THEME.colors.text;

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="p-6 rounded-lg border transition-all duration-300"
      style={{
        backgroundColor: THEME.colors.tertiary,
        borderColor: isHovered ? THEME.colors.primary : priorityBorder,
        borderWidth: '2px',
      }}
    >
      <div className="mb-4">
        <h3 className="font-semibold mb-2" style={{ color: THEME.colors.primary }}>
          {title}
        </h3>
        <p className="text-sm" style={{ color: THEME.colors.text }}>
          {message}
        </p>
      </div>

      <button
        onClick={onAction}
        className="text-sm font-semibold px-4 py-2 rounded-lg transition-all duration-300"
        style={{
          backgroundColor: isHovered ? THEME.colors.text : 'transparent',
          color: isHovered ? THEME.colors.secondary : THEME.colors.text,
          border: `1px solid ${THEME.colors.text}`,
        }}
      >
        {actionLabel}
      </button>
    </div>
  );
};

// ============================================================================
// ClientInstructionsCard - Important guidelines and information
// ============================================================================
export const ClientInstructionsCard = ({
  title = 'Important Information',
  instructions = [],
  contactEmail = null,
  contactPhone = null,
}) => {
  return (
    <div
      className="p-6 rounded-lg border"
      style={{
        backgroundColor: THEME.colors.tertiary,
        borderColor: THEME.colors.text,
        borderWidth: '1px',
      }}
    >
      <h3 className="text-lg font-semibold mb-4" style={{ color: THEME.colors.primary }}>
        {title}
      </h3>

      {instructions && instructions.length > 0 && (
        <div className="mb-6 space-y-3">
          {instructions.map((instruction, idx) => (
            <div key={idx} className="flex gap-3">
              <div
                className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center"
                style={{ backgroundColor: THEME.colors.text }}
              >
                <span style={{ color: THEME.colors.secondary, fontSize: '12px', fontWeight: 'bold' }}>
                  {idx + 1}
                </span>
              </div>
              <p style={{ color: THEME.colors.text }} className="text-sm">
                {instruction}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Contact Section */}
      {(contactEmail || contactPhone) && (
        <div
          className="pt-4 border-t space-y-2"
          style={{ borderColor: THEME.colors.text }}
        >
          <p className="text-xs font-semibold" style={{ color: THEME.colors.text }}>
            Need Help?
          </p>
          <div className="space-y-1 text-sm">
            {contactEmail && (
              <p style={{ color: THEME.colors.text }}>
                Email: <span style={{ color: THEME.colors.primary }}>{contactEmail}</span>
              </p>
            )}
            {contactPhone && (
              <p style={{ color: THEME.colors.text }}>
                Phone: <span style={{ color: THEME.colors.primary }}>{contactPhone}</span>
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// QuickContactButton - Fast contact options
// ============================================================================
export const QuickContactButton = ({
  type = 'email', // 'email', 'whatsapp', 'phone'
  label = null,
  value = null,
  isStacked = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const buttonConfig = {
    email: {
      label: label || 'Send Email',
      href: `mailto:${value}`,
      defaultValue: 'support@sumukhvisuals.com',
    },
    whatsapp: {
      label: label || 'WhatsApp',
      href: `https://wa.me/${value?.replace(/\D/g, '')}`,
      defaultValue: '+919876543210',
    },
    phone: {
      label: label || 'Call',
      href: `tel:${value}`,
      defaultValue: '+919876543210',
    },
  };

  const config = buttonConfig[type] || buttonConfig.email;
  const finalValue = value || config.defaultValue;
  const finalHref = config.href.replace(config.defaultValue, finalValue);

  return (
    <a
      href={finalHref}
      target={type === 'whatsapp' ? '_blank' : undefined}
      rel={type === 'whatsapp' ? 'noopener noreferrer' : undefined}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        block px-6 py-3 rounded-lg font-medium transition-all duration-300 text-center
        ${isStacked ? 'w-full' : ''}
      `}
      style={{
        backgroundColor: isHovered ? THEME.colors.text : 'transparent',
        color: isHovered ? THEME.colors.secondary : THEME.colors.text,
        borderWidth: '1px',
        borderColor: THEME.colors.text,
      }}
    >
      {config.label}
    </a>
  );
};

// ============================================================================
// EmptyState - Display when no data is available
// ============================================================================
export const EmptyState = ({
  title = 'No Projects Yet',
  message = 'Projects will appear here once they are created.',
  actionLabel = null,
  onAction = null,
}) => {
  return (
    <div
      className="p-12 rounded-lg border text-center"
      style={{
        backgroundColor: THEME.colors.tertiary,
        borderColor: THEME.colors.text,
        borderWidth: '1px',
      }}
    >
      <h3 className="text-lg font-semibold mb-2" style={{ color: THEME.colors.primary }}>
        {title}
      </h3>
      <p className="text-sm mb-4" style={{ color: THEME.colors.text }}>
        {message}
      </p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-6 py-2 rounded-lg font-medium transition-all duration-300"
          style={{
            backgroundColor: THEME.colors.text,
            color: THEME.colors.secondary,
          }}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

// ============================================================================
// LoadingPlaceholder - Skeleton loader for cards
// ============================================================================
export const LoadingPlaceholder = ({ count = 3 }) => {
  return (
    <div className="space-y-4">
      {Array(count)
        .fill(0)
        .map((_, idx) => (
          <div
            key={idx}
            className="p-6 rounded-lg border animate-pulse"
            style={{
              backgroundColor: THEME.colors.tertiary,
              borderColor: THEME.colors.text,
              borderWidth: '1px',
            }}
          >
            <div
              className="h-4 rounded mb-4 w-1/3"
              style={{ backgroundColor: THEME.colors.text, opacity: 0.3 }}
            />
            <div
              className="h-8 rounded mb-4 w-1/2"
              style={{ backgroundColor: THEME.colors.text, opacity: 0.2 }}
            />
            <div
              className="h-3 rounded"
              style={{ backgroundColor: THEME.colors.text, opacity: 0.2 }}
            />
          </div>
        ))}
    </div>
  );
};

// ============================================================================
// SectionHeader - Consistent section heading
// ============================================================================
export const SectionHeader = ({
  title,
  subtitle = null,
  actionLabel = null,
  onAction = null,
}) => {
  return (
    <div className="mb-6 flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold mb-1" style={{ color: THEME.colors.primary }}>
          {title}
        </h2>
        {subtitle && (
          <p className="text-sm" style={{ color: THEME.colors.text }}>
            {subtitle}
          </p>
        )}
      </div>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300"
          style={{
            color: THEME.colors.text,
          }}
          onMouseEnter={(e) => {
            e.target.style.color = THEME.colors.primary;
          }}
          onMouseLeave={(e) => {
            e.target.style.color = THEME.colors.text;
          }}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

// ============================================================================
// Export theme for use in other components
// ============================================================================
export { THEME };
