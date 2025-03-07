import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RiUpload2Line, RiImageEditLine, RiDownload2Line, RiGalleryLine, RiSave3Line, RiCoinLine } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { useCoins } from '../contexts/CoinContext';
import { NeonButton, GlassCard, AILoadingSpinner } from '../components/FuturisticUI';
import { supabase } from '../lib/supabase';
import { removeBackground } from '@imgly/background-removal';
import { useToolAction } from '../hooks/useToolAction';
import { TOOL_COSTS } from '../config/coinConfig';

const BgRemove: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { balance } = useCoins();
  const handleToolAction = useToolAction('bg-remove');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }
      setSelectedImage(file);
      setProcessedImage(null);
      setError(null);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
      toast.success('Image uploaded successfully!');
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(false);
    
    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      const file = event.dataTransfer.files[0];
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }
      setSelectedImage(file);
      setProcessedImage(null);
      setError(null);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
      toast.success('Image uploaded successfully!');
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedImage) return;

    if (!user?.id) {
      toast.error('Please log in to use this feature');
      return;
    }

    if (balance < TOOL_COSTS['bg-remove']) {
      toast.error(`Not enough coins. You need ${TOOL_COSTS['bg-remove']} coins.`);
      navigate('/shop');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setProgress(0);
    
    try {
      // First check if user can pay
      const canProceed = await handleToolAction();
      if (!canProceed) {
        throw new Error('Failed to process payment');
      }

      // Only process the image after successful payment
      const processedBlob = await removeBackground(selectedImage, {
        progress: (_, progressValue) => {
          // Ensure progress is between 0-100
          const normalizedProgress = Math.min(100, Math.max(0, progressValue * 100));
          setProgress(Math.round(normalizedProgress));
        },
      });

      // Convert blob to data URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setProcessedImage(reader.result as string);
        toast.success('Background removed successfully!');
      };
      reader.readAsDataURL(processedBlob);
    } catch (error) {
      console.error('Error processing file:', error);
      const message = error instanceof Error ? error.message : 'An error occurred';
      setError(message);
      toast.error(message);
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const handleSaveToGallery = async () => {
    if (!processedImage || isSaving) return;
    
    setIsSaving(true);
    try {
      // Get current user session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) {
        throw new Error('No authenticated user found');
      }

      // Convert base64/data URL to blob
      const response = await fetch(processedImage);
      const blob = await response.blob();

      // Generate unique filename
      const filename = `bg-removed-${Date.now()}.png`;
      
      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('generated-images')
        .upload(filename, blob, {
          contentType: 'image/png',
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('generated-images')
        .getPublicUrl(filename);

      // Save to database
      const { error: dbError } = await supabase
        .from('generated_images')
        .insert([
          {
            prompt: 'Background removed image',
            image_url: publicUrl,
            type: 'bg-remove',
            settings: { original: previewImage },
            user_id: session.user.id,
            created_at: new Date().toISOString()
          }
        ]);

      if (dbError) throw dbError;

      toast.success('Image saved to gallery!');
    } catch (error) {
      console.error('Error saving to gallery:', error);
      toast.error('Failed to save image to gallery');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-[calc(100vh-4rem)] p-2 sm:p-4 lg:p-8"
    >
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto mb-4 sm:mb-6 lg:mb-8"
      >
        <GlassCard variant="cyber" className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-orbitron font-bold bg-gradient-to-r from-neon-cyan via-holographic-teal to-ai-magenta bg-clip-text text-transparent text-center sm:text-left">
                Remove Background
              </h1>
              <p className="text-futuristic-silver/80 text-sm sm:text-base font-inter max-w-2xl mt-2">
                Remove backgrounds from your images with AI precision - now processed entirely in your browser!
              </p>
              <p className="text-futuristic-silver/60 text-sm mt-2">
                Cost: {TOOL_COSTS['bg-remove']} coins per background removal
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <div className="flex items-center gap-2 text-neon-cyan mb-2 sm:mb-0">
                <RiCoinLine className="w-5 h-5" />
                <span className="font-orbitron">{balance} coins</span>
              </div>
              <NeonButton
                variant="secondary"
                size="sm"
                onClick={() => navigate('/gallery')}
              >
                <RiGalleryLine className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">View Gallery</span>
              </NeonButton>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <GlassCard variant="cyber" className="p-4 sm:p-6">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              {/* Upload Area */}
              <motion.div
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className={`relative cursor-pointer ${isDragging ? 'scale-102' : ''}`}
              >
                <div
                  className={`border-2 border-dashed rounded-lg transition-all duration-200 ${
                    isDragging
                      ? 'border-neon-cyan bg-neon-cyan/10'
                      : 'border-neon-cyan/30 hover:border-neon-cyan/60'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById('fileInput')?.click()}
                >
                  <input
                    id="fileInput"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <div className="p-8 sm:p-12 text-center">
                    <motion.div
                      animate={{ scale: isDragging ? 1.1 : 1 }}
                      className="mx-auto w-16 h-16 sm:w-20 sm:h-20 text-neon-cyan/70 mb-4"
                    >
                      <RiUpload2Line className="w-full h-full" />
                    </motion.div>
                    <h3 className="text-lg sm:text-xl font-orbitron text-futuristic-silver mb-2">
                      Drop your image here
                    </h3>
                    <p className="text-sm text-futuristic-silver/60 font-inter">
                      or click to select from your device
                    </p>
                    <p className="text-xs text-futuristic-silver/40 font-inter mt-2">
                      Supports PNG, JPG, JPEG up to 5MB
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Preview and Results */}
              {previewImage && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Original Image */}
                  <div>
                    <h3 className="text-futuristic-silver font-orbitron mb-2">Original Image</h3>
                    <div className="relative aspect-square rounded-lg overflow-hidden bg-grid-pattern">
                      <img
                        src={previewImage}
                        alt="Original"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>

                  {/* Processed Image */}
                  <div>
                    <h3 className="text-futuristic-silver font-orbitron mb-2">
                      {processedImage ? 'Background Removed' : 'Result'}
                    </h3>
                    <div className="relative aspect-square rounded-lg overflow-hidden bg-grid-pattern">
                      {processedImage ? (
                        <img
                          src={processedImage}
                          alt="Processed"
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          {isProcessing ? (
                            <div className="text-center">
                              <AILoadingSpinner />
                              <p className="text-futuristic-silver/60 mt-4">
                                Processing... {progress}%
                              </p>
                            </div>
                          ) : (
                            <p className="text-futuristic-silver/60">
                              Click "Remove Background" to process
                              {!user?.id && (
                                <span className="block mt-2">Please log in to use this feature</span>
                              )}
                              {user?.id && balance < TOOL_COSTS['bg-remove'] && (
                                <span className="block mt-2">
                                  Not enough coins. You need {TOOL_COSTS['bg-remove']} coins.
                                  <br />
                                  <NeonButton
                                    variant="secondary"
                                    size="sm"
                                    onClick={() => navigate('/shop')}
                                    className="mt-2"
                                  >
                                    Get More Coins
                                  </NeonButton>
                                </span>
                              )}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap justify-center gap-4">
                {previewImage && !processedImage && (
                  <NeonButton
                    variant="primary"
                    disabled={isProcessing}
                    className="w-full sm:w-auto"
                  >
                    <RiImageEditLine className="w-5 h-5 mr-2" />
                    {isProcessing ? 'Processing...' : 'Remove Background'}
                  </NeonButton>
                )}

                {processedImage && (
                  <>
                    <NeonButton
                      variant="primary"
                      onClick={() => {
                        const link = document.createElement('a');
                        link.href = processedImage;
                        link.download = 'removed-background.png';
                        link.click();
                      }}
                    >
                      <RiDownload2Line className="w-5 h-5 mr-2" />
                      Download
                    </NeonButton>

                    <NeonButton
                      onClick={handleSaveToGallery}
                      disabled={isSaving}
                      variant="secondary"
                    >
                      <RiSave3Line className="w-5 h-5 mr-2" />
                      {isSaving ? 'Saving...' : 'Save to Gallery'}
                    </NeonButton>
                  </>
                )}
              </div>

              {error && (
                <div className="text-error text-center p-4 rounded-lg bg-error/10">
                  {error}
                </div>
              )}
            </form>
          </GlassCard>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default BgRemove; 