import React from 'react';

export function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '',
  ...props 
}) {
  const baseStyles = 'font-medium rounded-lg transition-colors duration-200 focus:outline-none';
  
  const variants = {
    primary: 'bg-white text-gray-900 hover:bg-gray-200',
    secondary: 'bg-gray-700 text-white hover:bg-gray-600 border border-gray-600',
    danger: 'bg-gray-700 text-white hover:bg-gray-600 border border-gray-600',
    ghost: 'text-gray-300 hover:text-white hover:bg-gray-700 border border-gray-600',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function FormInput({ 
  label, 
  placeholder, 
  value, 
  onChange,
  type = 'text',
  required = false,
  className = '',
  ...props 
}) {
  const displayValue = value !== null && value !== undefined ? String(value) : '';
  
  return (
    <div className={`mb-5 ${className}`}>
      {label && (
        <label className="block text-gray-300 text-sm font-medium mb-2">
          {label}
          {required && <span className="text-gray-400 ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={displayValue}
        onChange={onChange}
        required={required}
        className="w-full border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-gray-600 focus:ring-1 focus:ring-gray-600 transition-colors"
        style={{ backgroundColor: '#131313' }}
        {...props}
      />
    </div>
  );
}

export function FormTextarea({ 
  label, 
  placeholder, 
  value, 
  onChange,
  rows = 4,
  required = false,
  className = '',
  ...props 
}) {
  return (
    <div className={`mb-5 ${className}`}>
      {label && (
        <label className="block text-gray-300 text-sm font-medium mb-2">
          {label}
          {required && <span className="text-gray-400 ml-1">*</span>}
        </label>
      )}
      <textarea
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        rows={rows}
        required={required}
        className="w-full border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-gray-600 focus:ring-1 focus:ring-gray-600 transition-colors resize-none"
        style={{ backgroundColor: '#131313' }}
        {...props}
      />
    </div>
  );
}

export function FormSelect({ 
  label, 
  value, 
  onChange,
  options = [],
  required = false,
  className = '',
  ...props 
}) {
  return (
    <div className={`mb-5 ${className}`}>
      {label && (
        <label className="block text-gray-300 text-sm font-medium mb-2">
          {label}
          {required && <span className="text-gray-400 ml-1">*</span>}
        </label>
      )}
      <select
        value={value}
        onChange={onChange}
        required={required}
        className="w-full border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-gray-600 focus:ring-1 focus:ring-gray-600 transition-colors appearance-none"
        style={{
          backgroundColor: '#131313',
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%9ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
          backgroundPosition: 'right 0.5rem center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: '1.5em 1.5em',
          paddingRight: '2.5rem',
        }}
        {...props}
      >
        <option value="">Select an option</option>
        {options.map((opt) => (
          <option key={opt.value || opt} value={opt.value || opt}>
            {opt.label || opt}
          </option>
        ))}
      </select>
    </div>
  );
}

export function Badge({ children, variant = 'default', className = '' }) {
  const variants = {
    default: 'bg-gray-700 text-gray-100',
    success: 'bg-gray-600 text-gray-50',
    warning: 'bg-gray-650 text-gray-100',
    error: 'bg-gray-700 text-gray-100',
    info: 'bg-gray-650 text-gray-100',
  };

  return (
    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}

export function Card({ children, className = '' }) {
  return (
    <div className={`border border-gray-700 rounded-lg p-6 ${className}`} style={{ backgroundColor: '#131313' }}>
      {children}
    </div>
  );
}
