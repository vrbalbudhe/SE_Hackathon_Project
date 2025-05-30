import React, { useState, useEffect } from 'react';
import { Archive, Eye, Calendar, User, Building2, FileText, AlertCircle } from 'lucide-react';

const ProposalArchives = () => {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('🚀 ProposalArchives component mounted');
    fetchProposals();
  }, []);

  const fetchProposals = async () => {
    try {
      console.log('📡 Fetching proposals from admin API...');
      setLoading(true);
      setError(null);

      const response = await fetch('http://localhost:8000/api/admin/proposals/all', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      console.log('📡 API response status:', response.status);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to fetch proposals`);
      }

      const result = await response.json();
      console.log('📊 API result:', result);

      if (result.success) {
        setProposals(result.data.proposals || []);
        console.log('✅ Loaded', result.data.proposals?.length || 0, 'proposals');
      } else {
        throw new Error(result.message || 'Failed to fetch proposals');
      }
    } catch (err) {
      console.error('❌ API Error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'Invalid Date';
    }
  };

  const formatTechStack = (techStack) => {
    if (!techStack || !Array.isArray(techStack)) return [];
    return techStack.slice(0, 3);
  };

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            📋 Proposal Archives (Admin)
          </h1>
          <p className="text-gray-600">Loading all proposals from database...</p>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-4 text-gray-600">Fetching proposals...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            📋 Proposal Archives (Admin)
          </h1>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <AlertCircle className="h-6 w-6 text-red-600 mr-2" />
            <h3 className="text-lg font-medium text-red-800">Failed to Load Proposals</h3>
          </div>
          <p className="text-red-700 mb-4">{error}</p>
          <div className="text-sm text-red-600 space-y-1">
            <p><strong>Troubleshooting:</strong></p>
            <ul className="list-disc ml-5 space-y-1">
              <li>Check if backend server is running on port 8000</li>
              <li>Verify ProposalAdminRoutes are registered in app.js</li>
              <li>Check browser network tab for detailed error</li>
            </ul>
          </div>
          <button 
            onClick={fetchProposals}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center mb-2">
          <Archive className="h-8 w-8 text-blue-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">Proposal Archives</h1>
        </div>
        <p className="text-gray-600">
          Admin view of all proposals - Found {proposals.length} proposals
        </p>
      </div>

      {/* Success indicator */}
      <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <FileText className="h-5 w-5 text-green-600" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-green-700">
              ✅ Successfully connected to admin proposals API
            </p>
          </div>
        </div>
      </div>

      {/* Proposals List */}
      {proposals.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <Archive className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Proposals Found</h3>
          <p className="text-gray-600">
            No proposals have been generated yet. Have users create some proposals to see them here.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 bg-gray-50 border-b">
            <h3 className="text-lg font-medium text-gray-900">All Proposals</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {proposals.map((proposal, index) => (
              <div key={proposal.id || index} className="p-6 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {/* Title */}
                    <h4 className="text-lg font-medium text-gray-900 mb-2">
                      {proposal.name || 'Untitled Proposal'}
                    </h4>
                    
                    {/* Client Info */}
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center">
                        <Building2 className="h-4 w-4 mr-1" />
                        <span>{proposal.clientName || 'Unknown Client'}</span>
                      </div>
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        <span>{proposal.user?.email || 'No user assigned'}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>{formatDate(proposal.createdAt)}</span>
                      </div>
                    </div>

                    {/* Description */}
                    {proposal.goals && (
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {proposal.goals.length > 150 
                          ? proposal.goals.substring(0, 150) + '...' 
                          : proposal.goals}
                      </p>
                    )}

                    {/* Tech Stack */}
                    {proposal.techStack && proposal.techStack.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {formatTechStack(proposal.techStack).map((tech, techIndex) => (
                          <span
                            key={techIndex}
                            className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
                          >
                            {tech}
                          </span>
                        ))}
                        {proposal.techStack.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                            +{proposal.techStack.length - 3} more
                          </span>
                        )}
                      </div>
                    )}

                    {/* Budget */}
                    {proposal.budget && (
                      <p className="text-sm text-green-600 font-medium">
                        Budget: {proposal.budget}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="ml-4 flex-shrink-0">
                    <button className="flex items-center px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
                      <Eye className="h-4 w-4 mr-1" />
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProposalArchives;