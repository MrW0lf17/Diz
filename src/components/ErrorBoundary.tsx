import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate, useRouteError, isRouteErrorResponse } from 'react-router-dom';
import { NeonButton, GlassCard } from './FuturisticUI';
import { RiErrorWarningLine, RiHome2Line, RiRefreshLine } from 'react-icons/ri';

const ErrorBoundary: React.FC = () => {
  const error = useRouteError();
  const navigate = useNavigate();

  let errorMessage = 'An unexpected error occurred';
  let statusCode = 500;

  if (isRouteErrorResponse(error)) {
    statusCode = error.status;
    switch (error.status) {
      case 404:
        errorMessage = 'The page you are looking for does not exist';
        break;
      case 401:
        errorMessage = 'You are not authorized to access this page';
        break;
      case 403:
        errorMessage = 'Access forbidden';
        break;
      case 503:
        errorMessage = 'Service temporarily unavailable';
        break;
      default:
        errorMessage = error.statusText;
    }
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  return (
    <div className="min-h-screen bg-base-dark p-4 sm:p-6 lg:p-8 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl"
      >
        <GlassCard variant="cyber" className="p-8 text-center">
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-gradient-cyber flex items-center justify-center mb-6">
              <RiErrorWarningLine className="w-12 h-12 text-white" />
            </div>

            <h1 className="text-4xl font-orbitron font-bold bg-gradient-to-r from-neon-cyan via-holographic-teal to-ai-magenta bg-clip-text text-transparent mb-2">
              Error {statusCode}
            </h1>

            <p className="text-lg text-futuristic-silver/80 font-inter mb-8">
              {errorMessage}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <NeonButton
                variant="secondary"
                onClick={() => navigate(-1)}
              >
                <RiRefreshLine className="w-5 h-5 mr-2" />
                Go Back
              </NeonButton>

              <NeonButton
                variant="primary"
                onClick={() => navigate('/')}
              >
                <RiHome2Line className="w-5 h-5 mr-2" />
                Return Home
              </NeonButton>
            </div>

            <div className="mt-8 text-sm text-futuristic-silver/60 font-inter">
              <p>If this error persists, please contact our support team</p>
              <Link
                to="/contact"
                className="text-neon-cyan hover:text-holographic-teal transition-colors"
              >
                Contact Support
              </Link>
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
};

export default ErrorBoundary; 