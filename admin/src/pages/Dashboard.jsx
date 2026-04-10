import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [deleting, setDeleting] = useState(null);
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

  // Fetch projects from API on mount
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/project/admin/all`);
        
        let projectsData = [];
        if (response.data.success) {
          projectsData = response.data.projects || [];
        } else if (Array.isArray(response.data)) {
          projectsData = response.data;
        }
        
        setProjects(projectsData);
      } catch (error) {
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [backendUrl]);

  // Calculate metrics
  const totalClients = new Set(projects.map(p => p.clientName)).size;
  const totalProjects = projects.length;
  const activeProjects = projects.filter(p => 
    p.status === 'In Progress' || p.status === 'Revision Phase' || p.status === 'Getting Started' || 
    p.status === 'active' || p.status === 'Active' || p.status === 'in_progress' || p.status === 'revision'
  ).length;
  const revisionProjects = projects.filter(p => 
    p.status === 'Revision Phase' || p.status === 'revision' || p.status === 'Revision'
  ).length;
  const deliveredProjects = projects.filter(p => 
    p.status === 'Successfully Delivered' || p.status === 'delivered' || p.status === 'Delivered'
  ).length;
  const notStartedProjects = projects.filter(p => 
    p.status === 'Not Started' || p.status === 'not_started' || p.status === 'Not started'
  ).length;

  const totalRevenue = projects.reduce((sum, p) => sum + (p.paidAmount || 0), 0);
  const pendingPayment = projects.reduce((sum, p) => sum + (p.remainingAmount || 0), 0);

  // Status color mapping
  const statusColors = {
    'Not Started': { bg: '#505050', text: 'text-gray-300', light: '#505050' },
    'Getting Started': { bg: '#808080', text: 'text-gray-300', light: '#808080' },
    'In Progress': { bg: '#7ba3d0', text: 'text-white', light: '#7ba3d0' },
    'Revision Phase': { bg: '#f4b860', text: 'text-gray-900', light: '#f4b860' },
    'Successfully Delivered': { bg: '#7fb987', text: 'text-white', light: '#7fb987' }
  };

  // Filter projects by status
  const filteredProjects = filterStatus === 'all' 
    ? projects.slice(0, 10)
    : projects.filter(p => p.status === filterStatus).slice(0, 10);

  // Delete project handler
  const handleDeleteProject = async (projectId, projectName, e) => {
    e.stopPropagation();
    if (!window.confirm(`Are you sure you want to delete "${projectName}"? This action cannot be undone.`)) {
      return;
    }
    try {
      setDeleting(projectId);
      const response = await axios.delete(`${backendUrl}/api/project/admin/${projectId}`);
      // Backend returns { message: 'Project deleted' }
      if (response.status === 200) {
        setProjects(projects.filter(p => (p._id || p.id) !== projectId));
        alert('Project deleted successfully');
      }
    } catch (error) {
      alert('Failed to delete project: ' + (error.response?.data?.message || error.message));
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto">

        {/* Header Section */}
        <div className="mb-8 sm:mb-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2" style={{ fontFamily: 'Plus Jakarta Sans' }}>
                Dashboard
              </h1>
              <p className="text-xs sm:text-sm md:text-base text-gray-400 tracking-wide" style={{ fontFamily: 'Outfit' }}>
                Welcome back! Here's what's happening with your projects.
              </p>
            </div>
            <Link 
              to="/projects/new" 
              className="w-full sm:w-auto px-3 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold text-xs sm:text-sm transition-all duration-300 whitespace-nowrap"
              style={{
                backgroundColor: '#7ba3d0',
                color: '#000000',
                fontFamily: 'Plus Jakarta Sans'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#6a95c0'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#7ba3d0'}
            >
              + New Project
            </Link>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-8 sm:mb-12">
          {/* Total Clients Card */}
          <div className="rounded-lg sm:rounded-xl p-4 sm:p-6 border border-white/10 bg-gradient-to-br from-gray-900/50 to-black/50 hover:border-white/20 transition-all">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-gray-400 text-xs sm:text-sm tracking-wide mb-2" style={{ fontFamily: 'Outfit' }}>
                  TOTAL CLIENTS
                </p>
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold" style={{ fontFamily: 'Plus Jakarta Sans' }}>
                  {totalClients}
                </h3>
              </div>
            </div>
            <p className="text-xs text-gray-500 tracking-wider" style={{ fontFamily: 'Outfit' }}>
              Active Clients
            </p>
          </div>

          {/* Active Projects Card */}
          <div className="rounded-lg sm:rounded-xl p-4 sm:p-6 border border-white/10 bg-gradient-to-br from-gray-900/50 to-black/50 hover:border-white/20 transition-all">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-gray-400 text-xs sm:text-sm tracking-wide mb-2" style={{ fontFamily: 'Outfit' }}>
                  ACTIVE PROJECTS
                </p>
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold" style={{ fontFamily: 'Plus Jakarta Sans' }}>
                  {activeProjects}
                </h3>
              </div>
            </div>
            <p className="text-xs text-gray-500 tracking-wider" style={{ fontFamily: 'Outfit' }}>
              In progress or revision
            </p>
          </div>

          {/* Revision Phase Card */}
          <div className="rounded-lg sm:rounded-xl p-4 sm:p-6 border border-white/10 bg-gradient-to-br from-gray-900/50 to-black/50 hover:border-white/20 transition-all">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-gray-400 text-xs sm:text-sm tracking-wide mb-2" style={{ fontFamily: 'Outfit' }}>
                  AWAITING FEEDBACK
                </p>
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold" style={{ fontFamily: 'Plus Jakarta Sans' }}>
                  {revisionProjects}
                </h3>
              </div>
            </div>
            <p className="text-xs text-gray-500 tracking-wider" style={{ fontFamily: 'Outfit' }}>
              In revision phase
            </p>
          </div>

          {/* Delivered Card */}
          <div className="rounded-lg sm:rounded-xl p-4 sm:p-6 border border-white/10 bg-gradient-to-br from-gray-900/50 to-black/50 hover:border-white/20 transition-all">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-gray-400 text-xs sm:text-sm tracking-wide mb-2" style={{ fontFamily: 'Outfit' }}>
                  DELIVERED
                </p>
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold" style={{ fontFamily: 'Plus Jakarta Sans' }}>
                  {deliveredProjects}
                </h3>
              </div>
            </div>
            <p className="text-xs text-gray-500 tracking-wider" style={{ fontFamily: 'Outfit' }}>
              Completed projects
            </p>
          </div>
        </div>

        {/* Financial Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-8 sm:mb-12">
          {/* Total Revenue */}
          <div className="rounded-lg sm:rounded-xl p-4 sm:p-6 border border-white/10 bg-gradient-to-br from-gray-900/50 to-black/50">
            <p className="text-gray-400 text-xs sm:text-sm tracking-wide mb-3" style={{ fontFamily: 'Outfit' }}>
              TOTAL REVENUE
            </p>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2" style={{ fontFamily: 'Plus Jakarta Sans' }}>
              ₹{totalRevenue.toLocaleString('en-IN')}
            </h2>
            <p className="text-xs text-gray-500" style={{ fontFamily: 'Outfit' }}>
              From {totalProjects} projects
            </p>
          </div>

          {/* Pending Payment */}
          <div className="rounded-lg sm:rounded-xl p-4 sm:p-6 border border-white/10 bg-gradient-to-br from-gray-900/50 to-black/50">
            <p className="text-gray-400 text-xs sm:text-sm tracking-wide mb-3" style={{ fontFamily: 'Outfit' }}>
              PENDING PAYMENT
            </p>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 text-amber-400" style={{ fontFamily: 'Plus Jakarta Sans' }}>
              ₹{pendingPayment.toLocaleString('en-IN')}
            </h2>
            <p className="text-xs text-gray-500" style={{ fontFamily: 'Outfit' }}>
              Waiting for client
            </p>
          </div>

          {/* Payment Progress */}
          <div className="rounded-lg sm:rounded-xl p-4 sm:p-6 border border-white/10 bg-gradient-to-br from-gray-900/50 to-black/50">
            <p className="text-gray-400 text-xs sm:text-sm tracking-wide mb-4" style={{ fontFamily: 'Outfit' }}>
              COLLECTION RATE
            </p>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xl sm:text-2xl font-bold" style={{ fontFamily: 'Plus Jakarta Sans' }}>
                  {totalRevenue + pendingPayment > 0 
                    ? Math.round((totalRevenue / (totalRevenue + pendingPayment)) * 100)
                    : 0}%
                </span>
              </div>
              <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-emerald-500"
                  style={{ 
                    width: `${totalRevenue + pendingPayment > 0 
                      ? (totalRevenue / (totalRevenue + pendingPayment)) * 100
                      : 0}%`
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Project Status Overview */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3 mb-8 sm:mb-12">
          {[
            { label: 'Not Started', count: notStartedProjects, status: 'Not Started' },
            { label: 'Getting Started', count: projects.filter(p => p.status === 'Getting Started').length, status: 'Getting Started' },
            { label: 'In Progress', count: projects.filter(p => p.status === 'In Progress').length, status: 'In Progress' },
            { label: 'Revision', count: revisionProjects, status: 'Revision Phase' },
            { label: 'Delivered', count: deliveredProjects, status: 'Successfully Delivered' }
          ].map((item) => (
            <button
              key={item.status}
              onClick={() => setFilterStatus(item.status)}
              className={`p-2 sm:p-3 rounded-lg transition-all border text-xs sm:text-sm ${
                filterStatus === item.status
                  ? 'border-white/30 bg-white/10'
                  : 'border-white/10 bg-gray-900/20 hover:border-white/20'
              }`}
            >
              <div className="text-lg sm:text-xl md:text-2xl font-bold" style={{ color: statusColors[item.status].light }}>
                {item.count}
              </div>
              <p className="text-xs text-gray-400 mt-1 line-clamp-2" style={{ fontFamily: 'Outfit' }}>
                {item.label}
              </p>
            </button>
          ))}
        </div>

        {/* Projects Section */}
        <div className="rounded-lg sm:rounded-xl border border-white/10 bg-gradient-to-br from-gray-900/50 to-black/50 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 sm:mb-6">
            <div>
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold tracking-wide" style={{ fontFamily: 'Plus Jakarta Sans' }}>
                {filterStatus === 'all' ? 'Recent Projects' : `${filterStatus} Projects`}
              </h2>
              <p className="text-gray-400 text-xs sm:text-sm mt-1" style={{ fontFamily: 'Outfit' }}>
                Showing {filteredProjects.length} of {projects.filter(p => filterStatus === 'all' || p.status === filterStatus).length} projects
              </p>
            </div>
            <Link 
              to="/projects" 
              className="text-xs sm:text-sm text-gray-400 hover:text-white transition-colors whitespace-nowrap"
              style={{ fontFamily: 'Outfit' }}
            >
              View all →
            </Link>
          </div>

          {filteredProjects.length === 0 ? (
            <p className="text-gray-400 text-center py-8 text-sm" style={{ fontFamily: 'Outfit' }}>
              No projects found
            </p>
          ) : (
            <div className="space-y-3">
              {filteredProjects.map((project) => {
                const deliveredReels = project.reels ? project.reels.filter(r => r.status === 'Successfully Delivered').length : 0;
                const totalReels = project.totalReels || 0;
                const paymentStatus = project.totalAmount ? `₹${(project.paidAmount || 0).toLocaleString('en-IN')}` : '—';
                const colors = statusColors[project.status] || statusColors['Not Started'];
                const progressPercent = totalReels > 0 ? (deliveredReels / totalReels) * 100 : 0;
                const projectId = project._id || project.id;
                
                return (
                  <div
                    key={project.id}
                    className="group relative p-3 sm:p-4 rounded-lg border border-white/10 bg-gray-900/30 hover:border-white/20 hover:bg-gray-900/50 transition-all"
                  >
                    <Link
                      to={`/projects/${projectId}`}
                      className="block cursor-pointer"
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
                          {new Date(project.deadline).toLocaleDateString('en-IN', { 
                            month: 'short', 
                            day: 'numeric'
                          })}
                        </p>
                        <p className="font-medium" style={{ fontFamily: 'Outfit' }}>
                          {paymentStatus}
                        </p>
                      </div>
                    </div>

                    {/* Desktop Layout */}
                    <div className="hidden md:grid grid-cols-12 gap-4 items-center">
                      {/* Project Name */}
                      <div className="col-span-3">
                        <h3 className="text-white font-semibold truncate" style={{ fontFamily: 'Plus Jakarta Sans' }}>
                          {project.projectName}
                        </h3>
                        <p className="text-gray-400 text-xs mt-1" style={{ fontFamily: 'Outfit' }}>
                          {project.clientName}
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
                      <div className="col-span-2">
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
                      <div className="col-span-2">
                        <p className="text-sm text-gray-300" style={{ fontFamily: 'Outfit' }}>
                          {new Date(project.deadline).toLocaleDateString('en-IN', { 
                            month: 'short', 
                            day: 'numeric'
                          })}
                        </p>
                      </div>

                      {/* Payment */}
                      <div className="col-span-2">
                        <p className="text-sm text-gray-300 font-medium" style={{ fontFamily: 'Outfit' }}>
                          {paymentStatus}
                        </p>
                      </div>

                      {/* Arrow Indicator + Delete */}
                      <div className="col-span-1 text-right flex items-center justify-end gap-3">
                        <button
                          onClick={(e) => handleDeleteProject(projectId, project.projectName, e)}
                          disabled={deleting === projectId}
                          className="p-1.5 rounded-lg hover:bg-gray-700 text-gray-400 hover:text-red-400 transition-all"
                          title="Delete project"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                        <span className="text-gray-500 text-lg">→</span>
                      </div>
                    </div>
                    </Link>
                    {/* Mobile Delete Button */}
                    <button
                      onClick={(e) => handleDeleteProject(projectId, project.projectName, e)}
                      disabled={deleting === projectId}
                      className="md:hidden w-full mt-3 px-3 py-1.5 rounded-lg text-xs font-medium text-red-500 border border-red-500/30 hover:bg-red-500/10 transition-colors"
                    >
                      {deleting === projectId ? 'Deleting...' : 'Delete Project'}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
