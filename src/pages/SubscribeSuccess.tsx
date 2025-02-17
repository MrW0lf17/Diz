import React from 'react';
import { Link } from 'react-router-dom';

const SubscribeSuccess = () => {
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mx-auto h-24 w-24 text-indigo-600">
            <svg className="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="mt-8 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Welcome to Pro!
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Your subscription has been successfully activated. You now have access to all premium features.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              to="/image-editor"
              className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Start Using Pro Features
            </Link>
            <Link
              to="/"
              className="text-sm font-semibold leading-6 text-gray-900"
            >
              Go to Home <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscribeSuccess; 