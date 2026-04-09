import React, { useMemo, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { projectAPI } from '../services/projectAPI';

const STATUS_LABELS = {
  'Getting Started': 'Getting Started',
  'In Progress': 'In Progress',
  'Revision Phase': 'Revision Phase',
  'Successfully Delivered': 'Successfully Delivered',
};

const ClientDashboard = ({
  clientData: propClientData = {
    name: 'Client Name',
    avatar: 'https://via.placeholder.com/40',
  },
  projects: initialProjects = [],
  isLoading: initialIsLoading = false,
}) => {
  const navigate = useNavigate();
  const [clientData, setClientData] = useState(propClientData);
  const [projects, setProjects] = useState(initialProjects);
  const [isLoading, setIsLoading] = useState(initialIsLoading);
  const [error, setError] = useState(null);
  const [showAllRecentReels, setShowAllRecentReels] = useState(false);
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

  useEffect(() => {
    const token = localStorage.getItem('token');
    const firebaseUID = localStorage.getItem('firebaseUID');
    const userEmail = localStorage.getItem('userEmail');
    
    // Redirect to login if not authenticated
    if (!token) {
      console.log('🔐 No token found - redirecting to login');
      navigate('/login');
      return;
    }
    
    console.log('📍 Token check:', { 
      hasToken: !!token, 
      firebaseUID, 
      userEmail,
      token: token ? token.substring(0, 20) + '...' : 'none' 
    });
    
    if (!token) {
      console.warn('⚠️ No token found');
      return;
    }

    // Fetch client profile
    const fetchClientProfile = async () => {
      try {
        console.log('📍 Fetching client profile from:', `${backendUrl}/api/client/uid/${firebaseUID}`);
        const response = await axios.get(`${backendUrl}/api/client/uid/${firebaseUID}`);
        console.log('✅ Client profile fetched:', response.data);
        
        if (response.data.success && response.data.client) {
          setClientData({
            name: response.data.client.name || 'Client',
            avatar: response.data.client.avatar || 'https://via.placeholder.com/40',
          });
        }
      } catch (err) {
        console.error('❌ Failed to fetch client profile:', err);
        console.error('Error response:', err.response?.data);
        // Use default client data on error
      }
    };

    // Fetch projects
    const fetchProjects = async () => {
      try {
        setIsLoading(true);
        setError(null);
        console.log('🔄 Fetching projects from API...');
        console.log('📍 API URL:', `${backendUrl}/api/project/client`);
        console.log('📍 Token being sent:', token.substring(0, 20) + '...');
        
        const response = await projectAPI.getClientProjects();
        console.log('✅ API Response received:', response);
        console.log('✅ Projects data:', response.data);
        console.log('📊 Number of projects:', Array.isArray(response.data) ? response.data.length : 'unknown');
        
        if (Array.isArray(response.data)) {
          console.log('✅ Setting projects to state:', response.data);
          setProjects(response.data);
        } else {
          console.warn('⚠️ Response data is not an array:', response.data);
          setProjects(response.data?.projects || []);
        }
      } catch (err) {
        console.error('❌ Failed to fetch projects:', err);
        console.error('Error details:', {
          message: err.message,
          status: err.response?.status,
          data: err.response?.data,
        });
        setProjects(initialProjects);
        if (err.response?.status !== 401) {
          setError('Failed to load projects');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchClientProfile();
    fetchProjects();
  }, [backendUrl]);

  // Log current state for debugging
  const token = localStorage.getItem('token');
  const firebaseUID = localStorage.getItem('firebaseUID');
  
  console.log('🔍 CURRENT STATE:', {
    isLoggedIn: !!token,
    isLoading,
    projectsCount: projects.length,
    clientName: clientData?.name,
    firebaseUID,
  });

  const formatCurrency = (amount = 0) =>
    `₹${Number(amount || 0).toLocaleString('en-IN')}`;

  const formatDate = (date) => {
    if (!date) return 'No deadline';
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const getDaysLeft = (date) => {
    if (!date) return null;
    const now = new Date();
    const deadline = new Date(date);
    return Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));
  };

  const getReelProgress = (status) => {
    const progressMap = {
      'Getting Started': 15,
      'In Progress': 50,
      'Revision Phase': 75,
      'Successfully Delivered': 100,
      // Legacy formats
      'getting_started': 15,
      'in_progress': 50,
      'revision': 75,
      'delivered': 100,
    };
    return progressMap[status] || 0;
  };

  const getProjectMetrics = (project) => {
    const reels = Array.isArray(project.reels) ? project.reels : [];

    const delivered = reels.filter((r) => r.status === 'Successfully Delivered').length;
    const inProgress = reels.filter((r) => r.status === 'In Progress').length;
    const revisionPhase = reels.filter((r) => r.status === 'Revision Phase').length;
    const gettingStarted = reels.filter((r) => r.status === 'Getting Started').length;

    const total = Number(project.totalReels || reels.length || 0);
    const progress = total > 0 ? Math.round((delivered / total) * 100) : 0;

    let projectState = 'In progress';
    if (revisionPhase > 0) projectState = 'Awaiting review';
    else if (delivered === total && total > 0) projectState = 'Delivered';
    else if (delivered === 0 && inProgress === 0 && gettingStarted === total && total > 0) {
      projectState = 'Not started';
    }

    let heroLine = 'Work has not started yet';
    if (revisionPhase > 0) {
      heroLine = `${revisionPhase} reel${revisionPhase > 1 ? 's are' : ' is'} in revision phase`;
    } else if (inProgress > 0 && delivered === 0) {
      heroLine = 'Work has started on your first reel';
    } else if (inProgress > 0) {
      heroLine = `${delivered} of ${total} reels delivered`;
    } else if (delivered === total && total > 0) {
      heroLine = 'All reels have been completed and delivered';
    } else if (delivered > 0 && delivered < total) {
      heroLine = `${delivered} of ${total} reels delivered`;
    }

    return {
      delivered,
      inProgress,
      revisionPhase,
      gettingStarted,
      total,
      progress,
      projectState,
      heroLine,
    };
  };

  const pendingActions = useMemo(() => {
    return projects.flatMap((project) => {
      const reels = Array.isArray(project.reels) ? project.reels : [];

      return reels
        .filter((reel) => reel.status === 'ready_for_review' || reel.status === 'revision')
        .map((reel) => ({
          projectId: project._id || project.id,
          projectName: project.projectName,
          reelNumber: reel.reelNumber,
          status: reel.status,
          title:
            reel.status === 'ready_for_review'
              ? `Reel #${reel.reelNumber} is ready for your review`
              : `Reel #${reel.reelNumber} needs your feedback`,
          subtitle:
            reel.status === 'ready_for_review'
              ? 'The latest draft is ready and waiting for your response.'
              : 'Your feedback is needed before we continue.',
          note: reel.note || '',
        }));
    });
  }, [projects]);

  const totals = useMemo(() => {
    // Only count projects that are not fully delivered
    const activeProjects = projects.filter(p => {
      const metrics = getProjectMetrics(p);
      return !(metrics.delivered === metrics.total && metrics.total > 0);
    });
    
    const totalProjects = activeProjects.length;

    const totalDelivered = projects.reduce(
      (sum, project) => sum + getProjectMetrics(project).delivered,
      0
    );

    const totalReels = projects.reduce(
      (sum, project) => sum + getProjectMetrics(project).total,
      0
    );

    const paid = projects.reduce(
      (sum, project) => sum + Number(project.paidAmount || 0),
      0
    );

    const outstanding = projects.reduce(
      (sum, project) => sum + Number(project.remainingAmount || 0),
      0
    );

    const sortedDeadlines = projects
      .filter((p) => p.deadline)
      .sort((a, b) => new Date(a.deadline) - new Date(b.deadline));

    const nextDeadlineProject = sortedDeadlines[0] || null;

    return {
      totalProjects,
      totalDelivered,
      totalReels,
      paid,
      outstanding,
      nextDeadlineProject,
    };
  }, [projects]);

  const recentReelUpdates = useMemo(() => {
    // Collect all reels from all projects with their project metadata
    const allReels = [];
    projects.forEach((project) => {
      const reels = Array.isArray(project.reels) ? project.reels : [];
      reels.forEach((reel) => {
        allReels.push({
          ...reel,
          projectId: project._id || project.id,
          projectName: project.projectName,
          projectType: project.projectType,
        });
      });
    });

    // Prioritize reels by status: ready_for_review > revision > in_progress > delivered
    const statusPriority = {
      'Revision Phase': 0,
      'In Progress': 1,
      'Getting Started': 2,
      'Successfully Delivered': 3,
    };

    return allReels
      .sort((a, b) => {
        const priorityA = statusPriority[a.status] ?? 5;
        const priorityB = statusPriority[b.status] ?? 5;
        return priorityA - priorityB;
      });
  }, [projects]);

  // Show "not logged in" state - redirect to login
  if (!token) {
    console.log('❌ Not logged in - redirecting to login');
    return null; // Will redirect via useEffect or Navbar
  }

  if (isLoading) {
    console.log('⏳ Loading projects...');
    return (
      <div className="min-h-screen bg-black">
        <Navbar />
        
        <div className="pt-24 px-4 text-center text-[#f5f5f5]">
          <p className="text-lg">Loading your projects...</p>
          <p className="text-[#999] text-sm mt-2">Please wait while we fetch your data</p>
        </div>
      </div>
    );
  }

  if (projects.length === 0) {
    console.log('📭 RENDER: No projects - showing empty state');
    return (
      <div className="min-h-screen bg-black">
        <Navbar />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
          {/* Header */}
          <section className="mb-10">
            <div className="rounded-[28px] border border-white/10 bg-[#0f0f0f] p-6 sm:p-8">
              <p className="text-sm text-[#bdbdbd] mb-3">Welcome back</p>
              <h1 className="text-3xl sm:text-4xl font-semibold text-white tracking-tight">
                {clientData?.name || 'Client'}
              </h1>

              <div className="mt-4 space-y-2">
                <p className="text-[#d6d6d6] text-sm sm:text-base">
                  You do not have any active projects at the moment.
                </p>
              </div>
            </div>
          </section>

          {/* Empty State */}
          <section className="space-y-6">
            <div className="rounded-[28px] border border-white/10 bg-[#0f0f0f] p-8 text-center">
              <p className="text-[#999] text-lg mb-4">No Projects Yet</p>
              <p className="text-[#d6d6d6] text-sm mb-6">
                Projects will appear here once Sumukh creates and assigns them to you.
              </p>
              
              <button
                onClick={() => navigate('/contact')}
                className="hover:opacity-80 transition-all cursor-pointer"
              >
                <h3 className="text-white font-medium text-sm mb-2">Need help?</h3>
                <p className="text-[#999] text-xs">
                  Reach out to Sumukh for project approvals, revisions, payment questions, or project updates.
                </p>
              </button>
            </div>
          </section>
        </main>
      </div>
    );
  }

  // Show projects (main view)
  console.log('✅ RENDER: Showing projects | Count:', projects.length);
  return (
    <div className="min-h-screen bg-black">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
        {/* Header */}
        <section className="mb-10">
          <div className="rounded-[28px] border border-white/10 bg-[#0f0f0f] p-6 sm:p-8">
            <p className="text-sm text-[#bdbdbd] mb-3">Welcome back</p>
            <h1 className="text-3xl sm:text-4xl font-semibold text-white tracking-tight">
              {clientData?.name || 'Client'}
            </h1>

            <div className="mt-4 space-y-2">
              {projects.length === 0 ? (
                <p className="text-[#d6d6d6] text-sm sm:text-base">
                  You do not have any active projects at the moment.
                </p>
              ) : (
                <>
                  <p className="text-[#f5f5f5] text-sm sm:text-base">
                    You have {totals.totalProjects} active project
                    {totals.totalProjects !== 1 ? 's' : ''}.
                  </p>
                  {pendingActions.length > 0 && (
                    <p className="text-[#d6d6d6] text-sm sm:text-base">
                      {pendingActions.length} reel
                      {pendingActions.length !== 1 ? 's are' : ' is'} waiting for your review.
                    </p>
                  )}
                </>
              )}
            </div>
          </div>
        </section>

        {/* Action Required */}
        {pendingActions.length > 0 && (
          <section className="mb-10">
            <div className="rounded-[28px] border border-white/10 bg-[#131313] p-6 sm:p-7">
              <p className="text-xs uppercase tracking-[0.16em] text-[#a8a8a8] mb-3">
                Action required
              </p>

              <h2 className="text-xl sm:text-2xl font-semibold text-white mb-2">
                {pendingActions[0].title}
              </h2>

              <p className="text-sm text-[#e7e7e7] mb-1">
                {pendingActions[0].projectName}
              </p>

              <p className="text-sm text-[#bdbdbd] mb-5">
                {pendingActions[0].note || pendingActions[0].subtitle}
              </p>

              <button
                onClick={() => navigate(`/client/reel/${pendingActions[0].projectId}/${pendingActions[0].reelNumber}`)}
                className="inline-flex items-center justify-center rounded-xl bg-[#f5f5f5] px-5 py-2.5 text-sm font-semibold text-black transition-opacity hover:opacity-85"
              >
                Review now
              </button>
            </div>
          </section>
        )}

        {/* Active Reels */}
        {projects.length > 0 && recentReelUpdates.filter(r => r.status === 'Revision Phase' || r.status === 'revision' || r.status === 'In Progress' || r.status === 'in_progress' || r.status === 'Getting Started' || r.status === 'getting_started').length > 0 && (
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-white mb-6">Active reels</h2>

            <div className="space-y-3">
              {(() => {
                // Only show "Revision Phase", "In Progress", and "Getting Started" in active reels
                const revisionPhaseReels = recentReelUpdates.filter(r => r.status === 'Revision Phase' || r.status === 'revision');
                const inProgressReels = recentReelUpdates.filter(r => r.status === 'In Progress' || r.status === 'in_progress');
                const gettingStartedReels = recentReelUpdates.filter(r => r.status === 'Getting Started' || r.status === 'getting_started');
                const activeReels = [...revisionPhaseReels, ...inProgressReels, ...gettingStartedReels].slice(0, 5);
                
                return activeReels.map((reel, idx) => {
                const statusDescriptions = {
                  'Not Started': 'Work has not started yet',
                  'Getting Started': 'Reel is getting started',
                  'In Progress': 'Currently being edited',
                  'Revision Phase': 'Waiting for your feedback',
                  'Successfully Delivered': 'Completed and delivered',
                  // Legacy status mappings
                  'not_started': 'Work has not started yet',
                  'in_progress': 'Currently being edited',
                  'ready_for_review': 'Ready for your review',
                  'revision': 'Waiting for your feedback',
                  'delivered': 'Completed and delivered',
                };

                const statusLabels = {
                  'Not Started': 'Not Started',
                  'Getting Started': 'Getting Started',
                  'In Progress': 'In Progress',
                  'Revision Phase': 'Revision Phase',
                  'Successfully Delivered': 'Successfully Delivered',
                  // Legacy status mappings
                  'not_started': 'Not Started',
                  'in_progress': 'In Progress',
                  'ready_for_review': 'Ready for Review',
                  'revision': 'Revision',
                  'delivered': 'Delivered',
                };

                const statusColors = {
                  'Getting Started': '#808080',
                  'In Progress': '#7ba3d0',
                  'Revision Phase': '#f4b860',
                  'Successfully Delivered': '#7fb987',
                };

                const statusBgColors = {
                  'Getting Started': 'rgba(128, 128, 128, 0.1)',
                  'In Progress': 'rgba(123, 163, 208, 0.1)',
                  'Revision Phase': 'rgba(244, 184, 96, 0.1)',
                  'Successfully Delivered': 'rgba(127, 185, 135, 0.1)',
                };

                return (
                  <div
                    key={`${reel.projectId}-${reel.reelNumber}-${idx}`}
                    onClick={() => navigate(`/client/reel/${reel.projectId}/${reel.reelNumber}`)}
                    className="rounded-xl border border-white/10 bg-[#131313] p-6 transition-all hover:border-white/20 hover:bg-[#1a1a1a] cursor-pointer"
                  >
                    {/* Header Row */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="text-2xl font-bold text-white tracking-tight leading-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                            Reel #{reel.reelNumber}
                          </h3>
                        </div>
                        {reel.projectName && (
                          <p className="text-xs font-semibold text-[#888] mt-2 uppercase tracking-widest leading-relaxed" style={{ fontFamily: "'Outfit', sans-serif" }}>
                            {reel.projectName}
                          </p>
                        )}
                        {reel.name && (
                          <p className="text-lg font-bold text-[#e8e8e8] mt-3 tracking-tight leading-snug" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                            {reel.name}
                          </p>
                        )}
                      </div>
                      {/* Status Badge with Dynamic Color */}
                      <span
                        className="shrink-0 rounded-lg px-3 py-1.5 text-xs font-bold text-white whitespace-nowrap tracking-wider"
                        style={{
                          backgroundColor: statusColors[reel.status] || '#646464',
                          fontFamily: "'Outfit', sans-serif",
                        }}
                      >
                        {statusLabels[reel.status] || 'Unknown'}
                      </span>
                    </div>

                    {/* Status Description */}
                    <p className="text-sm text-[#bdbdbd] mb-4 font-medium tracking-wide leading-relaxed" style={{ fontFamily: "'Outfit', sans-serif" }}>
                      {statusDescriptions[reel.status] || 'Reel update'}
                    </p>

                    {/* Reel Note */}
                    {reel.note && (
                      <div
                        className="mb-4 rounded-lg p-3"
                        style={{ backgroundColor: statusBgColors[reel.status] || 'rgba(100, 100, 100, 0.1)' }}
                      >
                        <p className="text-sm font-bold text-[#777] mb-2 uppercase tracking-widest leading-none" style={{ fontFamily: "'Outfit', sans-serif" }}>Note</p>
                        <p className="text-base text-[#d6d6d6] leading-relaxed" style={{ fontFamily: "'Outfit', sans-serif" }}>{reel.note}</p>
                      </div>
                    )}

                    {/* Progress Bar */}
                    {(reel.status === 'Getting Started' || reel.status === 'In Progress' || reel.status === 'Revision Phase' || reel.status === 'getting_started' || reel.status === 'in_progress' || reel.status === 'revision') && (
                      <div className="mb-5">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm font-bold text-[#888] uppercase tracking-widest" style={{ fontFamily: "'Outfit', sans-serif" }}>Progress</p>
                          <p className="text-base font-bold text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{getReelProgress(reel.status)}%</p>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-[#0a0a0a]">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${getReelProgress(reel.status)}%`,
                              backgroundColor: statusColors[reel.status] || '#646464',
                            }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Action Button */}
                    <button
                      onClick={() => navigate(`/client/reel/${reel.projectId}/${reel.reelNumber}`)}
                      className="inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-base font-bold text-white transition-all hover:opacity-85 tracking-wide"
                      style={{
                        backgroundColor: statusColors[reel.status] || '#646464',
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                      }}
                    >
                      {reel.status === 'ready_for_review' ? 'Review now' : reel.status === 'revision' ? 'Provide feedback' : 'View reel'}
                    </button>
                  </div>
                );
                });
              })()}
            </div>
          </section>
        )}

        {/* Successfully Delivered Reels */}
        {projects.length > 0 && recentReelUpdates.filter(r => r.status === 'Successfully Delivered').length > 0 && (
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-white mb-6">Successfully delivered</h2>

            <div className="space-y-3">
              {(() => {
                const deliveredReels = recentReelUpdates.filter(r => r.status === 'Successfully Delivered').slice(0, 5);
                
                return deliveredReels.map((reel, idx) => {
                const statusColors = {
                  'Not Started': '#505050',
                  'Getting Started': '#808080',
                  'In Progress': '#7ba3d0',
                  'Revision Phase': '#f4b860',
                  'Successfully Delivered': '#7fb987',
                  // Legacy status mappings
                  'not_started': '#505050',
                  'in_progress': '#7ba3d0',
                  'ready_for_review': '#f4b860',
                  'revision': '#f4b860',
                  'delivered': '#7fb987',
                };

                const statusBgColors = {
                  'Not Started': 'rgba(80, 80, 80, 0.1)',
                  'Getting Started': 'rgba(128, 128, 128, 0.1)',
                  'In Progress': 'rgba(123, 163, 208, 0.1)',
                  'Revision Phase': 'rgba(244, 184, 96, 0.1)',
                  'Successfully Delivered': 'rgba(127, 185, 135, 0.1)',
                  // Legacy status mappings
                  'not_started': 'rgba(80, 80, 80, 0.1)',
                  'in_progress': 'rgba(123, 163, 208, 0.1)',
                  'ready_for_review': 'rgba(244, 184, 96, 0.1)',
                  'revision': 'rgba(244, 184, 96, 0.1)',
                  'delivered': 'rgba(127, 185, 135, 0.1)',
                };

                return (
                  <div
                    key={`${reel.projectId}-${reel.reelNumber}-${idx}`}
                    className="rounded-xl border border-white/10 bg-[#131313] p-6 transition-all hover:border-white/20 hover:bg-[#1a1a1a] cursor-pointer"
                    onClick={() => navigate(`/client/reel/${reel.projectId}/${reel.reelNumber}`)}
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 
                          className="text-lg font-bold text-white"
                          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                        >
                          Reel #{reel.reelNumber}
                        </h3>
                        <p className="text-xs font-semibold text-[#888] mt-2 uppercase tracking-widest">
                          {reel.projectName}
                        </p>
                        {reel.name && (
                          <p 
                            className="text-base text-[#d6d6d6] mt-3"
                            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                          >
                            {reel.name}
                          </p>
                        )}
                      </div>
                      <span
                        className="shrink-0 rounded-lg px-3 py-1.5 text-xs font-bold text-white whitespace-nowrap"
                        style={{ backgroundColor: statusColors[reel.status] || '#646464' }}
                      >
                        {reel.status}
                      </span>
                    </div>

                    <p className="text-xs text-[#666] text-right">Click to view details</p>
                  </div>
                );
                });
              })()}
            </div>

            {/* View More for Delivered Reels */}
            {recentReelUpdates.filter(r => r.status === 'Successfully Delivered').length > 5 && (
              <div className="mt-4 flex justify-center">
                <button
                  className="inline-flex items-center justify-center rounded-xl border border-white/12 px-6 py-2.5 text-sm font-semibold text-[#f5f5f5] transition-colors hover:bg-white hover:text-black"
                  disabled
                >
                  View more
                </button>
              </div>
            )}
          </section>
        )}

        {/* Projects */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-2xl font-semibold text-white">Your projects</h2>
          </div>

          {projects.length === 0 ? (
            <div className="rounded-[24px] border border-white/10 bg-[#131313] p-8 text-center text-[#d6d6d6]">
              No active projects yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {projects.map((project) => {
                const metrics = getProjectMetrics(project);
                const daysLeft = getDaysLeft(project.deadline);

                return (
                  <div
                    key={project._id || project.id}
                    className="rounded-[24px] border border-white/10 bg-[#131313] p-6 transition-all hover:border-white/20 hover:bg-[#171717]"
                  >
                    <div className="flex items-start justify-between gap-4 mb-5">
                      <div>
                        <h3 className="text-lg font-semibold text-white">
                          {project.projectName}
                        </h3>
                        <p className="text-sm text-[#a8a8a8] mt-1">
                          {project.projectType || 'Project'}
                          {project.packageType ? ` • ${project.packageType}` : ''}
                        </p>
                      </div>

                      <StatusBadge status={metrics.projectState} />
                    </div>

                    <p className="text-[#f3f3f3] text-sm sm:text-base mb-5 leading-6">
                      {metrics.heroLine}
                    </p>

                    <div className="mb-5">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-[#d6d6d6]">Progress</p>
                        <p className="text-sm text-white">
                          {metrics.delivered}/{metrics.total} reels
                        </p>
                      </div>

                      <div className="h-2 w-full overflow-hidden rounded-full bg-[#0a0a0a]">
                        <div
                          className="h-full rounded-full bg-[#f5f5f5] transition-all"
                          style={{ width: `${metrics.progress}%` }}
                        />
                      </div>

                      <p className="mt-2 text-xs text-[#9d9d9d]">
                        {metrics.progress}% complete
                      </p>
                    </div>

                    {project.deadline && (
                      <div className="mb-6 rounded-xl border border-white/8 bg-[#0d0d0d] px-4 py-3">
                        <p className="text-xs uppercase tracking-[0.14em] text-[#9d9d9d] mb-1">
                          Deadline
                        </p>
                        <p className="text-sm text-white">
                          {formatDate(project.deadline)}
                          {typeof daysLeft === 'number' && (
                            <span className="ml-2 text-[#bdbdbd]">
                              {daysLeft >= 0 ? `(${daysLeft} days left)` : '(Overdue)'}
                            </span>
                          )}
                        </p>
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={() => navigate(`/client/project/${project._id || project.id}`)}
                        className="inline-flex items-center justify-center rounded-xl bg-[#f5f5f5] px-4 py-2.5 text-sm font-semibold text-black transition-opacity hover:opacity-85"
                      >
                        View details
                      </button>

                      <a
                        href="https://wa.me/919876543210"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center rounded-xl border border-white/12 px-4 py-2.5 text-sm font-semibold text-[#f5f5f5] transition-colors hover:bg-white hover:text-black"
                      >
                        Message
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Recent Reel Updates */}
        {projects.length > 0 && recentReelUpdates.length > 0 && (
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-white mb-6">Recent reel updates</h2>

            <div className="space-y-3">
              {(showAllRecentReels ? recentReelUpdates : recentReelUpdates.slice(0, 5)).map((reel, idx) => {
                const statusColors = {
                  'Getting Started': '#808080',
                  'In Progress': '#7ba3d0',
                  'Revision Phase': '#f4b860',
                  'Successfully Delivered': '#7fb987',
                };

                const statusBgColors = {
                  'Getting Started': 'rgba(128, 128, 128, 0.1)',
                  'In Progress': 'rgba(123, 163, 208, 0.1)',
                  'Revision Phase': 'rgba(244, 184, 96, 0.1)',
                  'Successfully Delivered': 'rgba(127, 185, 135, 0.1)',
                };

                const getReelProgress = (status) => {
                  const progressMap = {
                    'Getting Started': 0,
                    'In Progress': 50,
                    'Revision Phase': 75,
                    'Successfully Delivered': 100,
                  };
                  return progressMap[status] || 0;
                };

                // Map old status values to new ones for display
                const mapStatus = (oldStatus) => {
                  const map = {
                    'ready_for_review': 'Revision Phase',
                    'revision': 'Revision Phase',
                    'in_progress': 'In Progress',
                    'delivered': 'Successfully Delivered',
                    'not_started': 'Getting Started',
                  };
                  return map[oldStatus] || oldStatus;
                };

                const displayStatus = mapStatus(reel.status);

                return (
                  <div
                    key={`${reel.projectId}-${reel.reelNumber}-${idx}`}
                    className="rounded-xl border border-white/10 bg-[#131313] p-6 transition-all hover:border-white/20 hover:bg-[#1a1a1a] cursor-pointer"
                    onClick={() => navigate(`/client/reel/${reel.projectId}/${reel.reelNumber}`)}
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 
                          className="text-lg font-bold text-white"
                          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                        >
                          Reel #{reel.reelNumber}
                        </h3>
                        <p className="text-xs font-semibold text-[#888] mt-2 uppercase tracking-widest">
                          {reel.projectName}
                        </p>
                        {reel.name && (
                          <p 
                            className="text-base text-[#d6d6d6] mt-3"
                            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                          >
                            {reel.name}
                          </p>
                        )}
                      </div>
                      <span
                        className="shrink-0 rounded-lg px-3 py-1.5 text-xs font-bold text-white whitespace-nowrap"
                        style={{ backgroundColor: statusColors[displayStatus] || '#646464' }}
                      >
                        {displayStatus}
                      </span>
                    </div>

                    {/* Progress bar for In Progress */}
                    {displayStatus === 'In Progress' && (
                      <div className="mb-3">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-xs font-bold text-[#888] uppercase">Progress</p>
                          <p className="text-sm font-bold text-white">{getReelProgress(displayStatus)}%</p>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-[#0a0a0a]">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${getReelProgress(displayStatus)}%`,
                              backgroundColor: statusColors[displayStatus] || '#646464',
                            }}
                          />
                        </div>
                      </div>
                    )}

                    <p className="text-xs text-[#666] text-right">Click to view details</p>
                  </div>
                );
              })}
            </div>

            {/* View More / Show Less Button */}
            {recentReelUpdates.length > 5 && (
              <div className="mt-4 flex justify-center">
                <button
                  onClick={() => setShowAllRecentReels(!showAllRecentReels)}
                  className="inline-flex items-center justify-center rounded-xl border border-white/12 px-6 py-2.5 text-sm font-semibold text-[#f5f5f5] transition-colors hover:bg-white hover:text-black"
                >
                  {showAllRecentReels ? 'Show less' : 'View more'}
                </button>
              </div>
            )}
          </section>
        )}

        {/* Billing */}
        {projects.length > 0 && (
          <section className="mb-10">
            <div className="rounded-[24px] border border-white/10 bg-[#131313] p-6 sm:p-7">
              <p className="text-xs uppercase tracking-[0.16em] text-[#a8a8a8] mb-4">
                Billing Summary
              </p>

              {/* Payment Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {/* Total Amount */}
                <div className="rounded-lg border border-white/5 bg-[#0a0a0a] p-4">
                  <p className="text-xs text-[#888] mb-2">Total Amount</p>
                  <p className="text-2xl font-semibold text-white">
                    {formatCurrency(totals.paid + totals.outstanding)}
                  </p>
                </div>

                {/* Amount Paid */}
                <div className="rounded-lg border border-white/5 bg-[#0a0a0a] p-4">
                  <p className="text-xs text-[#888] mb-2">Amount Paid</p>
                  <p className="text-2xl font-semibold text-[#7fb987]">
                    {formatCurrency(totals.paid)}
                  </p>
                </div>

                {/* Outstanding */}
                <div className="rounded-lg border border-white/5 bg-[#0a0a0a] p-4">
                  <p className="text-xs text-[#888] mb-2">Amount Due</p>
                  <p className="text-2xl font-semibold text-[#f4b860]">
                    {formatCurrency(totals.outstanding)}
                  </p>
                </div>
              </div>

              {/* Reels Delivered */}
              <div className="border-t border-white/10 pt-4">
                <p className="text-sm text-[#bdbdbd]">
                  {totals.totalDelivered}/{totals.totalReels} reels delivered
                  {totals.totalDelivered === totals.totalReels && totals.totalReels > 0 
                    ? ' ✓ All complete!' 
                    : totals.totalReels > totals.totalDelivered 
                    ? ` • ${totals.totalReels - totals.totalDelivered} remaining` 
                    : ''}
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Help */}
        <section>
          <div className="rounded-[24px] border border-white/10 bg-[#131313] p-8 text-center">
            <h3 className="text-xl font-semibold text-white mb-2">Need help?</h3>
            <p className="mx-auto max-w-2xl text-sm text-[#d6d6d6] mb-6">
              Reach out anytime for approvals, revisions, payment questions, or project updates.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-xl bg-[#f5f5f5] px-5 py-2.5 text-sm font-semibold text-black transition-opacity hover:opacity-85"
              >
                Message us
              </a>

              <a
                href="mailto:support@sumukhvisuals.com"
                className="inline-flex items-center justify-center rounded-xl border border-white/12 px-5 py-2.5 text-sm font-semibold text-[#f5f5f5] transition-colors hover:bg-white hover:text-black"
              >
                Email us
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

const SummaryCard = ({ value, label }) => (
  <div className="rounded-[24px] border border-white/10 bg-[#131313] p-5 sm:p-6 hover:border-white/20 transition-colors">
    <p className="text-3xl sm:text-4xl font-semibold text-white mb-1">{value}</p>
    <p className="text-xs uppercase tracking-[0.16em] text-[#9d9d9d]">
      {label}
    </p>
  </div>
);

const StatusBadge = ({ status }) => {
  const styles = {
    'Not started': 'bg-[#0b0b0b] text-[#bdbdbd] border-white/8',
    'In progress': 'bg-[#111111] text-white border-white/10',
    'Awaiting review': 'bg-[#171717] text-white border-white/15',
    'Feedback needed': 'bg-[#171717] text-white border-white/15',
    Delivered: 'bg-[#0f0f0f] text-[#f5f5f5] border-white/10',
  };

  return (
    <span
      className={`shrink-0 rounded-full border px-3 py-1 text-xs font-medium ${
        styles[status] || 'bg-[#111111] text-white border-white/10'
      }`}
    >
      {status}
    </span>
  );
};

export default ClientDashboard;