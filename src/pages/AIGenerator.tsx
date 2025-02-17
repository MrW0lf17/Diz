import { useState } from 'react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'

const AIGenerator = () => {
  const [prompt, setPrompt] = useState('')
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleGenerate = async () => {
    if (!prompt.trim()) return
    
    setLoading(true)
    try {
      // TODO: Implement AI generation API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      // Placeholder image for demo
      setGeneratedImage('https://via.placeholder.com/512x512.png?text=AI+Generated+Image')
    } catch (error) {
      console.error('Error generating image:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold">AI Image Generator</h1>
        <p className="text-gray-400 mt-2">
          Describe the image you want to create
        </p>
      </div>

      <Card>
        <div className="space-y-6">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="A serene lake at sunset with mountains in the background, cinematic lighting..."
            className="w-full h-32 p-4 rounded-lg bg-primary/30 text-light border border-secondary/30 focus:border-secondary focus:ring-1 focus:ring-secondary outline-none resize-none placeholder-light/50"
          />

          <Button
            onClick={handleGenerate}
            disabled={!prompt.trim() || loading}
            isLoading={loading}
            className="w-full bg-secondary hover:bg-accent text-dark"
            size="lg"
          >
            Generate Image
          </Button>
        </div>

        {generatedImage && (
          <div className="mt-8 space-y-4">
            <div className="relative aspect-square">
              <img
                src={generatedImage}
                alt="AI Generated"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>

            <div className="flex justify-center gap-4">
              <Button
                variant="outline"
                onClick={() => setGeneratedImage(null)}
              >
                Clear
              </Button>
              <Button
                variant="secondary"
                as="a"
                href={generatedImage}
                download="ai-generated.png"
              >
                Download
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}

export default AIGenerator 