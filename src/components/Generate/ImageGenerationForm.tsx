import React, { useState } from 'react';

interface ImageGenerationFormProps {
  onGenerate: (prompt: string, options: GenerationOptions) => void;
  isLoading: boolean;
}

interface GenerationOptions {
  width: number;
  height: number;
  steps: number;
  guidance: number;
}

const ImageGenerationForm: React.FC<ImageGenerationFormProps> = ({ onGenerate, isLoading }) => {
  const [prompt, setPrompt] = useState('');
  const [options, setOptions] = useState<GenerationOptions>({
    width: 1024,
    height: 1024,
    steps: 4,
    guidance: 3.5,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate(prompt, options);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="prompt" className="block text-sm font-medium text-gray-700">
          Prompt
        </label>
        <div className="mt-1">
          <textarea
            id="prompt"
            name="prompt"
            rows={3}
            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
            placeholder="Describe the image you want to generate..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="width" className="block text-sm font-medium text-gray-700">
            Width
          </label>
          <select
            id="width"
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            value={options.width}
            onChange={(e) => setOptions({ ...options, width: Number(e.target.value) })}
          >
            <option value={512}>512px</option>
            <option value={768}>768px</option>
            <option value={1024}>1024px</option>
          </select>
        </div>

        <div>
          <label htmlFor="height" className="block text-sm font-medium text-gray-700">
            Height
          </label>
          <select
            id="height"
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            value={options.height}
            onChange={(e) => setOptions({ ...options, height: Number(e.target.value) })}
          >
            <option value={512}>512px</option>
            <option value={768}>768px</option>
            <option value={1024}>1024px</option>
          </select>
        </div>

        <div>
          <label htmlFor="steps" className="block text-sm font-medium text-gray-700">
            Steps
          </label>
          <input
            type="range"
            id="steps"
            min="4"
            max="8"
            value={options.steps}
            onChange={(e) => setOptions({ ...options, steps: Number(e.target.value) })}
            className="mt-1 block w-full"
          />
          <span className="text-sm text-gray-500">{options.steps}</span>
        </div>

        <div>
          <label htmlFor="guidance" className="block text-sm font-medium text-gray-700">
            Guidance Scale
          </label>
          <input
            type="range"
            id="guidance"
            min="1"
            max="10"
            step="0.5"
            value={options.guidance}
            onChange={(e) => setOptions({ ...options, guidance: Number(e.target.value) })}
            className="mt-1 block w-full"
          />
          <span className="text-sm text-gray-500">{options.guidance}</span>
        </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
            isLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isLoading ? 'Generating...' : 'Generate Image'}
        </button>
      </div>
    </form>
  );
};

export default ImageGenerationForm; 