import React from 'react';
import { useParams } from 'react-router-dom';

const TeacherProfile = () => {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Teacher Profile Page
          </h1>
          <p className="text-gray-600 mb-6">
            This page will show detailed information about teacher ID: {id}
          </p>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-purple-800 mb-2">
              Coming Soon
            </h2>
            <p className="text-purple-600">
              Teacher profiles with skills, reviews, availability, and booking options will be available here.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherProfile;
