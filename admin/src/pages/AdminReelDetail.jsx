import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminReelChat from '../components/AdminReelChat';
import axios from 'axios';

export default function AdminReelDetail() {
  const navigate = useNavigate();
  const { id, reelNumber } = useParams(); // Changed from projectId to id
  const projectId = id; // Use id as projectId
  const [project, setProject] = useState(null);
  const [reel, setReel] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Edit states (these change as user types, but don't affect display until save)
  const [reelName, setReelName] = useState('');
  const [reelStatus, setReelStatus] = useState('');
  const [reelNote, setReelNote] = useState('');
  
  // Saved states (these only update after successful save)
  const [savedReelStatus, setSavedReelStatus] = useState('');
  
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null); // 'success', 'error', null
  
  // Try multiple possible backend URLs
  const possibleUrls = [
    import.meta.env.VITE_BACKEND_URL,
    'http://localhost:4000',
    'http://127.0.0.1:4000',
    'http://localhost:5000',
  ].filter(Boolean);
  
  const [backendUrl, setBackendUrl] = useState(possibleUrls[0] || 'http://localhost:4000');

  const statuses = ['Not Started', 'Getting Started', 'In Progress', 'Revision Phase', 'Successfully Delivered'];

  useEffect(() => {
    const fetchProject = async () => {
      try {
        if (!projectId || !reelNumber) {
          setError(`Invalid URL parameters: projectId=${projectId}, reelNumber=${reelNumber}`);
          setIsLoading(false);
          return;
        }

        const url = `${backendUrl}/api/project/admin/${projectId}`;
        
        setIsLoading(true);
        
        // Create axios instance with timeout
        const axiosInstance = axios.create({
          timeout: 5000 // 5 second timeout
        });
        
        const response = await axiosInstance.get(url);
        
        const projectData = response.data;
        setProject(projectData);

        // Find the reel
        const foundReel = projectData.reels?.find(r => r.reelNumber === parseInt(reelNumber));
        
        if (foundReel) {
          setReel(foundReel);
          setReelName(foundReel.name || '');
          setReelStatus(foundReel.status || 'not_started');
          setSavedReelStatus(foundReel.status || 'not_started');
          setReelNote(foundReel.note || '');
          setError(null);
        } else {
          const availableReels = projectData.reels?.map(r => r.reelNumber).join(', ') || 'none';
          setError(`Reel #${reelNumber} not found. Available reels: ${availableReels}`);
        }
      } catch (err) {
        
        let errorMsg = err.message;
        if (err.code === 'ECONNABORTED') {
          errorMsg = 'Request timeout (5s) - Backend might not be running';
        } else if (err.code === 'ECONNREFUSED') {
          errorMsg = `Connection refused to ${backendUrl} - Backend not running`;
        } else if (err.response?.status === 404) {
          errorMsg = 'Project not found (404)';
        }
        
        setError(`Failed to load reel: ${errorMsg}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProject();
  }, [projectId, reelNumber, backendUrl]);

  const handleSave = async () => {
    if (!project) return;

    setIsSaving(true);
    setSaveStatus(null);
    try {
      const updatedReel = {
        ...reel,
        name: reelName,
        status: reelStatus,
        note: reelNote,
      };

      // Update via API
      await axios.put(`${backendUrl}/api/project/admin/${projectId}`, {
        reels: project.reels.map(r => 
          r.reelNumber === parseInt(reelNumber) ? updatedReel : r
        ),
      });

      setReel(updatedReel);
      setSavedReelStatus(reelStatus);
      setSaveStatus('success');
      
      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      // Clear success message after 4 seconds
      setTimeout(() => setSaveStatus(null), 4000);
    } catch (err) {
      setSaveStatus('error');
      
      // Scroll to top to show error
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      // Clear error message after 5 seconds
      setTimeout(() => setSaveStatus(null), 5000);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen p-8" style={{ backgroundColor: '#131313' }}>
        <div className="text-center text-gray-400">
          <p>Loading reel details...</p>
          <p className="text-sm mt-2 text-gray-500">Project ID: {projectId}</p>
          <p className="text-sm text-gray-500">Reel Number: {reelNumber}</p>
        </div>
      </div>
    );
  }

  if (error || !project || !reel) {
    return (
      <div className="min-h-screen p-8" style={{ backgroundColor: '#131313' }}>
        <button
          onClick={() => navigate(-1)}
          className="mb-6 text-white hover:text-gray-300"
        >
          ← Back
        </button>
        <div className="rounded-lg border-2 border-red-600 bg-red-900/20 p-8 text-left">
          <h3 className="text-red-400 font-bold text-lg mb-4">Error Loading Reel</h3>
          <p className="text-red-300 mb-4">{error || 'Reel not found'}</p>
          
          {error && (
            <div className="bg-black/50 p-4 rounded mt-4 border border-red-700">
              <p className="font-mono text-xs text-gray-300">{error}</p>
              <p className="font-mono text-xs text-gray-500 mt-2">Project ID: {projectId}</p>
              <p className="font-mono text-xs text-gray-500">Reel #: {reelNumber}</p>
            </div>
          )}
          
          <p className="text-gray-400 text-sm mt-4">
            Check your browser console for detailed error logs.
          </p>
        </div>
      </div>
    );
  }

  const statusColors = {
    'Not Started': '#505050',
    'Getting Started': '#808080',
    'In Progress': '#7ba3d0',
    'Revision Phase': '#f4b860',
    'Successfully Delivered': '#7fb987',
  };

  const statusLabels = {
    'Not Started': 'Not Started',
    'Getting Started': 'Getting Started',
    'In Progress': 'In Progress',
    'Revision Phase': 'Revision Phase',
    'Successfully Delivered': 'Successfully Delivered',
  };

  const getReelProgress = (status) => {
    const progressMap = {
      'Not Started': 0,
      'Getting Started': 15,
      'In Progress': 50,
      'Revision Phase': 75,
      'Successfully Delivered': 100,
    };
    return progressMap[status] || 0;
  };

  return (
    <div className="min-h-screen p-8" style={{ backgroundColor: '#131313' }}>
      <div className="max-w-7xl mx-auto">
        {/* Save Status Notification */}
        {saveStatus && (
          <div className={`mb-6 p-4 rounded-lg text-center font-semibold transition-all ${
            saveStatus === 'success' 
              ? 'bg-green-900/30 text-green-300 border border-green-700'
              : 'bg-red-900/30 text-red-300 border border-red-700'
          }`}>
            {saveStatus === 'success' 
              ? 'Changes saved successfully!' 
              : 'Failed to save changes. Please try again.'}
          </div>
        )}

        {/* Header */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <button
              onClick={() => navigate(-1)}
              className="mb-4 text-white hover:text-gray-300 font-medium"
            >
              ← Back to Project
            </button>
            <h1 className="text-4xl font-bold text-white mb-2">
              Reel #{reelNumber}
            </h1>
            <p className="text-gray-400">{project.projectName}</p>
          </div>
          <div className="flex items-center gap-3">
            {reelStatus !== savedReelStatus && (
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-yellow-900/30 text-yellow-300 border border-yellow-700">
                Unsaved changes
              </span>
            )}
            <span
              className="px-4 py-2 rounded-full text-white font-medium"
              style={{ backgroundColor: statusColors[savedReelStatus] }}
            >
              {statusLabels[savedReelStatus]}
            </span>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Side - Reel Details */}
          <div className="lg:col-span-1">
            <div className="rounded-lg border border-gray-700 bg-black p-6">
              <h2 className="text-xl font-semibold text-white mb-6">Reel Details</h2>

              {/* Reel Name */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-white mb-2">
                  Reel Name
                </label>
                <input
                  type="text"
                  value={reelName}
                  onChange={(e) => setReelName(e.target.value)}
                  placeholder="e.g., Intro Sequence"
                  className="w-full px-4 py-2 rounded-lg bg-gray-900 text-white border border-gray-700 focus:border-white focus:outline-none"
                />
              </div>

              {/* Status */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-white mb-2">
                  Status
                </label>
                <select
                  value={reelStatus}
                  onChange={(e) => setReelStatus(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-gray-900 text-white border border-gray-700 focus:border-white focus:outline-none"
                >
                  {statuses.map(status => (
                    <option key={status} value={status}>
                      {statusLabels[status]}
                    </option>
                  ))}
                </select>

                {/* Progress Bar */}
                <div className="mt-4 pt-3 border-t border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-white">Progress</p>
                    <p className="text-sm font-semibold text-white">{getReelProgress(reelStatus)}%</p>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-gray-800">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${getReelProgress(reelStatus)}%`,
                        backgroundColor: statusColors[reelStatus] || '#646464',
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-white mb-2">
                  Work Notes
                </label>
                <textarea
                  value={reelNote}
                  onChange={(e) => setReelNote(e.target.value)}
                  placeholder="Add notes about this reel's progress..."
                  className="w-full px-4 py-2 rounded-lg bg-gray-900 text-white border border-gray-700 focus:border-white focus:outline-none resize-none"
                  rows="4"
                />
              </div>



              {/* Timestamps */}
              <div className="mb-6 pb-6 border-b border-gray-700">
                <p className="text-xs text-gray-500 mb-1">
                  Created: {new Date(reel.createdAt).toLocaleDateString('en-IN')}
                </p>
                <p className="text-xs text-gray-500">
                  Updated: {new Date(reel.updatedAt).toLocaleDateString('en-IN')}
                </p>
              </div>

              {/* Save Button */}
              <button
                onClick={handleSave}
                disabled={isSaving}
                className={`w-full px-4 py-3 rounded-lg font-semibold transition-all duration-200 ${
                  isSaving 
                    ? 'bg-gray-600 text-gray-300 cursor-not-allowed' 
                    : 'bg-white text-black hover:bg-gray-100 active:bg-gray-200'
                }`}
              >
                {isSaving ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="inline-block w-4 h-4 border-2 border-gray-300 border-t-white rounded-full animate-spin"></span>
                    Saving...
                  </span>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          </div>

          {/* Right Side - Chat */}
          <div className="lg:col-span-2 h-[700px]">
            <AdminReelChat projectId={projectId} reelNumber={parseInt(reelNumber)} adminName="Sumukh" />
          </div>
        </div>
      </div>
    </div>
  );
}
