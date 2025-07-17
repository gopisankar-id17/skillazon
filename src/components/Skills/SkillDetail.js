import React from 'react';
import { useParams } from 'react-router-dom';

const SkillDetail = () => {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Skill Detail Page
          </h1>
          <p className="text-gray-600 mb-6">
            This page will show detailed information about skill ID: {id}
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-blue-800 mb-2">
              Coming Soon
            </h2>
            <p className="text-blue-600">
              Detailed skill information, teacher profile, booking options, and reviews will be available here.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillDetail;
