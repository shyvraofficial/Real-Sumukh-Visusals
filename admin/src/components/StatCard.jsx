import React from 'react';

export default function StatCard({ label, value, icon, trend }) {
  return (
    <div className="border border-gray-700 rounded-lg p-6 hover:border-gray-600 transition-colors" style={{ backgroundColor: '#131313' }}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-400 text-sm font-medium mb-2">{label}</p>
          <h3 className="text-3xl font-light text-white tracking-tight">{value}</h3>
          {trend && (
            <p className={`text-xs mt-3 ${trend.positive ? 'text-gray-300' : 'text-gray-400'}`}>
              {trend.positive ? '↑' : '↓'} {trend.text}
            </p>
          )}
        </div>
        {icon && (
          <div className="text-gray-600 text-2xl">{icon}</div>
        )}
      </div>
    </div>
  );
}
