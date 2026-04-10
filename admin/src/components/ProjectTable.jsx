import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge } from './UIComponents';
import { 
  calculateProjectMetrics, 
  getProjectStatusSummary, 
  hasReelsStructure 
} from '../utils/projectMetrics';

export default function ProjectTable({ projects, onEdit, onDelete }) {
  const navigate = useNavigate();

  // Status color mapping
  const statusColors = {
    'Not Started': { bg: '#505050', text: 'text-gray-300', light: '#505050' },
    'Getting Started': { bg: '#808080', text: 'text-gray-300', light: '#808080' },
    'In Progress': { bg: '#7ba3d0', text: 'text-white', light: '#7ba3d0' },
    'Revision Phase': { bg: '#f4b860', text: 'text-gray-900', light: '#f4b860' },
    'Successfully Delivered': { bg: '#7fb987', text: 'text-white', light: '#7fb987' },
    // Legacy statuses
    'Delivered': { bg: '#7fb987', text: 'text-white', light: '#7fb987' },
    'active': { bg: '#7ba3d0', text: 'text-white', light: '#7ba3d0' },
    'Active': { bg: '#7ba3d0', text: 'text-white', light: '#7ba3d0' }
  };

  if (projects.length === 0) {
    return (
      <div className="rounded-xl p-8 text-center border border-white/10 bg-gradient-to-br from-gray-900/50 to-black/50">
        <p className="text-gray-400" style={{ fontFamily: 'Outfit' }}>No projects found</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {projects.map((project) => {
        const projectId = project._id || project.id;
        const hasReels = hasReelsStructure(project);
        const metrics = hasReels ? calculateProjectMetrics(project) : null;
        const showReelMetrics = hasReels && metrics;
        const deliveredReels = showReelMetrics ? metrics.deliveredReels : (project.completedReels || 0);
        const totalReels = project.totalReels || 0;
        const paymentStatus = project.totalAmount ? `₹${(project.paidAmount || 0).toLocaleString('en-IN')}` : '—';
        const colors = statusColors[project.status] || statusColors['Not Started'];
        const progressPercent = totalReels > 0 ? (deliveredReels / totalReels) * 100 : 0;

        return (
          <div
            key={projectId}
            className="group relative w-full text-left p-3 sm:p-4 rounded-lg border border-white/10 bg-gray-900/30 hover:border-white/20 hover:bg-gray-900/50 transition-all cursor-pointer"
            onClick={() => navigate(`/projects/${projectId}`)}
          >
            {/* Mobile Layout */}
            <div className="md:hidden space-y-3">
              {/* Top Row: Project Name + Status */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <h3 className="text-sm font-semibold truncate" style={{ fontFamily: 'Plus Jakarta Sans' }}>
                    {project.projectName}
                  </h3>
                  <p className="text-gray-400 text-xs mt-1" style={{ fontFamily: 'Outfit' }}>
                    {project.clientName}
                  </p>
                </div>
                <span 
                  className="inline-block text-xs font-bold px-2 py-1 rounded whitespace-nowrap flex-shrink-0"
                  style={{
                    backgroundColor: colors.bg,
                    color: colors.text === 'text-white' ? 'white' : '#1f1f1f',
                    fontFamily: 'Outfit'
                  }}
                >
                  {project.status || 'Pending'}
                </span>
              </div>

              {/* Reels Progress */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-300 font-medium whitespace-nowrap">{deliveredReels}/{totalReels}</span>
                <div className="flex-1 h-1 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full transition-all rounded-full"
                    style={{ 
                      width: `${progressPercent}%`,
                      backgroundColor: progressPercent === 100 ? '#7fb987' : '#7ba3d0'
                    }}
                  />
                </div>
              </div>

              {/* Bottom Row: Deadline + Payment */}
              <div className="flex items-center justify-between text-xs text-gray-300">
                <p style={{ fontFamily: 'Outfit' }}>
                  {project.deadline 
                    ? new Date(project.deadline).toLocaleDateString('en-IN', { 
                        month: 'short', 
                        day: 'numeric'
                      })
                    : 'N/A'
                  }
                </p>
                <p className="font-medium" style={{ fontFamily: 'Outfit' }}>
                  {paymentStatus}
                </p>
              </div>

              {/* Delete Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (window.confirm(`Delete "${project.projectName}"?`)) {
                    onDelete(projectId);
                  }
                }}
                className="w-full px-3 py-1.5 rounded-lg text-xs font-medium text-red-400 border border-red-400/30 hover:bg-red-400/10 transition-colors"
              >
                Delete Project
              </button>
            </div>

            {/* Desktop Layout */}
            <div className="hidden md:grid grid-cols-12 gap-4 items-center">
              {/* Project Name & Client */}
              <div className="col-span-3">
                <h3 className="text-white font-semibold truncate" style={{ fontFamily: 'Plus Jakarta Sans' }}>
                  {project.projectName}
                </h3>
                <p className="text-gray-400 text-xs mt-1" style={{ fontFamily: 'Outfit' }}>
                  {project.clientName}
                </p>
                <p className="text-gray-500 text-xs mt-0.5 truncate" style={{ fontFamily: 'Outfit' }}>
                  {project.clientEmail}
                </p>
              </div>

              {/* Project Type */}
              <div className="col-span-1">
                <p className="text-gray-400 text-xs" style={{ fontFamily: 'Outfit' }}>
                  {project.projectType || 'Project'}
                </p>
              </div>

              {/* Reels Progress */}
              <div className="col-span-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-300 font-medium">{deliveredReels}/{totalReels}</span>
                  <div className="w-12 h-1 bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full transition-all rounded-full"
                      style={{ 
                        width: `${progressPercent}%`,
                        backgroundColor: progressPercent === 100 ? '#7fb987' : '#7ba3d0'
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Status Badge */}
              <div className="col-span-1">
                <span 
                  className="inline-block text-xs font-bold px-2 py-1 rounded"
                  style={{
                    backgroundColor: colors.bg,
                    color: colors.text === 'text-white' ? 'white' : '#1f1f1f',
                    fontFamily: 'Outfit'
                  }}
                >
                  {project.status || 'Pending'}
                </span>
              </div>

              {/* Deadline */}
              <div className="col-span-1">
                <p className="text-sm text-gray-300" style={{ fontFamily: 'Outfit' }}>
                  {project.deadline 
                    ? new Date(project.deadline).toLocaleDateString('en-IN', { 
                        month: 'short', 
                        day: 'numeric'
                      })
                    : 'N/A'
                  }
                </p>
              </div>

              {/* Payment */}
              <div className="col-span-1">
                <p className="text-sm text-gray-300 font-medium" style={{ fontFamily: 'Outfit' }}>
                  {paymentStatus}
                </p>
              </div>

              {/* Arrow Indicator + Delete */}
              <div className="col-span-1 text-right flex items-center justify-end gap-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (window.confirm(`Delete "${project.projectName}"?`)) {
                      onDelete(projectId);
                    }
                  }}
                  className="p-1 rounded transition-colors hover:bg-red-900/30 text-red-400 hover:text-red-300"
                  title="Delete project"
                >
                  🗑
                </button>
                <span className="text-gray-500 text-lg">→</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
