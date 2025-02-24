import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { toast } from 'react-hot-toast';

const Callback: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the session to confirm sign in was successful
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          throw sessionError;
        }

        if (!session) {
          console.log('No session found in callback');
          navigate('/auth');
          return;
        }

        console.log('Session confirmed in callback, redirecting...');
        navigate('/dashboard', { replace: true });
      } catch (error) {
        console.error('Error in auth callback:', error);
        toast.error('Failed to complete sign in');
        navigate('/auth');
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-black">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-neon-cyan border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <h2 className="text-xl font-orbitron text-futuristic-silver">
          Completing sign in...
        </h2>
      </div>
    </div>
  );
};

export default Callback;