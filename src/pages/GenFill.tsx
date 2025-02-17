import React, { useState, useRef, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { supabase } from '../lib/supabase';
import { API_URL, AUTH_TOKEN_KEY } from '../config';
import { v4 as uuid } from 'uuid';
import { motion } from 'framer-motion';
import { useToolAction } from '../hooks/useToolAction';

interface Point {
  x: number;
  y: number;
  pressure?: number;
  tiltX?: number;
  tiltY?: number;
  timestamp: number;
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
  }
];

const GenFill: React.FC = () => {
  const handleToolAction = useToolAction('/gen-fill');

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPoint, setLastPoint] = useState<Point | null>(null);
  const [originalImage, setOriginalImage] = useState<HTMLImageElement | null>(null);
  const [loading, setLoading] = useState(false);
  const [brushSize, setBrushSize] = useState(20);
  const [prompt, setPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState<StylePreset>(STYLE_PRESETS[0]);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [points, setPoints] = useState<Point[]>([]);
  const pointsRef = useRef<Point[]>([]);
  const animationFrameRef = useRef<number>();
  const smoothingFactor = 0.3; // Adjust this value to control smoothing (0.1 to 0.5)
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        // Add touch event listeners
        canvas.addEventListener('touchstart', handleTouchStart);
        canvas.addEventListener('touchmove', handleTouchMove);
        canvas.addEventListener('touchend', stopDrawing);
        canvas.addEventListener('touchcancel', stopDrawing);
      }
    }
    
    return () => {
      if (canvas) {
        canvas.removeEventListener('touchstart', handleTouchStart);
        canvas.removeEventListener('touchmove', handleTouchMove);
        canvas.removeEventListener('touchend', stopDrawing);
        canvas.removeEventListener('touchcancel', stopDrawing);
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const initializeCanvas = (img: HTMLImageElement) => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
      }
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          setOriginalImage(img);
          initializeCanvas(img);
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const getPointFromEvent = (e: React.MouseEvent<HTMLCanvasElement> | Touch | PointerEvent): Point | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    let x, y, pressure, tiltX, tiltY;
    
    if (e instanceof PointerEvent) {
      x = (e.clientX - rect.left) * scaleX;
      y = (e.clientY - rect.top) * scaleY;
      pressure = e.pressure !== 0 ? e.pressure : 0.5;
      tiltX = e.tiltX;
      tiltY = e.tiltY;
    } else if (e instanceof Touch) {
      x = (e.clientX - rect.left) * scaleX;
      y = (e.clientY - rect.top) * scaleY;
      pressure = (e as any).force !== undefined ? (e as any).force : 0.5;
    } else {
      x = (e.clientX - rect.left) * scaleX;
      y = (e.clientY - rect.top) * scaleY;
      pressure = 0.5;
    }
    
    return { x, y, pressure, tiltX, tiltY, timestamp: Date.now() };
  };

  const handleTouchStart = (e: TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    const point = getPointFromEvent(touch);
    if (point) {
      setIsDrawing(true);
      setLastPoint(point);
      pointsRef.current = [point];
      setPoints([point]);
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    e.preventDefault();
    if (!isDrawing) return;
    
    const touch = e.touches[0];
    const point = getPointFromEvent(touch);
    if (point) {
      pointsRef.current = [...pointsRef.current, point];
      drawPoints();
    }
  };

  const smoothPoints = (points: Point[]): Point[] => {
    if (points.length < 3) return points;

    const smoothed: Point[] = [points[0]];
    
    for (let i = 1; i < points.length - 1; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const next = points[i + 1];
      
      const smoothedX = curr.x + smoothingFactor * (
        (prev.x + next.x) / 2 - curr.x
      );
      const smoothedY = curr.y + smoothingFactor * (
        (prev.y + next.y) / 2 - curr.y
      );
      
      smoothed.push({
        ...curr,
        x: smoothedX,
        y: smoothedY
      });
    }
    
    smoothed.push(points[points.length - 1]);
    return smoothed;
  };

  const drawPoints = () => {
    const canvas = canvasRef.current;
    if (!canvas || pointsRef.current.length < 2) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Get the smoothed points
    const smoothedPoints = smoothPoints(pointsRef.current);

    ctx.beginPath();
    ctx.moveTo(smoothedPoints[0].x, smoothedPoints[0].y);

    // Use Catmull-Rom spline for even smoother curves
    for (let i = 1; i < smoothedPoints.length - 2; i++) {
      const xc = (smoothedPoints[i].x + smoothedPoints[i + 1].x) / 2;
      const yc = (smoothedPoints[i].y + smoothedPoints[i + 1].y) / 2;
      const pressure = smoothedPoints[i].pressure || 0.5;
      
      // Adjust line width based on pressure and tilt
      const tiltFactor = smoothedPoints[i].tiltX != null && smoothedPoints[i].tiltY != null
        ? Math.sqrt(Math.pow(smoothedPoints[i].tiltX || 0, 2) + Math.pow(smoothedPoints[i].tiltY || 0, 2)) / 90
        : 1;
        
      ctx.lineWidth = brushSize * pressure * tiltFactor;
      ctx.strokeStyle = 'rgba(255, 255, 255, 1)';
      ctx.quadraticCurveTo(smoothedPoints[i].x, smoothedPoints[i].y, xc, yc);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(xc, yc);
    }

    // Handle the last two points
    if (smoothedPoints.length >= 2) {
      const lastPoint = smoothedPoints[smoothedPoints.length - 1];
      const pressure = lastPoint.pressure || 0.5;
      const tiltFactor = lastPoint.tiltX != null && lastPoint.tiltY != null
        ? Math.sqrt(Math.pow(lastPoint.tiltX || 0, 2) + Math.pow(lastPoint.tiltY || 0, 2)) / 90
        : 1;
      
      ctx.lineWidth = brushSize * pressure * tiltFactor;
      ctx.quadraticCurveTo(
        smoothedPoints[smoothedPoints.length - 2].x,
        smoothedPoints[smoothedPoints.length - 2].y,
        lastPoint.x,
        lastPoint.y
      );
      ctx.stroke();
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const point = getPointFromEvent(e);
    if (point) {
      setIsDrawing(true);
      setLastPoint(point);
      pointsRef.current = [point];
      setPoints([point]);
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const point = getPointFromEvent(e);
    if (point) {
      pointsRef.current = [...pointsRef.current, point];
      
      // Use requestAnimationFrame for smooth rendering
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      animationFrameRef.current = requestAnimationFrame(drawPoints);
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    setLastPoint(null);
    pointsRef.current = [];
    setPoints([]);
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas && originalImage) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(originalImage, 0, 0);
      }
    }
  };

  const generateFill = async () => {
    if (!originalImage || !prompt || isGenerating) {
      toast.error('Please upload an image and enter a prompt');
      return;
    }

    // Check if user has enough coins before proceeding
    const canProceed = await handleToolAction();
    if (!canProceed) return;

    setIsGenerating(true);
    try {
      setLoading(true);
      const canvas = canvasRef.current;
      if (!canvas) return;

      // Convert images to base64
      const originalBase64 = originalImage.src.split(',')[1];
      const maskBase64 = canvas.toDataURL().split(',')[1];

      // Language detection and translation
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
      let translatedPrompt = prompt;

      if (detectedLanguage !== 'english') {
        const translationResponse = await fetch(`${API_URL}/api/ai/translate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem(AUTH_TOKEN_KEY)}`
          },
          body: JSON.stringify({ text: prompt, from: detectedLanguage, to: 'english' })
        });

        const translationData = await translationResponse.json();
        if (translationData.translatedText) {
          translatedPrompt = translationData.translatedText.trim();
          toast.success(`Translated from ${detectedLanguage} to English`);
        }
      }

      // Call the API endpoint with translated prompt and style
      const response = await fetch(`${API_URL}/api/ai/generative-fill`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem(AUTH_TOKEN_KEY)}`
        },
        body: JSON.stringify({
          prompt: translatedPrompt + selectedStyle.promptSuffix,
          image: originalBase64,
          mask: maskBase64,
          width: canvas.width,
          height: canvas.height
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate image');
      }

      const data = await response.json();
      if (data.output) {
        setGeneratedImage(data.output);
        await saveToGallery(data.output, translatedPrompt);
        toast.success('Image generated successfully!');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error(error instanceof Error ? error.message : 'Error generating image');
    } finally {
      setLoading(false);
    }
  };

  const saveToGallery = async (imageUrl: string, imagePrompt: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) {
        throw new Error('No authenticated user found');
      }

      // Convert base64 to blob
      const base64Data = imageUrl.split(',')[1];
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      
      const byteArray = new Uint8Array(byteNumbers);
      const imageBlob = new Blob([byteArray], { type: 'image/jpeg' });

      // Upload to Supabase Storage
      const fileName = `genfill-${Date.now()}-${imagePrompt.slice(0, 50).replace(/[^a-z0-9]/gi, '_')}.jpg`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('generated-images')
        .upload(fileName, imageBlob, {
          contentType: 'image/jpeg',
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: publicUrlData } = await supabase.storage
        .from('generated-images')
        .getPublicUrl(uploadData.path);

      if (!publicUrlData?.publicUrl) {
        throw new Error('Failed to get public URL');
      }

      // Save to database
      const { error: dbError } = await supabase
        .from('generated_images')
        .insert([{
          id: uuid(),
          prompt: imagePrompt,
          image_url: publicUrlData.publicUrl,
          created_at: new Date().toISOString(),
          user_id: session.user.id,
          type: 'genfill'
        }]);

      if (dbError) throw dbError;

    } catch (error: any) {
      console.error('Error saving to gallery:', error);
      toast.error('Error saving to gallery');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-primary to-gray-900 text-light relative overflow-hidden">
      {/* Futuristic background elements */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-full h-full bg-gradient-radial-at-t from-secondary/20 via-transparent to-transparent blur-3xl" />
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-full h-full bg-gradient-radial-at-b from-accent/20 via-transparent to-transparent blur-3xl" />
      </div>

      <div className="container mx-auto px-4 py-8 relative">
        <div className="flex flex-col items-center mb-12">
          <h1 className="text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-secondary via-accent to-secondary animate-gradient-x">
            AI Generative Fill
          </h1>
          <p className="text-light/60 text-lg max-w-2xl text-center">
            Transform your images with AI-powered generative fill. Upload, mask, and watch the magic happen.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="backdrop-blur-xl bg-black/30 rounded-2xl shadow-2xl p-8 border border-white/10 relative">
            {/* Glow effects */}
            <div className="absolute -inset-px bg-gradient-to-r from-secondary/50 via-accent/50 to-secondary/50 rounded-2xl blur-xl opacity-20" />
            <div className="relative">
              {/* Style Selection */}
              <div className="mb-8">
                <label className="block text-lg font-medium text-light mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                  Select AI Style
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {STYLE_PRESETS.map((style) => (
                    <button
                      key={style.name}
                      onClick={() => setSelectedStyle(style)}
                      className={`p-3 rounded-xl text-sm transition-all duration-300 backdrop-blur-lg ${
                        selectedStyle === style
                          ? 'bg-gradient-to-r from-secondary to-accent text-dark font-semibold shadow-lg shadow-accent/30 scale-105 border border-white/20'
                          : 'bg-white/5 text-light border border-white/10 hover:bg-white/10 hover:border-white/20 hover:scale-105'
                      }`}
                      title={style.description}
                    >
                      {style.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Image Upload and Canvas */}
              <div className="mb-8">
                <label className="block text-lg font-medium text-light mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                  Upload & Draw Mask
                </label>
                <div className="flex flex-wrap gap-4 mb-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="block w-full text-sm text-light
                      file:mr-4 file:py-2.5 file:px-6
                      file:rounded-xl file:border file:border-white/10
                      file:text-sm file:font-medium
                      file:bg-white/5 file:text-light
                      hover:file:bg-white/10 file:transition-all file:duration-300"
                  />
                  <button
                    onClick={clearCanvas}
                    className="px-6 py-2.5 bg-white/5 text-light rounded-xl hover:bg-white/10 transition-all duration-300 border border-white/10 hover:border-white/20"
                  >
                    Clear Mask
                  </button>
                  <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/10">
                    <label className="text-sm text-light">Brush Size:</label>
                    <input
                      type="range"
                      min="1"
                      max="50"
                      value={brushSize}
                      onChange={(e) => setBrushSize(parseInt(e.target.value))}
                      className="w-32 accent-accent"
                    />
                  </div>
                </div>

                <div className="relative rounded-xl overflow-hidden border border-white/10 backdrop-blur-sm">
                  <canvas
                    ref={canvasRef}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseOut={stopDrawing}
                    className="bg-black/40 max-w-full"
                    style={{ cursor: 'crosshair' }}
                  />
                </div>
              </div>

              {/* Prompt Input */}
              <div className="mb-8">
                <label className="block text-lg font-medium text-light mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                  Enter your prompt
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe what you want to generate in the masked area..."
                  className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-transparent text-light placeholder-light/40 backdrop-blur-sm transition-all duration-300"
                  rows={4}
                />
              </div>

              {/* Generate Button */}
              <button
                onClick={generateFill}
                disabled={loading}
                className={`w-full py-4 px-6 rounded-xl text-dark font-medium transition-all duration-300 relative group ${
                  loading
                    ? 'bg-white/20 cursor-not-allowed'
                    : 'bg-gradient-to-r from-secondary via-accent to-secondary hover:scale-[1.02] animate-gradient-x'
                }`}
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-secondary via-accent to-secondary rounded-xl blur-xl opacity-30 group-hover:opacity-50 transition-all duration-300" />
                <span className="relative">
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-dark" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Generating...
                    </span>
                  ) : (
                    'Generate Fill'
                  )}
                </span>
              </button>
            </div>
          </div>

          {/* Generated Image Display */}
          {generatedImage && (
            <div className="mt-12 backdrop-blur-xl bg-black/30 rounded-2xl shadow-2xl p-8 border border-white/10 relative">
              {/* Glow effect */}
              <div className="absolute -inset-px bg-gradient-to-r from-secondary/50 via-accent/50 to-secondary/50 rounded-2xl blur-xl opacity-20" />
              <div className="relative">
                <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-secondary to-accent mb-6">Generated Result</h2>
                <div className="aspect-w-1 aspect-h-1 rounded-xl overflow-hidden border border-white/10">
                  <img
                    src={`data:image/jpeg;base64,${generatedImage}`}
                    alt="Generated result"
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="mt-6 space-y-2">
                  <p className="text-sm text-light/80">
                    <span className="text-accent font-medium">Style:</span> {selectedStyle.label}
                  </p>
                  <p className="text-sm text-light/80">
                    <span className="text-accent font-medium">Prompt:</span> {prompt}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GenFill; 