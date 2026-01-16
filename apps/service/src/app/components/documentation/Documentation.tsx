"use client";

import { useEffect, useState } from "react";

export function Documentation() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setLoading(false), 500);
  }, []);

  if (loading) {
    return (
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center">Loading documentation...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Documentation</h1>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600 mb-6">
            Welcome to the Pacepard documentation. Here you'll find guides, API references, and resources to help you get started.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-4">Getting Started</h2>
              <p className="text-gray-600">
                Learn the basics of using Pacepard and get up and running quickly.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-4">API Reference</h2>
              <p className="text-gray-600">
                Complete API documentation with examples and code snippets.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-4">Guides</h2>
              <p className="text-gray-600">
                Step-by-step guides for common tasks and workflows.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-4">Examples</h2>
              <p className="text-gray-600">
                Code examples and sample projects to help you learn.
              </p>
            </div>
          </div>

          <div className="mt-12 p-6 bg-blue-50 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Need Help?</h3>
            <p className="text-gray-700">
              If you can't find what you're looking for, feel free to reach out to our support team or check out our community forums.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
