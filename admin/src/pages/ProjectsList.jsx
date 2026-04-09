import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ProjectTable from '../components/ProjectTable';
import { FormInput, FormSelect, Button } from '../components/UIComponents';

export default function ProjectsList() {
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Fetch projects from API on mount
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        console.log('📍 Fetching projects from:', `${backendUrl}/api/project/admin/all`);
        const response = await axios.get(`${backendUrl}/api/project/admin/all`);
        console.log('✅ Projects fetched:', response.data);
        
        if (response.data.success) {
          setProjects(response.data.projects || []);
        } else if (Array.isArray(response.data)) {
          setProjects(response.data);
        }
      } catch (error) {
        console.error('❌ Failed to fetch projects:', error);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [backendUrl]);

  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      const matchesSearch = 
        project.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.clientName.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = !statusFilter || project.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [projects, searchTerm, statusFilter]);

  const handleEdit = (id) => {
    navigate(`/projects/${id}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        console.log('🗑 Deleting project:', id);
        const response = await axios.delete(`${backendUrl}/api/project/admin/${id}`);
        console.log('✅ Project deleted:', response.data);
        
        // Remove from local state
        setProjects(projects.filter(p => (p._id || p.id) !== id));
        alert('Project deleted successfully');
      } catch (error) {
        console.error('❌ Failed to delete project:', error);
        alert('Failed to delete project: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  const statuses = [
    'Not Started',
    'Getting Started',
    'In Progress',
    'Revision Phase',
    'Successfully Delivered',
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-light text-white mb-2">Projects</h1>
          <p className="text-gray-400">Manage all client projects</p>
        </div>
        <Button 
          variant="primary" 
          size="lg"
          onClick={() => navigate('/projects/new')}
        >
          + New Project
        </Button>
      </div>

      {/* Filters */}
      <div className="border border-gray-700 rounded-lg p-6 mb-8" style={{ backgroundColor: '#131313' }}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormInput
            label="Search Projects"
            placeholder="Search by project name or client..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FormSelect
            label="Filter by Status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { label: 'All Statuses', value: '' },
              ...statuses.map(s => ({ label: s, value: s }))
            ]}
          />
          <div className="flex items-end">
            <Button
              variant="ghost"
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('');
              }}
              className="w-full"
            >
              Clear Filters
            </Button>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <p className="text-gray-400 text-sm mb-6">
        {loading ? 'Loading projects...' : `Showing ${filteredProjects.length} of ${projects.length} projects`}
      </p>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <p className="text-gray-400">Loading projects...</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && projects.length === 0 && (
        <div className="text-center py-12 border border-gray-700 rounded-lg" style={{ backgroundColor: '#131313' }}>
          <p className="text-gray-400 mb-4">No projects yet</p>
          <Button 
            variant="primary" 
            onClick={() => navigate('/projects/new')}
          >
            Create First Project
          </Button>
        </div>
      )}

      {/* Projects Table */}
      {!loading && projects.length > 0 && (
        <ProjectTable 
          projects={filteredProjects}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
