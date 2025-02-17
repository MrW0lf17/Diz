import { Link } from 'react-router-dom'
import Button from './ui/Button'

const Hero = () => {
  return (
    <div className="relative overflow-hidden bg-primary">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5 bg-secondary" />

      {/* Content */}
      <div className="relative max-w-5xl mx-auto px-4 py-12 sm:py-24">
        <div className="text-center space-y-6 sm:space-y-8">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold">
            <span className="bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
              Next-Gen
            </span>{' '}
            <span className="text-light">Image Processing</span>
          </h1>

          <p className="text-lg sm:text-xl md:text-2xl text-accent max-w-3xl mx-auto px-4">
            Transform your images with cutting-edge AI technology. Create, edit, and enhance with professional tools powered by artificial intelligence.
          </p>

          <div className="flex flex-col xs:flex-row justify-center gap-4 px-4">
            <Button
              as={Link}
              to="/editor"
              size="lg"
              className="w-full xs:w-auto bg-secondary hover:bg-accent active:bg-accent/80 text-dark py-3 sm:py-2"
            >
              Start Editing
            </Button>
            <Button
              as={Link}
              to="/generate"
              variant="secondary"
              size="lg"
              className="w-full xs:w-auto border-2 border-secondary hover:border-accent active:border-accent/80 text-light hover:text-accent active:text-accent/80 py-3 sm:py-2"
            >
              Generate Art
            </Button>
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mt-12 sm:mt-16 px-4">
            <div className="bg-primary/40 backdrop-blur-sm p-6 rounded-lg space-y-3 sm:space-y-4 border border-secondary/20 hover:bg-primary/50 active:bg-primary/60 transition-colors duration-200 touch-pan-y">
              <h3 className="text-lg sm:text-xl font-bold text-accent">AI Image Generation</h3>
              <p className="text-sm sm:text-base text-light">Create stunning artwork with our Flux AI model, trained on millions of professional images.</p>
            </div>
            <div className="bg-primary/40 backdrop-blur-sm p-6 rounded-lg space-y-3 sm:space-y-4 border border-secondary/20 hover:bg-primary/50 active:bg-primary/60 transition-colors duration-200 touch-pan-y">
              <h3 className="text-lg sm:text-xl font-bold text-accent">Background Removal</h3>
              <p className="text-sm sm:text-base text-light">Remove backgrounds instantly with our AI-powered tools. Perfect for product photos.</p>
            </div>
            <div className="bg-primary/40 backdrop-blur-sm p-6 rounded-lg space-y-3 sm:space-y-4 border border-secondary/20 hover:bg-primary/50 active:bg-primary/60 transition-colors duration-200 touch-pan-y">
              <h3 className="text-lg sm:text-xl font-bold text-accent">Image Enhancement</h3>
              <p className="text-sm sm:text-base text-light">Enhance your photos automatically with our advanced AI algorithms.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero 