import React from 'react';
import { 
  UserGroupIcon, 
  AcademicCapIcon, 
  ChartBarIcon, 
  CogIcon,
  ExclamationTriangleIcon,
  ShieldCheckIcon 
} from '@heroicons/react/24/outline';

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage the Skillazon platform</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <UserGroupIcon className="w-12 h-12 text-blue-600 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">User Management</h3>
            <p className="text-gray-600">Manage users, teachers, and administrators</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <AcademicCapIcon className="w-12 h-12 text-green-600 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Skill Moderation</h3>
            <p className="text-gray-600">Review and approve skill listings</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <ChartBarIcon className="w-12 h-12 text-purple-600 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Analytics</h3>
            <p className="text-gray-600">Platform statistics and insights</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <ExclamationTriangleIcon className="w-12 h-12 text-red-600 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Reports</h3>
            <p className="text-gray-600">Handle user reports and disputes</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <ShieldCheckIcon className="w-12 h-12 text-indigo-600 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Security</h3>
            <p className="text-gray-600">Platform security and safety features</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <CogIcon className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Settings</h3>
            <p className="text-gray-600">Platform configuration and settings</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Admin Panel Coming Soon
          </h2>
          <p className="text-gray-600 mb-6">
            Comprehensive administrative tools are under development. Soon you'll be able to:
          </p>
          <ul className="text-left text-gray-600 space-y-2 max-w-md mx-auto">
            <li>• Manage user accounts and permissions</li>
            <li>• Moderate skill listings and content</li>
            <li>• View platform analytics and metrics</li>
            <li>• Handle disputes and reports</li>
            <li>• Configure platform settings</li>
            <li>• Monitor system security</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
