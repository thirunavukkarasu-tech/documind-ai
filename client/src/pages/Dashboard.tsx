import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/auth.context';
import { useLogout } from '../hooks/useAuth';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { logoutUser, isLoading } = useLogout();

  const handleLogout = async () => {
    await logoutUser();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="container-max py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">DocuMind AI</h1>
          <button
            onClick={handleLogout}
            disabled={isLoading}
            className="btn-primary"
          >
            {isLoading ? 'Logging out...' : 'Logout'}
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container-max py-12">
        <div className="card max-w-2xl">
          <div className="text-center">
            <div className="inline-block w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4">
              {user?.firstName?.[0]?.toUpperCase()}
              {user?.lastName?.[0]?.toUpperCase()}
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome to DocuMind AI
            </h2>

            <p className="text-gray-600 mb-6">
              Hello, <span className="font-semibold">{user?.firstName} {user?.lastName}</span>!
            </p>

            <div className="bg-gray-50 rounded-lg p-6 text-left space-y-3">
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="text-lg font-medium text-gray-900">{user?.email}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Role</p>
                <div className="flex items-center gap-2">
                  <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    {user?.role?.toUpperCase() || 'USER'}
                  </span>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600">Account Status</p>
                <div className="flex items-center gap-2">
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    user?.isActive
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {user?.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600">Member Since</p>
                <p className="text-lg font-medium text-gray-900">
                  {user?.createdAt
                    ? new Date(user.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })
                    : 'N/A'
                  }
                </p>
              </div>
            </div>

            <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Phase 2 - Authentication Complete ✓</h3>
              <p className="text-gray-700 text-sm">
                User registration, login, and authentication system successfully implemented.
                Protected routes are now active. Future phases will include document intelligence
                and AI-powered document processing features.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
