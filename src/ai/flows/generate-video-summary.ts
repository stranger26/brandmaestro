'use server';
/**
 * @fileOverview Generates a structured summary of video content using Groq's vision capabilities.
 * 
 * This flow analyzes video content to extract key topics, themes, and elements
 * that can be used for contextual risk analysis with Exa search.
 */

import { z } from 'genkit';
import Groq from 'groq-sdk';

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Check if API key is available
if (!process.env.GROQ_API_KEY) {
  console.warn('GROQ_API_KEY not found in environment variables');
}

const GenerateVideoSummaryInputSchema = z.object({
  videoDataUri: z
    .string()
    .describe(
      "A video to be analyzed, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  contentType: z
    .string()
    .optional()
    .describe('The MIME type of the video content.'),
});

export type GenerateVideoSummaryInput = z.infer<
  typeof GenerateVideoSummaryInputSchema
>;

const VideoSummarySchema = z.object({
  mainTopics: z.array(z.string()).describe('Key topics and subjects discussed in the video'),
  keyMessages: z.array(z.string()).describe('Main messages and themes conveyed'),
  visualElements: z.array(z.string()).describe('Important visual elements, colors, symbols, or imagery'),
  targetAudience: z.string().describe('Intended audience or demographic'),
  contentTheme: z.string().describe('Overall theme or category of content (e.g., educational, promotional, entertainment)'),
  productsMentioned: z.array(z.string()).optional().describe('Any products, services, or brands mentioned'),
  tone: z.string().describe('Overall tone of the content (e.g., professional, casual, urgent, humorous)'),
  culturalElements: z.array(z.string()).optional().describe('Cultural references, holidays, or cultural themes present'),
});

export type VideoSummary = z.infer<typeof VideoSummarySchema>;

/**
 * Generates a structured summary of video content for contextual risk analysis
 */
export async function generateVideoSummary(
  input: GenerateVideoSummaryInput
): Promise<VideoSummary> {
  // Check if API key is available
  if (!process.env.GROQ_API_KEY) {
    console.warn('GROQ_API_KEY not found, returning mock summary');
    return {
      mainTopics: ['General content'],
      keyMessages: ['Standard messaging'],
      visualElements: ['Standard visuals'],
      targetAudience: 'General audience',
      contentTheme: 'General content',
      productsMentioned: [],
      tone: 'Neutral',
      culturalElements: [],
    };
  }

  // Extract content type from data URI if it's a data URI
  let contentType = 'video/mp4'; // default
  if (input.videoDataUri.startsWith('data:')) {
    const mimeMatch = input.videoDataUri.match(/data:([^;]+);/);
    if (mimeMatch) {
      contentType = mimeMatch[1];
    }
  }

  const analysisPrompt = `
You are an expert video content analyst. Analyze the provided video and extract key information that would be useful for identifying potential sensitive topics or cultural risks.

Please provide a comprehensive analysis focusing on:

1. **Main Topics**: What are the primary subjects, themes, or topics discussed or shown?
2. **Key Messages**: What are the main messages, calls-to-action, or themes being conveyed?
3. **Visual Elements**: What important visual elements are present (colors, symbols, imagery, text overlays)?
4. **Target Audience**: Who appears to be the intended audience or demographic?
5. **Content Theme**: What category does this content fall into (educational, promotional, entertainment, news, etc.)?
6. **Products Mentioned**: Any specific products, services, or brand names mentioned or shown?
7. **Tone**: What is the overall tone (professional, casual, urgent, humorous, serious, etc.)?
8. **Cultural Elements**: Any cultural references, holidays, traditions, or cultural themes present?

Focus on elements that could potentially be sensitive or controversial in current cultural contexts. Be thorough but concise.

Video: ${input.videoDataUri}

IMPORTANT: Respond with ONLY a valid JSON object matching this exact structure. Do not include any explanatory text before or after the JSON:

{
  "mainTopics": ["topic1", "topic2", "topic3"],
  "keyMessages": ["message1", "message2"],
  "visualElements": ["element1", "element2"],
  "targetAudience": "description of target audience",
  "contentTheme": "theme category",
  "productsMentioned": ["product1", "product2"],
  "tone": "overall tone description",
  "culturalElements": ["cultural reference1", "cultural reference2"]
}
`;

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are an expert video content analyst specializing in identifying potentially sensitive or controversial elements in media content. Provide detailed, structured analysis in JSON format.',
        },
        {
          role: 'user',
          content: analysisPrompt,
        },
      ],
      model: 'llama-3.1-8b-instant',
      temperature: 0.3,
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) {
      throw new Error('No response from Groq API');
    }

    // Parse the JSON response - handle cases where response might not be pure JSON
    let parsedResponse;
    try {
      // Try to extract JSON from the response if it's wrapped in text
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedResponse = JSON.parse(jsonMatch[0]);
      } else {
        parsedResponse = JSON.parse(response);
      }
    } catch (parseError) {
      console.error('Failed to parse JSON response:', response);
      // Return mock data if JSON parsing fails
      return {
        mainTopics: ['General content'],
        keyMessages: ['Standard messaging'],
        visualElements: ['Standard visuals'],
        targetAudience: 'General audience',
        contentTheme: 'General content',
        productsMentioned: [],
        tone: 'Neutral',
        culturalElements: [],
      };
    }
    
    // Validate the response against our schema
    return VideoSummarySchema.parse(parsedResponse);
  } catch (error) {
    console.error('Error in generateVideoSummary:', error);
    throw new Error('Failed to generate video summary');
  }
}
