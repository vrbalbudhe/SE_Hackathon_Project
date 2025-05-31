import React from 'react';
import {
  User,
  Mail,
  Phone,
  Building,
  MapPin,
  Globe,
  Calendar,
  FileText,
  Award,
  Clock
} from 'lucide-react';

const UserProfile = () => {
  // Static profile data
  const profile = {
    name: 'Shivam Pokharkar',
    email: 'Shivam@example.com',
    title: 'Software Engineer',
    phone: '987654321',
    company: 'Tech Solutions Inc.',
    location: 'Pune, India',
    website: 'www.shivampokharkar.dev',
    createdAt: '2023-01-15',
    avatar: null,
    stats: {
      totalProposals: 5,
      successRate: '80',
      avgResponseTime: '2 days'
    }
  };

  // Static activity data
  const recentActivity = [
    {
      id: 1,
      action: 'Created new proposal',
      details: 'E-commerce Platform Development for Fashion Retail',
      timestamp: '2024-03-15T10:30:00Z'
    },
    {
      id: 2,
      action: 'Updated profile information',
      details: 'Changed company and role information',
      timestamp: '2024-03-14T15:45:00Z'
    },
    {
      id: 3,
      action: 'Proposal accepted',
      details: 'Mobile App Development for Healthcare Provider',
      timestamp: '2024-03-13T09:20:00Z'
    },
    {
      id: 4,
      action: 'Added new skills',
      details: 'React Native, Flutter, and AWS',
      timestamp: '2024-03-12T14:15:00Z'
    }
  ];

  const InfoItem = ({ icon: Icon, label, value }) => (
    <div className="flex items-center space-x-3">
      <div className="flex-shrink-0">
        <Icon className="h-5 w-5 text-gray-400" />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className="text-sm text-gray-900">{value || 'Not specified'}</p>
      </div>
    </div>
  );

  const ActivityItem = ({ activity }) => (
    <div className="flex items-start space-x-3">
      <div className="flex-shrink-0 mt-1">
        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
          <FileText className="h-4 w-4 text-blue-600" />
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900">
          {activity.action}
        </p>
        <p className="text-sm text-gray-500">
          {activity.details}
        </p>
        <p className="text-xs text-gray-400 mt-1">
          {new Date(activity.timestamp).toLocaleString()}
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-6">
            <div className="text-center mb-6">
              <div className="inline-block h-32 w-32 rounded-full overflow-hidden bg-gray-100 mb-4">
                {profile.avatar ? (
                  <img
                    src={profile.avatar}
                    alt={profile.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center">
                    <User className="h-16 w-16 text-gray-400" />
                  </div>
                )}
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">
                {profile.name}
              </h1>
              <p className="text-gray-600">{profile.title}</p>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InfoItem
                  icon={Mail}
                  label="Email"
                  value={profile.email}
                />
                <InfoItem
                  icon={Phone}
                  label="Phone"
                  value={profile.phone}
                />
                <InfoItem
                  icon={Building}
                  label="Company"
                  value={profile.company}
                />
                <InfoItem
                  icon={MapPin}
                  label="Location"
                  value={profile.location}
                />
                <InfoItem
                  icon={Globe}
                  label="Website"
                  value={profile.website}
                />
                <InfoItem
                  icon={Calendar}
                  label="Member Since"
                  value={new Date(profile.createdAt).toLocaleDateString()}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-2">
              <FileText className="h-5 w-5 text-blue-500 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Total Proposals</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">{profile.stats.totalProposals}</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-2">
              <Award className="h-5 w-5 text-green-500 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Success Rate</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">{profile.stats.successRate}%</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-2">
              <Clock className="h-5 w-5 text-purple-500 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Avg. Response Time</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">{profile.stats.avgResponseTime}</p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
            <div className="space-y-6">
              {recentActivity.map((activity) => (
                <ActivityItem key={activity.id} activity={activity} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile; 