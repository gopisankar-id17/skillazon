import React from 'react';
import { ChatBubbleLeftRightIcon as ChatIcon, VideoCameraIcon, PhoneIcon } from '@heroicons/react/24/outline';

const Chat = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Messages & Communication</h1>
          <p className="text-gray-600">Connect with teachers and students</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <ChatIcon className="w-12 h-12 text-blue-600 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Text Messages</h3>
            <p className="text-gray-600">Chat with teachers and students</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <VideoCameraIcon className="w-12 h-12 text-green-600 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Video Calls</h3>
            <p className="text-gray-600">Join live learning sessions</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <PhoneIcon className="w-12 h-12 text-purple-600 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Voice Calls</h3>
            <p className="text-gray-600">Audio-only communication option</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Communication Platform Coming Soon
          </h2>
          <p className="text-gray-600 mb-6">
            Real-time messaging and video calling features are under development. Soon you'll be able to:
          </p>
          <ul className="text-left text-gray-600 space-y-2 max-w-md mx-auto">
            <li>• Send real-time messages</li>
            <li>• Make video and voice calls</li>
            <li>• Share files and resources</li>
            <li>• Create group chats for skills</li>
            <li>• Schedule and join live sessions</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Chat;
