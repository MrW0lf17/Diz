import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { GlassCard } from './FuturisticUI';

interface AdminRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export const AdminRoute: React.FC<AdminRouteProps> = ({ 
  children, 
  redirectTo = '/' 
}) => {
  const { role, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <GlassCard variant="cyber" className="p-8">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-8 h-8 border-4 border-neon-cyan border-t-transparent rounded-full animate-spin" />
            <p className="text-futuristic-silver font-orbitron">Verifying access...</p>
          </div>
        </GlassCard>
      </div>
    );
  }

  if (role !== 'admin') {
    return (
      <Navigate 
        to={redirectTo} 
        replace 
        state={{ from: location, error: 'You need admin access to view this page.' }} 
      />
    );
  }

  return <>{children}</>;
};

export default AdminRoute; 