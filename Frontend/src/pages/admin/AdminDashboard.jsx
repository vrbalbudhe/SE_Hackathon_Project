import React, { useState } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import UserManagement from '../../components/admin/users/UserManagement';
import Analytics from '../../components/admin/analytics/Analytics';

function AdminDashboard() {
  const [selectedSection, setSelectedSection] = useState('Home');

  const renderContent = () => {
    switch (selectedSection) {
      case 'User Management':
        return <UserManagement />;
      case 'Analytics':
        return <Analytics />;
      case 'Report':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Reports</h2>
            <p className="text-gray-600">Reports section coming soon...</p>
          </div>
        );
      case 'Archives':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Archives</h2>
            <p className="text-gray-600">Archives section coming soon...</p>
          </div>
        );
      case 'Settings':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Settings</h2>
            <p className="text-gray-600">Settings section coming soon...</p>
          </div>
        );
      default:
        return (
          <div className="p-6">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-3xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Users</h3>
                  <p className="text-3xl font-bold text-blue-600">--</p>
                  <p className="text-sm text-gray-600 mt-2">Registered users</p>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Projects</h3>
                  <p className="text-3xl font-bold text-green-600">--</p>
                  <p className="text-sm text-gray-600 mt-2">Total projects</p>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Active Today</h3>
                  <p className="text-3xl font-bold text-purple-600">--</p>
                  <p className="text-sm text-gray-600 mt-2">Users active today</p>
                </div>
              </div>
              <div className="mt-8 bg-white rounded-lg shadow">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button 
                      onClick={() => setSelectedSection('User Management')}
                      className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left"
                    >
                      <h4 className="font-medium text-gray-900">Manage Users</h4>
                      <p className="text-sm text-gray-600 mt-1">View and manage all registered users</p>
                    </button>
                    <button 
                      onClick={() => setSelectedSection('Analytics')}
                      className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left"
                    >
                      <h4 className="font-medium text-gray-900">View Analytics</h4>
                      <p className="text-sm text-gray-600 mt-1">Check system usage and statistics</p>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar selectedIcon={selectedSection} setSelectedIcon={setSelectedSection} />
      <div className="flex-1">
        {renderContent()}
      </div>
    </div>
  );
}

export default AdminDashboard;