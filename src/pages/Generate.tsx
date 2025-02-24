import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RiAiGenerate, RiImageEditLine, RiDownload2Line, RiHistoryLine, RiSave3Line, RiGalleryLine } from 'react-icons/ri';
import { toast } from 'react-hot-toast';
import { NeonButton, GlassCard, AILoadingSpinner } from '../components/FuturisticUI';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config';
import { supabase } from '../lib/supabase';

interface GeneratedImage {
  url: string;
  prompt: string;
  timestamp: Date;
  settings: GenerationSettings;
}

interface GenerationSettings {
  width: number;
  height: number;
  steps: number;
  guidance: number;
  style: string;
}

const STYLE_PRESETS = [
  { id: 'cyberpunk', label: 'Cyberpunk', description: 'Neon-lit futuristic aesthetic' },
  { id: 'realistic', label: 'Realistic', description: 'Photorealistic style' },
  { id: 'anime', label: 'Anime', description: 'Japanese animation style' },
  { id: 'digital-art', label: 'Digital Art', description: 'Modern digital artwork' },
  { id: 'oil-painting', label: 'Oil Painting', description: 'Classical oil painting style' },
  { id: 'watercolor', label: 'Watercolor', description: 'Soft watercolor aesthetic' },
];

const Generate: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [settings, setSettings] = useState<GenerationSettings>({
    width: 512,
    height: 512,
    steps: 30,
    guidance: 7.5,
    style: 'cyberpunk',
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          ...settings,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate image');
      }

      const data = await response.json();
      
      const newImage: GeneratedImage = {
        url: data.imageUrl,
        prompt,
        timestamp: new Date(),
        settings: { ...settings },
      };

      setGeneratedImages((prev) => [newImage, ...prev]);
      toast.success('Image generated successfully!');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveToGallery = async (image: GeneratedImage) => {
    if (isSaving) return;
    
    setIsSaving(true);
    try {
      // Get current user session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) {
        throw new Error('No authenticated user found');
      }

      const response = await fetch(`${API_URL}/api/gallery/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          imageUrl: image.url,
          prompt: image.prompt,
          settings: image.settings,
          userId: session.user.id
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save image');
      }

      toast.success('Image saved to gallery!');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save image';
      toast.error(message);
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
                AI Image Generator
              </h1>
              <p className="text-futuristic-silver/80 text-sm sm:text-base font-inter max-w-2xl mt-2">
                Transform your ideas into stunning visuals using cutting-edge AI technology.
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
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Generation Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <GlassCard variant="cyber" className="h-full">
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              {/* Prompt Input */}
              <div>
                <label className="block text-futuristic-silver font-orbitron mb-2 text-sm">
                  Describe your vision
                </label>
                <div className="relative">
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="A cyberpunk city at night with neon lights and flying cars..."
                    className="w-full h-24 sm:h-32 bg-base-dark/40 text-futuristic-silver border border-neon-cyan/20 rounded-lg p-3 focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan placeholder-futuristic-silver/40 font-inter backdrop-blur-sm transition-colors text-sm resize-none"
                  />
                  <div className="absolute inset-0 pointer-events-none rounded-lg bg-gradient-to-b from-neon-cyan/5 to-ai-magenta/5 opacity-50" />
                </div>
              </div>

              {/* Style Selection */}
              <div>
                <label className="block text-futuristic-silver font-orbitron mb-2 text-sm">
                  Choose Style
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[160px] sm:max-h-[200px] overflow-y-auto custom-scrollbar pr-1">
                  {STYLE_PRESETS.map((style) => (
                    <motion.button
                      key={style.id}
                      onClick={() => setSettings({ ...settings, style: style.id })}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`group p-2 sm:p-3 rounded-lg border backdrop-blur-sm transition-all duration-200 ${
                        settings.style === style.id
                          ? 'bg-gradient-cyber border-neon-cyan text-white shadow-lg shadow-neon-cyan/20'
                          : 'bg-base-dark/40 border-futuristic-silver/20 text-futuristic-silver/80 hover:border-neon-cyan/40'
                      }`}
                    >
                      <p className="font-orbitron text-xs">{style.label}</p>
                      <p className="text-[10px] font-inter mt-1 opacity-60 line-clamp-1 group-hover:text-neon-cyan transition-colors">
                        {style.description}
                      </p>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Advanced Settings */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {/* Image Size */}
                <div>
                  <label className="block text-futuristic-silver font-orbitron mb-2 text-xs">
                    Size
                  </label>
                  <select
                    value={`${settings.width}x${settings.height}`}
                    onChange={(e) => {
                      const [width, height] = e.target.value.split('x').map(Number);
                      setSettings({ ...settings, width, height });
                    }}
                    className="w-full bg-base-dark/40 text-futuristic-silver border border-neon-cyan/20 rounded-lg p-2 text-xs focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan font-inter backdrop-blur-sm"
                  >
                    <option value="512x512">512 × 512</option>
                    <option value="768x768">768 × 768</option>
                    <option value="1024x1024">1024 × 1024</option>
                  </select>
                </div>

                {/* Steps */}
                <div>
                  <label className="block text-futuristic-silver font-orbitron mb-2 text-xs">
                    Steps: {settings.steps}
                  </label>
                  <input
                    type="range"
                    min="20"
                    max="50"
                    value={settings.steps}
                    onChange={(e) => setSettings({ ...settings, steps: Number(e.target.value) })}
                    className="w-full accent-neon-cyan"
                  />
                </div>

                {/* Guidance Scale */}
                <div className="col-span-2">
                  <label className="block text-futuristic-silver font-orbitron mb-2 text-xs">
                    Guidance Scale: {settings.guidance}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="20"
                    step="0.5"
                    value={settings.guidance}
                    onChange={(e) => setSettings({ ...settings, guidance: Number(e.target.value) })}
                    className="w-full accent-neon-cyan"
                  />
                </div>
              </div>

              {/* Generate Button */}
              <div className="pt-2 sm:pt-4">
                <NeonButton
                  variant="primary"
                  size="lg"
                  onClick={handleGenerate}
                  disabled={isLoading || !prompt.trim()}
                  className="w-full"
                >
                  {isLoading ? (
                    <>
                      <AILoadingSpinner size="sm" variant="cyber" />
                      <span className="ml-2">Generating...</span>
                    </>
                  ) : (
                    <>
                      <RiAiGenerate className="w-5 h-5 mr-2" />
                      Generate Image
                    </>
                  )}
                </NeonButton>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-xs sm:text-sm font-inter"
                >
                  {error}
                </motion.div>
              )}
            </div>
          </GlassCard>
        </motion.div>

        {/* Generated Images */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <GlassCard variant="cyber" className="h-full">
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base sm:text-lg font-orbitron font-bold text-futuristic-silver flex items-center">
                  <RiHistoryLine className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  History
                </h2>
              </div>

              {isLoading && generatedImages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-[300px] sm:h-[400px] text-center">
                  <AILoadingSpinner size="lg" variant="cyber" text="Creating your masterpiece..." />
                  <p className="mt-4 text-futuristic-silver/60 text-xs sm:text-sm font-inter max-w-[250px]">
                    Harnessing AI to bring your vision to life...
                  </p>
                </div>
              )}

              {!isLoading && generatedImages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-[300px] sm:h-[400px] text-center p-4 sm:p-6">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 mb-4 text-futuristic-silver/40">
                    <RiImageEditLine className="w-full h-full" />
                  </div>
                  <p className="text-futuristic-silver/40 font-inter text-sm">
                    Your generated images will appear here
                  </p>
                  <p className="text-futuristic-silver/30 font-inter text-xs mt-2">
                    Enter a prompt and choose your settings to begin
                  </p>
                </div>
              )}

              <AnimatePresence mode="popLayout">
                {generatedImages.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 max-h-[500px] sm:max-h-[600px] overflow-y-auto custom-scrollbar pr-1"
                  >
                    {generatedImages.map((image, index) => (
                      <motion.div
                        key={image.timestamp.getTime()}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <GlassCard variant="cyber" className="group overflow-hidden">
                          <div className="relative aspect-square">
                            <img
                              src={image.url}
                              alt={image.prompt}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-cyber opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                            
                            {/* Action Buttons */}
                            <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                              <NeonButton
                                variant="secondary"
                                size="sm"
                                onClick={() => {
                                  const link = document.createElement('a');
                                  link.href = image.url;
                                  link.download = `generated-${image.timestamp.getTime()}.png`;
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
                                onClick={() => handleSaveToGallery(image)}
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
                          <div className="p-3 space-y-2">
                            <p className="text-xs text-futuristic-silver/80 font-inter line-clamp-2">
                              {image.prompt}
                            </p>
                            <div className="flex flex-wrap gap-2">
                              <span className="text-[10px] text-neon-cyan/60 font-inter px-2 py-0.5 rounded-full bg-neon-cyan/10 backdrop-blur-sm">
                                {image.settings.width} × {image.settings.height}
                              </span>
                              <span className="text-[10px] text-neon-cyan/60 font-inter px-2 py-0.5 rounded-full bg-neon-cyan/10 backdrop-blur-sm">
                                {image.settings.style}
                              </span>
                            </div>
                            <p className="text-[10px] text-futuristic-silver/40 font-inter">
                              {image.timestamp.toLocaleString()}
                            </p>
                          </div>
                        </GlassCard>
                      </motion.div>
                    ))}
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

export default Generate; 