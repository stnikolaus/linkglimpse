'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Facebook, Twitter, Linkedin, Search, Instagram, MessageCircle, Users, Hash } from 'lucide-react';
import { useLinkGlimpseAnalytics } from '@/components/PlausibleEvents';

const socialPreviews = [
  { name: 'Open Graph Checker', href: '/open-graph-checker', description: 'Audit tags, images, redirects, and indexing signals', icon: Search },
  { name: 'Facebook', href: '/facebook-open-graph-debugger', description: 'Debug Facebook Open Graph previews', icon: Facebook },
  { name: 'Twitter / X', href: '/twitter-card-validator', description: 'Validate Twitter Cards and X previews', icon: Twitter },
  { name: 'LinkedIn', href: '/linkedin-post-preview', description: 'Inspect LinkedIn post previews', icon: Linkedin },
  { name: 'Instagram', href: '/instagram-social-preview', description: 'Create Instagram social previews', icon: Instagram },
  { name: 'Mastodon', href: '/mastodon-social-preview', description: 'Generate Mastodon social previews', icon: Users },
  { name: 'Tumblr', href: '/tumblr-social-preview', description: 'Create Tumblr social previews', icon: MessageCircle },
  { name: 'Bluesky', href: '/bluesky-social-preview', description: 'Generate Bluesky social previews', icon: Hash },
  { name: 'Nextdoor', href: '/nextdoor-social-preview', description: 'Create Nextdoor social previews', icon: Hash },
  { name: 'Google Search', href: '/google-search-preview', description: 'Generate Google search previews', icon: Search },
];

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const analytics = useLinkGlimpseAnalytics();

  return (
    <nav className="border-gray-200 absolute top-0 left-0 right-0 z-50">
      <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl p-4">
        <Link href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
          <Image src="/images/link-glimpse-logo.svg" alt="LinkGlimpse Logo" width={164} height={32} className="h-8 w-auto" priority />
        </Link>

        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          type="button"
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
          aria-controls="mega-menu-full"
          aria-expanded={isMobileMenuOpen}
        >
          <span className="sr-only">Open main menu</span>
          <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15"/>
          </svg>
        </button>

        <div className={`items-center justify-between ${isMobileMenuOpen ? 'flex' : 'hidden'} w-full md:flex md:w-auto md:order-1`}>
          <ul className="flex flex-col mt-4 font-medium md:flex-row md:mt-0 md:space-x-8 rtl:space-x-reverse">
            <li className="relative">
              <button
                onMouseEnter={() => setIsDropdownOpen(true)}
                className="flex items-center justify-between w-full py-2 px-3 font-medium text-gray-900 border-b border-gray-100 md:w-auto hover:bg-gray-50 md:hover:bg-transparent md:border-0 md:hover:text-blue-600 md:p-0"
              >
                Social Previews
                <svg className={`w-2.5 h-2.5 ms-3 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4"/>
                </svg>
              </button>
            </li>
            <li>
              <Link href="/bulk" className="block py-2 px-3 text-gray-900 border-b border-gray-100 hover:bg-gray-50 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0">
                Bulk Processing
              </Link>
            </li>
            <li>
              <Link href="/api" className="block py-2 px-3 text-gray-900 border-b border-gray-100 hover:bg-gray-50 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0">
                API Docs
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {isDropdownOpen && (
        <div
          className="bg-white border-gray-200 shadow-xs border-y absolute w-full z-50"
          onMouseEnter={() => setIsDropdownOpen(true)}
          onMouseLeave={() => setIsDropdownOpen(false)}
        >
          <div className="grid max-w-screen-xl px-4 py-5 mx-auto text-gray-900 sm:grid-cols-2 md:grid-cols-3 md:px-6">
            <ul aria-labelledby="mega-menu-full-dropdown-button">
              {socialPreviews.slice(0, 3).map((preview) => (
                <li key={preview.href}>
                  <Link onClick={() => analytics.trackPlatformNavigation(preview.name)} href={preview.href} className="block p-3 rounded-lg hover:bg-gray-50 border border-white hover:border-gray-100 transition ease-in-out duration-200">
                    <div className="font-semibold flex items-center">
                      <preview.icon className="mr-2 h-5 w-5 text-gray-600" />
                      {preview.name}
                    </div>
                    <span className="text-sm text-gray-500">{preview.description}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <ul>
              {socialPreviews.slice(3, 6).map((preview) => (
                <li key={preview.href}>
                  <Link onClick={() => analytics.trackPlatformNavigation(preview.name)} href={preview.href} className="block p-3 rounded-lg hover:bg-gray-50 border border-white hover:border-gray-100 transition ease-in-out duration-200">
                    <div className="font-semibold flex items-center">
                      <preview.icon className="mr-2 h-5 w-5 text-gray-600" />
                      {preview.name}
                    </div>
                    <span className="text-sm text-gray-500">{preview.description}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <ul className="hidden md:block">
              {socialPreviews.slice(6).map((preview) => (
                <li key={preview.href}>
                  <Link onClick={() => analytics.trackPlatformNavigation(preview.name)} href={preview.href} className="block p-3 rounded-lg hover:bg-gray-50 border border-white hover:border-gray-100 transition ease-in-out duration-200">
                    <div className="font-semibold flex items-center">
                      <preview.icon className="mr-2 h-5 w-5 text-gray-600" />
                      {preview.name}
                    </div>
                    <span className="text-sm text-gray-500">{preview.description}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </nav>
  );
}
