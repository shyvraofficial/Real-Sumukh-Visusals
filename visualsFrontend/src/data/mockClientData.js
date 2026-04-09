/**
 * Mock Data for Client Dashboard
 * New reel-based architecture: Projects contain multiple reels
 */

export const mockClientData = {
  name: 'Alex Studios',
  email: 'contact@alexstudios.com',
  avatar: 'https://via.placeholder.com/40/131313/f5f5f5?text=AS',
  phone: '+91 9876543210',
};

// Helper function to generate reels for a project
const generateReels = (totalReels) => {
  return Array.from({ length: totalReels }, (_, i) => {
    const reelNumber = i + 1;
    const statuses = ['not_started', 'in_progress', 'ready_for_review', 'revision', 'delivered'];
    
    // Distribute statuses realistically
    let status;
    if (reelNumber <= Math.floor(totalReels * 0.3)) {
      status = 'delivered';
    } else if (reelNumber <= Math.floor(totalReels * 0.5)) {
      status = 'ready_for_review';
    } else if (reelNumber <= Math.floor(totalReels * 0.7)) {
      status = 'in_progress';
    } else {
      status = 'not_started';
    }

    const hasLink = status === 'delivered' || status === 'ready_for_review';

    return {
      reelNumber,
      status,
      note: status === 'in_progress' ? 'Currently editing - color correction in progress' : 
            status === 'ready_for_review' ? 'First draft complete - awaiting feedback' :
            status === 'revision' ? 'Under revision based on client feedback' :
            status === 'delivered' ? 'Approved and downloaded by client' : null,
      link: hasLink ? `https://drive.google.com/file/d/${reelNumber}example` : null,
      createdAt: new Date(new Date().getTime() - (totalReels - i) * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
    };
  });
};

export const mockProjects = [
  {
    id: '1',
    clientId: 'client_alex',
    clientName: 'Alex Studios',
    projectName: 'Summer Campaign Reel',
    
    // Project metadata
    totalReels: 5,
    deliveryTime: '3-5 business days per reel',
    notes: 'Client prefers vibrant visuals and upbeat pacing. Use trending music.',
    
    // Billing
    totalAmount: 50000,
    paidAmount: 25000,
    remainingAmount: 25000,
    
    // Reels array
    reels: [
      { reelNumber: 1, status: 'Successfully Delivered', note: 'Approved and downloaded', link: 'https://drive.google.com/file/d/1example', createdAt: '2026-04-01T10:00:00Z', updatedAt: '2026-04-05T14:30:00Z' },
      { reelNumber: 2, status: 'Successfully Delivered', note: 'Approved and downloaded', link: 'https://drive.google.com/file/d/2example', createdAt: '2026-04-02T10:00:00Z', updatedAt: '2026-04-05T15:00:00Z' },
      { reelNumber: 3, status: 'Revision Phase', note: 'First draft complete - awaiting client feedback', link: 'https://drive.google.com/file/d/3example', createdAt: '2026-04-03T10:00:00Z', updatedAt: '2026-04-07T16:20:00Z' },
      { reelNumber: 4, status: 'In Progress', note: 'Currently editing - color correction in progress', link: null, createdAt: '2026-04-04T10:00:00Z', updatedAt: '2026-04-08T09:45:00Z' },
      { reelNumber: 5, status: 'Getting Started', note: null, link: null, createdAt: '2026-04-04T11:00:00Z', updatedAt: '2026-04-04T11:00:00Z' },
    ],
    
    createdAt: '2026-04-01T00:00:00Z',
    updatedAt: '2026-04-08T10:00:00Z',
  },
  
  {
    id: '2',
    clientId: 'client_luna',
    clientName: 'Luna Creative',
    projectName: 'YouTube Series Intro',
    
    totalReels: 1,
    deliveryTime: '2 business days',
    notes: 'Keep intro under 10 seconds. Include company logo and brand colors.',
    
    totalAmount: 15000,
    paidAmount: 15000,
    remainingAmount: 0,
    
    reels: [
      { reelNumber: 1, status: 'delivered', note: 'Final version approved and downloaded', link: 'https://drive.google.com/file/d/ytintro', createdAt: '2026-04-02T10:00:00Z', updatedAt: '2026-04-06T11:30:00Z' },
    ],
    
    createdAt: '2026-04-02T00:00:00Z',
    updatedAt: '2026-04-06T11:30:00Z',
  },
  
  {
    id: '3',
    clientId: 'client_tech',
    clientName: 'Tech Startup',
    projectName: 'Product Launch Campaign',
    
    totalReels: 10,
    deliveryTime: '5-7 business days per reel',
    notes: 'Detail-oriented. Multiple rounds of revisions expected. Premium color grading required.',
    
    totalAmount: 100000,
    paidAmount: 0,
    remainingAmount: 100000,
    
    reels: Array.from({ length: 10 }, (_, i) => ({
      reelNumber: i + 1,
      status: i === 0 ? 'not_started' : 'not_started',
      note: null,
      link: null,
      createdAt: '2026-04-05T00:00:00Z',
      updatedAt: '2026-04-05T00:00:00Z',
    })),
    
    createdAt: '2026-04-05T00:00:00Z',
    updatedAt: '2026-04-05T00:00:00Z',
  },
];

export const mockBillingData = [
  {
    id: '1',
    projectId: '1',
    projectName: 'Summer Campaign Reel',
    clientName: 'Alex Studios',
    packageName: 'Summer Campaign - Advance Package',
    totalAmount: 50000,
    paidAmount: 25000,
    remainingAmount: 25000,
    totalReels: 5,
    deliveredReels: 2,
    nextPaymentDue: '2026-04-15',
    paymentStatus: 'partial',
  },
  {
    id: '2',
    projectId: '2',
    projectName: 'YouTube Series Intro',
    clientName: 'Luna Creative',
    packageName: 'YouTube Intro - Standard Package',
    totalAmount: 15000,
    paidAmount: 15000,
    remainingAmount: 0,
    totalReels: 1,
    deliveredReels: 1,
    nextPaymentDue: null,
    paymentStatus: 'completed',
  },
  {
    id: '3',
    projectId: '3',
    projectName: 'Product Launch Campaign',
    clientName: 'Tech Startup',
    packageName: 'Product Launch - Premium Package',
    totalAmount: 100000,
    paidAmount: 0,
    remainingAmount: 100000,
    totalReels: 10,
    deliveredReels: 0,
    nextPaymentDue: '2026-05-05',
    paymentStatus: 'pending',
  },
  {
    id: '3',
    projectId: '3',
    packageName: 'Product Launch - Premium',
    totalAmount: 15000,
    paidAmount: 0,
    remainingAmount: 15000,
    completedReels: 0,
    totalReels: 3,
    nextPaymentDue: '2026-04-15',
    paymentStatus: 'pending',
  },
];

// ============================================================================
// Helper Functions - Derive data from reel-based structure
// ============================================================================

/**
 * Calculate project metrics from reels array
 */
export const calculateProjectMetrics = (project) => {
  if (!project.reels || project.reels.length === 0) {
    return {
      deliveredReels: 0,
      inProgressReels: 0,
      readyForReviewReels: 0,
      revisionReels: 0,
      notStartedReels: 0,
      progress: 0,
      pendingActions: [],
    };
  }

  const reels = project.reels;
  
  const delivered = reels.filter(r => r.status === 'delivered').length;
  const inProgress = reels.filter(r => r.status === 'in_progress').length;
  const readyForReview = reels.filter(r => r.status === 'ready_for_review').length;
  const revision = reels.filter(r => r.status === 'revision').length;
  const notStarted = reels.filter(r => r.status === 'not_started').length;
  
  const progress = (delivered / project.totalReels) * 100;
  
  // Derive pending actions from reel statuses
  const pendingActions = [];
  if (readyForReview > 0) {
    const reelNums = reels.filter(r => r.status === 'ready_for_review').map(r => `#${r.reelNumber}`);
    pendingActions.push({
      type: 'ready_for_review',
      message: `Reel${reelNums.length > 1 ? 's' : ''} ${reelNums.join(', ')} ready for review`,
      reels: reelNums,
    });
  }
  if (revision > 0) {
    const reelNums = reels.filter(r => r.status === 'revision').map(r => `#${r.reelNumber}`);
    pendingActions.push({
      type: 'revision',
      message: `Reel${reelNums.length > 1 ? 's' : ''} ${reelNums.join(', ')} awaiting revision approval`,
      reels: reelNums,
    });
  }

  return {
    deliveredReels: delivered,
    inProgressReels: inProgress,
    readyForReviewReels: readyForReview,
    revisionReels: revision,
    notStartedReels: notStarted,
    progress,
    pendingActions,
  };
};

/**
 * Get reels needing attention
 */
export const getReelsNeedingAttention = (project) => {
  if (!project.reels) return [];
  
  return project.reels.filter(reel => 
    ['ready_for_review', 'revision'].includes(reel.status)
  );
};

/**
 * Get next reel to work on
 */
export const getNextReelToStart = (project) => {
  if (!project.reels) return null;
  
  return project.reels.find(reel => reel.status === 'not_started');
};

/**
 * Get dashboard metrics from projects
 */
export const getDashboardMetrics = (projects, billingData) => {
  const activeProjects = projects.filter(p => {
    const metrics = calculateProjectMetrics(p);
    return metrics.deliveredReels < p.totalReels;
  }).length;

  // Find reels needing action across all projects
  const reelsNeedingAction = projects.flatMap(p => {
    const actionReels = getReelsNeedingAttention(p);
    return actionReels.map(reel => ({
      projectId: p.id,
      projectName: p.projectName,
      reelNumber: reel.reelNumber,
      status: reel.status,
    }));
  });

  const upcomingProject = projects.length > 0
    ? projects.find(p => calculateProjectMetrics(p).progress < 100)
    : null;

  const totalPaymentRemaining = billingData.reduce(
    (sum, billing) => sum + (billing.remainingAmount || 0),
    0
  );

  return {
    activeProjects,
    reelsNeedingAction,
    upcomingProject,
    totalPaymentRemaining,
  };
};

/**
 * Calculate project progress percentage
 */
export const calculateProjectProgress = (completed, total) => {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
};

/**
 * Get days remaining until deadline
 */
export const getDaysRemaining = (deadline) => {
  const deadlineDate = new Date(deadline);
  const today = new Date();
  return Math.ceil((deadlineDate - today) / (1000 * 60 * 60 * 24));
};

/**
 * Check if deadline is urgent (3 days or less)
 */
export const isDeadlineUrgent = (deadline) => {
  return getDaysRemaining(deadline) <= 3;
};

/**
 * Check if project uses new reel-based structure
 */
export const hasReelsStructure = (project) => {
  return project && Array.isArray(project.reels) && project.reels.length > 0;
};
