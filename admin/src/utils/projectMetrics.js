/**
 * Project Metrics Utility Functions
 * Calculates metrics from reel-based project structure
 */

/**
 * Calculate all metrics for a project based on its reels
 * @param {Object} project - Project object with reels array
 * @returns {Object} - Metrics object with counts and derived data
 */
export const calculateProjectMetrics = (project) => {
  if (!project || !project.reels || !Array.isArray(project.reels)) {
    return {
      notStartedReels: 0,
      gettingStartedReels: 0,
      inProgressReels: 0,
      revisionPhaseReels: 0,
      deliveredReels: 0,
      progress: 0,
      pendingActions: [],
    };
  }

  const reels = project.reels;
  const metrics = {
    notStartedReels: 0,
    gettingStartedReels: 0,
    inProgressReels: 0,
    revisionPhaseReels: 0,
    deliveredReels: 0,
    pendingActions: [],
  };

  reels.forEach(reel => {
    const status = reel.status || '';
    
    // Handle new 5-status system
    if (status === 'Not Started' || status === 'not_started') {
      metrics.notStartedReels += 1;
    } else if (status === 'Getting Started' || status === 'getting_started') {
      metrics.gettingStartedReels += 1;
    } else if (status === 'In Progress' || status === 'in_progress') {
      metrics.inProgressReels += 1;
    } else if (status === 'Revision Phase' || status === 'revision' || status === 'revision_phase') {
      metrics.revisionPhaseReels += 1;
      metrics.pendingActions.push(`Reel #${reel.reelNumber}: Revision Needed`);
    } else if (status === 'Successfully Delivered' || status === 'Delivered' || status === 'delivered') {
      metrics.deliveredReels += 1;
    } else {
      // Default to not started for unknown statuses
      metrics.notStartedReels += 1;
    }
  });

  // Calculate progress percentage (completed / total)
  metrics.progress = project.totalReels > 0 
    ? Math.round((metrics.deliveredReels / project.totalReels) * 100)
    : 0;

  return metrics;
};

/**
 * Get summary text for project status
 * @param {Object} metrics - Metrics object from calculateProjectMetrics
 * @param {number} totalReels - Total reels in project
 * @returns {string} - Human-readable summary
 */
export const getProjectStatusSummary = (metrics, totalReels) => {
  if (metrics.pendingActions.length > 0) {
    return `${metrics.pendingActions.length} reel${metrics.pendingActions.length !== 1 ? 's' : ''} awaiting action`;
  }
  if (metrics.inProgressReels > 0) {
    return `${metrics.inProgressReels} reel${metrics.inProgressReels !== 1 ? 's' : ''} in progress`;
  }
  if (metrics.deliveredReels === totalReels) {
    return 'Completed';
  }
  return 'Not started';
};

/**
 * Get reel status badge color
 * @param {string} status - Reel status
 * @returns {string} - Color class for styling
 */
export const getReelStatusColor = (status) => {
  // Handle new status formats (title case with spaces)
  if (status === 'Successfully Delivered' || status === 'Delivered' || status === 'delivered') {
    return 'bg-green-600 text-white';
  } else if (status === 'In Progress' || status === 'in_progress') {
    return 'bg-blue-600 text-white';
  } else if (status === 'Ready for Review' || status === 'ready_for_review') {
    return 'bg-yellow-600 text-white';
  } else if (status === 'Revision Phase' || status === 'revision' || status === 'Revision') {
    return 'bg-orange-600 text-white';
  } else if (status === 'Getting Started' || status === 'Not Started' || status === 'not_started') {
    return 'bg-gray-600 text-white';
  }
  return 'bg-gray-600 text-white';
};

/**
 * Normalize reel status from various formats
 * @param {string} status - Status in any format
 * @returns {string} - Normalized status with underscores
 */
export const normalizeReelStatus = (status) => {
  if (!status) return 'not_started';
  return status.toLowerCase().replace(/\s+/g, '_');
};

/**
 * Get reels that need attention
 * @param {Object} project - Project object
 * @returns {Array} - Array of reels with status ready_for_review or revision
 */
export const getReelsNeedingAttention = (project) => {
  if (!project || !project.reels) return [];
  return project.reels.filter(reel => {
    const status = reel.status || '';
    return status === 'Ready for Review' || status === 'ready_for_review' ||
           status === 'Revision Phase' || status === 'revision' || status === 'Revision';
  });
};

/**
 * Check if a project has any reels
 * @param {Object} project - Project object
 * @returns {boolean} - True if project has reels array
 */
export const hasReelsStructure = (project) => {
  return project && Array.isArray(project.reels) && project.reels.length > 0;
};

/**
 * Get project progress percentage
 * @param {Object} project - Project object
 * @returns {number} - Progress percentage (0-100)
 */
export const getProjectProgress = (project) => {
  const metrics = calculateProjectMetrics(project);
  return metrics.progress;
};
