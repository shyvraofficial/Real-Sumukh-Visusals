/**
 * DATA INTEGRATION GUIDE
 * 
 * To connect frontend ClientDashboard to admin panel data:
 */

// ============================================================================
// OPTION 1: SHARED PROJECTCONTEXT (RECOMMENDED)
// ============================================================================
// 
// In your main app file, wrap both admin and frontend with same ProjectProvider:
//
// import { ProjectProvider } from './admin/src/context/ProjectContext';
// 
// function App() {
//   return (
//     <ProjectProvider>
//       <BrowserRouter>
//         <Routes>
//           {/* Admin routes */}
//           <Route path="/admin/*" element={<AdminApp />} />
//           
//           {/* Frontend routes */}
//           <Route path="/client/*" element={<FrontendApp />} />
//         </Routes>
//       </BrowserRouter>
//     </ProjectProvider>
//   );
// }

// ============================================================================
// OPTION 2: USE CONTAINER COMPONENT WITH CONTEXT
// ============================================================================
//
// In visualsFrontend/src/pages/ - Create ClientDashboardWithContext.jsx:
//
// import React, { useContext } from 'react';
// import ClientDashboard from './ClientDashboard';
// import { ProjectContext } from '../../admin/src/context/ProjectContext';
//
// export default function ClientDashboardWithContext() {
//   const { projects } = useContext(ProjectContext);
//   
//   return (
//     <ClientDashboard
//       projects={projects}
//       clientData={{ name: 'Client', avatar: 'https://via.placeholder.com/40' }}
//     />
//   );
// }
//
// Then use in routing:
// <Route path="/client/dashboard" element={<ClientDashboardWithContext />} />

// ============================================================================
// OPTION 3: PASS PROJECTS VIA PROPS
// ============================================================================
//
// From parent component:
//
// import { useContext } from 'react';
// import { ProjectContext } from './admin/src/context/ProjectContext';
// import ClientDashboard from './visualsFrontend/src/pages/ClientDashboard';
//
// function ParentComponent() {
//   const { projects } = useContext(ProjectContext);
//   
//   return (
//     <ClientDashboard 
//       projects={projects}
//       clientData={{ name: 'Client', avatar: '...' }}
//     />
//   );
// }

// ============================================================================
// OPTION 4: API INTEGRATION
// ============================================================================
//
// Backend API endpoint:
//
// GET /api/projects
// Returns: [{id, clientName, projectName, ...reels: [...]}]
//
// In ClientDashboard, add useEffect:
//
// useEffect(() => {
//   fetch('/api/projects')
//     .then(res => res.json())
//     .then(data => setAllProjects(data))
//     .catch(err => console.error(err));
// }, []);

// ============================================================================
// QUICK TEST - Add this to see mock data:
// ============================================================================
//
// In ClientDashboard.jsx, import mock projects:
//
// import { mockProjects } from '../data/mockClientData';
// 
// Then replace:
//   projects = [] 
// with:
//   projects = mockProjects
//
// This will show sample data for testing!

export const INTEGRATION_STEPS = [
  '1. Choose integration option above (most recommend Option 1)',
  '2. Set up ProjectContext in your app root',
  '3. Pass projects to ClientDashboard component',
  '4. Dashboard will auto-calculate metrics from reels array',
  '5. Test by visiting /client/dashboard',
];

export const PROJECT_DATA_STRUCTURE = {
  example: {
    id: '1',
    clientName: 'Client Name',
    projectName: 'Project Name',
    projectType: 'Reel',
    packageType: 'Premium',
    deadline: '2026-04-20',
    totalReels: 5,
    totalAmount: 50000,
    paidAmount: 25000,
    remainingAmount: 25000,
    deliveryTime: '3-5 business days',
    notes: 'Project notes',
    reels: [
      { reelNumber: 1, status: 'Successfully Delivered', note: 'Completed', link: 'https://...', createdAt: '2026-04-01T00:00:00Z', updatedAt: '2026-04-05T00:00:00Z' },
      { reelNumber: 2, status: 'In Progress', note: 'Being edited', link: null, createdAt: '2026-04-02T00:00:00Z', updatedAt: '2026-04-08T00:00:00Z' },
      { reelNumber: 3, status: 'Revision Phase', note: 'Draft ready', link: 'https://...', createdAt: '2026-04-03T00:00:00Z', updatedAt: '2026-04-07T00:00:00Z' },
      { reelNumber: 4, status: 'Revision Phase', note: 'Awaiting feedback', link: null, createdAt: '2026-04-04T00:00:00Z', updatedAt: '2026-04-06T00:00:00Z' },
      { reelNumber: 5, status: 'Getting Started', note: null, link: null, createdAt: '2026-04-04T00:00:00Z', updatedAt: '2026-04-04T00:00:00Z' },
    ],
    createdAt: '2026-04-01T00:00:00Z',
    updatedAt: '2026-04-08T00:00:00Z',
  }
};
