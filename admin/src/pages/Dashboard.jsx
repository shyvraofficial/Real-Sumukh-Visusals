import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

  // Fetch projects from API on mount
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        console.log('📍 Fetching dashboard projects from:', `${backendUrl}/api/project/admin/all`);
        const response = await axios.get(`${backendUrl}/api/project/admin/all`);
        console.log('✅ Dashboard projects fetched:', response.data);
        
        let projectsData = [];
        if (response.data.success) {
          projectsData = response.data.projects || [];
        } else if (Array.isArray(response.data)) {
          projectsData = response.data;
        }
        
        console.log('📊 Projects loaded:', projectsData.length);
        console.log('🔍 Sample statuses:', projectsData.slice(0, 3).map(p => ({ name: p.projectName, status: p.status })));
        
        setProjects(projectsData);
      } catch (error) {
        console.error('❌ Failed to fetch dashboard projects:', error);
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

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="p-8 max-w-7xl mx-auto">

        {/* Header Section */}
        <div className="mb-12">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-5xl font-bold mb-2" style={{ fontFamily: 'Plus Jakarta Sans' }}>
                Dashboard
              </h1>
              <p className="text-gray-400 text-lg tracking-wide" style={{ fontFamily: 'Outfit' }}>
                Welcome back! Here's what's happening with your projects.
              </p>
            </div>
            <Link 
              to="/add" 
              className="px-6 py-3 rounded-lg font-semibold transition-all duration-300 mt-2"
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Total Clients Card */}
          <div className="rounded-xl p-6 border border-white/10 bg-gradient-to-br from-gray-900/50 to-black/50 hover:border-white/20 transition-all">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-gray-400 text-sm tracking-wide mb-2" style={{ fontFamily: 'Outfit' }}>
                  TOTAL CLIENTS
                </p>
                <h3 className="text-4xl font-bold" style={{ fontFamily: 'Plus Jakarta Sans' }}>
                  {totalClients}
                </h3>
              </div>
            </div>
            <p className="text-xs text-gray-500 tracking-wider" style={{ fontFamily: 'Outfit' }}>
              Active Clients
            </p>
          </div>

          {/* Active Projects Card */}
          <div className="rounded-xl p-6 border border-white/10 bg-gradient-to-br from-gray-900/50 to-black/50 hover:border-white/20 transition-all">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-gray-400 text-sm tracking-wide mb-2" style={{ fontFamily: 'Outfit' }}>
                  ACTIVE PROJECTS
                </p>
                <h3 className="text-4xl font-bold" style={{ fontFamily: 'Plus Jakarta Sans' }}>
                  {activeProjects}
                </h3>
              </div>
            </div>
            <p className="text-xs text-gray-500 tracking-wider" style={{ fontFamily: 'Outfit' }}>
              In progress or revision
            </p>
          </div>

          {/* Revision Phase Card */}
          <div className="rounded-xl p-6 border border-white/10 bg-gradient-to-br from-gray-900/50 to-black/50 hover:border-white/20 transition-all">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-gray-400 text-sm tracking-wide mb-2" style={{ fontFamily: 'Outfit' }}>
                  AWAITING FEEDBACK
                </p>
                <h3 className="text-4xl font-bold" style={{ fontFamily: 'Plus Jakarta Sans' }}>
                  {revisionProjects}
                </h3>
              </div>
            </div>
            <p className="text-xs text-gray-500 tracking-wider" style={{ fontFamily: 'Outfit' }}>
              In revision phase
            </p>
          </div>

          {/* Delivered Card */}
          <div className="rounded-xl p-6 border border-white/10 bg-gradient-to-br from-gray-900/50 to-black/50 hover:border-white/20 transition-all">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-gray-400 text-sm tracking-wide mb-2" style={{ fontFamily: 'Outfit' }}>
                  DELIVERED
                </p>
                <h3 className="text-4xl font-bold" style={{ fontFamily: 'Plus Jakarta Sans' }}>
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          {/* Total Revenue */}
          <div className="rounded-xl p-6 border border-white/10 bg-gradient-to-br from-gray-900/50 to-black/50">
            <p className="text-gray-400 text-sm tracking-wide mb-3" style={{ fontFamily: 'Outfit' }}>
              TOTAL REVENUE
            </p>
            <h2 className="text-3xl font-bold mb-2" style={{ fontFamily: 'Plus Jakarta Sans' }}>
              ₹{totalRevenue.toLocaleString('en-IN')}
            </h2>
            <p className="text-xs text-gray-500" style={{ fontFamily: 'Outfit' }}>
              From {totalProjects} projects
            </p>
          </div>

          {/* Pending Payment */}
          <div className="rounded-xl p-6 border border-white/10 bg-gradient-to-br from-gray-900/50 to-black/50">
            <p className="text-gray-400 text-sm tracking-wide mb-3" style={{ fontFamily: 'Outfit' }}>
              PENDING PAYMENT
            </p>
            <h2 className="text-3xl font-bold mb-2 text-amber-400" style={{ fontFamily: 'Plus Jakarta Sans' }}>
              ₹{pendingPayment.toLocaleString('en-IN')}
            </h2>
            <p className="text-xs text-gray-500" style={{ fontFamily: 'Outfit' }}>
              Waiting for client
            </p>
          </div>

          {/* Payment Progress */}
          <div className="rounded-xl p-6 border border-white/10 bg-gradient-to-br from-gray-900/50 to-black/50">
            <p className="text-gray-400 text-sm tracking-wide mb-4" style={{ fontFamily: 'Outfit' }}>
              COLLECTION RATE
            </p>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-2xl font-bold" style={{ fontFamily: 'Plus Jakarta Sans' }}>
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
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-12">
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
              className={`p-3 rounded-lg transition-all border ${
                filterStatus === item.status
                  ? 'border-white/30 bg-white/10'
                  : 'border-white/10 bg-gray-900/20 hover:border-white/20'
              }`}
            >
              <div className="text-2xl font-bold" style={{ color: statusColors[item.status].light }}>
                {item.count}
              </div>
              <p className="text-xs text-gray-400 mt-1" style={{ fontFamily: 'Outfit' }}>
                {item.label}
              </p>
            </button>
          ))}
        </div>

        {/* Projects Section */}
        <div className="rounded-xl border border-white/10 bg-gradient-to-br from-gray-900/50 to-black/50 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold tracking-wide" style={{ fontFamily: 'Plus Jakarta Sans' }}>
                {filterStatus === 'all' ? 'Recent Projects' : `${filterStatus} Projects`}
              </h2>
              <p className="text-gray-400 text-sm mt-1" style={{ fontFamily: 'Outfit' }}>
                Showing {filteredProjects.length} of {projects.filter(p => filterStatus === 'all' || p.status === filterStatus).length} projects
              </p>
            </div>
            <Link 
              to="/projects" 
              className="text-sm text-gray-400 hover:text-white transition-colors"
              style={{ fontFamily: 'Outfit' }}
            >
              View all →
            </Link>
          </div>

          {filteredProjects.length === 0 ? (
            <p className="text-gray-400 text-center py-8" style={{ fontFamily: 'Outfit' }}>
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
                
                return (
                  <Link
                    key={project.id}
                    to={`/projects/${project._id || project.id}`}
                    className="block p-4 rounded-lg border border-white/10 bg-gray-900/30 hover:border-white/20 hover:bg-gray-900/50 transition-all cursor-pointer"
                  >
                    <div className="grid grid-cols-12 gap-4 items-center">
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

                      {/* Arrow Indicator */}
                      <div className="col-span-1 text-right">
                        <span className="text-gray-500 text-lg">→</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
