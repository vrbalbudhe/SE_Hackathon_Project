import React, { useState, useEffect } from 'react';
import {
  Archive,
  Eye,
  Calendar,
  User,
  Building2,
  X,
  AlertCircle,
  FileText
} from 'lucide-react';

const ProposalArchives = () => {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProposal, setSelectedProposal] = useState(null);

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
        // Clean and transform the data
        const cleanedProposals = (result.data.proposals || []).map((proposal, index) => ({
          id: proposal.id || `proposal-${index}-${Date.now()}`,
          name: proposal.name || 'Untitled',
          clientName: proposal.clientName || 'Unknown Client',
          clientIndustry: proposal.clientIndustry || 'Unknown Industry',
          budget: proposal.budget || null,
          techStack: Array.isArray(proposal.techStack) ? proposal.techStack : [],
          modules: Array.isArray(proposal.modules) ? proposal.modules : [],
          goals: proposal.goals || 'No description available',
          challenges: proposal.challenges || null,
          tone: proposal.tone || null,
          proposalType: proposal.proposalType || null,
          createdAt: proposal.createdAt ? new Date(proposal.createdAt) : new Date(),
          updatedAt: proposal.updatedAt ? new Date(proposal.updatedAt) : new Date(),
          user: proposal.user && typeof proposal.user === 'object' ? {
            id: proposal.user.id || 'unknown',
            name: proposal.user.name || 'Unknown User',
            email: proposal.user.email || 'No email'
          } : null
        }));

        setProposals(cleanedProposals);
        console.log('✅ Loaded', cleanedProposals.length, 'proposals');
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

  const formatDate = (date) => {
    try {
      if (!date) return 'No date';
      const dateObj = date instanceof Date ? date : new Date(date);
      if (isNaN(dateObj.getTime())) return 'Invalid date';
      
      return dateObj.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'Date error';
    }
  };

  const formatTechStack = (techStack) => {
    if (!techStack || !Array.isArray(techStack) || techStack.length === 0) {
      return ['No tech stack'];
    }
    return techStack.slice(0, 3);
  };

  const viewProposal = (proposal) => {
    setSelectedProposal(proposal);
  };

  const closeModal = () => {
    setSelectedProposal(null);
  };

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            📋 All Proposals (Admin)
          </h1>
          <p className="text-gray-600">Loading all proposals...</p>
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
            📋 All Proposals (Admin)
          </h1>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <AlertCircle className="h-6 w-6 text-red-600 mr-2" />
            <h3 className="text-lg font-medium text-red-800">Failed to Load Proposals</h3>
          </div>
          <p className="text-red-700 mb-4">{error}</p>
          <button 
            onClick={fetchProposals}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
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
          <h1 className="text-3xl font-bold text-gray-900">All Proposals</h1>
        </div>
        <p className="text-gray-600">
          Admin view of all proposals - Found {proposals.length} proposals
        </p>
      </div>

      {/* Success indicator */}
      <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center">
          <FileText className="h-5 w-5 text-green-600 mr-2" />
          <p className="text-sm text-green-700">
            ✅ Successfully loaded all proposals
          </p>
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
            <h3 className="text-lg font-medium text-gray-900">All Proposals ({proposals.length})</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {proposals.map((proposal, index) => (
              <div key={`proposal-${proposal.id}-${index}`} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {/* Title */}
                    <h4 className="text-lg font-medium text-gray-900 mb-2">
                      {proposal.name}
                    </h4>
                    
                    {/* Client & User Info */}
                    <div className="flex items-center flex-wrap gap-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center">
                        <Building2 className="h-4 w-4 mr-1 flex-shrink-0" />
                        <span>{proposal.clientName}</span>
                        {proposal.clientIndustry && proposal.clientIndustry !== 'Unknown Industry' && (
                          <span className="ml-1 text-gray-500">({proposal.clientIndustry})</span>
                        )}
                      </div>
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-1 flex-shrink-0" />
                        <span>
                          {proposal.user ? 
                            `${proposal.user.name} (${proposal.user.email})` : 
                            'No user assigned'
                          }
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1 flex-shrink-0" />
                        <span>{formatDate(proposal.createdAt)}</span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {proposal.goals.length > 150 
                        ? proposal.goals.substring(0, 150) + '...' 
                        : proposal.goals}
                    </p>

                    {/* Tech Stack */}
                    {proposal.techStack && proposal.techStack.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {formatTechStack(proposal.techStack).map((tech, techIndex) => (
                          <span
                            key={`tech-${proposal.id}-${techIndex}`}
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
                    <button 
                      onClick={() => viewProposal(proposal)}
                      className="flex items-center px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    >
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

      {/* Modal for Proposal Details */}
      {selectedProposal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
          <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">Proposal Details</h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)] space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Proposal Name</label>
                  <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">
                  {selectedProposal.name}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Created By</label>
                <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">
                  {selectedProposal.user ? 
                    `${selectedProposal.user.name} (${selectedProposal.user.email})` : 
                    'No user assigned'
                  }
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Client</label>
                  <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">
                  {selectedProposal.clientName}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
                  <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">
                  {selectedProposal.clientIndustry}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Budget</label>
                  <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">
                    {selectedProposal.budget || 'Not specified'}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Created Date</label>
                  <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">
                    {formatDate(selectedProposal.createdAt)}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Goals & Requirements</label>
                  <div className="text-sm text-gray-900 bg-gray-50 p-3 rounded-md max-h-32 overflow-y-auto">
                  {selectedProposal.goals}
                  </div>
                </div>

                {selectedProposal.challenges && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Challenges</label>
                    <div className="text-sm text-gray-900 bg-gray-50 p-3 rounded-md">
                      {selectedProposal.challenges}
                    </div>
                  </div>
                )}

              {selectedProposal.techStack && selectedProposal.techStack.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tech Stack</label>
                  <div className="flex flex-wrap gap-1">
                    {selectedProposal.techStack.map((tech, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
              </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProposalArchives;