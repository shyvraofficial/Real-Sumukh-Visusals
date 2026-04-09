import React, { useState } from 'react';

// ============================================================================
// AdminOverviewCard - Versatile overview/stat card for dashboards
// ============================================================================
export const AdminOverviewCard = ({
  icon: Icon,
  label,
  value,
  subtitle,
  trend,
  onClick,
  className = '',
}) => {
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer transition-all duration-300 hover:scale-105 ${className}`}
      style={{ backgroundColor: '#131313' }}
    >
      <div className="p-6 rounded-lg border border-gray-700 hover:border-gray-600">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-gray-400 text-sm font-medium mb-2">{label}</p>
            <p className="text-white text-3xl font-semibold mb-1">{value}</p>
            {subtitle && <p className="text-gray-500 text-xs">{subtitle}</p>}
            {trend && (
              <p className={`text-xs mt-2 ${trend.positive ? 'text-green-400' : 'text-red-400'}`}>
                {trend.positive ? '↑' : '↓'} {trend.text}
              </p>
            )}
          </div>
          {Icon && (
            <div className="ml-4 p-3 rounded-lg" style={{ backgroundColor: '#0a0a0a' }}>
              <Icon className="w-6 h-6 text-gray-400" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// ProjectStatusSelect - Specialized dropdown for project status
// ============================================================================
export const ProjectStatusSelect = ({
  value,
  onChange,
  label = 'Project Status',
  error,
  required = false,
  ...props
}) => {
  const statuses = [
    { value: 'Not Started', label: 'Not Started', color: 'bg-gray-500' },
    { value: 'Getting Started', label: 'Getting Started', color: 'bg-gray-600' },
    { value: 'In Progress', label: 'In Progress', color: 'bg-blue-600' },
    { value: 'Revision Phase', label: 'Revision Phase', color: 'bg-yellow-600' },
    { value: 'Successfully Delivered', label: 'Successfully Delivered', color: 'bg-green-600' },
  ];

  return (
    <div>
      {label && (
        <label className="block text-gray-300 text-sm font-medium mb-2">
          {label}
          {required && <span className="text-gray-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        <select
          value={value}
          onChange={onChange}
          required={required}
          className="w-full border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-gray-600 focus:ring-1 focus:ring-gray-600 transition-colors appearance-none"
          style={{
            backgroundColor: '#131313',
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%238b8b8b' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
            backgroundPosition: 'right 0.5rem center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '1.5em 1.5em',
            paddingRight: '2.5rem',
          }}
          {...props}
        >
          <option value="">Select status...</option>
          {statuses.map((status) => (
            <option key={status.value} value={status.value}>
              {status.label}
            </option>
          ))}
        </select>
      </div>
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  );
};

// ============================================================================
// BillingProgressFields - Form fields for billing and payment tracking
// ============================================================================
export const BillingProgressFields = ({
  totalAmount,
  onTotalChange,
  paidAmount,
  onPaidChange,
  packageType,
  onPackageChange,
  errors = {},
}) => {
  const remainingAmount = totalAmount ? totalAmount - (paidAmount || 0) : 0;
  const progressPercentage = totalAmount ? (paidAmount / totalAmount) * 100 : 0;

  const packageTypes = [
    { value: 'Basic', label: 'Basic Package' },
    { value: 'Standard', label: 'Standard Package' },
    { value: 'Advance', label: 'Advance Package' },
    { value: 'Premium', label: 'Premium Package' },
  ];

  return (
    <div
      className="p-6 rounded-lg border border-gray-700"
      style={{ backgroundColor: '#131313' }}
    >
      <h3 className="text-white text-lg font-semibold mb-6">Billing & Payment</h3>

      {/* Package Type */}
      <div className="mb-6">
        <label className="block text-gray-300 text-sm font-medium mb-2">Package Type</label>
        <div className="relative">
          <select
            value={packageType}
            onChange={(e) => onPackageChange(e.target.value)}
            className="w-full border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-gray-600 focus:ring-1 focus:ring-gray-600 transition-colors appearance-none"
            style={{
              backgroundColor: '#131313',
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%238b8b8b' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
              backgroundPosition: 'right 0.5rem center',
              backgroundRepeat: 'no-repeat',
              backgroundSize: '1.5em 1.5em',
              paddingRight: '2.5rem',
            }}
          >
            <option value="">Select package...</option>
            {packageTypes.map((pkg) => (
              <option key={pkg.value} value={pkg.value}>
                {pkg.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Total Amount */}
      <div className="mb-6">
        <label className="block text-gray-300 text-sm font-medium mb-2">Total Amount (₹)</label>
        <input
          type="number"
          value={totalAmount}
          onChange={(e) => onTotalChange(Number(e.target.value))}
          placeholder="Enter total project amount"
          className="w-full border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-gray-600 focus:ring-1 focus:ring-gray-600 transition-colors"
          style={{ backgroundColor: '#131313' }}
        />
        {errors.totalAmount && <p className="text-red-400 text-xs mt-1">{errors.totalAmount}</p>}
      </div>

      {/* Paid Amount */}
      <div className="mb-6">
        <label className="block text-gray-300 text-sm font-medium mb-2">Paid Amount (₹)</label>
        <input
          type="number"
          value={paidAmount}
          onChange={(e) => onPaidChange(Number(e.target.value))}
          placeholder="Enter amount paid"
          className="w-full border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-gray-600 focus:ring-1 focus:ring-gray-600 transition-colors"
          style={{ backgroundColor: '#131313' }}
        />
        {errors.paidAmount && <p className="text-red-400 text-xs mt-1">{errors.paidAmount}</p>}
      </div>

      {/* Payment Progress Bar */}
      {totalAmount > 0 && (
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <p className="text-gray-400 text-sm">Payment Progress</p>
            <p className="text-gray-300 text-sm font-semibold">
              ₹{paidAmount.toLocaleString()} / ₹{totalAmount.toLocaleString()}
            </p>
          </div>
          <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gray-500 transition-all duration-300"
              style={{ width: `${Math.min(progressPercentage, 100)}%` }}
            />
          </div>
          <p className="text-gray-500 text-xs mt-2">
            {Math.round(progressPercentage)}% Complete • ₹{remainingAmount.toLocaleString()} Remaining
          </p>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// PendingActionInput - Input field for tracking pending actions
// ============================================================================
export const PendingActionInput = ({
  value,
  onChange,
  label = 'Pending Action',
  placeholder = 'e.g., Client review, Final approval, Upload files...',
  error,
  required = false,
}) => {
  const suggestions = [
    'Client review',
    'Final approval',
    'Upload files',
    'Awaiting payment',
    'Revision needed',
    'Asset collection',
    'Deadline reminder',
  ];

  const [showSuggestions, setShowSuggestions] = useState(false);

  return (
    <div>
      {label && (
        <label className="block text-gray-300 text-sm font-medium mb-2">
          {label}
          {required && <span className="text-gray-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={onChange}
          onFocus={() => !value && setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          placeholder={placeholder}
          required={required}
          className="w-full border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-gray-600 focus:ring-1 focus:ring-gray-600 transition-colors"
          style={{ backgroundColor: '#131313' }}
        />
        {showSuggestions && !value && (
          <div
            className="absolute top-full left-0 right-0 mt-1 border border-gray-700 rounded-lg shadow-lg z-10"
            style={{ backgroundColor: '#131313' }}
          >
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => {
                  onChange({ target: { value: suggestion } });
                  setShowSuggestions(false);
                }}
                className="w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors text-sm border-b border-gray-700 last:border-b-0"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  );
};

// ============================================================================
// InstructionsTextarea - Rich textarea for client instructions
// ============================================================================
export const InstructionsTextarea = ({
  value,
  onChange,
  label = 'Client Instructions',
  placeholder = 'Enter any special instructions, preferences, or notes...',
  error,
  maxLength = 500,
  required = false,
}) => {
  const charCount = value ? value.length : 0;
  const percentUsed = (charCount / maxLength) * 100;

  return (
    <div>
      {label && (
        <label className="block text-gray-300 text-sm font-medium mb-2">
          {label}
          {required && <span className="text-gray-500 ml-1">*</span>}
        </label>
      )}
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        maxLength={maxLength}
        required={required}
        rows="5"
        className="w-full border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-gray-600 focus:ring-1 focus:ring-gray-600 transition-colors resize-none"
        style={{ backgroundColor: '#131313' }}
      />
      <div className="mt-2 flex items-center justify-between">
        <div className="flex-1">
          <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gray-500 transition-all duration-300"
              style={{ width: `${percentUsed}%` }}
            />
          </div>
        </div>
        <p className="text-gray-500 text-xs ml-3">
          {charCount}/{maxLength}
        </p>
      </div>
      {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
    </div>
  );
};

// ============================================================================
// ProjectManagementList - Advanced table/list for project management
// ============================================================================
export const ProjectManagementList = ({
  projects = [],
  columns = [],
  onEdit,
  onDelete,
  onStatusChange,
  isLoading = false,
  emptyMessage = 'No projects found',
}) => {
  const [sortBy, setSortBy] = useState('deadline');
  const [filterStatus, setFilterStatus] = useState('all');

  // Filter projects
  const filteredProjects =
    filterStatus === 'all'
      ? projects
      : projects.filter((p) => p.status === filterStatus);

  // Get unique statuses
  const uniqueStatuses = ['all', ...new Set(projects.map((p) => p.status))];

  if (isLoading) {
    return (
      <div
        className="p-8 rounded-lg border border-gray-700 text-center"
        style={{ backgroundColor: '#131313' }}
      >
        <p className="text-gray-400">Loading projects...</p>
      </div>
    );
  }

  if (filteredProjects.length === 0) {
    return (
      <div
        className="p-8 rounded-lg border border-gray-700 text-center"
        style={{ backgroundColor: '#131313' }}
      >
        <p className="text-gray-400">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filter Bar */}
      <div className="flex items-center gap-4 pb-4 border-b border-gray-700">
        <span className="text-gray-400 text-sm">Filter by Status:</span>
        <div className="flex gap-2 flex-wrap">
          {uniqueStatuses.map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                filterStatus === status
                  ? 'bg-gray-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {status === 'all' ? 'All' : status}
            </button>
          ))}
        </div>
      </div>

      {/* Projects List */}
      <div className="space-y-3">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            className="p-4 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors"
            style={{ backgroundColor: '#131313' }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              {/* Project Name */}
              <div>
                <p className="text-gray-400 text-xs mb-1">Project</p>
                <p className="text-white font-semibold">{project.projectName}</p>
              </div>

              {/* Client Name */}
              <div>
                <p className="text-gray-400 text-xs mb-1">Client</p>
                <p className="text-white">{project.clientName}</p>
              </div>

              {/* Status Badge */}
              <div>
                <p className="text-gray-400 text-xs mb-1">Status</p>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-500 rounded-full" />
                  <span className="text-gray-300 text-sm">{project.status}</span>
                </div>
              </div>

              {/* Deadline */}
              <div>
                <p className="text-gray-400 text-xs mb-1">Deadline</p>
                <p className="text-white text-sm">
                  {new Date(project.deadline).toLocaleDateString('en-IN', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            {project.completedReels && project.totalReels && (
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-gray-400 text-xs">Progress</p>
                  <p className="text-gray-300 text-xs">
                    {project.completedReels}/{project.totalReels} reels
                  </p>
                </div>
                <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gray-500 transition-all duration-300"
                    style={{
                      width: `${(project.completedReels / project.totalReels) * 100}%`,
                    }}
                  />
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-2 justify-end pt-2 border-t border-gray-700">
              {onStatusChange && (
                <select
                  value={project.status}
                  onChange={(e) => onStatusChange(project.id, e.target.value)}
                  className="px-2 py-1 text-xs bg-gray-800 border border-gray-700 rounded text-gray-300 focus:outline-none focus:border-gray-600"
                  style={{ backgroundColor: '#131313' }}
                >
                  <option value="Planning">Planning</option>
                  <option value="In Progress">In Progress</option>
                  <option value="First Draft Ready">First Draft Ready</option>
                  <option value="In Revision">In Revision</option>
                  <option value="Completed">Completed</option>
                  <option value="On Hold">On Hold</option>
                </select>
              )}
              {onEdit && (
                <button
                  onClick={() => onEdit(project.id)}
                  className="px-3 py-1.5 text-xs bg-gray-800 text-gray-300 rounded hover:bg-gray-700 transition-colors"
                >
                  Edit
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => {
                    if (confirm('Delete this project?')) {
                      onDelete(project.id);
                    }
                  }}
                  className="px-3 py-1.5 text-xs bg-gray-900 text-gray-400 rounded hover:bg-red-900 hover:text-red-300 transition-colors"
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================================================
// Billing Status Badge - Shows payment/billing status
// ============================================================================
export const BillingStatusBadge = ({ paidAmount, totalAmount, variant = 'default' }) => {
  const percentage = totalAmount ? (paidAmount / totalAmount) * 100 : 0;

  let statusText = 'Not Started';
  let statusColor = 'bg-gray-800 text-gray-300';

  if (percentage === 0) {
    statusText = 'Pending';
    statusColor = 'bg-gray-800 text-gray-300';
  } else if (percentage === 100) {
    statusText = 'Paid';
    statusColor = 'bg-gray-700 text-gray-200';
  } else if (percentage >= 75) {
    statusText = 'Almost Complete';
    statusColor = 'bg-gray-700 text-gray-200';
  } else if (percentage >= 50) {
    statusText = 'Partial';
    statusColor = 'bg-gray-800 text-gray-400';
  }

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor}`}>
      {statusText} ({Math.round(percentage)}%)
    </span>
  );
};

// ============================================================================
// Progress Indicator - Visual progress indicator for projects
// ============================================================================
export const ProgressIndicator = ({
  current,
  total,
  label = 'Progress',
  showPercentage = true,
  size = 'md',
}) => {
  const percentage = total ? (current / total) * 100 : 0;

  const sizeClasses = {
    sm: 'h-1 text-xs',
    md: 'h-2 text-sm',
    lg: 'h-3 text-base',
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <p className="text-gray-300 text-sm font-medium">{label}</p>
        {showPercentage && <p className="text-gray-400 text-xs">{Math.round(percentage)}%</p>}
      </div>
      <div className={`w-full bg-gray-800 rounded-full overflow-hidden ${sizeClasses[size]}`}>
        <div
          className="h-full bg-gray-500 transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p className="text-gray-500 text-xs mt-1">
        {current} of {total} items
      </p>
    </div>
  );
};
