import React, { useState } from 'react';

// EXPLICIT IMPORTS - make sure these paths are correct
import AdminSidebar from '../../components/admin/AdminSidebar';
import UserManagement from '../../components/admin/users/UserManagement';
import Analytics from '../../components/admin/analytics/Analytics';

// THIS IS THE IMPORTANT ONE - make sure this file exists at this exact path
import ProposalArchives from '../../components/admin/proposals/ProposalArchives';

function AdminDashboard() {
  const [selectedSection, setSelectedSection] = useState('Home');

  // Debug logging
  React.useEffect(() => {
    console.log('✅ AdminDashboard - All imports successful');
    console.log('✅ ProposalArchives component:', ProposalArchives);
    console.log('✅ Current selected section:', selectedSection);
  }, [selectedSection]);

  const renderContent = () => {
    console.log('🔄 AdminDashboard - Rendering content for:', selectedSection);
    
    switch (selectedSection) {
      case 'User Management':
        console.log('📊 Rendering UserManagement');
        return <UserManagement />;
        
      case 'Analytics':
        console.log('📈 Rendering Analytics');
        return <Analytics />;
        
      case 'Archives':
        console.log('📋 Rendering ProposalArchives from admin/proposals/');
        // Add extra verification
        if (!ProposalArchives) {
          return (
            <div className="p-6">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="text-lg font-medium text-red-800">❌ Component Import Error</h3>
                <p className="text-red-700">
                  ProposalArchives component not found at: 
                  <code className="bg-red-100 px-1 rounded">
                    Frontend/src/components/admin/proposals/ProposalArchives.jsx
                  </code>
                </p>
              </div>
            </div>
          );
        }
        return <ProposalArchives />;
        
      case 'Report':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Reports</h2>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600">Reports section coming soon...</p>
              <p className="text-sm text-gray-500 mt-2">
                Note: This is different from the Archives section.
              </p>
            </div>
          </div>
        );
        
      case 'Settings':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Settings</h2>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600">Settings section coming soon...</p>
            </div>
          </div>
        );
        
      case 'Home':
      default:
        return (
          <div className="p-6">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-3xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>
              
              {/* Debug Component Info */}
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="text-lg font-medium text-blue-800 mb-2">🔍 Debug Info</h3>
                <div className="text-sm text-blue-700 space-y-1">
                  <p><strong>Current Section:</strong> {selectedSection}</p>
                  <p><strong>ProposalArchives Available:</strong> {ProposalArchives ? '✅ Yes' : '❌ No'}</p>
                  <p><strong>Expected Path:</strong> components/admin/proposals/ProposalArchives.jsx</p>
                </div>
              </div>
              
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
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button 
                      onClick={() => {
                        console.log('🖱️ Clicked User Management');
                        setSelectedSection('User Management');
                      }}
                      className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left"
                    >
                      <h4 className="font-medium text-gray-900">Manage Users</h4>
                      <p className="text-sm text-gray-600 mt-1">View and manage all registered users</p>
                    </button>
                    <button 
                      onClick={() => {
                        console.log('🖱️ Clicked Analytics');
                        setSelectedSection('Analytics');
                      }}
                      className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left"
                    >
                      <h4 className="font-medium text-gray-900">View Analytics</h4>
                      <p className="text-sm text-gray-600 mt-1">Check system usage and statistics</p>
                    </button>
                    <button 
                      onClick={() => {
                        console.log('🖱️ Clicked Archives - Should load ProposalArchives');
                        setSelectedSection('Archives');
                      }}
                      className="p-4 border border-gray-200 rounded-lg hover:bg-purple-50 hover:border-purple-300 text-left transition-colors"
                    >
                      <h4 className="font-medium text-gray-900">📋 Proposal Archives</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        View all submitted proposals (NOT ReportsArchive)
                      </p>
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