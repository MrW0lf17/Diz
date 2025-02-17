import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RiUpload2Line, RiImageEditLine, RiDownload2Line, RiGalleryLine, RiSave3Line, RiMagicLine, RiScissorsCutLine } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { NeonButton, GlassCard, AILoadingSpinner } from '../components/FuturisticUI';
import { supabase } from '../lib/supabase';

interface EditedImage {
  url: string;
  type: 'background-removal' | 'face-swap' | 'enhancement';
  originalImage: string;
}

const ImageEditor: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [editedImage, setEditedImage] = useState<EditedImage | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeEffect, setActiveEffect] = useState<'background-removal' | 'face-swap' | 'enhancement' | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size must be less than 10MB');
        return;
      }
      setSelectedImage(file);
      setEditedImage(null);
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
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size must be less than 10MB');
        return;
      }
      setSelectedImage(file);
      setEditedImage(null);
      setError(null);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
      toast.success('Image uploaded successfully!');
    }
  };

  const handleProcess = async (type: 'background-removal' | 'face-swap' | 'enhancement') => {
    if (!selectedImage) return;

    setIsProcessing(true);
    setError(null);
    setActiveEffect(type);
    
    try {
      const formData = new FormData();
      formData.append('file', selectedImage);
      formData.append('type', type);

      const endpoint = type === 'background-removal' 
        ? '/api/ai/remove-background'
        : type === 'face-swap'
        ? '/api/ai/face-swap'
        : '/api/ai/enhance';

      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to process image with ${type}`);
      }

      const data = await response.json();
      
      if (data.processed_url || data.image_data) {
        setEditedImage({
          url: data.processed_url || data.image_data,
          type,
          originalImage: previewImage as string
        });
        toast.success(`Image ${type.replace('-', ' ')} successful!`);
      }
    } catch (error) {
      console.error('Error processing file:', error);
      const message = error instanceof Error ? error.message : 'An error occurred';
      setError(message);
      toast.error(message);
    } finally {
      setIsProcessing(false);
      setActiveEffect(null);
    }
  };

  const handleSaveToGallery = async () => {
    if (!editedImage || isSaving) return;
    
    setIsSaving(true);
    try {
      // Convert base64/data URL to blob
      const response = await fetch(editedImage.url);
      const blob = await response.blob();

      // Generate unique filename
      const filename = `edited-${editedImage.type}-${Date.now()}.png`;
      
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
            prompt: `Image edited with ${editedImage.type.replace('-', ' ')}`,
            image_url: publicUrl,
            type: editedImage.type,
            settings: { original: editedImage.originalImage }
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
                AI Image Editor
              </h1>
              <p className="text-futuristic-silver/80 text-sm sm:text-base font-inter max-w-2xl mt-2">
                Transform your images with AI-powered editing tools.
              </p>
            </div>
            <div className="flex gap-2">
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
            <div className="space-y-4 sm:space-y-6">
              {/* Upload Area */}
              {!previewImage && (
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
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input
                      ref={fileInputRef}
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
                        Supports PNG, JPG, JPEG up to 10MB
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-xs sm:text-sm font-inter"
                >
                  {error}
                </motion.div>
              )}

              {/* Image Preview and Controls */}
              <AnimatePresence mode="wait">
                {previewImage && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-4"
                  >
                    {/* Image Display */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                      {/* Original Image */}
                      <div>
                        <h4 className="text-sm font-orbitron text-futuristic-silver mb-2">
                          Original Image
                        </h4>
                        <GlassCard variant="dark" className="overflow-hidden">
                          <div className="aspect-square relative">
                            <img
                              src={previewImage}
                              alt="Original"
                              className="w-full h-full object-contain"
                            />
                          </div>
                        </GlassCard>
                      </div>

                      {/* Processed Image */}
                      {editedImage ? (
                        <div>
                          <h4 className="text-sm font-orbitron text-futuristic-silver mb-2">
                            Processed Image
                          </h4>
                          <GlassCard variant="dark" className="overflow-hidden">
                            <div className="aspect-square relative">
                              <img
                                src={editedImage.url}
                                alt="Processed"
                                className="w-full h-full object-contain"
                              />
                              <div className="absolute top-2 right-2 flex gap-2">
                                <NeonButton
                                  variant="secondary"
                                  size="sm"
                                  onClick={() => {
                                    const link = document.createElement('a');
                                    link.href = editedImage.url;
                                    link.download = `edited-${editedImage.type}.png`;
                                    document.body.appendChild(link);
                                    link.click();
                                    document.body.removeChild(link);
                                    toast.success('Image downloaded successfully!');
                                  }}
                                >
                                  <RiDownload2Line className="w-4 h-4" />
                                </NeonButton>
                                <NeonButton
                                  variant="primary"
                                  size="sm"
                                  onClick={handleSaveToGallery}
                                  disabled={isSaving}
                                >
                                  {isSaving ? (
                                    <AILoadingSpinner size="sm" variant="cyber" />
                                  ) : (
                                    <RiSave3Line className="w-4 h-4" />
                                  )}
                                </NeonButton>
                              </div>
                            </div>
                          </GlassCard>
                        </div>
                      ) : (
                        <div>
                          <h4 className="text-sm font-orbitron text-futuristic-silver mb-2">
                            Select an Effect
                          </h4>
                          <GlassCard variant="dark" className="p-4">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                              <NeonButton
                                variant="primary"
                                onClick={() => handleProcess('background-removal')}
                                disabled={isProcessing}
                                className="w-full"
                              >
                                {activeEffect === 'background-removal' ? (
                                  <AILoadingSpinner size="sm" variant="cyber" />
                                ) : (
                                  <>
                                    <RiScissorsCutLine className="w-5 h-5 mr-2" />
                                    Remove BG
                                  </>
                                )}
                              </NeonButton>
                              <NeonButton
                                variant="secondary"
                                onClick={() => handleProcess('face-swap')}
                                disabled={isProcessing}
                                className="w-full"
                              >
                                {activeEffect === 'face-swap' ? (
                                  <AILoadingSpinner size="sm" variant="cyber" />
                                ) : (
                                  <>
                                    <RiImageEditLine className="w-5 h-5 mr-2" />
                                    Face Swap
                                  </>
                                )}
                              </NeonButton>
                              <NeonButton
                                variant="accent"
                                onClick={() => handleProcess('enhancement')}
                                disabled={isProcessing}
                                className="w-full"
                              >
                                {activeEffect === 'enhancement' ? (
                                  <AILoadingSpinner size="sm" variant="cyber" />
                                ) : (
                                  <>
                                    <RiMagicLine className="w-5 h-5 mr-2" />
                                    Enhance
                                  </>
                                )}
                              </NeonButton>
                            </div>
                          </GlassCard>
                        </div>
                      )}
                    </div>

                    {/* Reset Button */}
                    {previewImage && (
                      <div className="flex justify-end">
                        <NeonButton
                          variant="secondary"
                          size="sm"
                          onClick={() => {
                            setPreviewImage(null);
                            setSelectedImage(null);
                            setEditedImage(null);
                            setError(null);
                          }}
                        >
                          Upload New Image
                        </NeonButton>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ImageEditor; 