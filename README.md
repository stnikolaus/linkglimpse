# LinkGlimpse - Social Media Preview Generator

A modern Next.js web application that generates social media previews for any URL. See how your links will appear when shared on Facebook, Twitter, LinkedIn, Instagram, and more platforms. Perfect for marketers, content creators, and developers who want to optimize their social media sharing.

## 🚀 Features

- **URL Input & Validation**: Enter any URL and get instant validation
- **Multi-Platform Previews**: Generate previews for 9 different social platforms
- **AI-Powered Enhancement**: Optimize titles, descriptions, and generate hashtags using AI
- **Bulk URL Processing**: Process up to 100 URLs at once with batch export
- **Real-time Metadata Extraction**: Fetches Open Graph, Twitter Cards, and meta tags
- **API Access**: RESTful API for programmatic access to social preview data
- **Export Options**: Download results in JSON or CSV format
- **Copy to Clipboard**: Copy preview text with one click
- **Responsive Design**: Works perfectly on desktop and mobile
- **Modern UI**: Clean, intuitive interface with smooth animations
- **SEO Optimized**: Built with best practices for search engine optimization



## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Package Manager**: pnpm

## 🎯 SEO Features

This application is built with comprehensive SEO optimization:

- **Dynamic Sitemap**: Automatically generated sitemap.xml with all pages
- **Structured Data**: JSON-LD markup for rich snippets and voice search
- **Meta Tags**: Complete Open Graph and Twitter Card support
- **Robots.txt**: Proper crawling instructions for search engines
- **Canonical URLs**: Prevents duplicate content issues
- **Performance Optimized**: Fast loading times for better rankings
- **Mobile Friendly**: Responsive design for mobile-first indexing
- **PWA Support**: Web app manifest for better mobile experience
- **Security Headers**: Enhanced security for trust signals

## Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd social-preview
```

2. Install dependencies:
```bash
pnpm install
```

3. Run the development server:
```bash
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. Enter any URL in the input field
2. Click "Preview" or press Enter
3. View how the URL will appear on different social platforms
4. Click the copy icon to copy the preview text

## API Endpoints

### GET /api/metadata?url={url}

Fetches metadata from a given URL.

**Parameters:**
- `url` (required): The URL to extract metadata from

**Response:**
```json
{
  "title": "Page Title",
  "description": "Page description",
  "image": "https://example.com/image.jpg",
  "url": "https://example.com",
  "siteName": "Site Name"
}
```

### POST /api/bulk

Process multiple URLs in bulk.

**Parameters:**
- `urls` (required): Array of URLs to process (max 100)
- `format` (optional): Export format - 'json' or 'csv' (default: 'json')

**Request Body:**
```json
{
  "urls": ["https://example.com", "https://google.com"],
  "format": "json"
}
```

**Response:**
```json
{
  "summary": {
    "totalUrls": 2,
    "successful": 2,
    "failed": 0,
    "totalProcessingTime": 1500,
    "averageProcessingTime": 750
  },
  "results": [
    {
      "url": "https://example.com",
      "success": true,
      "metadata": { ... },
      "processingTime": 800
    }
  ],
  "timestamp": "2025-01-01T12:00:00.000Z"
}
```

### POST /api/enhance

Enhance metadata using AI.

**Parameters:**
- `metadata` (required): Current metadata object
- `platforms` (optional): Target platforms for optimization (default: ['facebook', 'twitter', 'linkedin'])
- `enhancementType` (optional): Type of enhancement - 'title', 'description', 'hashtags', or 'all' (default: 'all')

**Request Body:**
```json
{
  "metadata": {
    "title": "Example Title",
    "description": "Example description",
    "url": "https://example.com"
  },
  "platforms": ["facebook", "twitter"],
  "enhancementType": "all"
}
```

**Response:**
```json
{
  "success": true,
  "enhancements": {
    "original": { ... },
    "enhanced": { ... },
    "suggestions": {
      "title": "Optimized Title",
      "description": "Enhanced description",
      "hashtags": ["#example", "#social"],
      "improvements": ["Add more engaging content", "Include call-to-action"]
    },
    "confidence": 0.85
  },
  "timestamp": "2025-01-01T12:00:00.000Z"
}
```

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── metadata/
│   │       └── route.ts          # API endpoint for metadata
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Main page
├── components/
│   ├── PreviewCard.tsx           # Individual preview card
│   ├── SocialPreview.tsx         # Main preview component
│   └── UrlInput.tsx              # URL input component
├── lib/
│   └── url-utils.ts              # URL validation utilities
└── types/
    └── index.ts                  # TypeScript type definitions
```

## Supported Platforms

- **Facebook**: Open Graph preview
- **Twitter**: Twitter Card preview
- **LinkedIn**: Professional network preview
- **Google Search**: Search result preview
- **Instagram**: Social media preview
- **Tumblr**: Blog platform preview
- **Mastodon**: Fediverse preview
- **Nextdoor**: Local community preview
- **Bluesky**: Social platform preview

## Development

### Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

### Environment Variables

For AI features, create a `.env.local` file with:

```bash
# Get your API key from: https://makersuite.google.com/app/apikey
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key_here

# Optional: Set to 'false' to disable AI features (default: true)
ENABLE_AI_FEATURES=true
```

Basic functionality works without AI features.

## Deployment

The app can be deployed to any platform that supports Next.js:

- **Vercel** (recommended)
- **Netlify**
- **Railway**
- **AWS Amplify**

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Icons from [Lucide React](https://lucide.dev/)
