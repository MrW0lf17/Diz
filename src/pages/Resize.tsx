import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RiUpload2Line, RiDownload2Line, RiZoomInLine, RiImageLine, RiSave3Line, RiCoinLine } from 'react-icons/ri';
import { toast } from 'react-hot-toast';
import { NeonButton, GlassCard, AILoadingSpinner } from '../components/FuturisticUI';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useToolAction } from '../hooks/useToolAction';
import { useCoins } from '../contexts/CoinContext';
import { TOOL_COSTS } from '../config/coinConfig';

const Resize: React.FC = () => {
  const handleToolAction = useToolAction('resize');
  
  const { user } = useAuth();
  const { balance } = useCoins();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [processedImage, setProcessedImage] = useState<string>('');
  const [scale, setScale] = useState<number>(1);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      validateAndSetImage(file);
    }
  };

  const validateAndSetImage = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      toast.error('Image size should be less than 10MB');
      return;
    }

    setSelectedImage(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setProcessedImage('');
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

    const file = event.dataTransfer.files?.[0];
    if (file) {
      validateAndSetImage(file);
    }
  };

  const handleProcess = async () => {
    if (!selectedImage) return;

    if (!user) {
      toast.error('Please log in to use this feature');
      return;
    }

    console.log('Current balance:', balance);
    console.log('Tool cost:', TOOL_COSTS['resize']);

    if (balance < TOOL_COSTS['resize']) {
      toast.error(`Not enough coins. You need ${TOOL_COSTS['resize']} coins.`);
      return;
    }

    setIsProcessing(true);
    try {
      // First check if user can pay
      console.log('Attempting to deduct coins...');
      const canProceed = await handleToolAction();
      console.log('Can proceed:', canProceed);

      if (!canProceed) {
        throw new Error('Failed to process payment');
      }

      // Create a new image element
      const img = new Image();
      img.src = previewUrl;
      
      await new Promise((resolve) => {
        img.onload = () => {
          // Create canvas with new dimensions
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          const newWidth = img.width * scale;
          const newHeight = img.height * scale;
          
          canvas.width = newWidth;
          canvas.height = newHeight;
          
          // Enable image smoothing for better quality
          if (ctx) {
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            
            // Draw image with new dimensions
            ctx.drawImage(img, 0, 0, newWidth, newHeight);
            
            // Convert to base64
            const resizedImage = canvas.toDataURL('image/png', 1.0);
            setProcessedImage(resizedImage);
          }
          resolve(null);
        };
      });

      toast.success('Image resized successfully!');
    } catch (error) {
      console.error('Error processing image:', error);
      const message = error instanceof Error ? error.message : 'Failed to process image';
      toast.error(message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = async () => {
    if (!processedImage) return;

    const link = document.createElement('a');
    link.href = processedImage;
    link.download = `resized_${selectedImage?.name || 'image'}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSaveToGallery = async () => {
    if (!processedImage || !user) return;

    setIsSaving(true);
    try {
      // Convert base64 to blob
      const base64Response = await fetch(processedImage);
      const blob = await base64Response.blob();

      // Generate unique filename
      const filename = `resize_${Date.now()}_${selectedImage?.name || 'image.png'}`;

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('images')
        .upload(`public/${user.id}/${filename}`, blob, {
          contentType: 'image/png',
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('images')
        .getPublicUrl(`public/${user.id}/${filename}`);

      if (!publicUrlData.publicUrl) throw new Error('Failed to get public URL');

      // Save metadata to database
      const { error: dbError } = await supabase
        .from('generated_images')
        .insert({
          user_id: user.id,
          image_url: publicUrlData.publicUrl,
          prompt: `Resized image (${scale}x)`,
          type: 'resize',
          original_filename: selectedImage?.name || 'image.png',
          settings: { scale }
        });

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
    <div className="min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-4xl mx-auto mb-12"
      >
        <h1 className="text-4xl sm:text-5xl font-orbitron font-bold bg-gradient-to-r from-neon-cyan via-holographic-teal to-ai-magenta bg-clip-text text-transparent mb-4">
          Image Resize
        </h1>
        <p className="text-lg text-futuristic-silver/80 font-inter">
          Resize your images with high-quality results
        </p>
        <div className="flex items-center justify-center gap-4 mt-4">
          <div className="flex items-center gap-2 text-neon-cyan">
            <RiCoinLine className="w-5 h-5" />
            <span className="font-orbitron">{balance} coins</span>
          </div>
          <div className="text-futuristic-silver/60 text-sm">
            Cost: {TOOL_COSTS['resize']} coins per resize
          </div>
        </div>
      </motion.div>

      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <GlassCard variant="cyber" className="h-full">
              <div
                className={`p-8 h-full ${!selectedImage ? 'flex flex-col items-center justify-center' : ''}`}
              >
                {!selectedImage ? (
                  <div
                    className={`w-full aspect-video border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-colors duration-200 ${
                      isDragging
                        ? 'border-neon-cyan bg-neon-cyan/10'
                        : 'border-futuristic-silver/20 hover:border-neon-cyan/40 hover:bg-neon-cyan/5'
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <RiUpload2Line className="w-12 h-12 text-futuristic-silver/40 mb-4" />
                    <p className="text-futuristic-silver/60 text-center font-inter">
                      Drag and drop your image here
                      <br />
                      or click to browse
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="relative aspect-video rounded-xl overflow-hidden">
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-orbitron text-futuristic-silver mb-2">
                          Resize Scale ({scale}x)
                        </label>
                        <input
                          type="range"
                          min="0.5"
                          max="4"
                          step="0.1"
                          value={scale}
                          onChange={(e) => setScale(parseFloat(e.target.value))}
                          className="w-full accent-neon-cyan"
                        />
                        <div className="flex justify-between text-xs text-futuristic-silver/60 font-inter mt-1">
                          <span>0.5x</span>
                          <span>4x</span>
                        </div>
                      </div>
                      <div className="flex justify-between gap-4">
                        <NeonButton
                          variant="secondary"
                          onClick={() => {
                            setSelectedImage(null);
                            setPreviewUrl('');
                            setProcessedImage('');
                          }}
                        >
                          Clear
                        </NeonButton>
                        <NeonButton
                          variant="primary"
                          onClick={handleProcess}
                          disabled={isProcessing}
                        >
                          {isProcessing ? (
                            <>
                              <AILoadingSpinner size="sm" className="mr-2" />
                              Processing...
                            </>
                          ) : (
                            <>
                              <RiZoomInLine className="w-5 h-5 mr-2" />
                              Resize Image
                            </>
                          )}
                        </NeonButton>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </GlassCard>
          </motion.div>

          {/* Result Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <GlassCard variant="cyber" className="h-full">
              <div className="p-8 h-full">
                {processedImage ? (
                  <div className="space-y-6">
                    <div className="relative aspect-video rounded-xl overflow-hidden">
                      <img
                        src={processedImage}
                        alt="Processed"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex justify-end gap-4">
                      <NeonButton
                        variant="secondary"
                        onClick={handleSaveToGallery}
                        disabled={isSaving || !user}
                      >
                        {isSaving ? (
                          <>
                            <AILoadingSpinner size="sm" className="mr-2" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <RiSave3Line className="w-5 h-5 mr-2" />
                            Save to Gallery
                          </>
                        )}
                      </NeonButton>
                      <NeonButton variant="primary" onClick={handleDownload}>
                        <RiDownload2Line className="w-5 h-5 mr-2" />
                        Download
                      </NeonButton>
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center">
                    <RiImageLine className="w-12 h-12 text-futuristic-silver/20 mb-4" />
                    <p className="text-futuristic-silver/40 font-inter">
                      Processed image will appear here
                    </p>
                  </div>
                )}
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Resize; 