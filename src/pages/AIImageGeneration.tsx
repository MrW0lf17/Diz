import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import Replicate from "replicate";
import { supabase } from '../lib/supabase';
import { API_URL, AUTH_TOKEN_KEY } from '../config';
import { v4 as uuid } from 'uuid';
import { NeonButton, GlassCard, AILoadingSpinner } from '../components/FuturisticUI';
import { useToolAction } from '../hooks/useToolAction';
import { useNavigate } from 'react-router-dom';

interface GeneratedImage {
  url: string;
  prompt: string;
  translatedPrompt?: string;
  timestamp: string;
}

interface StylePreset {
  name: string;
  label: string;
  promptSuffix: string;
  description: string;
}

const STYLE_PRESETS: StylePreset[] = [
  { 
    name: 'none',
    label: 'Standard AI',
    promptSuffix: ', high quality, detailed, sharp focus',
    description: 'Standard high-quality image generation'
  },
  { 
    name: 'realistic',
    label: 'Ultra Realistic',
    promptSuffix: ', ultra realistic, photorealistic, 8k uhd, high detail, professional photography, masterpiece, sharp focus, high resolution, cinematic lighting',
    description: 'Ultra-realistic photography style'
  },
  { 
    name: 'anime',
    label: 'Anime Creator',
    promptSuffix: ', anime style, high quality anime art, Studio Ghibli, detailed anime illustration, anime key visual, vibrant colors, beautiful anime artwork',
    description: 'Japanese animation style'
  },
  { 
    name: 'cyberpunk',
    label: 'Neo Future',
    promptSuffix: ', cyberpunk style, neon lights, dark futuristic city, high tech, cyber aesthetics, blade runner style, neon-noir, rain, reflective surfaces, holographic displays',
    description: 'Futuristic sci-fi style'
  },
  { 
    name: 'cartoon',
    label: 'Cartoon Creator',
    promptSuffix: ', cartoon style, 2D animation, vibrant colors, clean lines, Disney Pixar style, expressive characters, whimsical illustration',
    description: 'Fun cartoon style'
  },
  { 
    name: 'fantasy',
    label: 'Fantasy World',
    promptSuffix: ', fantasy art, magical atmosphere, ethereal lighting, mystical environment, detailed fantasy illustration, epic scene, dramatic lighting, majestic',
    description: 'Magical fantasy style'
  },
  { 
    name: 'oil-painting',
    label: 'Oil Painting',
    promptSuffix: ', oil painting, traditional art, detailed brushstrokes, textured canvas, classical painting style, rich colors, masterpiece, museum quality, fine art',
    description: 'Classical painting style'
  },
  { 
    name: 'watercolor',
    label: 'Watercolor Art',
    promptSuffix: ', watercolor painting, soft watercolor effects, flowing colors, delicate brushwork, artistic, traditional watercolor style, paper texture',
    description: 'Soft watercolor style'
  },
  { 
    name: 'pop-art',
    label: 'Pop Art',
    promptSuffix: ', pop art style, Andy Warhol inspired, bold colors, halftone dots, comic book style, retro pop art aesthetic, graphic design, bold outlines',
    description: 'Retro pop art style'
  },
  { 
    name: '3d-render',
    label: '3D Creator',
    promptSuffix: ', 3D render, octane render, cinema 4D, high detail, physically based rendering, realistic lighting, subsurface scattering, ray tracing, 3D modeling',
    description: '3D rendered style'
  },
  { 
    name: 'pixel-art',
    label: 'Pixel Art',
    promptSuffix: ', pixel art, 16-bit style, retro game art, pixelated, classic video game style, detailed pixel illustration, crisp pixels, retro gaming aesthetic',
    description: 'Retro gaming style'
  },
  { 
    name: 'minimalist',
    label: 'Minimalist',
    promptSuffix: ', minimalist design, clean lines, simple shapes, minimal color palette, negative space, modern minimalist style, elegant simplicity',
    description: 'Clean minimalist style'
  },
  { 
    name: 'steampunk',
    label: 'Victorian Tech',
    promptSuffix: ', steampunk style, Victorian era aesthetics, brass and copper machinery, steam-powered technology, ornate mechanical details, vintage industrial, clockwork mechanisms',
    description: 'Victorian sci-fi style'
  },
];

const AIImageGeneration: React.FC = () => {
  const handleToolAction = useToolAction('/ai-image-generation');
  const navigate = useNavigate();

  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<GeneratedImage | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<StylePreset>(STYLE_PRESETS[0]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const saveToGallery = async (imageUrl: string, imagePrompt: string) => {
    try {
      console.log('Starting save to gallery process...', { imagePrompt, imageUrl });
      
      // Get current user
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) {
        throw new Error('No authenticated user found');
      }

      // For base64 images, we need to convert them to a blob
      let imageBlob: Blob;
      try {
        // Check if the image is base64
        if (imageUrl.startsWith('data:image')) {
          const base64Data = imageUrl.split(',')[1];
          const byteCharacters = atob(base64Data);
          const byteNumbers = new Array(byteCharacters.length);
          
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          
          const byteArray = new Uint8Array(byteNumbers);
          imageBlob = new Blob([byteArray], { type: 'image/jpeg' });
        } else {
          // For regular URLs
          const response = await fetch(imageUrl);
          imageBlob = await response.blob();
        }
        
        console.log('Image converted to blob:', { size: imageBlob.size, type: imageBlob.type });

        if (imageBlob.size === 0) {
          throw new Error('Blob is empty');
        }
      } catch (blobError) {
        console.error('Error converting to blob:', blobError);
        throw new Error('Failed to convert image to blob');
      }

      // Upload to Supabase Storage with retry logic
      const maxRetries = 3;
      let uploadData;
      let lastError;

      for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
          const fileName = `${Date.now()}-${imagePrompt.slice(0, 50).replace(/[^a-z0-9]/gi, '_')}.jpg`;
          console.log('Attempting upload with filename:', fileName);
          
          const { data, error: uploadError } = await supabase.storage
            .from('generated-images')
            .upload(fileName, imageBlob, {
              contentType: 'image/jpeg',
              cacheControl: '3600',
              upsert: true
            });

          if (uploadError) {
            throw uploadError;
          }

          uploadData = data;
          console.log('Upload successful:', uploadData);
          break;
        } catch (error) {
          lastError = error;
          console.error(`Upload attempt ${attempt + 1} failed:`, error);
          if (attempt === maxRetries - 1) throw error;
          await new Promise(r => setTimeout(r, 1000 * (attempt + 1)));
        }
      }

      if (!uploadData?.path) {
        throw new Error('Upload successful but no path returned');
      }

      // Get public URL
      const { data: publicUrlData } = await supabase.storage
        .from('generated-images')
        .getPublicUrl(uploadData.path);

      if (!publicUrlData?.publicUrl) {
        throw new Error('Failed to get public URL');
      }

      const publicUrl = publicUrlData.publicUrl;
      console.log('Generated public URL:', publicUrl);

      // Verify the image is accessible
      try {
        const imageResponse = await fetch(publicUrl);
        if (!imageResponse.ok) {
          throw new Error(`Image URL not accessible: ${imageResponse.status}`);
        }
        console.log('Image URL verified as accessible');
      } catch (verifyError) {
        console.error('Error verifying image URL:', verifyError);
        throw new Error('Failed to verify image accessibility');
      }

      // Save metadata to database with retry logic
      for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
          console.log('Attempting database save, attempt', attempt + 1);
          const { data: dbData, error: dbError } = await supabase
            .from('generated_images')
            .insert([{
              id: uuid(),
              prompt: imagePrompt,
              image_url: publicUrl,
              created_at: new Date().toISOString(),
              user_id: session.user.id
            }])
            .select();

          if (dbError) {
            console.error('Database error:', dbError);
            throw dbError;
          }
          
          if (!dbData || dbData.length === 0) {
            console.error('No data returned from database insert');
            throw new Error('No data returned from database insert');
          }

          console.log('Successfully saved to database:', dbData[0]);
          return dbData[0];
        } catch (error) {
          lastError = error;
          console.error(`Database save attempt ${attempt + 1} failed:`, error);
          if (attempt === maxRetries - 1) throw error;
          await new Promise(r => setTimeout(r, 1000 * (attempt + 1)));
        }
      }

      throw new Error('Failed to save to database after all retries');
    } catch (error: any) {
      console.error('Detailed error in saveToGallery:', {
        error,
        message: error.message,
        stack: error.stack
      });
      toast.error(`Failed to save to gallery: ${error.message}`);
      throw error;
    }
  };

  const handleGenerate = async () => {
    if (!prompt || isGenerating) return;

    // Check if user has enough coins before proceeding
    const canProceed = await handleToolAction();
    if (!canProceed) return;

    setIsGenerating(true);
    setError(null);

    try {
      if (!prompt.trim()) {
        toast.error('Please enter a prompt');
        return;
      }

      let translatedPrompt = prompt;
      
      // Language detection
      const languageResponse = await fetch(`${API_URL}/api/ai/detect-language`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem(AUTH_TOKEN_KEY)}`
        },
        body: JSON.stringify({ text: prompt })
      });

      if (!languageResponse.ok) {
        throw new Error('Language detection failed');
      }

      const languageData = await languageResponse.json();
      const detectedLanguage = languageData.language?.toLowerCase() || 'english';
      
      if (detectedLanguage !== 'english') {
        try {
          const translationResponse = await fetch(`${API_URL}/api/ai/translate`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem(AUTH_TOKEN_KEY)}`
            },
            body: JSON.stringify({ text: prompt, from: detectedLanguage, to: 'english' })
          });

          const translationData = await translationResponse.json();

          if (!translationResponse.ok) {
            console.error('Translation error:', translationData.error);
            if (translationData.translatedText) {
              // Use original text if provided in error response
              translatedPrompt = translationData.translatedText;
              toast.error('Translation failed - using original text');
            } else {
              throw new Error(translationData.error || 'Translation failed');
            }
          } else if (!translationData.translatedText) {
            throw new Error('Invalid translation response');
          } else {
            translatedPrompt = translationData.translatedText.trim();
            toast.success(`Step 1 complete`);
            console.log('Original:', prompt);
            console.log('Translated:', translatedPrompt);
          }
        } catch (translationError) {
          console.error('Translation error:', translationError);
          toast.error('Could not translate prompt, proceeding with original text');
        }
      }

      // Generate image with translated prompt and style suffix
      const response = await fetch(`${API_URL}/api/ai/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem(AUTH_TOKEN_KEY)}`
        },
        body: JSON.stringify({
          prompt: translatedPrompt + selectedStyle.promptSuffix
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to generate image');
      }

      const data = await response.json();
      
      if (data.success) {
        // Handle both base64 and URL responses from Together AI
        const imageUrl = data.image_url || data.stored_url;
        if (!imageUrl) {
          throw new Error('No image URL in response');
        }

        setGeneratedImage({
          url: imageUrl,
          prompt: prompt,
          translatedPrompt: translatedPrompt !== prompt ? translatedPrompt : undefined,
          timestamp: new Date().toISOString(),
        });
        
        // Only save to gallery if the backend hasn't already done so
        // This happens when we get a base64 image without a stored_url
        if (data.image_url && !data.stored_url) {
          try {
            await saveToGallery(imageUrl, translatedPrompt);
            toast.success('Image saved to gallery!');
          } catch (error) {
            console.error('Failed to save to gallery:', error);
            toast.error('Failed to save to gallery');
          }
        }
        
        toast.success('Image generated successfully!');
      } else {
        throw new Error(data.error || 'Failed to generate image');
      }
    } catch (error) {
      console.error('Error generating image:', error);
      let errorMessage = 'Failed to generate image. Please try again.';
      
      if (error instanceof Error) {
        if (error.message.includes('Rate limit exceeded')) {
          errorMessage = 'Too many requests. Please wait a minute and try again.';
        } else if (error.message.includes('No authenticated user')) {
          errorMessage = 'Please log in to generate images.';
          // Redirect to login page
          navigate('/login');
        } else if (error.message.includes('Token')) {
          errorMessage = 'Your session has expired. Please log in again.';
          // Clear invalid token
          localStorage.removeItem(AUTH_TOKEN_KEY);
          // Redirect to login page
          navigate('/login');
        } else if (error.message.includes('Failed to generate')) {
          errorMessage = 'Image generation failed. Please try a different prompt or try again later.';
        }
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    if (!generatedImage) return;

    setDownloading(true);
    try {
      if (generatedImage.url.startsWith('data:image')) {
        // For base64 images
        const link = document.createElement('a');
        link.href = generatedImage.url;
        link.download = `generated-image-${Date.now()}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        // For regular URLs
        const response = await fetch(generatedImage.url);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `generated-image-${Date.now()}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }
      toast.success('Image downloaded successfully!');
    } catch (error) {
      console.error('Error downloading image:', error);
      toast.error('Failed to download image');
    } finally {
      setDownloading(false);
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
        className="max-w-7xl mx-auto mb-6 sm:mb-8 lg:mb-12"
      >
        <GlassCard variant="cyber" className="p-4 sm:p-6">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-orbitron font-bold bg-gradient-to-r from-neon-cyan via-holographic-teal to-ai-magenta bg-clip-text text-transparent text-center sm:text-left mb-2 sm:mb-4">
            AI Image Generation
          </h1>
          <p className="text-futuristic-silver/80 text-sm sm:text-base lg:text-lg font-inter max-w-3xl">
            Transform your imagination into stunning visuals using cutting-edge AI technology. Choose from multiple styles and watch your ideas come to life.
          </p>
        </GlassCard>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
        {/* Input Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <GlassCard variant="cyber" className="h-full">
            <div className="p-4 sm:p-6 space-y-6">
              {/* Prompt Input */}
              <div>
                <label className="block text-futuristic-silver font-orbitron mb-2 text-sm sm:text-base">
                  Describe your image
                </label>
                <div className="relative">
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="A cyberpunk city at night with neon lights and flying cars..."
                    className="w-full h-32 bg-base-dark/40 text-futuristic-silver border border-neon-cyan/20 rounded-lg p-3 focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan placeholder-futuristic-silver/40 font-inter backdrop-blur-sm transition-colors text-sm sm:text-base"
                  />
                  <div className="absolute inset-0 pointer-events-none rounded-lg bg-gradient-to-b from-neon-cyan/5 to-ai-magenta/5 opacity-50" />
                </div>
              </div>

              {/* Style Selection */}
              <div>
                <label className="block text-futuristic-silver font-orbitron mb-2 text-sm sm:text-base">
                  Choose Style
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 max-h-[400px] overflow-y-auto custom-scrollbar pr-1">
                  {STYLE_PRESETS.map((style) => (
                    <motion.button
                      key={style.name}
                      onClick={() => setSelectedStyle(style)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`group p-3 rounded-lg border backdrop-blur-sm transition-all duration-200 ${
                        selectedStyle.name === style.name
                          ? 'bg-gradient-cyber border-neon-cyan text-white shadow-lg shadow-neon-cyan/20'
                          : 'bg-base-dark/40 border-futuristic-silver/20 text-futuristic-silver/80 hover:border-neon-cyan/40'
                      }`}
                    >
                      <p className="font-orbitron text-xs sm:text-sm">{style.label}</p>
                      <p className="text-[10px] sm:text-xs font-inter mt-1 opacity-60 line-clamp-1 group-hover:text-neon-cyan transition-colors">
                        {style.description}
                      </p>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Generate Button */}
              <div className="flex justify-end pt-4">
                <NeonButton
                  variant="primary"
                  size="lg"
                  onClick={handleGenerate}
                  disabled={loading || !prompt.trim() || isGenerating}
                  className="w-full sm:w-auto"
                >
                  {isGenerating ? (
                    <>
                      <AILoadingSpinner size="sm" variant="cyber" />
                      <span className="ml-2">Generating...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Generate Image
                    </>
                  )}
                </NeonButton>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Output Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <GlassCard variant="cyber" className="h-full">
            <div className="p-4 sm:p-6 space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg sm:text-xl font-orbitron font-bold text-futuristic-silver">
                  Generated Image
                </h2>
                {generatedImage && (
                  <NeonButton
                    variant="secondary"
                    size="sm"
                    onClick={handleDownload}
                    disabled={downloading}
                  >
                    {downloading ? (
                      <>
                        <AILoadingSpinner size="sm" variant="holographic" />
                        <span className="ml-2 hidden sm:inline">Saving...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        <span className="hidden sm:inline">Save to Gallery</span>
                      </>
                    )}
                  </NeonButton>
                )}
              </div>
              
              <div className="relative aspect-square rounded-lg overflow-hidden border border-neon-cyan/20 bg-base-dark/40">
                {loading ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <AILoadingSpinner size="lg" variant="cyber" text="Creating your masterpiece..." />
                    <div className="mt-4 text-xs sm:text-sm text-futuristic-silver/60 font-inter max-w-[200px] text-center">
                      Harnessing AI to bring your vision to life...
                    </div>
                  </div>
                ) : generatedImage ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="relative h-full group cursor-pointer"
                    onClick={() => setShowPreviewModal(true)}
                  >
                    <img
                      src={generatedImage.url}
                      alt={generatedImage.prompt}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-cyber opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="bg-black/50 px-4 py-2 rounded-lg">
                        <p className="text-white text-sm">Click to view larger</p>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                    <div className="w-16 h-16 mb-4 text-futuristic-silver/40">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <p className="text-futuristic-silver/40 font-inter text-sm sm:text-base">
                      Your AI-generated masterpiece will appear here
                    </p>
                    <p className="text-futuristic-silver/30 font-inter text-xs sm:text-sm mt-2">
                      Enter a prompt and choose a style to begin
                    </p>
                  </div>
                )}
              </div>

              {generatedImage && (
                <div className="space-y-2">
                  <div className="text-xs sm:text-sm text-futuristic-silver/60 font-inter">
                    <span className="text-neon-cyan">Prompt:</span>
                    <p className="mt-1 line-clamp-2">{generatedImage.prompt}</p>
                  </div>
                  <div className="text-[10px] sm:text-xs text-futuristic-silver/30 font-inter">
                    Generated at {new Date(generatedImage.timestamp).toLocaleString()}
                  </div>
                </div>
              )}
            </div>
          </GlassCard>
        </motion.div>
      </div>

      {/* Image Preview Modal */}
      {showPreviewModal && generatedImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
          onClick={() => setShowPreviewModal(false)}
        >
          <div className="relative w-full max-w-4xl" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setShowPreviewModal(false)}
              className="absolute -top-12 right-0 text-white hover:text-neon-cyan transition-colors"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <GlassCard variant="cyber" className="overflow-hidden">
              <div className="relative aspect-square md:aspect-[16/9]">
                <img
                  src={generatedImage.url}
                  alt={generatedImage.prompt}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="p-4 space-y-2">
                <p className="text-futuristic-silver font-inter">{generatedImage.prompt}</p>
                <p className="text-futuristic-silver/60 text-sm">
                  Generated at {new Date(generatedImage.timestamp).toLocaleString()}
                </p>
              </div>
            </GlassCard>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default AIImageGeneration; 