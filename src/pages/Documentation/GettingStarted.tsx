import { Link } from 'react-router-dom';
import { RiArrowLeftLine } from 'react-icons/ri';

const GettingStarted = () => {
  return (
    <div className="max-w-3xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
      <Link to="/docs" className="text-primary hover:text-opacity-80 inline-flex items-center mb-8">
        <RiArrowLeftLine className="mr-2" />
        Back to Documentation
      </Link>

      <h1 className="text-4xl font-bold text-dark mb-8">Getting Started</h1>
      
      <div className="prose prose-lg">
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-dark mb-4">Welcome to DiToolz Pro</h2>
          <p className="text-gray-600 mb-4">
            DiToolz Pro is a powerful suite of AI-powered image editing tools. This guide will help you get started
            with our platform and make the most of our features.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-dark mb-4">Quick Start Guide</h2>
          <ol className="list-decimal pl-6 space-y-4 text-gray-600">
            <li>
              <strong>Create an Account</strong>
              <p>Sign up for a free account to get started with basic features.</p>
            </li>
            <li>
              <strong>Choose Your Tool</strong>
              <p>Select from our range of tools in the sidebar navigation.</p>
            </li>
            <li>
              <strong>Upload Your Image</strong>
              <p>Drag and drop or click to upload your image.</p>
            </li>
            <li>
              <strong>Edit and Enhance</strong>
              <p>Use our intuitive interface to edit your image.</p>
            </li>
            <li>
              <strong>Download Results</strong>
              <p>Download your edited image in high quality.</p>
            </li>
          </ol>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-dark mb-4">Available Tools</h2>
          <ul className="space-y-4 text-gray-600">
            <li>
              <strong>AI Image Generation</strong>
              <p>Create images from text descriptions using state-of-the-art AI.</p>
            </li>
            <li>
              <strong>Background Removal</strong>
              <p>Remove backgrounds with one click using AI algorithms.</p>
            </li>
            <li>
              <strong>Face Swap</strong>
              <p>Seamlessly swap faces while maintaining natural appearance.</p>
            </li>
            <li>
              <strong>Image Enhancement</strong>
              <p>Automatically improve image quality and colors.</p>
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-dark mb-4">Next Steps</h2>
          <ul className="space-y-4 text-gray-600">
            <li>
              <Link to="/docs/tutorials" className="text-primary hover:text-opacity-80">
                View Tutorials
              </Link>
            </li>
            <li>
              <Link to="/docs/api-reference" className="text-primary hover:text-opacity-80">
                API Reference
              </Link>
            </li>
            <li>
              <Link to="/docs/best-practices" className="text-primary hover:text-opacity-80">
                Best Practices
              </Link>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default GettingStarted; 