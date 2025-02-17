import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GlassCard } from '../components/FuturisticUI';
import { BlogPost } from '../types/blog';

export const blogPosts: BlogPost[] = [
  {
    title: "Getting Started with AI Image Generation",
    slug: "getting-started-ai-generation",
    date: "March 1, 2024",
    category: "Tutorial",
    excerpt: "Master the art of AI image generation with our comprehensive guide to creating stunning visuals using advanced AI tools.",
    image: "/blog/ai-generation.jpg",
    content: `
      <h2>Introduction to AI Image Generation</h2>
      <p>AI image generation has revolutionized the creative industry, enabling anyone to create professional-quality visuals with just a text prompt. This guide will help you understand the fundamentals and create amazing images.</p>
      
      <h2>Understanding Prompts</h2>
      <p>The key to getting great results lies in crafting effective prompts. Learn how to structure your descriptions, use style modifiers, and leverage advanced parameters to achieve exactly the look you want.</p>
      
      <h3>Key Elements of a Good Prompt</h3>
      <ul>
        <li>Subject description: Be specific about what you want to create</li>
        <li>Style keywords: Define the artistic style and mood</li>
        <li>Technical parameters: Specify quality and technical aspects</li>
        <li>Composition elements: Describe lighting, perspective, and framing</li>
      </ul>
      
      <h2>Best Practices</h2>
      <p>Follow these proven techniques to get the best results from our AI image generation tool:</p>
      <ul>
        <li>Start with a clear vision of your desired outcome</li>
        <li>Use specific, descriptive language</li>
        <li>Experiment with different style combinations</li>
        <li>Iterate and refine based on results</li>
      </ul>
      
      <h2>Advanced Techniques</h2>
      <p>Take your AI-generated images to the next level with these advanced features:</p>
      <ul>
        <li>Inpainting and outpainting</li>
        <li>Style mixing and transfer</li>
        <li>Prompt weighting and emphasis</li>
        <li>Negative prompts for better control</li>
      </ul>
    `
  },
  {
    title: "10 Tips for Perfect Background Removal",
    slug: "background-removal-tips",
    date: "February 28, 2024",
    category: "Tips & Tricks",
    excerpt: "Learn professional techniques for flawless background removal and discover how AI is making this process faster and more accurate than ever.",
    image: "/blog/bg-removal.jpg",
    content: `
      <h2>Why Background Removal Matters</h2>
      <p>A clean, well-executed background removal can transform an ordinary image into a professional-grade asset. Learn why this technique is crucial for:</p>
      <ul>
        <li>E-commerce product photos</li>
        <li>Professional portraits</li>
        <li>Marketing materials</li>
        <li>Social media content</li>
      </ul>
      
      <h2>Advanced Techniques</h2>
      <p>Master these professional techniques for perfect results:</p>
      <ol>
        <li>Understanding edge detection and refinement</li>
        <li>Handling complex edges like hair and fur</li>
        <li>Managing transparency and shadows</li>
        <li>Preserving fine details and textures</li>
        <li>Working with reflective surfaces</li>
      </ol>
      
      <h2>Common Mistakes to Avoid</h2>
      <p>Watch out for these common pitfalls when removing backgrounds:</p>
      <ul>
        <li>Over-aggressive edge cleaning</li>
        <li>Ignoring color contamination</li>
        <li>Poor handling of semi-transparent areas</li>
        <li>Inconsistent edge treatment</li>
      </ul>
      
      <h2>AI-Powered Solutions</h2>
      <p>Discover how our AI background removal tools can help you:</p>
      <ul>
        <li>Automatic subject detection</li>
        <li>Smart edge refinement</li>
        <li>Real-time preview and adjustment</li>
        <li>Batch processing capabilities</li>
      </ul>
    `
  },
  {
    title: "The Future of AI in Image Editing",
    slug: "future-of-ai-editing",
    date: "February 25, 2024",
    category: "Industry Insights",
    excerpt: "Dive into the revolutionary changes AI is bringing to image editing and get a glimpse of the exciting developments on the horizon.",
    image: "/blog/future-ai.jpg",
    content: `
      <h2>Current State of AI Editing</h2>
      <p>AI has already transformed many aspects of image editing, bringing unprecedented capabilities:</p>
      <ul>
        <li>Intelligent object removal and replacement</li>
        <li>Advanced style transfer and manipulation</li>
        <li>Automated color grading and enhancement</li>
        <li>Smart composition assistance</li>
      </ul>
      
      <h2>Emerging Technologies</h2>
      <p>New developments are pushing the boundaries of what's possible:</p>
      <ul>
        <li>Neural network-based image understanding</li>
        <li>Context-aware content generation</li>
        <li>Real-time style adaptation</li>
        <li>Advanced scene manipulation</li>
      </ul>
      
      <h2>Future Predictions</h2>
      <p>Here's what we expect to see in the coming years:</p>
      <ul>
        <li>Fully automated professional-grade editing</li>
        <li>Advanced AI-powered creative assistance</li>
        <li>Real-time collaborative editing with AI</li>
        <li>Personalized style development</li>
      </ul>
      
      <h2>Impact on Creative Industries</h2>
      <p>Understanding how these changes will affect:</p>
      <ul>
        <li>Professional photographers and editors</li>
        <li>Digital artists and designers</li>
        <li>Content creators and marketers</li>
        <li>The future of creative workflows</li>
      </ul>
    `
  }
];

const Blog = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-blue-900 to-gray-900 text-light relative overflow-hidden">
      {/* Futuristic background elements */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-full h-full bg-gradient-radial-at-t from-blue-500/20 via-transparent to-transparent blur-3xl" />
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-full h-full bg-gradient-radial-at-b from-blue-400/20 via-transparent to-transparent blur-3xl" />
      </div>

      <div className="container mx-auto px-4 py-12 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-500 to-blue-400 animate-gradient-x">
            Blog
          </h1>
          <p className="text-light/60 text-lg">
            Latest updates, tutorials, and insights
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <motion.div
              key={post.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Link to={`/blog/${post.slug}`}>
                <GlassCard variant="cyber" className="h-full group relative overflow-hidden">
                  {/* Glow effects */}
                  <div className="absolute -inset-px bg-gradient-to-r from-blue-500/50 via-blue-400/50 to-blue-500/50 rounded-2xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                  
                  <div className="relative">
                    <div className="aspect-w-16 aspect-h-9 rounded-t-xl overflow-hidden">
                      <img 
                        src={post.image} 
                        alt={post.title} 
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300" 
                      />
                    </div>
                    
                    <div className="p-6">
                      <div className="flex items-center text-sm text-light/60 mb-2">
                        <time dateTime={post.date}>{post.date}</time>
                        {post.category && (
                          <>
                            <span className="mx-2">•</span>
                            <span className="text-blue-400">{post.category}</span>
                          </>
                        )}
                      </div>
                      
                      <h2 className="text-xl font-semibold text-light mb-3 group-hover:text-blue-400 transition-colors duration-200">
                        {post.title}
                      </h2>
                      
                      <p className="text-light/60 mb-4">{post.excerpt}</p>
                      
                      <div className="flex items-center text-blue-400 group-hover:text-blue-300 transition-colors duration-200">
                        Read more
                        <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blog; 