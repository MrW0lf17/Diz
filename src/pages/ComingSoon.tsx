import React from 'react';

const ComingSoon: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800 text-white p-4">
      <div className="max-w-2xl text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
          AI Generative Fill
        </h1>
        <div className="relative">
          <div className="animate-pulse bg-blue-500/20 rounded-lg p-8 mb-8">
            <p className="text-xl md:text-2xl mb-4">Coming Soon</p>
            <p className="text-gray-300">
              We're working hard to bring you an amazing AI-powered generative fill feature.
              Stay tuned for updates!
            </p>
          </div>
        </div>
        <div className="space-y-4">
          <p className="text-gray-400">
            This feature will allow you to:
          </p>
          <ul className="text-gray-300 space-y-2">
            <li className="flex items-center justify-center space-x-2">
              <span>✨</span>
              <span>Generate content intelligently based on context</span>
            </li>
            <li className="flex items-center justify-center space-x-2">
              <span>🎯</span>
              <span>Fill in missing areas with precise accuracy</span>
            </li>
            <li className="flex items-center justify-center space-x-2">
              <span>🔄</span>
              <span>Seamlessly blend generated content</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ComingSoon; 