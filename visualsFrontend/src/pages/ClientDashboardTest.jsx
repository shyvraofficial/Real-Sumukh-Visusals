import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ClientNavbar from '../components/ClientNavbar';

/**
 * Client Dashboard - TEST VERSION WITH SAMPLE DATA
 * Use this to see the dashboard populated with real project data
 */
const ClientDashboardTest = ({
  clientData = {
    name: 'Alex Studios',
    avatar: 'https://via.placeholder.com/40',
  },
  onLogout = () => {},
}) => {
  const navigate = useNavigate();

  // ===== SAMPLE DATA (Replace with real data from admin) =====
  const sampleProjects = [
    {
      id: '1',
      clientName: 'Alex Studios',
      projectName: 'Summer Campaign Reel',
      projectType: 'Reel',
      packageType: 'Advance',
      deadline: '2026-04-15',
      totalReels: 5,
      totalAmount: 50000,
      paidAmount: 25000,
      remainingAmount: 25000,
      deliveryTime: '3-5 business days per reel',
      notes: 'Client prefers vibrant visuals and upbeat pacing.',
      reels: [
        { reelNumber: 1, status: 'delivered', note: 'Approved and downloaded', link: 'https://drive.google.com/file/d/1example', createdAt: '2026-04-01T10:00:00Z', updatedAt: '2026-04-05T14:30:00Z' },
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
      clientName: 'Luna Creative',
      projectName: 'YouTube Series Intro',
      projectType: 'YouTube',
      packageType: 'Basic',
      deadline: '2026-04-20',
      totalReels: 1,
      totalAmount: 15000,
      paidAmount: 15000,
      remainingAmount: 0,
      deliveryTime: '2 business days',
      notes: 'Keep intro under 10 seconds. Include company logo.',
      reels: [
        { reelNumber: 1, status: 'Successfully Delivered', note: 'Final version approved and downloaded', link: 'https://drive.google.com/file/d/ytintro', createdAt: '2026-04-02T10:00:00Z', updatedAt: '2026-04-06T11:30:00Z' },
      ],
      createdAt: '2026-04-02T00:00:00Z',
      updatedAt: '2026-04-06T11:30:00Z',
    },
    {
      id: '3',
      clientName: 'Tech Startup',
      projectName: 'Product Launch Campaign',
      projectType: 'Reel',
      packageType: 'Premium',
      deadline: '2026-05-15',
      totalReels: 10,
      totalAmount: 100000,
      paidAmount: 0,
      remainingAmount: 100000,
      deliveryTime: '5-7 business days per reel',
      notes: 'Detail-oriented. Multiple rounds of revisions expected.',
      reels: Array.from({ length: 10 }, (_, i) => ({
        reelNumber: i + 1,
        status: 'Getting Started',
        note: null,
        link: null,
        createdAt: '2026-04-05T00:00:00Z',
        updatedAt: '2026-04-05T00:00:00Z',
      })),
      createdAt: '2026-04-05T00:00:00Z',
      updatedAt: '2026-04-05T00:00:00Z',
    },
  ];

  const [allProjects] = useState(sampleProjects);

  // Calculate reel metrics
  const calculateMetrics = (project) => {
    if (!project.reels || project.reels.length === 0) {
      return { delivered: 0, inProgress: 0, readyForReview: 0, revision: 0, progress: 0, pending: [] };
    }

    const delivered = project.reels.filter(r => r.status === 'delivered').length;
    const inProgress = project.reels.filter(r => r.status === 'in_progress').length;
    const readyForReview = project.reels.filter(r => r.status === 'ready_for_review').length;
    const revision = project.reels.filter(r => r.status === 'revision').length;
    const progress = Math.round((delivered / project.totalReels) * 100);

    const pending = [];
    if (readyForReview > 0) pending.push(`${readyForReview} reel${readyForReview > 1 ? 's' : ''} ready for review`);
    if (revision > 0) pending.push(`${revision} reel${revision > 1 ? 's' : ''} needs revision feedback`);

    return { delivered, inProgress, readyForReview, revision, progress, pending };
  };

  // Get all pending actions across projects
  const allPendingActions = allProjects
    .flatMap(project => {
      return project.reels
        .filter(reel => reel.status === 'ready_for_review' || reel.status === 'revision')
        .map(reel => ({
          projectId: project.id,
          projectName: project.projectName,
          reelNumber: reel.reelNumber,
          status: reel.status,
          note: reel.note,
        }));
    });

  const totalReelsDelivered = allProjects.reduce((sum, p) => sum + calculateMetrics(p).delivered, 0);
  const totalReelsCount = allProjects.reduce((sum, p) => sum + p.totalReels, 0);
  const totalOutstanding = allProjects.reduce((sum, p) => sum + (p.remainingAmount || 0), 0);

  return (
    <div style={{ backgroundColor: '#000000' }} className="min-h-screen">
      <ClientNavbar clientName={clientData.name} clientAvatar={clientData.avatar} onLogout={onLogout} />

      <main className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        
        {/* Welcome Section */}
        <section className="mb-16">
          <h1 className="text-4xl font-bold mb-2" style={{ color: '#ffffff' }}>Welcome back</h1>
          <p style={{ color: '#f3f3f3' }}>
            {allProjects.length === 0
              ? 'No projects at the moment.'
              : allPendingActions.length === 0
              ? `${allProjects.length} project${allProjects.length > 1 ? 's' : ''} in progress — all on track.`
              : `${allProjects.length} project${allProjects.length > 1 ? 's' : ''} in progress — ${allPendingActions.length} reel${allPendingActions.length > 1 ? 's' : ''} need your attention.`
            }
          </p>
        </section>

        {/* Stats Cards */}
        <section className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { label: 'Active Projects', value: allProjects.length },
              { label: 'Waiting for Action', value: allPendingActions.length },
              { label: 'Reels Delivered', value: `${totalReelsDelivered}/${totalReelsCount}` },
              { label: 'Outstanding', value: `₹${totalOutstanding.toLocaleString('en-IN')}` },
            ].map((card, idx) => (
              <div
                key={idx}
                className="p-5 rounded-lg border"
                style={{ backgroundColor: '#131313', borderColor: '#f3f3f3', borderWidth: '1px' }}
              >
                <p className="text-xs font-medium mb-2" style={{ color: '#f3f3f3' }}>
                  {card.label}
                </p>
                <p className="text-2xl font-bold" style={{ color: '#ffffff' }}>
                  {card.value}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Pending Actions */}
        {allPendingActions.length > 0 && (
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-6" style={{ color: '#ffffff' }}>Waiting for Your Action</h2>
            <div className="space-y-3">
              {allPendingActions.map((action, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-lg border flex items-center justify-between"
                  style={{ backgroundColor: '#131313', borderColor: '#f3f3f3', borderWidth: '1px' }}
                >
                  <div>
                    <p style={{ color: '#f3f3f3' }} className="text-sm mb-1">{action.projectName}</p>
                    <p style={{ color: '#ffffff' }} className="font-medium">
                      Reel #{action.reelNumber} {action.status === 'ready_for_review' ? 'is ready for your review' : 'needs your feedback'}
                    </p>
                    {action.note && <p style={{ color: '#f3f3f3' }} className="text-xs mt-1">{action.note}</p>}
                  </div>
                  <button
                    onClick={() => navigate(`/client/project/${action.projectId}`)}
                    className="ml-4 px-4 py-2 rounded-lg font-semibold text-sm whitespace-nowrap transition-all"
                    style={{ backgroundColor: '#f3f3f3', color: '#000000' }}
                    onMouseEnter={(e) => (e.target.style.opacity = '0.8')}
                    onMouseLeave={(e) => (e.target.style.opacity = '1')}
                  >
                    View
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects Grid */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6" style={{ color: '#ffffff' }}>Your Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allProjects.map(project => {
              const metrics = calculateMetrics(project);
              return (
                <div
                  key={project.id}
                  className="p-6 rounded-lg border cursor-pointer transition-all hover:border-white"
                  style={{ backgroundColor: '#131313', borderColor: '#f3f3f3', borderWidth: '1px' }}
                  onClick={() => navigate(`/client/project/${project.id}`)}
                >
                  <h3 style={{ color: '#ffffff' }} className="font-bold text-lg mb-1">
                    {project.projectName}
                  </h3>
                  <p style={{ color: '#f3f3f3' }} className="text-xs mb-4">
                    {project.projectType} • {project.packageType}
                  </p>

                  {/* Metrics */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div>
                      <p style={{ color: '#f3f3f3' }} className="text-xs mb-1">Delivered</p>
                      <p style={{ color: '#ffffff' }} className="font-bold">{metrics.delivered}/{project.totalReels}</p>
                    </div>
                    <div>
                      <p style={{ color: '#f3f3f3' }} className="text-xs mb-1">In Progress</p>
                      <p style={{ color: '#ffffff' }} className="font-bold">{metrics.inProgress}</p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <p style={{ color: '#f3f3f3' }} className="text-xs">Progress</p>
                      <p style={{ color: '#f3f3f3' }} className="text-xs font-medium">{metrics.progress}%</p>
                    </div>
                    <div className="w-full h-2 rounded-full" style={{ backgroundColor: '#0a0a0a' }}>
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${metrics.progress}%`, backgroundColor: '#f3f3f3' }}
                      />
                    </div>
                  </div>

                  {/* Pending Actions */}
                  {metrics.pending.length > 0 && (
                    <div className="p-3 rounded border-l-2" style={{ backgroundColor: '#0a0a0a', borderColor: '#f3f3f3' }}>
                      {metrics.pending.map((action, idx) => (
                        <p key={idx} style={{ color: '#f3f3f3' }} className="text-xs">
                          {action}
                        </p>
                      ))}
                    </div>
                  )}

                  {/* Deadline */}
                  {project.deadline && (
                    <p style={{ color: '#f3f3f3' }} className="text-xs mt-4">
                      Deadline: {new Date(project.deadline).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Billing Section */}
        {allProjects.length > 0 && (
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-6" style={{ color: '#ffffff' }}>Billing Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {allProjects.map(project => {
                const paymentProgress = project.totalAmount ? (project.paidAmount / project.totalAmount) * 100 : 0;
                return (
                  <div key={project.id} className="p-6 rounded-lg border" style={{ backgroundColor: '#131313', borderColor: '#f3f3f3', borderWidth: '1px' }}>
                    <h3 style={{ color: '#ffffff' }} className="font-bold mb-4">{project.projectName}</h3>
                    
                    <div className="grid grid-cols-3 gap-3 mb-5">
                      <div>
                        <p style={{ color: '#f3f3f3' }} className="text-xs mb-1">Total</p>
                        <p style={{ color: '#ffffff' }} className="font-bold">₹{project.totalAmount?.toLocaleString('en-IN')}</p>
                      </div>
                      <div>
                        <p style={{ color: '#f3f3f3' }} className="text-xs mb-1">Paid</p>
                        <p style={{ color: '#ffffff' }} className="font-bold">₹{project.paidAmount?.toLocaleString('en-IN')}</p>
                      </div>
                      <div>
                        <p style={{ color: '#f3f3f3' }} className="text-xs mb-1">Remaining</p>
                        <p style={{ color: '#f3f3f3' }} className="font-bold">₹{project.remainingAmount?.toLocaleString('en-IN')}</p>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <p style={{ color: '#f3f3f3' }} className="text-xs">Payment Progress</p>
                        <p style={{ color: '#f3f3f3' }} className="text-xs font-medium">{Math.round(paymentProgress)}%</p>
                      </div>
                      <div className="w-full h-2 rounded-full" style={{ backgroundColor: '#0a0a0a' }}>
                        <div
                          className="h-full rounded-full transition-all"
                          style={{ width: `${paymentProgress}%`, backgroundColor: '#f3f3f3' }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Support Section */}
        <section>
          <div className="p-10 rounded-lg border text-center" style={{ backgroundColor: '#131313', borderColor: '#f3f3f3', borderWidth: '1px' }}>
            <h3 className="text-xl font-semibold mb-2" style={{ color: '#ffffff' }}>Need Help?</h3>
            <p className="text-sm mb-6" style={{ color: '#f3f3f3' }}>Contact us with any questions.</p>
            <div className="flex justify-center gap-3">
              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2 rounded-lg border font-semibold text-sm transition-all"
                style={{ borderColor: '#f3f3f3', color: '#f3f3f3' }}
                onMouseEnter={(e) => { e.target.style.backgroundColor = '#f3f3f3'; e.target.style.color = '#000000'; }}
                onMouseLeave={(e) => { e.target.style.backgroundColor = 'transparent'; e.target.style.color = '#f3f3f3'; }}
              >
                WhatsApp
              </a>
              <a
                href="mailto:support@sumukhvisuals.com"
                className="px-6 py-2 rounded-lg border font-semibold text-sm transition-all"
                style={{ borderColor: '#f3f3f3', color: '#f3f3f3' }}
                onMouseEnter={(e) => { e.target.style.backgroundColor = '#f3f3f3'; e.target.style.color = '#000000'; }}
                onMouseLeave={(e) => { e.target.style.backgroundColor = 'transparent'; e.target.style.color = '#f3f3f3'; }}
              >
                Email
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ClientDashboardTest;
