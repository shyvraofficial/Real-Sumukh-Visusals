import React, { useContext } from 'react';
import ClientDashboard from './ClientDashboard';

/**
 * ClientDashboardContainer
 * Bridge component that connects frontend ClientDashboard to admin's ProjectContext
 * Use this in your app routing instead of ClientDashboard directly
 */
const ClientDashboardContainer = ({ clientData, onLogout = () => {} }) => {
  // Try to import and use ProjectContext from admin
  // If ProjectContext is shared between admin and frontend:
  let projects = [];
  
  try {
    // Attempt to use ProjectContext if it's available
    const ProjectContext = require('../../../admin/src/context/ProjectContext').ProjectContext;
    const context = useContext(ProjectContext);
    if (context && context.projects) {
      projects = context.projects;
    }
  } catch (error) {
    // ProjectContext not available, use mock data or prop
  }

  // Fallback: use projects from props or mock data
  if (!projects || projects.length === 0) {
    // Try to use localStorage or sessionStorage if projects were stored
    const storedProjects = sessionStorage.getItem('projects');
    if (storedProjects) {
      try {
        projects = JSON.parse(storedProjects);
      } catch (e) {
        projects = [];
      }
    }
  }

  return (
    <ClientDashboard
      projects={projects}
      clientData={clientData || {
        name: 'Client',
        avatar: 'https://via.placeholder.com/40',
      }}
      onLogout={onLogout}
    />
  );
};

export default ClientDashboardContainer;
