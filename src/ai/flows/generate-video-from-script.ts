'use server';
/**
 * @fileOverview Generates a video from a text script.
 *
 * - generateVideoFromScript - A function that handles the video generation process.
 * - GenerateVideoFromScriptInput - The input type for the generateVideoFromScript function.
 * - GenerateVideoFromScriptOutput - The return type for the generateVideoFromScript function.
 */

import { ai } from '@/ai/genkit';
import { googleAI } from '@genkit-ai/google-genai';
import { z } from 'genkit';
import * as fs from 'fs';
import { Readable } from 'stream';
import { MediaPart } from 'genkit';

export const GenerateVideoFromScriptInputSchema = z.object({
  script: z.string().describe('The text script to generate the video from.'),
});
export type GenerateVideoFromScriptInput = z.infer<
  typeof GenerateVideoFromScriptInputSchema
>;

export const GenerateVideoFromScriptOutputSchema = z.object({
  videoUrl: z.string().describe('The data URI of the generated video.'),
});
export type GenerateVideoFromScriptOutput = z.infer<
  typeof GenerateVideoFromScriptOutputSchema
>;

async function downloadVideo(
  video: MediaPart,
  path: string
): Promise<string> {
  const fetch = (await import('node-fetch')).default;
  // Add API key before fetching the video.
  const videoDownloadResponse = await fetch(
    `${video.media!.url}&key=${process.env.GEMINI_API_KEY}`
  );
  if (
    !videoDownloadResponse ||
    videoDownloadResponse.status !== 200 ||
    !videoDownloadResponse.body
  ) {
    throw new Error('Failed to fetch video');
  }

  const videoBuffer = await videoDownloadResponse.arrayBuffer();
  return `data:video/mp4;base64,${Buffer.from(videoBuffer).toString('base64')}`;
}

export const generateVideoFromScriptFlow = ai.defineFlow(
  {
    name: 'generateVideoFromScriptFlow',
    inputSchema: GenerateVideoFromScriptInputSchema,
    outputSchema: GenerateVideoFromScriptOutputSchema,
  },
  async ({ script }) => {
    let { operation } = await ai.generate({
      model: googleAI.model('veo-2.0-generate-001'),
      prompt: script,
      config: {
        durationSeconds: 5,
        aspectRatio: '16:9',
      },
    });

    if (!operation) {
      throw new Error('Expected the model to return an operation');
    }

    // Wait until the operation completes. Note that this may take some time, maybe even up to a minute. Design the UI accordingly.
    while (!operation.done) {
      operation = await ai.checkOperation(operation);
      // Sleep for 5 seconds before checking again.
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }

    if (operation.error) {
      throw new Error('failed to generate video: ' + operation.error.message);
    }

    const video = operation.output?.message?.content.find((p) => !!p.media);
    if (!video) {
      throw new Error('Failed to find the generated video');
    }
    const videoDataUrl = await downloadVideo(video, 'output.mp4');
    return {
      videoUrl: videoDataUrl,
    };
  }
);

export async function generateVideoFromScript(
  input: GenerateVideoFromScriptInput
): Promise<GenerateVideoFromScriptOutput> {
  return generateVideoFromScriptFlow(input);
}
