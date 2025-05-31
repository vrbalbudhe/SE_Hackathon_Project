import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PlusCircle,
  FileText,
  Clock,
  TrendingUp,
  Settings,
  User,
  Archive,
  BarChart
} from 'lucide-react';
import { AuthContext } from '../../../contexts/AuthContext';

const UserHome = () => {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [recentProposals, setRecentProposals] = useState([]);
  const [stats, setStats] = useState({
    totalProposals: 0,
    monthlyProposals: 0,
    averageResponseTime: '0',
    successRate: '0'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser?.id) {
      fetchUserDashboardData();
    }
  }, [currentUser]);

  const fetchUserDashboardData = async () => {
    try {
      // Fetch recent proposals
      const proposalsResponse = await fetch(
        `http://localhost:8000/api/user/proposals/recent/${currentUser.id}`,
        {
          credentials: 'include'
        }
      );
      const proposalsData = await proposalsResponse.json();

      // Fetch user stats
      const statsResponse = await fetch(
        `http://localhost:8000/api/user/stats/${currentUser.id}`,
        {
          credentials: 'include'
        }
      );
      const statsData = await statsResponse.json();

      if (proposalsData.success) {
        setRecentProposals(proposalsData.proposals || []);
      }

      if (statsData.success) {
        setStats(statsData.stats);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      title: 'New Proposal',
      icon: PlusCircle,
      description: 'Create a new project proposal',
      action: () => navigate('/proposals/new'),
      color: 'bg-blue-500'
    },
    {
      title: 'View Archives',
      icon: Archive,
      description: 'Access your proposal history',
      action: () => navigate('/proposals/archives'),
      color: 'bg-purple-500'
    },
    {
      title: 'Profile Settings',
      icon: Settings,
      description: 'Update your account preferences',
      action: () => navigate('/settings'),
      color: 'bg-green-500'
    }
  ];

  const StatCard = ({ icon: Icon, title, value, description }) => (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center mb-4">
        <Icon className="h-8 w-8 text-blue-500 mr-3" />
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      <div className="mb-2">
        <span className="text-3xl font-bold text-gray-900">{value}</span>
      </div>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-40 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {currentUser?.name || 'User'}! 👋
        </h1>
        <p className="text-gray-600">
          Here's an overview of your proposal generation activity
        </p>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={action.action}
              className="bg-white rounded-lg shadow p-6 text-left hover:shadow-md transition-shadow"
            >
              <div className="flex items-center mb-4">
                <div className={`${action.color} p-3 rounded-lg`}>
                  <action.icon className="h-6 w-6 text-white" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {action.title}
              </h3>
              <p className="text-sm text-gray-600">{action.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Stats</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={FileText}
            title="Total Proposals"
            value={stats.totalProposals}
            description="Total proposals generated"
          />
          <StatCard
            icon={Clock}
            title="Monthly"
            value={stats.monthlyProposals}
            description="Proposals this month"
          />
          <StatCard
            icon={TrendingUp}
            title="Success Rate"
            value={`${stats.successRate}%`}
            description="Proposal acceptance rate"
          />
          <StatCard
            icon={BarChart}
            title="Response Time"
            value={stats.averageResponseTime}
            description="Average response time"
          />
        </div>
      </div>

      {/* Recent Proposals */}
      {/* <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Proposals</h2>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {recentProposals.length === 0 ? (
            <div className="p-6 text-center">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Recent Proposals
              </h3>
              <p className="text-gray-600 mb-4">
                You haven't created any proposals yet. Start by creating a new one!
              </p>
              <button
                onClick={() => navigate('/proposals/new')}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                <PlusCircle className="h-5 w-5 mr-2" />
                Create New Proposal
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {recentProposals.map((proposal) => (
                <div
                  key={proposal.id}
                  className="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => navigate(`/proposals/${proposal.id}`)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 mb-1">
                        {proposal.name}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {proposal.clientName} • Created on{' '}
                        {new Date(proposal.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <span className="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-800">
                        {proposal.status || 'Draft'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div> */}
        <div>
      </div>
    </div>
  );
};

export default UserHome; 