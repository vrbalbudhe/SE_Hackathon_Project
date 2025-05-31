import React, { useState } from 'react';
import { Save, User, Lock, Bell, Shield } from 'lucide-react';

const UserSettings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [message, setMessage] = useState(null);

  const [profileForm, setProfileForm] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1 (555) 123-4567',
    company: 'Tech Solutions Inc.',
    title: 'Software Engineer',
    location: 'San Francisco, CA',
    website: 'www.johndoe.dev',
    avatar: ''
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    proposalUpdates: true,
    marketingEmails: false
  });

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    setMessage({
      type: 'success',
      text: 'Profile updated successfully! (Demo - no actual update)'
    });
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage({
        type: 'error',
        text: 'Passwords do not match'
      });
      return;
    }
    setMessage({
      type: 'success',
      text: 'Password updated successfully! (Demo - no actual update)'
    });
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  const handleNotificationSubmit = (e) => {
    e.preventDefault();
    setMessage({
      type: 'success',
      text: 'Notification preferences updated! (Demo - no actual update)'
    });
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600">Manage your account settings and preferences</p>
        </div>

        {message && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              {tabs.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`py-4 px-1 inline-flex items-center border-b-2 font-medium text-sm ${
                    activeTab === id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-5 w-5 mr-2" />
                  {label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'profile' && (
              <form onSubmit={handleProfileSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                      type="text"
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      value={profileForm.email}
                      onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                    <input
                      type="tel"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Company</label>
                    <input
                      type="text"
                      value={profileForm.company}
                      onChange={(e) => setProfileForm({ ...profileForm, company: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Title</label>
                    <input
                      type="text"
                      value={profileForm.title}
                      onChange={(e) => setProfileForm({ ...profileForm, title: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Location</label>
                    <input
                      type="text"
                      value={profileForm.location}
                      onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Website</label>
                    <input
                      type="url"
                      value={profileForm.website}
                      onChange={(e) => setProfileForm({ ...profileForm, website: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </button>
                </div>
              </form>
            )}

            {activeTab === 'security' && (
              <form onSubmit={handlePasswordSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Current Password</label>
                  <input
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(e) =>
                      setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">New Password</label>
                  <input
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) =>
                      setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) =>
                      setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    Update Password
                  </button>
                </div>
              </form>
            )}

            {activeTab === 'notifications' && (
              <form onSubmit={handleNotificationSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        type="checkbox"
                        checked={notifications.emailNotifications}
                        onChange={(e) =>
                          setNotifications({
                            ...notifications,
                            emailNotifications: e.target.checked
                          })
                        }
                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label className="font-medium text-gray-700">Email Notifications</label>
                      <p className="text-gray-500">Receive notifications via email</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        type="checkbox"
                        checked={notifications.proposalUpdates}
                        onChange={(e) =>
                          setNotifications({
                            ...notifications,
                            proposalUpdates: e.target.checked
                          })
                        }
                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label className="font-medium text-gray-700">Proposal Updates</label>
                      <p className="text-gray-500">Get notified about proposal status changes</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        type="checkbox"
                        checked={notifications.marketingEmails}
                        onChange={(e) =>
                          setNotifications({
                            ...notifications,
                            marketingEmails: e.target.checked
                          })
                        }
                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label className="font-medium text-gray-700">Marketing Emails</label>
                      <p className="text-gray-500">Receive marketing and promotional emails</p>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Bell className="h-4 w-4 mr-2" />
                    Save Preferences
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSettings; 