'use server';

import { NextRequest, NextResponse } from 'next/server';
import { generateText } from 'ai';
import { google } from '@ai-sdk/google';
import { ApiResponse, aiEnhancementSchema } from '@/types';

interface EnhancementRequest {
  metadata: ApiResponse;
  platforms?: string[];
}

export async function POST(request: NextRequest) {
  try {
    
    // Check if AI features are enabled
    if (process.env.ENABLE_AI_FEATURES === 'false') {
      return NextResponse.json({
        error: 'AI features are currently disabled'
      }, { status: 503 });
    }

    const body: EnhancementRequest = await request.json();
    const { metadata, platforms = ['facebook', 'twitter', 'linkedin'] } = body;

    if (!metadata || !metadata.url) {
      return NextResponse.json({
        error: 'Valid metadata with URL is required'
      }, { status: 400 });
    }

    // Generate structured prompt for AI enhancement
    const prompt = generateStructuredPrompt(metadata, platforms);
    
    console.log('Attempting AI enhancement with structured output...');
    
    const result = await generateText({
      model: google('models/gemini-2.0-flash-exp'),
      prompt: prompt,
      system: `You are a social media optimization expert. Analyze the provided content and return a structured JSON response with optimizations for social media platforms. Always return valid JSON that matches the exact schema provided.`
    });

    if (!result.text) {
      throw new Error('No response from AI');
    }

    // Parse the JSON response
    let aiResponse;
    try {
      // Extract JSON from the response (in case there's extra text)
      const jsonMatch = result.text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }
      aiResponse = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.error('JSON parsing error:', parseError);
      console.error('AI Response:', result.text);
      throw new Error('Invalid JSON response from AI');
    }

    // Validate the response against our schema
    const validatedResult = aiEnhancementSchema.parse(aiResponse);

    return NextResponse.json({
      success: true,
      enhancements: validatedResult,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('AI Enhancement Error:', error);
    return NextResponse.json({
      error: 'Failed to enhance metadata',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

function generateStructuredPrompt(metadata: ApiResponse, platforms: string[]) {
  const domain = new URL(metadata.url).hostname;
  const currentTitle = metadata.title || 'No title available';
  const currentDescription = metadata.description || 'No description available';

  return `Analyze this social media content and provide structured optimization recommendations.

Content to analyze:
- Title: "${currentTitle}"
- Description: "${currentDescription}"
- URL: ${metadata.url}
- Domain: ${domain}
- Target platforms: ${platforms.join(', ')}

Return a JSON object with the following exact structure:

{
  "title": {
    "optimized": "Your optimized title here (max 60 chars for Twitter, 100 for others)",
    "score": 85,
    "feedback": "Brief feedback on title optimization"
  },
  "description": {
    "optimized": "Your optimized description here (max 200 chars)",
    "score": 80,
    "feedback": "Brief feedback on description optimization"
  },
  "hashtags": ["#hashtag1", "#hashtag2", "#hashtag3", "#hashtag4", "#hashtag5"],
  "improvements": [
    "Specific improvement suggestion 1",
    "Specific improvement suggestion 2",
    "Specific improvement suggestion 3"
  ],
  "overallScore": 82,
  "platformOptimizations": {
    "facebook": {
      "score": 85,
      "feedback": "Facebook-specific optimization feedback"
    },
    "twitter": {
      "score": 78,
      "feedback": "Twitter-specific optimization feedback"
    },
    "linkedin": {
      "score": 80,
      "feedback": "LinkedIn-specific optimization feedback"
    }
  }
}

Requirements:
- Scores should be 0-100
- Optimized title should be engaging and click-worthy
- Optimized description should be compelling with call-to-action
- Hashtags should be relevant and platform-appropriate
- Improvements should be actionable and specific
- Platform optimizations should consider each platform's unique requirements
- Return ONLY the JSON object, no additional text`;
}

export async function GET() {
  return NextResponse.json({
    error: 'POST method required for AI enhancement',
    example: {
      method: 'POST',
      body: {
        metadata: {
          title: 'Example Title',
          description: 'Example description',
          url: 'https://example.com'
        },
        platforms: ['facebook', 'twitter']
      }
    }
  }, { status: 405 });
}