import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ReelChat from '../components/ReelChat';
import { projectAPI } from '../services/projectAPI';

const ClientReelDetail = () => {
  const navigate = useNavigate();
  const { projectId, reelNumber } = useParams();
  const [project, setProject] = useState(null);
  const [reel, setReel] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Get client data for chat
  const clientData = localStorage.getItem('clientData') ? JSON.parse(localStorage.getItem('clientData')) : {};

  useEffect(() => {
    const fetchReel = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await projectAPI.getReel(projectId, reelNumber);
        setProject(response.data.project);
        setReel(response.data.reel);
      } catch (err) {
        console.error('Failed to fetch reel:', err);
        setError('Failed to load reel details');
      } finally {
        setIsLoading(false);
      }
    };

    if (projectId && reelNumber) {
      fetchReel();
    }
  }, [projectId, reelNumber]);

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
          <div className="text-center text-[#a8a8a8]">Loading...</div>
        </main>
      </div>
    );
  }

  if (error || !project || !reel) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
          <button
            onClick={() => navigate('/client/dashboard')}
            className="mb-6 text-black hover:text-black/70 transition-colors font-medium"
          >
            ← Back to dashboard
          </button>
          <div className="rounded-[24px] border border-black/10 bg-white p-8 text-center text-[#a8a8a8]">
            {error || 'Reel not found'}
          </div>
        </main>
      </div>
    );
  }

  const statusLabels = {
    'Getting Started': 'Getting Started',
    'In Progress': 'In Progress',
    'Revision Phase': 'Revision Phase',
    'Successfully Delivered': 'Successfully Delivered',
  };

  const statusColors = {
    'Getting Started': '#808080',
    'In Progress': '#7ba3d0',
    'Revision Phase': '#f4b860',
    'Successfully Delivered': '#7fb987',
  };

  const statusDescriptions = {
    ready_for_review: 'This reel is ready for your review. Please provide your feedback to help us refine it.',
    revision: 'We\'re waiting for your feedback on this reel before we can proceed with the next phase.',
    in_progress: 'Our team is currently working on this reel. Check back soon for updates.',
    delivered: 'This reel has been completed and delivered to you.',
    not_started: 'Work on this reel hasn\'t started yet.',
  };

  return (
    <div className="min-h-screen bg-black">
      <Navbar />

      <main className="mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 max-w-7xl">
        {/* Back Button */}
        <button
          onClick={() => navigate('/client/dashboard')}
          className="mb-8 text-white hover:text-[#ccc] transition-colors font-medium"
        >
          ← Back to dashboard
        </button>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Side - Reel Details */}
          <div className="lg:col-span-1">
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-3xl font-semibold text-white mb-2">
                    Reel #{reel.reelNumber}
                  </h1>
                  {reel.name && (
                    <p className="text-[#bdbdbd] text-sm mb-2">
                      {reel.name}
                    </p>
                  )}
                  <p className="text-lg text-[#a8a8a8]">
                    {project.projectName}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <span
                  className="shrink-0 rounded-full px-4 py-2 text-sm font-medium text-white"
                  style={{ backgroundColor: statusColors[reel.status] || '#646464' }}
                >
                  {statusLabels[reel.status] || 'Unknown'}
                </span>
              </div>

              <p className="text-sm text-[#888]">
                {statusDescriptions[reel.status] || 'Reel status'}
              </p>
            </div>

            {/* Details Card */}
            <div className="rounded-lg border border-white/10 bg-[#131313] p-6 space-y-6">
              {/* Status Section */}
              <div className="pb-6 border-b border-white/10">
                <p className="text-xs uppercase tracking-widest text-[#888] mb-3">
                  Current Status
                </p>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-white font-medium text-sm">Status</p>
                    <span
                      className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium text-white"
                      style={{ backgroundColor: statusColors[reel.status] || '#646464' }}
                    >
                      {statusLabels[reel.status] || 'Unknown'}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-4 pt-3 border-t border-white/5">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-white font-medium text-sm">Progress</p>
                      <p className="text-sm font-semibold text-white">{getReelProgress(reel.status)}%</p>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-[#0a0a0a]">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${getReelProgress(reel.status)}%`,
                          backgroundColor: statusColors[reel.status] || '#646464',
                        }}
                      />
                    </div>
                  </div>
                  {reel.note && (
                    <div className="flex flex-col gap-1">
                      <p className="text-white font-medium text-sm">Notes</p>
                      <p className="text-[#a8a8a8] text-sm">{reel.note}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Progress Section */}
              {(reel.status === 'in_progress' || reel.status === 'ready_for_review') && (
                <div className="pb-6 border-b border-white/10">
                  <p className="text-xs uppercase tracking-widest text-[#888] mb-3">
                    Progress
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-white font-medium text-sm">Completion</p>
                      <p className="text-[#a8a8a8] text-sm">{getReelProgress(reel.status)}%</p>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-[#0a0a0a]">
                      <div
                        className="h-full rounded-full bg-white"
                        style={{ width: `${getReelProgress(reel.status)}%` }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Reel Details */}
              <div>
                <p className="text-xs uppercase tracking-widest text-[#888] mb-3">
                  Details
                </p>
                <div className="space-y-3">
                  <div className="flex flex-col gap-1">
                    <p className="text-white font-medium text-sm">Project</p>
                    <p className="text-[#a8a8a8] text-sm">{project.projectName}</p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-white font-medium text-sm">Type</p>
                    <p className="text-[#a8a8a8] text-sm">{project.projectType}</p>
                  </div>
                  {project.deadline && (
                    <div className="flex flex-col gap-1">
                      <p className="text-white font-medium text-sm">Deadline</p>
                      <p className="text-[#a8a8a8] text-sm">
                        {new Date(project.deadline).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  )}

                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Chat */}
          <div className="lg:col-span-2 h-[600px] lg:h-auto lg:min-h-[700px]">
            <ReelChat projectId={projectId} reelNumber={reelNumber} clientData={clientData} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default ClientReelDetail;
