import { cleanupExpiredMedia } from './storageUtils';

const CLEANUP_INTERVAL = 1000 * 60 * 60; // 1 hour
const BUCKETS_TO_CLEAN = ['generated_videos', 'job_applications', 'user_uploads'];

export const startCleanupJob = () => {
  const cleanup = async () => {
    try {
      await Promise.all(
        BUCKETS_TO_CLEAN.map(bucket => cleanupExpiredMedia(bucket))
      );
      console.log('Cleanup job completed successfully');
    } catch (error) {
      console.error('Error in cleanup job:', error);
    }
  };

  // Run immediately
  cleanup();

  // Then run periodically
  const interval = setInterval(cleanup, CLEANUP_INTERVAL);

  // Return cleanup function
  return () => clearInterval(interval);
};

// Function to be called from App.tsx
export const initializeCleanupJob = () => {
  if (typeof window !== 'undefined') { // Only run in browser
    return startCleanupJob();
  }
  return () => {}; // No-op for SSR
}; 