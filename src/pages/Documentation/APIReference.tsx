const APIReference = () => {
  return (
    <div className="max-w-3xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold text-dark mb-8">API Reference</h1>
      
      <div className="prose prose-lg">
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-dark mb-4">Authentication</h2>
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <code className="text-sm">
              Authorization: Bearer YOUR_API_KEY
            </code>
          </div>
          <p className="text-gray-600 mb-4">
            All API requests must include your API key in the Authorization header.
            You can find your API key in your account settings.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-dark mb-4">Base URL</h2>
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <code className="text-sm">
              https://api.ditoolz.pro/v1
            </code>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-dark mb-4">Endpoints</h2>
          
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold text-dark mb-2">Image Generation</h3>
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <code className="text-sm">
                  POST /generate
                </code>
              </div>
              <p className="text-gray-600 mb-4">
                Generate an image from a text description.
              </p>
              <h4 className="font-semibold mb-2">Parameters:</h4>
              <ul className="list-disc pl-6 text-gray-600">
                <li>prompt (string, required): The text description</li>
                <li>size (string, optional): Image size (default: "1024x1024")</li>
                <li>style (string, optional): Art style preference</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-dark mb-2">Background Removal</h3>
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <code className="text-sm">
                  POST /remove-background
                </code>
              </div>
              <p className="text-gray-600 mb-4">
                Remove background from an image.
              </p>
              <h4 className="font-semibold mb-2">Parameters:</h4>
              <ul className="list-disc pl-6 text-gray-600">
                <li>image (file, required): The image to process</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-dark mb-2">Object Removal</h3>
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <code className="text-sm">
                  POST /remove-object
                </code>
              </div>
              <p className="text-gray-600 mb-4">
                Remove objects from an image.
              </p>
              <h4 className="font-semibold mb-2">Parameters:</h4>
              <ul className="list-disc pl-6 text-gray-600">
                <li>image (file, required): The image to process</li>
                <li>mask (file, required): The mask indicating the object to remove</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-dark mb-4">Rate Limits</h2>
          <ul className="list-disc pl-6 text-gray-600">
            <li>Free tier: 100 requests per day</li>
            <li>Pro tier: 1000 requests per day</li>
            <li>Enterprise tier: Custom limits</li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default APIReference; 