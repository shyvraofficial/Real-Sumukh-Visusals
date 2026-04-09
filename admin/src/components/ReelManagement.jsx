import React from 'react';
import { useNavigate } from 'react-router-dom';

// ============================================================================
// THEME
// ============================================================================
const THEME = {
  colors: {
    primary: '#ffffff',
    secondary: '#000000',
    tertiary: '#131313',
    text: '#f3f3f3',
  },
};

// ============================================================================
// Reel Status Badge
// ============================================================================
const ReelStatusBadge = ({ status }) => {
  const statusConfig = {
    'Not Started': { label: 'Not Started', bg: '#505050', text: '#f0f0f0' },
    'Getting Started': { label: 'Getting Started', bg: '#808080', text: '#ffffff' },
    'In Progress': { label: 'In Progress', bg: '#7ba3d0', text: '#ffffff' },
    'Revision Phase': { label: 'Revision Phase', bg: '#f4b860', text: '#000000' },
    'Successfully Delivered': { label: 'Successfully Delivered', bg: '#7fb987', text: '#ffffff' },
    // Legacy statuses for backwards compatibility
    not_started: { label: 'Not Started', bg: '#505050', text: '#f0f0f0' },
    in_progress: { label: 'In Progress', bg: '#7ba3d0', text: '#ffffff' },
    ready_for_review: { label: 'Revision Phase', bg: '#f4b860', text: '#000000' },
    revision: { label: 'Revision Phase', bg: '#f4b860', text: '#000000' },
    delivered: { label: 'Successfully Delivered', bg: '#7fb987', text: '#ffffff' },
  };

  const config = statusConfig[status] || statusConfig['Not Started'];

  return (
    <span
      className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold"
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
// ReelManagement - Simple list of reels that link to detail page
// ============================================================================
export const ReelManagement = ({ project }) => {
  const navigate = useNavigate();

  if (!project || !project.reels || project.reels.length === 0) {
    return (
      <div style={{ color: THEME.colors.text }}>
        No reels found for this project.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold" style={{ color: THEME.colors.text }}>
        Reels ({project.reels.length} total)
      </h3>

      {/* Reels List */}
      <div className="space-y-2">
        {project.reels.map(reel => (
          <button
            key={reel.reelNumber}
            onClick={() => navigate(`/projects/${project._id || project.id}/reel/${reel.reelNumber}`)}
            className="w-full p-4 rounded-lg border text-left transition-all hover:border-white/50"
            style={{
              backgroundColor: THEME.colors.tertiary,
              borderColor: '#404040',
            }}
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1">
                <h4 className="font-semibold" style={{ color: THEME.colors.primary }}>
                  Reel #{reel.reelNumber}
                </h4>
                {reel.name && (
                  <p className="text-sm mt-1" style={{ color: '#a8a8a8' }}>
                    {reel.name}
                  </p>
                )}
                <p className="text-xs mt-2" style={{ color: '#888' }}>
                  Updated: {new Date(reel.updatedAt).toLocaleDateString('en-IN')}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <ReelStatusBadge status={reel.status} />
                <span style={{ color: '#888' }}>→</span>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Summary */}
      <div
        className="p-4 rounded-lg border mt-6"
        style={{ backgroundColor: THEME.colors.secondary, borderColor: THEME.colors.text }}
      >
        <div className="grid grid-cols-5 gap-2 text-center text-sm">
          {(() => {
            const counts = {
              'Not Started': project.reels.filter(r => r.status === 'Not Started').length,
              'Getting Started': project.reels.filter(r => r.status === 'Getting Started').length,
              'In Progress': project.reels.filter(r => r.status === 'In Progress').length,
              'Revision Phase': project.reels.filter(r => r.status === 'Revision Phase').length,
              'Successfully Delivered': project.reels.filter(r => r.status === 'Successfully Delivered').length,
            };
            return Object.entries(counts).map(([status, count]) => (
              <div key={status}>
                <div style={{ color: THEME.colors.text }} className="text-xs">
                  {status.replace(/_/g, ' ')}
                </div>
                <div style={{ color: THEME.colors.primary }} className="font-bold text-lg">
                  {count}
                </div>
              </div>
            ));
          })()}
        </div>
      </div>
    </div>
  );
};

export default ReelManagement;
