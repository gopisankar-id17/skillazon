import React from 'react';
import { useParams } from 'react-router-dom';

const BookingDetail = () => {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Booking Detail Page
          </h1>
          <p className="text-gray-600 mb-6">
            This page will show detailed information about booking ID: {id}
          </p>
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-green-800 mb-2">
              Coming Soon
            </h2>
            <p className="text-green-600">
              Detailed booking information, session details, and management options will be available here.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetail;
