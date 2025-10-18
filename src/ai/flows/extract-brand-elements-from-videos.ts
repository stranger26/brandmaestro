'use server';
/**
 * @fileOverview Extracts brand elements from uploaded videos or YouTube links using AI analysis.
 *
 * - extractBrandElements - A function that handles the brand element extraction process.
 * - ExtractBrandElementsInput - The input type for the extractBrandElements function.
 * - ExtractBrandElementsOutput - The return type for the extractBrandElements function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExtractBrandElementsInputSchema = z.object({
  videoUrls: z
    .array(z.string())
    .describe('An array of video URLs (YouTube links or direct video file URLs).'),
  mostRepresentativeVideoIndex: z
    .number()
    .optional()
    .describe('The index of the most representative video in the videoUrls array.'),
});
export type ExtractBrandElementsInput = z.infer<typeof ExtractBrandElementsInputSchema>;

const ExtractBrandElementsOutputSchema = z.object({
  coreVisualElements: z.object({
    logoUsage: z.object({
      placementCoordinates: z.string().describe('Placement coordinates of the logo.'),
      animationTiming: z.string().describe('Animation timing of the logo.'),
      transparencyPatterns: z.string().describe('Transparency patterns of the logo.'),
    }),
    colorPalette: z.object({
      hexValuesRankedByFrequency: z.array(z.string()).describe('Hex values ranked by frequency.'),
      contextualPairingSuggestions: z.array(z.string()).describe('Contextual pairing suggestions for colors.'),
    }),
    typography: z.object({
      detectedFonts: z.array(z.string()).describe('Detected fonts in the videos.'),
      hierarchyOfUsage: z.string().describe('Hierarchy of font usage.'),
    }),
    designTreatments: z.array(z.string()).describe('Common lower-thirds, transitions, overlays, and filters.'),
  }),
  audioAndNarrativeStyle: z.object({
    musicAndSound: z.object({
      bpmRange: z.string().describe('BPM range of the music.'),
      tonalMood: z.string().describe('Tonal mood of the music.'),
      instrumentBias: z.string().describe('Instrument bias in the music.'),
    }),
    toneAndLanguage: z.object({
      sentiment: z.string().describe('Sentiment analysis of the video content.'),
      linguisticToneClassifier: z
        .string()
        .describe('Linguistic tone classifier (formal/playful/etc.).'),
    }),
    storyStructure: z.object({
      averageIntroTime: z.string().describe('Average intro time of the videos.'),
      averageOutroTime: z.string().describe('Average outro time of the videos.'),
      structureArchetype: z.string().describe('Story structure archetype (Hero’s Journey, Tutorial, Review, etc.).'),
    }),
  }),
  formatAndTechnicalInstructions: z.object({
    brandingTemplates: z.string().describe('Auto-generated PowerPoint & title-card templates (as a URL or file path).'),
    videoFormats: z.string().describe('Aspect ratios, resolutions, and subtitle presence.'),
    updateProtocols: z.string().describe('AI generates changelog when style drifts detected.'),
  }),
  brandConsistencyInApplication: z.object({
    visualConsistency: z.string().describe('% deviation from color/font baseline.'),
    cohesiveMessaging: z.string().describe('Script theme clustering for message drift detection.'),
  }),
});
export type ExtractBrandElementsOutput = z.infer<typeof ExtractBrandElementsOutputSchema>;

export async function extractBrandElements(input: ExtractBrandElementsInput): Promise<ExtractBrandElementsOutput> {
  return extractBrandElementsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractBrandElementsPrompt',
  input: {schema: ExtractBrandElementsInputSchema},
  output: {schema: ExtractBrandElementsOutputSchema},
  prompt: `You are an AI brand analyst. Analyze the videos provided to extract key brand elements.\n\nVideos: {{videoUrls}}\n\nMost Representative Video Index: {{mostRepresentativeVideoIndex}}\n\nOutput a JSON object containing the following brand elements:\n\nCore Visual Elements:\n- Logo Usage: Placement coordinates, animation timing, transparency patterns\n- Color Palette: Hex values ranked by frequency, contextual pairing suggestions\n- Typography: Detected fonts, hierarchy of usage\n- Design Treatments: Common lower-thirds, transitions, overlays, filters\n\nAudio and Narrative Style:\n- Music & Sound: BPM range, tonal mood, instrument bias\n- Tone & Language: Sentiment, linguistic tone classifier (formal/playful/etc.)\n- Story Structure: Average intro/outro time, structure archetype (Hero’s Journey, Tutorial, Review, etc.)\n\nFormat & Technical Instructions:\n- Branding Templates: Auto-generated PowerPoint & title-card templates\n- Video Formats: Aspect ratios, resolutions, subtitle presence\n- Update Protocols: AI generates changelog when style drifts detected\n\nBrand Consistency in Application:\n- Visual Consistency: % deviation from color/font baseline
- Cohesive Messaging: Script theme clustering for message drift detection`,
});

const extractBrandElementsFlow = ai.defineFlow(
  {
    name: 'extractBrandElementsFlow',
    inputSchema: ExtractBrandElementsInputSchema,
    outputSchema: ExtractBrandElementsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
