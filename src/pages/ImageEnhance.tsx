import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { API_URL } from '../config';
import { GlassCard } from '../components/FuturisticUI';

interface EnhancementSettings {
  denoise: number;
  contrast: number;
  sharpness: number;
  brightness: number;
}

const ImageEnhance: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [enhancedImage, setEnhancedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [comparisonPosition, setComparisonPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const comparisonRef = useRef<HTMLDivElement>(null);
  const [settings, setSettings] = useState<EnhancementSettings>({
    denoise: 10,
    contrast: 3,
    sharpness: 1,
    brightness: 0
  });

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size too large. Maximum size is 10MB');
      return;
    }

    setEnhancedImage(null);
    setShowComparison(false);

    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64 = e.target?.result as string;
      setOriginalImage(base64);
    };
    reader.readAsDataURL(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: 1,
    multiple: false
  });

  const enhanceImage = async (imageData: string) => {
    try {
      setIsProcessing(true);
      const response = await fetch(`${API_URL}/api/ai/enhance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          image: imageData,
          settings
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      setEnhancedImage(data.result);
      if (originalImage && data.result) {
        setShowComparison(true);
      }
      toast.success('Image enhanced successfully!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to enhance image');
      setEnhancedImage(null);
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    if (!originalImage || !enhancedImage) {
      setShowComparison(false);
    }
  }, [originalImage, enhancedImage]);

  const handleComparisonMove = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!comparisonRef.current || !isDragging) return;
    
    const rect = comparisonRef.current.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const position = ((x - rect.left) / rect.width) * 100;
    setComparisonPosition(Math.min(Math.max(position, 0), 100));
  }, [isDragging]);

  useEffect(() => {
    const handleMouseUp = () => setIsDragging(false);
    const handleMouseLeave = () => setIsDragging(false);
    const handleTouchEnd = () => setIsDragging(false);

    if (isDragging) {
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('mouseleave', handleMouseLeave);
      window.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging]);

  const handleSettingChange = (setting: keyof EnhancementSettings, value: number) => {
    setSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const downloadImage = () => {
    if (!enhancedImage) return;
    
    const link = document.createElement('a');
    link.href = enhancedImage;
    link.download = 'enhanced-image.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-black/90 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center relative">
          <div className="absolute inset-0 bg-gradient-cyber opacity-10"></div>
          <h1 className="text-4xl md:text-5xl font-orbitron text-holographic-teal mb-3 tracking-wider">
            Neural Image Enhancement
          </h1>
          <div className="h-1 w-32 bg-gradient-cyber mx-auto mb-4"></div>
          <p className="text-futuristic-silver text-sm md:text-base font-inter max-w-2xl mx-auto leading-relaxed">
            Enhance your images with AI-powered tools. Adjust noise reduction, contrast, sharpness, and brightness with precision.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column - Controls */}
          <div className="lg:col-span-4 space-y-6">
            <GlassCard variant="cyber" className="backdrop-blur-xl border border-white/5">
              <div className="p-4 border-b border-white/5">
                <h3 className="font-orbitron text-neon-cyan text-lg">Input Image</h3>
              </div>
              <div className="p-6">
                <div
                  {...getRootProps()}
                  className={`
                    relative group border-2 border-dashed rounded-xl p-8 text-center cursor-pointer
                    transition-all duration-300 overflow-hidden
                    ${isDragActive ? 'border-holographic-teal bg-holographic-teal/5' : 'border-white/10 hover:border-white/20'}
                  `}
                >
                  <input {...getInputProps()} />
                  <div className="relative z-10 space-y-4">
                    <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-cyber p-[1px]">
                      <div className="w-full h-full rounded-2xl bg-black/50 flex items-center justify-center">
                        <svg className="w-8 h-8 text-neon-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    </div>
                    <p className="text-futuristic-silver font-medium">
                      {isDragActive ? "Release to process" : "Drop image or click to upload"}
                    </p>
                    <p className="text-xs text-metallic-gold">Supports JPG, PNG, WebP • Max 10MB</p>
                  </div>
                  <div className="absolute inset-0 bg-gradient-cyber opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
                </div>
              </div>
            </GlassCard>

            <GlassCard variant="cyber" className="backdrop-blur-xl border border-white/5">
              <div className="p-4 border-b border-white/5">
                <h3 className="font-orbitron text-neon-cyan text-lg">Enhancement Controls</h3>
              </div>
              <div className="p-6 space-y-6">
                {Object.entries(settings).map(([key, value]) => (
                  <div key={key} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-futuristic-silver font-orbitron text-sm uppercase tracking-wider">
                        {key === 'denoise' ? 'Noise Reduction' : key}
                      </label>
                      <span className="text-holographic-teal font-mono">{value.toFixed(1)}</span>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-cyber opacity-10 rounded-full"></div>
                      <input
                        type="range"
                        min={key === 'brightness' ? -50 : 0}
                        max={key === 'contrast' ? 10 : key === 'sharpness' ? 3 : 20}
                        step={key === 'sharpness' ? 0.1 : 1}
                        value={value}
                        onChange={(e) => handleSettingChange(key as keyof EnhancementSettings, parseFloat(e.target.value))}
                        className="w-full appearance-none h-1 rounded-full bg-black/50 accent-holographic-teal relative z-10"
                      />
                    </div>
                    <p className="text-xs text-futuristic-silver/60">
                      {key === 'denoise' && 'Reduce image noise and graininess'}
                      {key === 'contrast' && 'Adjust the difference between light and dark areas'}
                      {key === 'sharpness' && 'Enhance edge definition and detail'}
                      {key === 'brightness' && 'Control overall image luminosity'}
                    </p>
                  </div>
                ))}
                
                <button
                  onClick={() => originalImage && enhanceImage(originalImage)}
                  disabled={!originalImage || isProcessing}
                  className="w-full bg-gradient-cyber hover:bg-gradient-cyber/90 text-white font-orbitron py-3 rounded-lg transition-all
                    disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gradient-cyber
                    relative group overflow-hidden"
                >
                  <span className="relative z-10">
                    {isProcessing ? 'Processing...' : 'Apply Enhancement'}
                  </span>
                  <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                </button>
              </div>
            </GlassCard>
          </div>

          {/* Right Column - Preview */}
          <div className="lg:col-span-8">
            <GlassCard variant="cyber" className="h-full backdrop-blur-xl border border-white/5">
              <div className="p-4 border-b border-white/5 flex justify-between items-center">
                <h3 className="font-orbitron text-neon-cyan text-lg">
                  {showComparison ? 'Interactive Comparison' : 'Enhanced Result'}
                </h3>
                {(originalImage && enhancedImage) && (
                  <div className="flex space-x-3">
                    <button
                      onClick={() => setShowComparison(!showComparison)}
                      className="p-2 rounded-lg bg-black/20 text-futuristic-silver hover:text-holographic-teal transition-colors"
                      title={showComparison ? "View Enhanced" : "Compare"}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                      </svg>
                    </button>
                    <button
                      onClick={downloadImage}
                      className="p-2 rounded-lg bg-black/20 text-futuristic-silver hover:text-holographic-teal transition-colors"
                      title="Download"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>

              <div className="p-6 h-[calc(100%-4rem)]">
                {originalImage && enhancedImage ? (
                  showComparison ? (
                    <div
                      ref={comparisonRef}
                      className="relative h-full rounded-xl overflow-hidden cursor-col-resize touch-pan-x bg-black/20"
                      onMouseDown={() => setIsDragging(true)}
                      onTouchStart={() => setIsDragging(true)}
                      onMouseMove={handleComparisonMove}
                      onTouchMove={handleComparisonMove}
                    >
                      <img
                        src={enhancedImage}
                        alt="Enhanced"
                        className="absolute inset-0 w-full h-full object-contain"
                      />
                      <div
                        className="absolute inset-y-0 left-0 overflow-hidden"
                        style={{ width: `${comparisonPosition}%` }}
                      >
                        <img
                          src={originalImage}
                          alt="Original"
                          className="absolute inset-0 w-[100vw] h-full object-contain"
                          style={{ maxWidth: 'none' }}
                        />
                      </div>
                      <div
                        className="absolute inset-y-0 bg-holographic-teal/50 w-0.5 cursor-col-resize"
                        style={{ left: `${comparisonPosition}%` }}
                      >
                        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-gradient-cyber p-[1px]">
                          <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
                            <svg className="w-4 h-4 text-holographic-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                            </svg>
                          </div>
                        </div>
                      </div>
                      <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute top-4 left-4 bg-black/70 px-3 py-1 rounded-full">
                          <span className="text-xs font-orbitron text-white/70">Original</span>
                        </div>
                        <div className="absolute top-4 right-4 bg-black/70 px-3 py-1 rounded-full">
                          <span className="text-xs font-orbitron text-white/70">Enhanced</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="relative h-full rounded-xl overflow-hidden bg-black/20">
                      <img
                        src={enhancedImage}
                        alt="Enhanced"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  )
                ) : originalImage ? (
                  <div className="relative h-full rounded-xl overflow-hidden bg-black/20">
                    <img
                      src={originalImage}
                      alt="Original"
                      className="w-full h-full object-contain"
                    />
                    {isProcessing && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <div className="flex flex-col items-center space-y-4">
                          <div className="relative">
                            <div className="w-16 h-16 rounded-full border-2 border-holographic-teal/20"></div>
                            <motion.div
                              className="absolute inset-0 rounded-full border-2 border-transparent border-t-holographic-teal"
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            />
                          </div>
                          <p className="font-orbitron text-sm text-white">Processing Enhancement</p>
                        </div>
                      </div>
                    )}
                    {!isProcessing && !enhancedImage && (
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <button
                          onClick={() => originalImage && enhanceImage(originalImage)}
                          className="px-6 py-3 bg-gradient-cyber hover:bg-gradient-cyber/90 text-white font-orbitron rounded-lg transition-all
                            relative group overflow-hidden"
                        >
                          <span className="relative z-10">Enhance Image</span>
                          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center text-futuristic-silver/60">
                    <div className="text-center">
                      <svg className="w-16 h-16 mx-auto mb-4 text-futuristic-silver/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="font-orbitron text-sm">Upload an image to begin</p>
                    </div>
                  </div>
                )}
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageEnhance; 