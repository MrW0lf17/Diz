import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { RiRefreshLine, RiDownloadLine, RiDeleteBin6Line } from 'react-icons/ri';
import { NeonButton, GlassCard, AILoadingSpinner } from '../components/FuturisticUI';

interface SavedImage {
  id: string;
  prompt: string;
  image_url: string;
  created_at: string;
}

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const Gallery: React.FC = () => {
  const [images, setImages] = useState<SavedImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<SavedImage | null>(null);
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [downloading, setDownloading] = useState<string | null>(null);

  useEffect(() => {
    loadImages();
    
    // Set up auto-refresh every 10 seconds
    const refreshInterval = setInterval(() => {
      console.log('Auto-refreshing gallery...');
      setLastRefresh(new Date());
    }, 10000);

    return () => clearInterval(refreshInterval);
  }, []);

  // Reload images when lastRefresh changes
  useEffect(() => {
    loadImages();
  }, [lastRefresh]);

  const loadImages = async () => {
    try {
      console.log('Loading images from Supabase...', new Date().toISOString());
      
      // Get current user session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) {
        console.log('No authenticated user found');
        setImages([]);
        return;
      }

      const { data, error } = await supabase
        .from('generated_images')
        .select('*')
        .eq('user_id', session.user.id)  // Only fetch images for current user
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase query error:', error);
        throw error;
      }

      console.log('Raw data from Supabase:', data);
      console.log('Images loaded:', data?.length || 0, 'images found');
      
      if (!data || data.length === 0) {
        console.log('No images found in the database');
        setImages([]);
        return;
      }

      // Set images immediately without waiting for verification
      const validImages = data.filter(image => {
        if (!image.id || !image.image_url || !image.prompt || !image.created_at) {
          console.error('Invalid image data:', image);
          return false;
        }
        return true;
      });

      console.log('Valid images:', validImages.length, 'out of', data.length);
      setImages(validImages);

      // Verify images in the background
      validImages.forEach(async (image) => {
        try {
          console.log('Verifying image URL:', image.image_url);
          const response = await fetch(image.image_url, { method: 'HEAD' });
          if (!response.ok) {
            console.error(`Image not accessible: ${image.image_url}, Status: ${response.status}`);
            setFailedImages(prev => new Set(Array.from(prev).concat([image.id])));
          } else {
            console.log(`Image URL verified: ${image.image_url}`);
          }
        } catch (error) {
          console.error(`Error verifying image: ${image.image_url}`, error);
          setFailedImages(prev => new Set(Array.from(prev).concat([image.id])));
        }
      });

    } catch (error) {
      console.error('Error loading images:', error);
      toast.error('Failed to load images');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      console.log('Starting delete process for image:', id);
      const imageToDelete = images.find(img => img.id === id);
      if (!imageToDelete) {
        console.error('Image not found in state:', id);
        return;
      }

      // Delete from storage
      const fileName = imageToDelete.image_url.split('/').pop();
      if (fileName) {
        console.log('Deleting from storage:', fileName);
        const { error: storageError } = await supabase.storage
          .from('generated-images')
          .remove([fileName]);
          
        if (storageError) {
          console.error('Storage deletion error:', storageError);
          throw storageError;
        }
        console.log('Storage deletion successful');
      }

      // Delete from database
      console.log('Deleting from database...');
      const { error } = await supabase
        .from('generated_images')
        .delete()
        .match({ id });

      if (error) {
        console.error('Database deletion error:', error);
        throw error;
      }

      console.log('Database deletion successful');
      setImages(images.filter(img => img.id !== id));
      toast.success('Image deleted successfully');
    } catch (error) {
      console.error('Error deleting image:', error);
      toast.error('Failed to delete image');
    }
  };

  const handleImageError = (imageId: string) => {
    console.log('Image failed to load:', imageId);
    setFailedImages(prev => new Set(Array.from(prev).concat([imageId])));
  };

  const handleDownload = async (image: SavedImage) => {
    if (downloading === image.id) return;
    
    setDownloading(image.id);
    try {
      const response = await fetch(image.image_url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `generated-image-${image.prompt.slice(0, 30)}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('Image downloaded successfully!');
    } catch (error) {
      console.error('Error downloading image:', error);
      toast.error('Failed to download image');
    } finally {
      setDownloading(null);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-[calc(100vh-4rem)] bg-base-dark text-futuristic-silver p-2 sm:p-4 lg:p-8"
    >
      <div className="max-w-7xl mx-auto">
        <GlassCard variant="cyber" className="p-4 sm:p-6 mb-4 sm:mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-orbitron bg-gradient-cyber bg-clip-text text-transparent text-center sm:text-left">
              Image Gallery
            </h1>
            <NeonButton
              variant="primary"
              onClick={() => setLastRefresh(new Date())}
              className="flex items-center gap-2 w-full sm:w-auto"
              size="sm"
            >
              <RiRefreshLine className="text-xl" />
              <span className="sm:hidden">Refresh</span>
              <span className="hidden sm:inline">Refresh Gallery</span>
            </NeonButton>
          </div>
        </GlassCard>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <AILoadingSpinner size="lg" variant="cyber" text="Loading gallery..." />
          </div>
        ) : images.length === 0 ? (
          <GlassCard variant="cyber" className="p-6 sm:p-12 text-center">
            <p className="text-base sm:text-lg text-futuristic-silver/60 font-inter">No images saved yet.</p>
            <NeonButton
              variant="primary"
              onClick={() => window.location.href = '/generate'}
              className="mt-4 w-full sm:w-auto"
            >
              Generate Your First Image
            </NeonButton>
          </GlassCard>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6"
          >
            <AnimatePresence mode="popLayout">
              {images.map((image, index) => (
                <motion.div
                  key={image.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <GlassCard
                    variant="cyber"
                    className="overflow-hidden group hover:border-neon-cyan/40 transition-all duration-200"
                  >
                    <div className="aspect-w-1 aspect-h-1 relative">
                      {failedImages.has(image.id) ? (
                        <div className="flex items-center justify-center w-full h-full bg-base-dark/50 text-futuristic-silver/40 font-inter text-sm">
                          <p>Image not available</p>
                        </div>
                      ) : (
                        <>
                          <img
                            src={image.image_url}
                            alt={image.prompt}
                            className="object-cover w-full h-full cursor-pointer transition-all duration-300 group-hover:scale-105"
                            onClick={() => setSelectedImage(image)}
                            onError={() => handleImageError(image.id)}
                          />
                          <div className="absolute inset-0 bg-base-dark/80 opacity-0 group-hover:opacity-100 sm:group-hover:opacity-100 transition-all duration-200">
                            <div className="absolute inset-0 flex items-center justify-center gap-2 sm:gap-4">
                              <NeonButton
                                variant="primary"
                                onClick={() => handleDownload(image)}
                                disabled={downloading === image.id}
                                size="sm"
                              >
                                {downloading === image.id ? (
                                  <AILoadingSpinner size="sm" variant="cyber" />
                                ) : (
                                  <RiDownloadLine className="text-lg sm:text-xl" />
                                )}
                              </NeonButton>
                              <NeonButton
                                variant="secondary"
                                onClick={() => handleDelete(image.id)}
                                size="sm"
                              >
                                <RiDeleteBin6Line className="text-lg sm:text-xl" />
                              </NeonButton>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                    <div className="p-3 sm:p-4">
                      <p className="text-xs sm:text-sm text-futuristic-silver/80 font-inter line-clamp-2 group-hover:text-neon-cyan transition-colors">
                        {image.prompt}
                      </p>
                      <p className="text-[10px] sm:text-xs text-futuristic-silver/40 font-inter mt-1 sm:mt-2">
                        {new Date(image.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Image Preview Modal */}
        <AnimatePresence>
          {selectedImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-base-dark/90 backdrop-blur-sm z-50 p-2 sm:p-4"
              onClick={() => setSelectedImage(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="w-full h-full flex items-center justify-center"
              >
                <div 
                  className="w-full max-w-4xl max-h-[90vh] overflow-auto"
                  onClick={e => e.stopPropagation()}
                >
                  <GlassCard variant="cyber" className="overflow-hidden">
                    <img
                      src={selectedImage.image_url}
                      alt={selectedImage.prompt}
                      className="w-full h-auto"
                    />
                    <div className="p-3 sm:p-4">
                      <p className="text-sm sm:text-base text-futuristic-silver font-inter mb-2 sm:mb-4">
                        {selectedImage.prompt}
                      </p>
                      <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-4">
                        <NeonButton
                          variant="primary"
                          onClick={() => handleDownload(selectedImage)}
                          disabled={downloading === selectedImage.id}
                          className="w-full sm:w-auto"
                          size="sm"
                        >
                          {downloading === selectedImage.id ? (
                            <AILoadingSpinner size="sm" variant="cyber" />
                          ) : (
                            <>
                              <RiDownloadLine className="text-lg sm:text-xl mr-2" />
                              Download
                            </>
                          )}
                        </NeonButton>
                        <NeonButton
                          variant="secondary"
                          onClick={() => setSelectedImage(null)}
                          className="w-full sm:w-auto"
                          size="sm"
                        >
                          Close
                        </NeonButton>
                      </div>
                    </div>
                  </GlassCard>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Gallery; 