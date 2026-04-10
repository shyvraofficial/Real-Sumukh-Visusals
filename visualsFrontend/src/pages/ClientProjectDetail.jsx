import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { projectAPI } from '../services/projectAPI';

/**
 * Client Project Detail Page
 * Comprehensive project view showing reels, progress, and payment information
 * Uses new 4-status system with professional typography
 */
const ClientProjectDetail = ({
  clientData = { name: 'Client', avatar: 'https://via.placeholder.com/40' },
  projects = [],
  onLogout = () => {},
}) => {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        
        if (!token) {
          navigate('/login?mode=client');
          return;
        }

        // Try to fetch from API first
        const response = await axios.get(
          `${backendUrl}/api/project/${projectId}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        if (response.data) {
          setProject(response.data);
        }
      } catch (error) {
        // Try to find in props as fallback
        if (projects.length > 0) {
          const foundProject = projects.find(p => p._id === projectId || p.id === projectId);
          setProject(foundProject || null);
        } else {
          setProject(null);
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (projectId) {
      fetchProject();
    }
  }, [projectId, backendUrl, navigate, projects]);

  // Status system with colors
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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount || 0);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
          <div className="text-center text-[#bdbdbd]">Loading project details...</div>
        </main>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-black">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
          <section className="rounded-[28px] border border-white/10 bg-[#0f0f0f] p-8 text-center">
            <h2 className="text-2xl font-semibold text-white mb-4">Project not found</h2>
            <p className="text-[#d6d6d6] text-sm mb-6">
              The project you're looking for doesn't exist or has been removed.
            </p>
            <button
              onClick={() => navigate('/client/dashboard')}
              className="px-6 py-2.5 rounded-lg font-medium"
              style={{ backgroundColor: '#f5f5f5', color: '#000000' }}
            >
              ← Back to Dashboard
            </button>
          </section>
        </main>
      </div>
    );
  }

  // Calculate metrics
  const reels = Array.isArray(project.reels) ? project.reels : [];
  const delivered = reels.filter(r => r.status === 'Successfully Delivered').length;
  const inProgress = reels.filter(r => r.status === 'In Progress').length;
  const revisionPhase = reels.filter(r => r.status === 'Revision Phase').length;
  const gettingStarted = reels.filter(r => r.status === 'Getting Started').length;
  const totalReels = project.totalReels || reels.length || 0;
  const progress = totalReels > 0 ? Math.round((delivered / totalReels) * 100) : 0;

  const getProjectId = () => {
    return project._id || project.id || projectId;
  };

  return (
    <div className="min-h-screen bg-black">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
        {/* Header */}
        <section className="mb-10">
          <div className="flex items-start justify-between mb-6">
            <button
              onClick={() => navigate('/client/dashboard')}
              className="text-[#bdbdbd] hover:text-white font-medium transition-colors"
            >
              ← Back to Dashboard
            </button>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-[#0f0f0f] p-6 sm:p-8">
            <h1 
              className="text-3xl sm:text-4xl font-semibold text-white mb-4"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              {project.projectName}
            </h1>

            <div className="flex flex-wrap items-center gap-3">
              {project.projectType && (
                <span className="px-3 py-1.5 rounded-lg bg-[#1a1a1a] text-xs font-semibold text-[#bdbdbd]">
                  {project.projectType}
                </span>
              )}
              {project.packageType && (
                <span className="px-3 py-1.5 rounded-lg bg-[#1a1a1a] text-xs font-semibold text-[#bdbdbd]">
                  {project.packageType}
                </span>
              )}
              {project.deadline && (
                <span className="text-sm text-[#999]">
                  Deadline: {new Date(project.deadline).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              )}
            </div>
          </div>
        </section>

        {/* Quick Stats */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {/* Overall Progress */}
          <div className="rounded-lg border border-white/10 bg-[#131313] p-6">
            <p className="text-xs uppercase tracking-wider text-[#888] mb-3">Overall Progress</p>
            <p className="text-3xl font-bold text-white mb-3">{progress}%</p>
            <p className="text-sm text-[#999]">{delivered}/{totalReels} reels delivered</p>
          </div>

          {/* Status Breakdown */}
          <div className="rounded-lg border border-white/10 bg-[#131313] p-6">
            <p className="text-xs uppercase tracking-wider text-[#888] mb-3">Status</p>
            <div className="space-y-2">
              {revisionPhase > 0 && <p className="text-sm text-white"><span className="text-[#f4b860]">●</span> {revisionPhase} in revision</p>}
              {inProgress > 0 && <p className="text-sm text-white"><span className="text-[#7ba3d0]">●</span> {inProgress} in progress</p>}
              {gettingStarted > 0 && <p className="text-sm text-white"><span className="text-[#808080]">●</span> {gettingStarted} getting started</p>}
            </div>
          </div>

          {/* Next Action */}
          <div className="rounded-lg border border-white/10 bg-[#131313] p-6">
            <p className="text-xs uppercase tracking-wider text-[#888] mb-3">Next Action</p>
            <p className="text-base font-semibold text-white">
              {revisionPhase > 0 
                ? `${revisionPhase} reel${revisionPhase !== 1 ? 's' : ''} need feedback`
                : inProgress > 0
                ? 'Check back soon'
                : 'All on schedule'}
            </p>
          </div>
        </section>

        {/* Reels Section */}
        <section className="mb-10">
          <h2 
            className="text-2xl font-semibold text-white mb-6"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            All Reels
          </h2>

          {reels.length === 0 ? (
            <div className="rounded-lg border border-white/10 bg-[#131313] p-8 text-center">
              <p className="text-[#999]">No reels in this project yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {reels.map((reel, idx) => (
                <div
                  key={`${reel.reelNumber}-${idx}`}
                  className="rounded-xl border border-white/10 bg-[#131313] p-6 transition-all hover:border-white/20 hover:bg-[#1a1a1a] cursor-pointer"
                  onClick={() => navigate(`/client/reel/${getProjectId()}/${reel.reelNumber}`)}
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
                      {reel.name && (
                        <p 
                          className="text-base text-[#d6d6d6] mt-2"
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

                  {/* Status note */}
                  {reel.note && (
                    <div className="mb-4 rounded-lg p-3" style={{ backgroundColor: statusBgColors[reel.status] || 'rgba(100, 100, 100, 0.1)' }}>
                      <p className="text-sm text-[#d6d6d6]">{reel.note}</p>
                    </div>
                  )}

                  {/* Progress bar */}
                  {(reel.status === 'In Progress' || reel.status === 'Revision Phase') && (
                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-bold text-[#888] uppercase">Progress</p>
                        <p className="text-sm font-bold text-white">{getReelProgress(reel.status)}%</p>
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

                  <p className="text-xs text-[#666] text-right">Click to view details</p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Project Details & Payment */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          {/* Project Info */}
          <div className="lg:col-span-2 rounded-lg border border-white/10 bg-[#131313] p-6">
            <p className="text-xs uppercase tracking-wider text-[#888] mb-4">Project Details</p>

            <div className="space-y-4">
              {project.notes && (
                <div>
                  <p className="text-xs uppercase tracking-wider text-[#888] mb-2">Notes</p>
                  <p className="text-sm text-[#d6d6d6]">{project.notes}</p>
                </div>
              )}

              {project.deliveryTime && (
                <div>
                  <p className="text-xs uppercase tracking-wider text-[#888] mb-2">Delivery Time</p>
                  <p className="text-sm text-[#d6d6d6]">{project.deliveryTime}</p>
                </div>
              )}
            </div>
          </div>

          {/* Payment Info */}
          <div className="rounded-lg border border-white/10 bg-[#131313] p-6">
            <p className="text-xs uppercase tracking-wider text-[#888] mb-4">Payment</p>

            <div className="space-y-3 mb-5 rounded-lg border border-white/10 bg-[#0a0a0a] p-4">
              <div>
                <p className="text-xs text-[#888] mb-1">Total Amount</p>
                <p className="text-xl font-bold text-white">{formatCurrency(project.totalAmount)}</p>
              </div>
              <div className="border-t border-white/10 pt-3">
                <p className="text-xs text-[#888] mb-1">Paid</p>
                <p className="text-lg font-bold text-[#7fb987]">{formatCurrency(project.paidAmount)}</p>
              </div>
              <div className="border-t border-white/10 pt-3">
                <p className="text-xs text-[#888] mb-1">Due</p>
                <p className="text-lg font-bold text-[#f4b860]">{formatCurrency(project.remainingAmount)}</p>
              </div>
            </div>

            {/* Payment Progress */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-bold text-[#888]">PAID</p>
                <p className="text-sm font-bold text-white">
                  {project.totalAmount ? Math.round((project.paidAmount / project.totalAmount) * 100) : 0}%
                </p>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-[#0a0a0a]">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${project.totalAmount ? (project.paidAmount / project.totalAmount) * 100 : 0}%`,
                    backgroundColor: '#7fb987',
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="rounded-lg border border-white/10 bg-[#131313] p-8 text-center">
          <h3 
            className="text-xl font-semibold text-white mb-3"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Questions about your project?
          </h3>
          <p className="text-[#bdbdbd] text-sm mb-5">
            Reach out anytime for updates, feedback, or payment questions.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-xl bg-[#f5f5f5] px-6 py-2.5 text-sm font-semibold text-black transition-opacity hover:opacity-85"
            >
              Message on WhatsApp
            </a>

            <a
              href="mailto:support@sumukhvisuals.com"
              className="inline-flex items-center justify-center rounded-xl border border-white/20 px-6 py-2.5 text-sm font-semibold text-[#f5f5f5] transition-colors hover:bg-white hover:text-black"
            >
              Email us
            </a>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ClientProjectDetail;
