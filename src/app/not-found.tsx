'use client';

import Link from 'next/link';
import { Home, ArrowLeft, Globe } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-16">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center">
          {/* 404 Number */}
          <div className="mb-8">
            <h1 className="text-9xl font-bold text-gray-200">404</h1>
            <div className="relative">
              <h2 className="text-4xl font-bold text-gray-900 absolute inset-0 flex items-center justify-center">
                Page Not Found
              </h2>
            </div>
          </div>

          {/* Message */}
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Oops! The page you&apos;re looking for doesn&apos;t exist. But don&apos;t worry,
            we have plenty of useful tools and resources for you to explore.
          </p>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Link
              href="/"
              className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200 hover:border-gray-300"
            >
              <Home className="h-8 w-8 text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Go Home</h3>
              <p className="text-sm text-gray-600">Return to the main page</p>
            </Link>

            <Link
              href="/bulk"
              className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200 hover:border-gray-300"
            >
              <Globe className="h-8 w-8 text-green-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Bulk Processing</h3>
              <p className="text-sm text-gray-600">Process multiple URLs at once</p>
            </Link>
          </div>

          {/* Popular Pages */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Popular Pages</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link
                href="/facebook-open-graph-debugger"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Facebook Preview Tool
              </Link>
              <Link
                href="/twitter-card-validator"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Twitter Preview Tool
              </Link>
              <Link
                href="/linkedin-post-preview"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                LinkedIn Preview Tool
              </Link>
              <Link
                href="/instagram-social-preview"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Instagram Preview Tool
              </Link>
              <Link
                href="/google-search-preview"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Google Search Preview
              </Link>
              <Link
                href="/api"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                API Documentation
              </Link>
            </div>
          </div>

          {/* Back Button */}
          <div className="mt-8">
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
