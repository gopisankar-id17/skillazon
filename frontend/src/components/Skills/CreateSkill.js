import React from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';

const CreateSkill = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-8">
            <PlusIcon className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              Create a New Skill
            </h1>
            <p className="text-gray-600 text-lg">
              Share your expertise and start teaching others
            </p>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
            <h2 className="text-xl font-semibold text-blue-800 mb-4">
              Coming Soon
            </h2>
            <p className="text-blue-600 mb-6">
              The skill creation form is under development. Soon you'll be able to:
            </p>
            <ul className="text-left text-blue-600 space-y-2 max-w-md mx-auto">
              <li>• Create detailed skill descriptions</li>
              <li>• Set your pricing and availability</li>
              <li>• Upload skill images and materials</li>
              <li>• Define session duration and requirements</li>
              <li>• Manage your teaching calendar</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateSkill;
