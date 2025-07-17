import React from 'react';
import { CalendarIcon, ClockIcon, UserIcon } from '@heroicons/react/24/outline';

const Bookings = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">My Bookings</h1>
          <p className="text-gray-600">Manage your learning sessions and teaching appointments</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <CalendarIcon className="w-12 h-12 text-blue-600 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Upcoming Sessions</h3>
            <p className="text-gray-600">View and manage your scheduled learning sessions</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <ClockIcon className="w-12 h-12 text-green-600 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Session History</h3>
            <p className="text-gray-600">Review your completed learning experiences</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <UserIcon className="w-12 h-12 text-purple-600 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Teaching Sessions</h3>
            <p className="text-gray-600">Manage sessions where you're the teacher</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Booking Management Coming Soon
          </h2>
          <p className="text-gray-600 mb-6">
            Full booking management functionality is under development. Soon you'll be able to:
          </p>
          <ul className="text-left text-gray-600 space-y-2 max-w-md mx-auto">
            <li>• View upcoming and past bookings</li>
            <li>• Cancel or reschedule sessions</li>
            <li>• Join video calls for sessions</li>
            <li>• Rate and review completed sessions</li>
            <li>• Track your learning progress</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Bookings;
