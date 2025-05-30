import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Users, 
  FileText, 
  TrendingUp, 
  Activity,
  Calendar,
  User,
  RefreshCw
} from 'lucide-react';

const Analytics = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  // Auto-refresh every 30 seconds when enabled
  useEffect(() => {
    let interval;
    if (autoRefresh) {
      interval = setInterval(() => {
        fetchAnalyticsData(true); // Silent refresh
      }, 30000); // 30 seconds
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh]);

  const fetchAnalyticsData = async (silent = false) => {
    try {
      if (!silent) {
        setLoading(true);
        setError(null);
      }
      
      // Add timestamp to prevent caching
      const timestamp = new Date().getTime();
      const response = await fetch(`http://localhost:8000/api/admin/analytics/summary?t=${timestamp}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        setAnalyticsData(result.data);
        setLastUpdated(new Date());
        if (!silent) {
          console.log('Analytics data refreshed:', result.data);
        }
      } else {
        throw new Error(result.message || 'Failed to fetch analytics data');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching analytics:', err);
    } finally {
      if (!silent) {
        setLoading(false);
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const StatCard = ({ title, value, icon: Icon, color, subtitle }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className={`text-3xl font-bold ${color}`}>
            {typeof value === 'number' ? value.toLocaleString() : value}
          </p>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
        <div className={`p-3 rounded-full ${color.replace('text-', 'bg-').replace('600', '100')}`}>
          <Icon className={`h-6 w-6 ${color}`} />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <div className="text-red-600">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error loading analytics</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
            <button 
              onClick={() => fetchAnalyticsData()}
              className="ml-auto bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded text-sm"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center mb-2">
              <BarChart3 className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
            </div>
            <p className="text-gray-600">System analytics and performance metrics</p>
          </div>
          <div className="flex items-center space-x-4">
            {/* Auto-refresh toggle */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="autoRefresh"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="autoRefresh" className="text-sm text-gray-600">
                Auto-refresh (30s)
              </label>
            </div>
            {lastUpdated && (
              <span className="text-sm text-gray-500">
                Last updated: {formatDate(lastUpdated)}
              </span>
            )}
            <button
              onClick={() => fetchAnalyticsData()}
              disabled={loading}
              className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Users"
          value={analyticsData?.totalUsers || 0}
          icon={Users}
          color="text-blue-600"
          subtitle={`+${analyticsData?.todayUsers || 0} today`}
        />
        <StatCard
          title="Total Proposals"
          value={analyticsData?.totalProposals || 0}
          icon={FileText}
          color="text-green-600"
          subtitle={`+${analyticsData?.todayProposals || 0} today`}
        />
        <StatCard
          title="New Users (30 days)"
          value={analyticsData?.recentUsers || 0}
          icon={TrendingUp}
          color="text-purple-600"
          subtitle="Recent registrations"
        />
        <StatCard
          title="Avg Proposals/User"
          value={analyticsData?.avgProposalsPerUser || 0}
          icon={Activity}
          color="text-orange-600"
          subtitle="Per registered user"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Most Active Users */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center">
              <User className="h-5 w-5 text-gray-600 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900">Most Active Users</h2>
            </div>
          </div>
          <div className="p-6">
            {analyticsData?.mostActiveUsers && analyticsData.mostActiveUsers.length > 0 ? (
              <div className="space-y-4">
                {analyticsData.mostActiveUsers.map((user, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium mr-3">
                        {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{user.name || 'Unknown'}</p>
                        <p className="text-sm text-gray-600">{user.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {user.proposalCount} proposals
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <User className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500">No active users yet</p>
              </div>
            )}
          </div>
        </div>

        {/* User Role Distribution */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center">
              <Users className="h-5 w-5 text-gray-600 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900">User Role Distribution</h2>
            </div>
          </div>
          <div className="p-6">
            {analyticsData?.roleDistribution && Object.keys(analyticsData.roleDistribution).length > 0 ? (
              <div className="space-y-4">
                {Object.entries(analyticsData.roleDistribution).map(([role, count]) => (
                  <div key={role} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-3 ${
                        role === 'Admin' ? 'bg-purple-500' : 'bg-green-500'
                      }`}></div>
                      <span className="font-medium text-gray-900">{role}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-600 mr-2">{count}</span>
                      <span className="text-sm text-gray-500">
                        ({analyticsData.totalUsers > 0 ? 
                          ((count / analyticsData.totalUsers) * 100).toFixed(1) : 0}%)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500">No role data available</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Activity Timeline */}
      <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-gray-600 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900">Daily Proposal Activity (Last 10 Days)</h2>
            </div>
            {analyticsData?.dataFreshness && (
              <span className="text-xs text-gray-400">
                Request ID: {analyticsData.dataFreshness.requestId}
              </span>
            )}
          </div>
        </div>
        <div className="p-6">
          {analyticsData?.dailyProposalCounts && Object.keys(analyticsData.dailyProposalCounts).length > 0 ? (
            <div className="space-y-2">
              {Object.entries(analyticsData.dailyProposalCounts)
                .sort(([a], [b]) => new Date(b) - new Date(a))
                .slice(0, 10)
                .map(([date, count]) => (
                <div key={date} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <span className="text-gray-600">{formatDate(date)}</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {count} proposals
                  </span>
                </div>
              ))}
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-700">
                  💡 <strong>Tip:</strong> This data updates in real-time. Generate a new proposal to see it reflected here!
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500">No recent proposal activity</p>
              <p className="text-sm text-gray-400 mt-1">Generate some proposals to see activity here!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;