import { NextRequest, NextResponse } from 'next/server';
import { ApiResponse } from '@/types';

interface BulkUrlRequest {
  urls: string[];
  platforms?: string[];
  format?: 'json' | 'csv';
}

interface BulkUrlResult {
  url: string;
  success: boolean;
  metadata?: ApiResponse;
  error?: string;
  processingTime: number;
}

export async function POST(request: NextRequest) {
  try {
    const body: BulkUrlRequest = await request.json();
    const { urls, format = 'json' } = body;

    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return NextResponse.json({
        error: 'URLs array is required and must not be empty'
      }, { status: 400 });
    }

    if (urls.length > 100) {
      return NextResponse.json({
        error: 'Maximum 100 URLs allowed per request'
      }, { status: 400 });
    }

    const results: BulkUrlResult[] = [];
    const startTime = Date.now();

    // Process URLs in parallel with a limit of 10 concurrent requests
    const batchSize = 10;
    for (let i = 0; i < urls.length; i += batchSize) {
      const batch = urls.slice(i, i + batchSize);
      const batchPromises = batch.map(async (url) => {
        const urlStartTime = Date.now();
        
        try {
          // Validate URL
          if (!url || typeof url !== 'string') {
            return {
              url,
              success: false,
              error: 'Invalid URL format',
              processingTime: Date.now() - urlStartTime
            };
          }

          // Normalize URL
          let normalizedUrl = url;
          if (!url.startsWith('http://') && !url.startsWith('https://')) {
            normalizedUrl = `https://${url}`;
          }

          // Fetch metadata from the existing metadata API
          const metadataResponse = await fetch(`${request.nextUrl.origin}/api/metadata?url=${encodeURIComponent(normalizedUrl)}`);
          
          if (!metadataResponse.ok) {
            throw new Error(`HTTP ${metadataResponse.status}: ${metadataResponse.statusText}`);
          }
          
          const metadata: ApiResponse = await metadataResponse.json();
          
          return {
            url: normalizedUrl,
            success: true,
            metadata,
            processingTime: Date.now() - urlStartTime
          };
        } catch (error) {
          return {
            url,
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
            processingTime: Date.now() - urlStartTime
          };
        }
      });

      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);
    }

    const totalTime = Date.now() - startTime;
    const successfulResults = results.filter(r => r.success);
    const failedResults = results.filter(r => !r.success);

    const response = {
      summary: {
        totalUrls: urls.length,
        successful: successfulResults.length,
        failed: failedResults.length,
        totalProcessingTime: totalTime,
        averageProcessingTime: totalTime / urls.length
      },
      results,
      timestamp: new Date().toISOString()
    };

    // Return CSV format if requested
    if (format === 'csv') {
      const csvHeaders = ['URL', 'Success', 'Title', 'Description', 'Image', 'Site Name', 'Author', 'Processing Time (ms)', 'Error'];
      const csvRows = results.map(result => [
        result.url,
        result.success ? 'Yes' : 'No',
        result.metadata?.title || '',
        result.metadata?.description || '',
        result.metadata?.image || '',
        result.metadata?.siteName || '',
        result.metadata?.author || '',
        result.processingTime,
        result.error || ''
      ]);

      const csvContent = [csvHeaders, ...csvRows]
        .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
        .join('\n');

      return new NextResponse(csvContent, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="bulk-social-previews-${new Date().toISOString().split('T')[0]}.csv"`
        }
      });
    }

    return NextResponse.json(response);

  } catch (error) {
    console.error('Bulk API Error:', error);
    return NextResponse.json({
      error: 'Failed to process bulk request',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    error: 'POST method required for bulk processing',
    example: {
      method: 'POST',
      body: {
        urls: ['https://example.com', 'https://google.com'],
        platforms: ['facebook', 'twitter'],
        format: 'json'
      }
    }
  }, { status: 405 });
} 