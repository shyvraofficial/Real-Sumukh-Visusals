import React, { useContext, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ProjectContext } from '../context/ProjectContext';
import { ReelManagement } from '../components/ReelManagement';
import { Card, Button, FormInput, FormTextarea } from '../components/UIComponents';
import { calculateProjectMetrics, hasReelsStructure } from '../utils/projectMetrics';

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProject, updateProject } = useContext(ProjectContext);
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

  const contextProject = getProject(id);
  const [project, setProject] = useState(contextProject || null);
  const [loading, setLoading] = useState(!contextProject);
  const [metrics, setMetrics] = useState(null);
  const [isEditingMetadata, setIsEditingMetadata] = useState(false);
  const [isEditingBilling, setIsEditingBilling] = useState(false);
  const [editData, setEditData] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [reelsToAdd, setReelsToAdd] = useState(1);
  const [saveStatus, setSaveStatus] = useState(null); // 'success', 'error', null
  const [isReelsCollapsed, setIsReelsCollapsed] = useState(true); // Default collapsed

  // Fetch project from API if not in context
  useEffect(() => {
    if (!contextProject) {
      const fetchProject = async () => {
        try {
          const response = await axios.get(`${backendUrl}/api/project/admin/${id}`);
          setProject(response.data);
        } catch (error) {
          // Error fetching project
        } finally {
          setLoading(false);
        }
      };

      fetchProject();
    } else {
      setProject(contextProject);
      setLoading(false);
    }
  }, [id, contextProject, backendUrl]);

  useEffect(() => {
    if (project) {
      const hasReels = hasReelsStructure(project);
      if (hasReels) {
        const calculatedMetrics = calculateProjectMetrics(project);
        setMetrics(calculatedMetrics);
      }
      setEditData({
        clientName: project.clientName,
        projectName: project.projectName,
        deliveryTime: project.deliveryTime || '',
        notes: project.notes || '',
        totalAmount: project.totalAmount || 0,
        paidAmount: project.paidAmount || 0,
      });
    }
  }, [project]);

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center">
          <p className="text-gray-400 mb-4">Loading project...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="p-8">
        <div className="text-center">
          <p className="text-gray-400 mb-4">Project not found</p>
          <Button onClick={() => navigate('/projects')} variant="primary">
            Back to Projects
          </Button>
        </div>
      </div>
    );
  }

  const handleRuelUpdate = async (projectId, reelNumber, updates) => {
    try {
      setSaveStatus(null);
      setIsSaving(true);
      
      // Use id from route params (guaranteed to be correct)
      const actualProjectId = id || projectId;
      
      if (!actualProjectId) {
        throw new Error('Project ID not found');
      }
      
      // Update the reel in the current project
      const updatedProject = {
        ...project,
        reels: project.reels.map(r =>
          r.reelNumber === reelNumber
            ? {
                ...r,
                ...updates,
                updatedAt: new Date().toISOString(),
              }
            : r
        ),
      };
      
      // Save to backend
      const response = await axios.put(
        `${backendUrl}/api/project/admin/${actualProjectId}`,
        updatedProject
      );
      
      // Update both context and local state
      setProject(updatedProject);
      updateProject(actualProjectId, updatedProject);
      setMetrics(calculateProjectMetrics(updatedProject));
      setSaveStatus('success');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (error) {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(null), 5000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveMetadata = async () => {
    setIsSaving(true);
    setSaveStatus(null);
    try {
      const updatedProject = {
        ...project,
        ...editData,
      };
      
      // Save to backend
      const response = await axios.put(
        `${backendUrl}/api/project/admin/${id}`,
        updatedProject
      );
      
      // Update both context and local state
      setProject(updatedProject);
      updateProject(id, updatedProject);
      setIsEditingMetadata(false);
      setSaveStatus('success');
      
      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (error) {
      setSaveStatus('error');
      
      // Scroll to top to show error
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      setTimeout(() => setSaveStatus(null), 5000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveBilling = async () => {
    setIsSaving(true);
    setSaveStatus(null);
    try {
      const totalAmount = parseInt(editData?.totalAmount || 0);
      const paidAmount = parseInt(editData?.paidAmount || 0);
      const remainingAmount = totalAmount - paidAmount;
      
      const updatedProject = {
        ...project,
        totalAmount,
        paidAmount,
        remainingAmount: remainingAmount,
      };
      
      // Save to backend
      const response = await axios.put(
        `${backendUrl}/api/project/admin/${id}`,
        updatedProject
      );
      
      // Update both context and local state
      setProject(updatedProject);
      updateProject(id, updatedProject);
      setIsEditingBilling(false);
      setSaveStatus('success');
      
      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (error) {
      setSaveStatus('error');
      
      // Scroll to top to show error
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      setTimeout(() => setSaveStatus(null), 5000);
    } finally {
      setIsSaving(false);
    }
  };

  const hasReels = hasReelsStructure(project);

  return (
    <div className="p-8">
      {/* Save Status Notification */}
      {saveStatus && (
        <div className={`mb-6 p-4 rounded-lg text-center ${
          saveStatus === 'success' 
            ? 'bg-green-900/30 text-green-300 border border-green-700'
            : 'bg-red-900/30 text-red-300 border border-red-700'
        }`}>
          {saveStatus === 'success' ? '✅ Changes saved successfully!' : '❌ Failed to save changes. Please try again.'}
        </div>
      )}

      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-light text-white mb-2">{project.projectName}</h1>
          <p className="text-gray-400">
            {project.clientName} • {project.projectType || 'Project'} • Created {new Date(project.createdAt || new Date()).toLocaleDateString()}
          </p>
        </div>
        <Button
          variant="secondary"
          onClick={() => navigate('/projects')}
        >
          ← Back to Projects
        </Button>
      </div>

      {/* Metrics Summary */}
      {hasReels && metrics && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
            <Card className="p-4">
              <p className="text-gray-400 text-xs uppercase tracking-wide mb-2" style={{ color: '#505050' }}>Not Started</p>
              <p className="text-2xl font-light text-white">{metrics.notStartedReels}</p>
              <p className="text-gray-500 text-xs mt-1">waiting to begin</p>
            </Card>
            <Card className="p-4">
              <p className="text-gray-400 text-xs uppercase tracking-wide mb-2" style={{ color: '#808080' }}>Getting Started</p>
              <p className="text-2xl font-light text-white">{metrics.gettingStartedReels}</p>
              <p className="text-gray-500 text-xs mt-1">setup in progress</p>
            </Card>
            <Card className="p-4">
              <p className="text-gray-400 text-xs uppercase tracking-wide mb-2" style={{ color: '#7ba3d0' }}>In Progress</p>
              <p className="text-2xl font-light text-white">{metrics.inProgressReels}</p>
              <p className="text-gray-500 text-xs mt-1">being edited</p>
            </Card>
            <Card className="p-4">
              <p className="text-gray-400 text-xs uppercase tracking-wide mb-2" style={{ color: '#f4b860' }}>Revision Phase</p>
              <p className="text-2xl font-light text-white">{metrics.revisionPhaseReels}</p>
              <p className="text-gray-500 text-xs mt-1">feedback received</p>
            </Card>
            <Card className="p-4">
              <p className="text-gray-400 text-xs uppercase tracking-wide mb-2" style={{ color: '#7fb987' }}>Delivered</p>
              <p className="text-2xl font-light text-white">{metrics.deliveredReels}</p>
              <p className="text-gray-500 text-xs mt-1">of {project.totalReels} reels</p>
            </Card>
          </div>

          {/* Progress Bar */}
          <Card className="p-4 mb-8">
            <div className="flex items-center justify-between mb-3">
              <p className="text-gray-400 text-xs uppercase tracking-wide">Overall Progress</p>
              <p className="text-2xl font-light text-white">{metrics.progress}%</p>
            </div>
            <div className="w-full bg-gray-600 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-emerald-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${metrics.progress}%` }}
              />
            </div>
          </Card>
        </>
      )}

      {/* Project Details Section */}
      <Card className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-light text-white">Project Details</h2>
          <Button
            variant={isEditingMetadata ? 'ghost' : 'secondary'}
            size="sm"
            onClick={() => setIsEditingMetadata(!isEditingMetadata)}
          >
            {isEditingMetadata ? '✕ Cancel' : '✎ Edit'}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {isEditingMetadata ? (
            <>
              <FormInput
                label="Client Name"
                name="clientName"
                value={editData?.clientName || ''}
                onChange={handleInputChange}
              />
              <FormInput
                label="Project Name"
                name="projectName"
                value={editData?.projectName || ''}
                onChange={handleInputChange}
              />
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Client Email</label>
                <p className="text-gray-400 text-sm bg-gray-700 rounded px-3 py-2">{project.clientEmail || 'N/A'}</p>
              </div>
              <FormInput
                label="Delivery Time"
                name="deliveryTime"
                placeholder="e.g., 3-5 business days per reel"
                value={editData?.deliveryTime || ''}
                onChange={handleInputChange}
              />
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Project Type</label>
                <p className="text-gray-400 text-sm bg-gray-700 rounded px-3 py-2">{project.projectType || 'N/A'}</p>
              </div>
            </>
          ) : (
            <>
              <div>
                <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Client Name</p>
                <p className="text-gray-300">{project.clientName}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Project Name</p>
                <p className="text-gray-300">{project.projectName}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Client Email</p>
                <p className="text-gray-300">{project.clientEmail || 'N/A'}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Delivery Time</p>
                <p className="text-gray-300">{project.deliveryTime || 'Not specified'}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Project Type</p>
                <p className="text-gray-300">{project.projectType || 'N/A'}</p>
              </div>
            </>
          )}
        </div>

        {isEditingMetadata && (
          <>
            <FormTextarea
              label="Project Notes"
              name="notes"
              placeholder="Internal notes about the project..."
              value={editData?.notes || ''}
              onChange={handleInputChange}
              rows={4}
              className="mt-6"
            />
            <div className="flex gap-3 mt-6">
              <Button
                variant="primary"
                onClick={handleSaveMetadata}
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button
                variant="secondary"
                onClick={() => setIsEditingMetadata(false)}
              >
                Cancel
              </Button>
            </div>
          </>
        )}
      </Card>

      {/* Billing Information Section */}
      <Card className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-light text-white">Billing Information</h2>
          <Button
            variant={isEditingBilling ? 'ghost' : 'secondary'}
            size="sm"
            onClick={() => setIsEditingBilling(!isEditingBilling)}
          >
            {isEditingBilling ? '✕ Cancel' : '✎ Edit'}
          </Button>
        </div>

        {!isEditingBilling ? (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div>
              <p className="text-gray-400 text-xs uppercase tracking-wide mb-2">Total Amount</p>
              <p className="text-2xl font-light text-white">₹{(project.totalAmount || 0).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs uppercase tracking-wide mb-2">Paid Amount</p>
              <p className="text-2xl font-light text-white">₹{(project.paidAmount || 0).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs uppercase tracking-wide mb-2">Remaining Amount</p>
              <p className="text-2xl font-light text-white">₹{((project.totalAmount || 0) - (project.paidAmount || 0)).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs uppercase tracking-wide mb-2">Payment Status</p>
              {project.totalAmount > 0 ? (
                <div>
                  <p className="text-lg font-light text-white">
                    {project.paidAmount >= project.totalAmount ? '100%' : Math.round((project.paidAmount / project.totalAmount) * 100)}%
                  </p>
                  <div className="mt-2 w-full bg-gray-600 rounded-full h-1.5">
                    <div
                      className="bg-white h-1.5 rounded-full transition-all duration-300"
                      style={{ width: `${project.paidAmount >= project.totalAmount ? 100 : Math.round((project.paidAmount / project.totalAmount) * 100)}%` }}
                    />
                  </div>
                </div>
              ) : (
                <p className="text-gray-400 text-sm">No amount set</p>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <FormInput
                label="Total Project Amount (₹)"
                name="totalAmount"
                type="number"
                min="0"
                value={editData?.totalAmount}
                onChange={handleInputChange}
              />
              <FormInput
                label="Paid Amount (₹)"
                name="paidAmount"
                type="number"
                min="0"
                value={editData?.paidAmount}
                onChange={handleInputChange}
              />
            </div>

            <div className="p-3 bg-gray-700 rounded-lg">
              {(() => {
                const total = parseInt(editData?.totalAmount || 0);
                const paid = parseInt(editData?.paidAmount || 0);
                const remaining = total - paid;
                const percentage = total > 0 ? Math.round((paid / total) * 100) : 0;
                return (
                  <>
                    <p className="text-gray-300 text-sm mb-2">
                      Remaining Amount: <span className="text-white font-medium">₹{remaining.toLocaleString()}</span>
                    </p>
                    <p className="text-gray-400 text-xs">
                      Payment Status: <span className="text-white">{percentage}%</span>
                    </p>
                    <div className="mt-2 w-full bg-gray-600 rounded-full h-1.5">
                      <div
                        className="bg-white h-1.5 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </>
                );
              })()}
            </div>

            <div className="flex gap-3">
              <Button
                variant="primary"
                onClick={handleSaveBilling}
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button
                variant="secondary"
                onClick={() => setIsEditingBilling(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Add More Reels Section - FRESH IMPLEMENTATION */}
      {hasReels && (
        <Card className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-light text-white">Add More Reels</h2>
            <button
              onClick={() => setIsReelsCollapsed(!isReelsCollapsed)}
              className="text-gray-400 hover:text-white transition-colors text-2xl leading-none"
            >
              {isReelsCollapsed ? '▶' : '▼'}
            </button>
          </div>
          
          <p className="text-gray-400 text-sm mb-6">
            Currently have <span className="text-white font-medium">{project.totalReels || project.reels?.length || 0}</span> reel{((project.totalReels || project.reels?.length || 0) !== 1) ? 's' : ''} total.
          </p>

          {!isReelsCollapsed && (
            <div className="space-y-4">
              <FormInput
                label="Number of Reels to Add"
                type="number"
                min="1"
                max="50"
                value={reelsToAdd}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === '' || val === '0') {
                    setReelsToAdd('');
                  } else {
                    setReelsToAdd(Math.max(1, parseInt(val) || 1));
                  }
                }}
                onBlur={() => {
                  if (reelsToAdd === '' || reelsToAdd < 1) {
                    setReelsToAdd(1);
                  }
                }}
              />
              
              <div className="p-3 bg-gray-700 rounded-lg">
                <p className="text-gray-300 text-sm">
                  This will create <span className="text-white font-medium">{reelsToAdd}</span> new reel{reelsToAdd !== 1 ? 's' : ''} with status "Getting Started"
                </p>
                <p className="text-gray-400 text-xs mt-2">
                  Total after: <span className="text-white">{(project.totalReels || project.reels?.length || 0) + reelsToAdd}</span>
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="primary"
                  onClick={async () => {
                    if (reelsToAdd <= 0) {
                      alert('Please enter a valid number');
                      return;
                    }

                    setIsSaving(true);
                    setSaveStatus(null);

                    try {
                      const currentReelCount = project.reels?.length || 0;
                      const newReels = Array.from({ length: reelsToAdd }, (_, i) => ({
                        reelNumber: currentReelCount + i + 1,
                        status: 'Not Started',
                        note: '',
                        link: null,
                        name: '',
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                      }));

                      const updatedProject = {
                        ...project,
                        totalReels: currentReelCount + reelsToAdd,
                        reels: [...(project.reels || []), ...newReels],
                        updatedAt: new Date().toISOString(),
                      };

                      const response = await axios.put(
                        `${backendUrl}/api/project/admin/${id}`,
                        updatedProject,
                        { headers: { 'Content-Type': 'application/json' } }
                      );

                      // Update local state
                      setProject(response.data);
                      updateProject(id, response.data);
                      setMetrics(calculateProjectMetrics(response.data));
                      setReelsToAdd(1);
                      setSaveStatus('success');

                      setTimeout(() => setSaveStatus(null), 3000);
                    } catch (error) {
                      setSaveStatus('error');
                      setTimeout(() => setSaveStatus(null), 5000);
                    } finally {
                      setIsSaving(false);
                    }
                  }}
                  disabled={isSaving || reelsToAdd <= 0}
                >
                  {isSaving ? 'Adding...' : `Add ${reelsToAdd} Reel${reelsToAdd !== 1 ? 's' : ''}`}
                </Button>
              </div>
            </div>
          )}
        </Card>
      )}

      {/* Reel Management Section */}
      {hasReels ? (
        <Card>
          <h2 className="text-xl font-light text-white mb-6">Manage Reels</h2>
          <p className="text-gray-400 text-sm mb-6">
            Update individual reel statuses and add notes below.
          </p>
          <ReelManagement 
            project={project} 
            onUpdateReel={handleRuelUpdate}
          />
        </Card>
      ) : (
        <Card>
          <p className="text-gray-400">This project does not have the reel-based structure yet.</p>
        </Card>
      )}
    </div>
  );
}
