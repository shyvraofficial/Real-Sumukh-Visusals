import React, { useState, useEffect } from 'react';

/**
 * Premium Dark ProjectForm Component
 * Complete form for creating and editing client projects
 * Handles client info, project details, billing, timelines, and delivery
 */
const ProjectForm = ({ 
  initialData = null,
  onSubmit,
  onCancel,
  isLoading = false,
  title = 'Create New Project'
}) => {
  const [formData, setFormData] = useState(
    initialData || {
      clientName: '',
      projectName: '',
      projectType: '',
      packageType: '',
      deadline: '',
      status: 'Planning',
      completedReels: 0,
      totalReels: 1,
      paidAmount: 0,
      remainingAmount: 0,
      totalAmount: 0,
      pendingAction: '',
      deliveryTime: '3-5 business days',
      clientInstructions: '',
      adminNote: '',
      draftLink: '',
      finalDeliveryLink: '',
    }
  );

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [formStep, setFormStep] = useState('client');

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  // Calculate remaining amount when amounts change
  useEffect(() => {
    const remaining = (formData.totalAmount || 0) - (formData.paidAmount || 0);
    setFormData(prev => ({
      ...prev,
      remainingAmount: Math.max(0, remaining)
    }));
  }, [formData.totalAmount, formData.paidAmount]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.clientName.trim()) {
      newErrors.clientName = 'Client name is required';
    }
    if (!formData.projectName.trim()) {
      newErrors.projectName = 'Project name is required';
    }
    if (!formData.projectType) {
      newErrors.projectType = 'Project type is required';
    }
    if (!formData.packageType) {
      newErrors.packageType = 'Package type is required';
    }
    if (!formData.deadline) {
      newErrors.deadline = 'Deadline is required';
    }
    if (formData.totalAmount <= 0) {
      newErrors.totalAmount = 'Total amount must be greater than 0';
    }
    if (formData.paidAmount > formData.totalAmount) {
      newErrors.paidAmount = 'Paid amount cannot exceed total amount';
    }
    if (formData.completedReels > formData.totalReels) {
      newErrors.completedReels = 'Completed reels cannot exceed total reels';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
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
      [name]: value === '' ? 0 : parseInt(value, 10)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);

    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const projectTypes = [
    { value: 'Reel', label: 'Instagram Reel' },
    { value: 'YouTube', label: 'YouTube Video' },
    { value: 'TikTok', label: 'TikTok Video' },
    { value: 'Promo', label: 'Promotional Video' },
    { value: 'Tutorial', label: 'Tutorial/Educational' },
    { value: 'Event', label: 'Event Coverage' },
    { value: 'Commercial', label: 'Commercial/Ad' },
    { value: 'Other', label: 'Other' },
  ];

  const packageTypes = [
    { value: 'Basic', label: 'Basic - Single reel, standard edits' },
    { value: 'Standard', label: 'Standard - Multiple reels, advanced effects' },
    { value: 'Advance', label: 'Advance - Complex project, full customization' },
    { value: 'Premium', label: 'Premium - Unlimited revisions, priority support' },
  ];

  const statusOptions = [
    { value: 'Not Started', label: 'Not Started' },
    { value: 'Getting Started', label: 'Getting Started' },
    { value: 'In Progress', label: 'In Progress' },
    { value: 'Revision Phase', label: 'Revision Phase' },
    { value: 'Successfully Delivered', label: 'Successfully Delivered' },
  ];

  const deliveryTimes = [
    { value: '1-2 business days', label: 'Express - 1-2 business days' },
    { value: '3-5 business days', label: 'Standard - 3-5 business days' },
    { value: '1-2 weeks', label: 'Extended - 1-2 weeks' },
    { value: '2-4 weeks', label: 'Complex - 2-4 weeks' },
  ];

  const progressPercentage = formData.totalAmount 
    ? (formData.paidAmount / formData.totalAmount) * 100 
    : 0;

  const completionPercentage = formData.totalReels 
    ? (formData.completedReels / formData.totalReels) * 100 
    : 0;

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-6xl mx-auto">
      {/* Form Header */}
      <div className="mb-8">
        <h1 className="text-white text-3xl font-bold mb-2">{title}</h1>
        <p className="text-gray-400 text-sm">
          {initialData ? 'Update project information and track progress' : 'Create a new project for your client'}
        </p>
      </div>

      {/* Step Indicator */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        {[
          { id: 'client', label: 'Client Info' },
          { id: 'project', label: 'Project Details' },
          { id: 'billing', label: 'Billing & Progress' },
          { id: 'delivery', label: 'Delivery & Links' },
          { id: 'instructions', label: 'Instructions & Notes' },
        ].map(step => (
          <button
            key={step.id}
            type="button"
            onClick={() => setFormStep(step.id)}
            className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors text-sm font-medium ${
              formStep === step.id
                ? 'bg-gray-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            {step.label}
          </button>
        ))}
      </div>

      {/* Form Sections */}
      <div className="space-y-6">
        {/* ====== CLIENT INFORMATION ====== */}
        {formStep === 'client' && (
          <div
            className="p-8 rounded-lg border border-gray-700"
            style={{ backgroundColor: '#131313' }}
          >
            <h2 className="text-white text-xl font-semibold mb-6 flex items-center gap-2">
              <div className="w-1 h-6 bg-gray-500" />
              Client Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Client Name */}
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Client Name <span className="text-gray-500">*</span>
                </label>
                <input
                  type="text"
                  name="clientName"
                  value={formData.clientName}
                  onChange={handleInputChange}
                  placeholder="e.g., Alex Studios"
                  className="w-full border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-gray-600 focus:ring-1 focus:ring-gray-600 transition-colors"
                  style={{ backgroundColor: '#131313' }}
                />
                {errors.clientName && (
                  <p className="text-red-400 text-xs mt-1">{errors.clientName}</p>
                )}
              </div>

              {/* Project Name */}
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Project Name <span className="text-gray-500">*</span>
                </label>
                <input
                  type="text"
                  name="projectName"
                  value={formData.projectName}
                  onChange={handleInputChange}
                  placeholder="e.g., Summer Campaign Reel"
                  className="w-full border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-gray-600 focus:ring-1 focus:ring-gray-600 transition-colors"
                  style={{ backgroundColor: '#131313' }}
                />
                {errors.projectName && (
                  <p className="text-red-400 text-xs mt-1">{errors.projectName}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ====== PROJECT DETAILS ====== */}
        {formStep === 'project' && (
          <div
            className="p-8 rounded-lg border border-gray-700"
            style={{ backgroundColor: '#131313' }}
          >
            <h2 className="text-white text-xl font-semibold mb-6 flex items-center gap-2">
              <div className="w-1 h-6 bg-gray-500" />
              Project Details
            </h2>

            <div className="space-y-6">
              {/* Project Type & Package Type */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Project Type <span className="text-gray-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      name="projectType"
                      value={formData.projectType}
                      onChange={handleInputChange}
                      className="w-full border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gray-600 focus:ring-1 focus:ring-gray-600 transition-colors appearance-none"
                      style={{
                        backgroundColor: '#131313',
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%238b8b8b' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                        backgroundPosition: 'right 1rem center',
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: '1.5em 1.5em',
                        paddingRight: '2.5rem',
                      }}
                    >
                      <option value="">Select project type...</option>
                      {projectTypes.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors.projectType && (
                    <p className="text-red-400 text-xs mt-1">{errors.projectType}</p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Package Type <span className="text-gray-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      name="packageType"
                      value={formData.packageType}
                      onChange={handleInputChange}
                      className="w-full border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gray-600 focus:ring-1 focus:ring-gray-600 transition-colors appearance-none"
                      style={{
                        backgroundColor: '#131313',
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%238b8b8b' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                        backgroundPosition: 'right 1rem center',
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: '1.5em 1.5em',
                        paddingRight: '2.5rem',
                      }}
                    >
                      <option value="">Select package...</option>
                      {packageTypes.map(pkg => (
                        <option key={pkg.value} value={pkg.value}>
                          {pkg.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors.packageType && (
                    <p className="text-red-400 text-xs mt-1">{errors.packageType}</p>
                  )}
                </div>
              </div>

              {/* Status & Deadline */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Status
                  </label>
                  <div className="relative">
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gray-600 focus:ring-1 focus:ring-gray-600 transition-colors appearance-none"
                      style={{
                        backgroundColor: '#131313',
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%238b8b8b' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                        backgroundPosition: 'right 1rem center',
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: '1.5em 1.5em',
                        paddingRight: '2.5rem',
                      }}
                    >
                      {statusOptions.map(status => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Deadline <span className="text-gray-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleInputChange}
                    className="w-full border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gray-600 focus:ring-1 focus:ring-gray-600 transition-colors"
                    style={{ backgroundColor: '#131313' }}
                  />
                  {errors.deadline && (
                    <p className="text-red-400 text-xs mt-1">{errors.deadline}</p>
                  )}
                </div>
              </div>

              {/* Completed & Total Reels */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Completed Reels
                  </label>
                  <input
                    type="number"
                    name="completedReels"
                    value={formData.completedReels}
                    onChange={handleNumberChange}
                    min="0"
                    className="w-full border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gray-600 focus:ring-1 focus:ring-gray-600 transition-colors"
                    style={{ backgroundColor: '#131313' }}
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Total Reels
                  </label>
                  <input
                    type="number"
                    name="totalReels"
                    value={formData.totalReels}
                    onChange={handleNumberChange}
                    min="1"
                    className="w-full border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gray-600 focus:ring-1 focus:ring-gray-600 transition-colors"
                    style={{ backgroundColor: '#131313' }}
                  />
                  {errors.completedReels && (
                    <p className="text-red-400 text-xs mt-1">{errors.completedReels}</p>
                  )}
                </div>
              </div>

              {/* Progress Bar */}
              {formData.totalReels > 0 && (
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-gray-300 text-sm font-medium">Project Completion</p>
                    <p className="text-gray-400 text-xs">{Math.round(completionPercentage)}%</p>
                  </div>
                  <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gray-500 transition-all duration-300"
                      style={{ width: `${completionPercentage}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ====== BILLING & PROGRESS ====== */}
        {formStep === 'billing' && (
          <div
            className="p-8 rounded-lg border border-gray-700"
            style={{ backgroundColor: '#131313' }}
          >
            <h2 className="text-white text-xl font-semibold mb-6 flex items-center gap-2">
              <div className="w-1 h-6 bg-gray-500" />
              Billing & Payment Progress
            </h2>

            <div className="space-y-6">
              {/* Total Amount */}
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Total Amount (₹) <span className="text-gray-500">*</span>
                </label>
                <input
                  type="number"
                  name="totalAmount"
                  value={formData.totalAmount}
                  onChange={handleNumberChange}
                  min="0"
                  placeholder="Enter total project amount"
                  className="w-full border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-gray-600 focus:ring-1 focus:ring-gray-600 transition-colors"
                  style={{ backgroundColor: '#131313' }}
                />
                {errors.totalAmount && (
                  <p className="text-red-400 text-xs mt-1">{errors.totalAmount}</p>
                )}
              </div>

              {/* Paid Amount */}
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Amount Paid (₹)
                </label>
                <input
                  type="number"
                  name="paidAmount"
                  value={formData.paidAmount}
                  onChange={handleNumberChange}
                  min="0"
                  placeholder="Enter amount paid"
                  className="w-full border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-gray-600 focus:ring-1 focus:ring-gray-600 transition-colors"
                  style={{ backgroundColor: '#131313' }}
                />
                {errors.paidAmount && (
                  <p className="text-red-400 text-xs mt-1">{errors.paidAmount}</p>
                )}
              </div>

              {/* Payment Summary */}
              {formData.totalAmount > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-lg bg-gray-900">
                  <div>
                    <p className="text-gray-400 text-xs mb-1">Total Amount</p>
                    <p className="text-white text-lg font-semibold">₹{formData.totalAmount.toLocaleString('en-IN')}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs mb-1">Paid Amount</p>
                    <p className="text-white text-lg font-semibold">₹{formData.paidAmount.toLocaleString('en-IN')}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs mb-1">Remaining Amount</p>
                    <p className="text-gray-300 text-lg font-semibold">₹{formData.remainingAmount.toLocaleString('en-IN')}</p>
                  </div>
                </div>
              )}

              {/* Payment Progress Bar */}
              {formData.totalAmount > 0 && (
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-gray-300 text-sm font-medium">Payment Progress</p>
                    <p className="text-gray-400 text-xs">{Math.round(progressPercentage)}%</p>
                  </div>
                  <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gray-500 transition-all duration-300"
                      style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ====== DELIVERY & LINKS ====== */}
        {formStep === 'delivery' && (
          <div
            className="p-8 rounded-lg border border-gray-700"
            style={{ backgroundColor: '#131313' }}
          >
            <h2 className="text-white text-xl font-semibold mb-6 flex items-center gap-2">
              <div className="w-1 h-6 bg-gray-500" />
              Delivery Details & Links
            </h2>

            <div className="space-y-6">
              {/* Delivery Time */}
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Expected Delivery Time
                </label>
                <div className="relative">
                  <select
                    name="deliveryTime"
                    value={formData.deliveryTime}
                    onChange={handleInputChange}
                    className="w-full border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gray-600 focus:ring-1 focus:ring-gray-600 transition-colors appearance-none"
                    style={{
                      backgroundColor: '#131313',
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%238b8b8b' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                      backgroundPosition: 'right 1rem center',
                      backgroundRepeat: 'no-repeat',
                      backgroundSize: '1.5em 1.5em',
                      paddingRight: '2.5rem',
                    }}
                  >
                    {deliveryTimes.map(time => (
                      <option key={time.value} value={time.value}>
                        {time.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Draft Link */}
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Draft/Working Link
                </label>
                <input
                  type="url"
                  name="draftLink"
                  value={formData.draftLink}
                  onChange={handleInputChange}
                  placeholder="https://drive.google.com/... or https://dropbox.com/..."
                  className="w-full border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-gray-600 focus:ring-1 focus:ring-gray-600 transition-colors"
                  style={{ backgroundColor: '#131313' }}
                />
                <p className="text-gray-500 text-xs mt-1">Link to working files or draft versions</p>
              </div>

              {/* Final Delivery Link */}
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Final Delivery Link
                </label>
                <input
                  type="url"
                  name="finalDeliveryLink"
                  value={formData.finalDeliveryLink}
                  onChange={handleInputChange}
                  placeholder="https://drive.google.com/... or https://dropbox.com/..."
                  className="w-full border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-gray-600 focus:ring-1 focus:ring-gray-600 transition-colors"
                  style={{ backgroundColor: '#131313' }}
                />
                <p className="text-gray-500 text-xs mt-1">Link to final, approved deliverables</p>
              </div>
            </div>
          </div>
        )}

        {/* ====== INSTRUCTIONS & NOTES ====== */}
        {formStep === 'instructions' && (
          <div
            className="p-8 rounded-lg border border-gray-700"
            style={{ backgroundColor: '#131313' }}
          >
            <h2 className="text-white text-xl font-semibold mb-6 flex items-center gap-2">
              <div className="w-1 h-6 bg-gray-500" />
              Instructions & Notes
            </h2>

            <div className="space-y-6">
              {/* Client Instructions */}
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Client Instructions
                </label>
                <textarea
                  name="clientInstructions"
                  value={formData.clientInstructions}
                  onChange={handleInputChange}
                  placeholder="Enter any specific instructions from the client. E.g., color preferences, style, music type, pacing, etc."
                  rows="5"
                  maxLength="1000"
                  className="w-full border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-gray-600 focus:ring-1 focus:ring-gray-600 transition-colors resize-none"
                  style={{ backgroundColor: '#131313' }}
                />
                <div className="flex justify-between items-center mt-2">
                  <p className="text-gray-500 text-xs">Be specific about client preferences</p>
                  <p className="text-gray-600 text-xs">{formData.clientInstructions.length}/1000</p>
                </div>
              </div>

              {/* Admin/Internal Notes */}
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Admin Notes (Internal)
                </label>
                <textarea
                  name="adminNote"
                  value={formData.adminNote}
                  onChange={handleInputChange}
                  placeholder="Enter internal notes for your team. E.g., technical requirements, special handling, deadline alerts, etc."
                  rows="5"
                  maxLength="1000"
                  className="w-full border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-gray-600 focus:ring-1 focus:ring-gray-600 transition-colors resize-none"
                  style={{ backgroundColor: '#131313' }}
                />
                <div className="flex justify-between items-center mt-2">
                  <p className="text-gray-500 text-xs">Only visible to your admin team</p>
                  <p className="text-gray-600 text-xs">{formData.adminNote.length}/1000</p>
                </div>
              </div>

              {/* Pending Action */}
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Current Pending Action
                </label>
                <input
                  type="text"
                  name="pendingAction"
                  value={formData.pendingAction}
                  onChange={handleInputChange}
                  placeholder="e.g., Awaiting client assets, Revision in progress, Final approval pending..."
                  className="w-full border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-gray-600 focus:ring-1 focus:ring-gray-600 transition-colors"
                  style={{ backgroundColor: '#131313' }}
                />
                <p className="text-gray-500 text-xs mt-1">What's blocking progress on this project right now?</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Form Actions */}
      <div
        className="mt-12 p-6 rounded-lg border border-gray-700 flex gap-4 justify-end"
        style={{ backgroundColor: '#131313' }}
      >
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="px-8 py-3 rounded-lg border border-gray-700 text-gray-300 font-medium hover:bg-gray-900 hover:text-white transition-all duration-300 disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isLoading}
          className="px-8 py-3 rounded-lg bg-gray-700 text-white font-medium hover:bg-gray-600 transition-all duration-300 disabled:opacity-50 flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-gray-300 border-t-white rounded-full animate-spin" />
              Saving...
            </>
          ) : (
            <>
              ✓ {initialData ? 'Update Project' : 'Create Project'}
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default ProjectForm;
