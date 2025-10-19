'use server';
/**
 * @fileOverview Generates a video from a text script using Fal.ai's Veo 3 model.
 *
 * - generateVideoFromScript - A function that handles the video generation process.
 * - GenerateVideoFromScriptInput - The input type for the generateVideoFromScript function.
 * - GenerateVideoFromScriptOutput - The return type for the generateVideoFromScript function.
 */

import { fal } from '@fal-ai/client';
import { z } from 'zod';

// Configure Fal.ai client only if API key is available
if (process.env.FAL_KEY) {
  fal.config({
    credentials: process.env.FAL_KEY
  });
}

const GenerateVideoFromScriptInputSchema = z.object({
  script: z.string().describe('The text script to generate the video from.'),
});
export type GenerateVideoFromScriptInput = z.infer<
  typeof GenerateVideoFromScriptInputSchema
>;

const GenerateVideoFromScriptOutputSchema = z.object({
  videoUrl: z.string().describe('The URL of the generated video.'),
});
export type GenerateVideoFromScriptOutput = z.infer<
  typeof GenerateVideoFromScriptOutputSchema
>;

export async function generateVideoFromScript(
  input: GenerateVideoFromScriptInput
): Promise<GenerateVideoFromScriptOutput> {
  const { script } = input;

  // Check if FAL_KEY is configured
  if (!process.env.FAL_KEY) {
    // Return a placeholder response for development/testing
    console.warn('FAL_KEY not configured. Returning placeholder video URL.');
    return {
      videoUrl: 'https://placehold.co/1920x1080.mp4?text=Video+Generation+Disabled+-+Add+FAL_KEY+to+.env'
    };
  }

  try {
    console.log('Generating video with Fal.ai Veo 3 for script:', script);
    
    // Generate video with Veo 3 via Fal.ai
    const result = await fal.subscribe("fal-ai/veo3", {
      input: {
        prompt: script
      },
      onQueueUpdate: (update) => {
        if (update.status === "IN_PROGRESS") {
          console.log("Video generation in progress...");
        }
      }
    });

    console.log('Video generation completed:', result);
    
    // Extract video URL from result
    const videoUrl = result.data.video.url;
    
    return {
      videoUrl: videoUrl,
    };
  } catch (error) {
    console.error('Video generation failed:', error);
    throw new Error(
      `Failed to generate video: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}