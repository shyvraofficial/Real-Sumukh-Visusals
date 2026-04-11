import React, { useContext, useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ProjectContext } from '../context/ProjectContext';
import { 
  FormInput, 
  FormSelect, 
  FormTextarea, 
  Button,
  Card 
} from '../components/UIComponents';

export default function ProjectForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { projects, addProject, updateProject, getProject } = useContext(ProjectContext);

  const isEditMode = !!id;
  
  // For backward compatibility, try context first, then fetch from API
  const existingProject = isEditMode ? getProject(id) : null;

  const [clients, setClients] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState('');
  const [useManualEmail, setUseManualEmail] = useState(false);
  const [manualEmail, setManualEmail] = useState('');
  
  const [formData, setFormData] = useState({
    clientName: '',
    projectName: '',
    projectType: '',
    packageType: '',
    deadline: '',
    totalReels: 0,
    totalAmount: 0,
    paidAmount: 0,
    deliveryTime: '',
    notes: '',
  });

  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [loadingClients, setLoadingClients] = useState(true);
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';
  
  // Track if we've already initialized form data from existingProject
  const hasInitializedRef = useRef(false);

  // Fetch clients on mount
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/client/all`);
        
        // Handle both response formats
        if (res.data.success && res.data.clients) {
          setClients(res.data.clients);
        } else if (Array.isArray(res.data)) {
          setClients(res.data);
        } else if (Array.isArray(res.data.clients)) {
          setClients(res.data.clients);
        }
      } catch (error) {
        setClients([]);
      } finally {
        setLoadingClients(false);
      }
    };

    if (!isEditMode) {
      fetchClients();
    }
  }, [isEditMode, backendUrl]);

  // Fetch project from API if editing and not in context
  useEffect(() => {
    if (isEditMode && !existingProject) {
      const fetchProject = async () => {
        try {
          const response = await axios.get(`${backendUrl}/api/project/admin/${id}`);
          
          if (response.data) {
            // Backend returns the project object directly
            const project = response.data;
            setFormData({
              clientName: project.clientName || '',
              projectName: project.projectName || '',
              projectType: project.projectType || '',
              packageType: project.packageType || '',
              deadline: project.deadline ? project.deadline.split('T')[0] : '',
              totalReels: project.totalReels || 0,
              totalAmount: project.totalAmount || 0,
              paidAmount: project.paidAmount || 0,
              deliveryTime: project.deliveryTime || '',
              notes: project.notes || '',
            });
            setSelectedClientId(project.clientId || '');
          }
        } catch (error) {
        }
      };

      fetchProject();
    }
  }, [isEditMode, id, existingProject, backendUrl]);

  // Load existing project data if editing (from context) - only once on mount
  useEffect(() => {
    if (existingProject && !hasInitializedRef.current) {
      setFormData(existingProject);
      hasInitializedRef.current = true;
    }
  }, []); // Empty dependency array - only run once on mount

  const handleClientSelect = (e) => {
    const clientId = e.target.value;
    setSelectedClientId(clientId);
    
    // Find the selected client and auto-fill the email
    const selectedClient = clients.find(c => c._id === clientId);
    if (selectedClient) {
      setManualEmail(selectedClient.email);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Check that either a client is selected or manual email is provided
    if (!selectedClientId && !manualEmail.trim()) {
      newErrors.client = 'Please select a client or enter their email';
    }
    
    if (!formData.clientName.trim()) newErrors.clientName = 'Client name is required';
    if (!formData.projectName.trim()) newErrors.projectName = 'Project name is required';
    if (!formData.projectType) newErrors.projectType = 'Project type is required';
    if (!formData.deadline) newErrors.deadline = 'Deadline is required';
    
    // Convert to numbers for validation
    const totalReels = Number(formData.totalReels);
    const totalAmount = Number(formData.totalAmount);
    const paidAmount = Number(formData.paidAmount);
    
    if (totalReels <= 0) newErrors.totalReels = 'Must be greater than 0';
    if (totalAmount <= 0) newErrors.totalAmount = 'Must be greater than 0';
    if (paidAmount < 0) newErrors.paidAmount = 'Cannot be negative';
    if (paidAmount > totalAmount) newErrors.paidAmount = 'Cannot exceed total amount';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Helper function to generate empty reels array
  const generateReelsArray = (count) => {
    const reels = [];
    for (let i = 1; i <= count; i++) {
      reels.push({
        reelNumber: i,
        status: 'Getting Started',
        note: null,
        link: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
    return reels;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSaving(true);
    try {
      // Convert string values to numbers for calculations
      const totalReels = Number(formData.totalReels);
      const totalAmount = Number(formData.totalAmount);
      const paidAmount = Number(formData.paidAmount);

      const projectData = {
        ...formData,
        totalReels,
        totalAmount,
        paidAmount,
        remainingAmount: totalAmount - paidAmount,
      };

      // Add client info
      if (manualEmail.trim()) {
        projectData.clientEmail = manualEmail.trim();
      } else if (selectedClientId) {
        // Fallback: find client in list and get email
        const selectedClient = clients.find(c => c._id === selectedClientId);
        if (selectedClient) {
          projectData.clientEmail = selectedClient.email;
        }
      }

      // Call backend API
      if (!isEditMode) {
        const response = await axios.post(`${backendUrl}/api/project/admin/create`, projectData);
        if (response.data.success) {
          addProject(response.data.project);
          navigate('/projects');
        }
      } else {
        const response = await axios.put(`${backendUrl}/api/project/admin/${id}`, projectData);
        if (response.data.success) {
          updateProject(id, response.data.project);
          navigate('/projects');
        }
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || 'Failed to save project';
      setErrors({ submit: errorMsg });
    } finally {
      setIsSaving(false);
    }
  };

  const projectTypes = ['Reel', 'YouTube', 'Ad', 'Montage'];
  const packageTypes = ['Basic', 'Advance', 'Montage', 'Custom'];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-light text-white mb-2">
          {isEditMode ? 'Edit Project' : 'Create New Project'}
        </h1>
        <p className="text-gray-400">
          {isEditMode 
            ? 'Update project details. Use ReelManagement to update individual reel statuses.'
            : 'Add a new client project. Specify the number of reels, and the system will auto-generate them.'}
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Client Selection Section */}
        <Card className="mb-8">
          <h2 className="text-xl font-light text-white mb-6">Select Client</h2>
          
          {/* Toggle between dropdown and manual entry */}
          <div className="mb-6 flex gap-4">
            <button
              type="button"
              onClick={() => {
                setUseManualEmail(false);
                setSelectedClientId('');
              }}
              className={`px-4 py-2 rounded transition ${!useManualEmail ? 'bg-white text-black' : 'bg-gray-700 text-white'}`}
            >
              Select from List
            </button>
            <button
              type="button"
              onClick={() => {
                setUseManualEmail(true);
                setSelectedClientId('');
                setManualEmail('');
              }}
              className={`px-4 py-2 rounded transition ${useManualEmail ? 'bg-white text-black' : 'bg-gray-700 text-white'}`}
            >
              Enter Email
            </button>
          </div>

          {errors.client && <p className="text-red-400 text-sm mb-4">{errors.client}</p>}
          {errors.submit && <p className="text-red-400 text-sm mb-4">{errors.submit}</p>}

          {!useManualEmail ? (
            <div className="mb-6">
              <label className="block text-sm font-light text-white mb-2">Existing Clients</label>
              {loadingClients ? (
                <div className="w-full px-4 py-2 bg-gray-700 text-gray-400 rounded border border-gray-600">
                  Loading clients...
                </div>
              ) : (
                <select
                  value={selectedClientId}
                  onChange={handleClientSelect}
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-white focus:outline-none"
                >
                  <option value="">-- Select a client --</option>
                  {clients.map(client => (
                    <option key={client._id} value={client._id}>
                      {client.name} ({client.email})
                    </option>
                  ))}
                </select>
              )}
              <p className="text-gray-400 text-xs mt-2">
                {loadingClients ? 'Loading...' : clients.length === 0 ? 'No clients found. Clients will appear here after they sign up.' : `${clients.length} client(s) available`}
              </p>
            </div>
          ) : (
            <div className="mb-6">
              <FormInput
                label="Client Email"
                name="manualEmail"
                placeholder="client@example.com"
                value={manualEmail}
                onChange={(e) => setManualEmail(e.target.value)}
              />
              <p className="text-gray-400 text-xs mt-2">
                Client will be created when they first sign up with this email.
              </p>
            </div>
          )}

          {/* Client Name Input */}
          <div className="mt-6">
            <FormInput
              label="Client Name"
              name="clientName"
              placeholder="e.g., Alex Studios"
              value={formData.clientName}
              onChange={handleInputChange}
              required
            />
            {errors.clientName && <p className="text-red-400 text-xs mt-1">{errors.clientName}</p>}
          </div>
        </Card>

        {/* Project Information Section */}
        <Card className="mb-8">
          <h2 className="text-xl font-light text-white mb-6">Project Information</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <FormInput
                label="Project Name"
                name="projectName"
                placeholder="e.g., Summer Campaign Reel"
                value={formData.projectName}
                onChange={handleInputChange}
                required
              />
              {errors.projectName && <p className="text-gray-400 text-xs mt-1">{errors.projectName}</p>}
            </div>
          </div>
        </Card>

        {/* Project Details Section */}
        <Card className="mb-8">
          <h2 className="text-xl font-light text-white mb-6">Project Details</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div>
              <FormSelect
                label="Project Type"
                name="projectType"
                value={formData.projectType}
                onChange={handleInputChange}
                options={projectTypes}
                required
              />
              {errors.projectType && <p className="text-gray-400 text-xs mt-1">{errors.projectType}</p>}
            </div>
            <div>
              <FormSelect
                label="Package Type"
                name="packageType"
                value={formData.packageType}
                onChange={handleInputChange}
                options={packageTypes}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Deadline
                <span className="text-gray-400 ml-1">*</span>
              </label>
              <input
                type="date"
                name="deadline"
                value={formData.deadline}
                onChange={handleInputChange}
                required
                className="w-full border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-gray-600 focus:ring-1 focus:ring-gray-600 transition-colors"
                style={{ 
                  backgroundColor: '#131313',
                  colorScheme: 'dark'
                }}
              />
              {errors.deadline && <p className="text-gray-400 text-xs mt-1">{errors.deadline}</p>}
            </div>
            <div>
              <FormInput
                label="Total Reels in Project"
                name="totalReels"
                type="number"
                min="1"
                value={formData.totalReels}
                onChange={handleNumberChange}
                required
              />
              {errors.totalReels && <p className="text-gray-400 text-xs mt-1">{errors.totalReels}</p>}
            </div>
          </div>

          {formData.totalReels > 0 && (
            <div className="mt-4 p-3 bg-gray-700 rounded-lg">
              <p className="text-gray-300 text-sm">
                {formData.totalReels} individual reel{formData.totalReels !== 1 ? 's' : ''} will be created with status "Not Started"
              </p>
            </div>
          )}
        </Card>

        {/* Payment Information Section */}
        <Card className="mb-8">
          <h2 className="text-xl font-light text-white mb-6">Billing Information</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <FormInput
                label="Total Project Amount (₹)"
                name="totalAmount"
                type="number"
                min="0"
                value={formData.totalAmount}
                onChange={handleNumberChange}
                required
              />
              {errors.totalAmount && <p className="text-gray-400 text-xs mt-1">{errors.totalAmount}</p>}
            </div>
            <div>
              <FormInput
                label="Paid Amount (₹)"
                name="paidAmount"
                type="number"
                min="0"
                value={formData.paidAmount}
                onChange={handleNumberChange}
              />
              {errors.paidAmount && <p className="text-gray-400 text-xs mt-1">{errors.paidAmount}</p>}
            </div>
          </div>
          {formData.totalAmount > 0 && (
            <div className="mt-4 p-3 bg-gray-700 rounded-lg">
              <p className="text-gray-300 text-sm mb-2">
                Total: ₹{formData.totalAmount.toLocaleString()}
              </p>
              <p className="text-gray-300 text-sm mb-2">
                Paid: ₹{formData.paidAmount.toLocaleString()}
              </p>
              <p className="text-gray-300 text-sm">
                Remaining: ₹{(formData.totalAmount - formData.paidAmount).toLocaleString()}
              </p>
              <div className="mt-3 w-full bg-gray-600 rounded-full h-2">
                <div
                  className="bg-white h-2 rounded-full transition-all duration-300"
                  style={{ width: `${formData.paidAmount > 0 ? (formData.paidAmount / formData.totalAmount) * 100 : 0}%` }}
                />
              </div>
              <p className="text-gray-400 text-xs mt-2">
                {formData.totalAmount - formData.paidAmount === 0 ? '100% Paid' : `${Math.round((formData.paidAmount / formData.totalAmount) * 100)}% Paid`}
              </p>
            </div>
          )}
        </Card>

        {/* Delivery Information Section */}
        <Card className="mb-8">
          <h2 className="text-xl font-light text-white mb-6">Delivery Settings</h2>
          
          <FormInput
            label="Delivery Time"
            name="deliveryTime"
            placeholder="e.g., 3-5 business days per reel"
            value={formData.deliveryTime}
            onChange={handleInputChange}
          />

          <FormTextarea
            label="Project Notes"
            name="notes"
            placeholder="Internal project notes - document requirements, special instructions, etc..."
            value={formData.notes}
            onChange={handleInputChange}
            rows={5}
          />

          <div className="mt-4 p-3 bg-gray-700 rounded-lg">
            <p className="text-gray-300 text-sm">
              <span className="font-light">ℹ️ </span>
              Once project is created, use the ReelManagement component to:
            </p>
            <ul className="text-gray-400 text-sm mt-2 list-disc list-inside space-y-1">
              <li>Update individual reel statuses</li>
              <li>Add notes to specific reels</li>
            </ul>
          </div>
        </Card>

        {/* Form Actions */}
        <div className="flex gap-4">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : (isEditMode ? 'Update Project' : 'Create Project')}
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="lg"
            onClick={() => navigate('/projects')}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
