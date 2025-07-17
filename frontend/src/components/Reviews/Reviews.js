import React from 'react';
import { StarIcon, HandThumbUpIcon as ThumbUpIcon, ChatBubbleOvalLeftIcon as MessageCircleIcon } from '@heroicons/react/24/outline';

const Reviews = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Reviews & Feedback</h1>
          <p className="text-gray-600">Manage reviews for your skills and sessions</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <StarIcon className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Give Reviews</h3>
            <p className="text-gray-600">Rate and review your completed learning sessions</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <ThumbUpIcon className="w-12 h-12 text-blue-600 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Received Reviews</h3>
            <p className="text-gray-600">View feedback from your students</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <MessageCircleIcon className="w-12 h-12 text-green-600 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Review Responses</h3>
            <p className="text-gray-600">Respond to reviews and engage with feedback</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Review System Coming Soon
          </h2>
          <p className="text-gray-600 mb-6">
            Comprehensive review and rating functionality is under development. Soon you'll be able to:
          </p>
          <ul className="text-left text-gray-600 space-y-2 max-w-md mx-auto">
            <li>• Rate sessions and teachers</li>
            <li>• Write detailed reviews</li>
            <li>• View all your given and received reviews</li>
            <li>• Respond to student feedback</li>
            <li>• Track your overall rating as a teacher</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Reviews;
