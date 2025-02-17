import { Link } from 'react-router-dom';
import { RiArrowLeftLine } from 'react-icons/ri';

const Tutorials = () => {
  return (
    <div className="max-w-3xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
      <Link to="/docs" className="text-primary hover:text-opacity-80 inline-flex items-center mb-8">
        <RiArrowLeftLine className="mr-2" />
        Back to Documentation
      </Link>

      <h1 className="text-4xl font-bold text-dark mb-8">Tutorials</h1>
      
      <div className="prose prose-lg">
        <div className="grid gap-8">
          {tutorials.map((tutorial) => (
            <article key={tutorial.title} className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold text-dark mb-4">{tutorial.title}</h2>
              <p className="text-gray-600 mb-4">{tutorial.description}</p>
              <div className="flex items-center text-sm text-gray-500">
                <span className="mr-2">{tutorial.duration}</span>
                <span className="mx-2">•</span>
                <span>{tutorial.difficulty}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

const tutorials = [
  {
    title: "Getting Started with AI Image Generation",
    description: "Learn how to create stunning images using our AI generation tools with step-by-step instructions.",
    duration: "15 min",
    difficulty: "Beginner"
  },
  {
    title: "Advanced Background Removal Techniques",
    description: "Master the art of perfect background removal with advanced tips and techniques.",
    duration: "20 min",
    difficulty: "Intermediate"
  },
  {
    title: "Professional Face Swap Guide",
    description: "Learn how to create natural-looking face swaps while maintaining proper lighting and expressions.",
    duration: "25 min",
    difficulty: "Advanced"
  },
  {
    title: "Batch Processing with Our API",
    description: "Automate your workflow by processing multiple images using our API.",
    duration: "30 min",
    difficulty: "Advanced"
  }
];

export default Tutorials; 