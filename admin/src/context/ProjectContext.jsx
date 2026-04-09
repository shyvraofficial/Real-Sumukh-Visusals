import React, { createContext, useState, useCallback } from 'react';

export const ProjectContext = createContext();

const mockProjects = [
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
    notes: 'Client prefers vibrant visuals and upbeat pacing. Use trending music.',
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
    notes: 'Keep intro under 10 seconds. Include company logo and brand colors.',
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
    notes: 'Detail-oriented. Multiple rounds of revisions expected. Premium color grading required.',
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

export function ProjectProvider({ children }) {
  const [projects, setProjects] = useState(mockProjects);

  const addProject = useCallback((projectData) => {
    const newProject = {
      id: Date.now().toString(),
      ...projectData,
    };
    setProjects([...projects, newProject]);
    return newProject;
  }, [projects]);

  const updateProject = useCallback((id, projectData) => {
    setProjects(projects.map(p => p.id === id ? { ...p, ...projectData } : p));
  }, [projects]);

  const deleteProject = useCallback((id) => {
    setProjects(projects.filter(p => p.id !== id));
  }, [projects]);

  const getProject = useCallback((id) => {
    return projects.find(p => p.id === id);
  }, [projects]);

  const value = {
    projects,
    addProject,
    updateProject,
    deleteProject,
    getProject,
  };

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
}
