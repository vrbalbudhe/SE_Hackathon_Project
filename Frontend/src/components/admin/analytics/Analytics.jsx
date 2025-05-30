import React from 'react';
import { BarChart3 } from 'lucide-react';

const Analytics = () => {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <div className="flex items-center mb-2">
          <BarChart3 className="h-8 w-8 text-blue-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        </div>
        <p className="text-gray-600">System analytics and statistics</p>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">Analytics dashboard coming soon...</p>
      </div>
    </div>
  );
};

export default Analytics;