'use server';

/**
 * @fileOverview A content strategy advice AI agent.
 *
 * - getContentStrategyAdvice - A function that provides content strategy advice.
 * - ContentStrategyAdviceInput - The input type for the getContentStrategyAdvice function.
 * - ContentStrategyAdviceOutput - The return type for the getContentStrategyAdvice function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ContentStrategyAdviceInputSchema = z.object({
  uploadSchedule: z
    .string()
    .describe(
      'The user upload schedule, including the date and time of each video upload.'
    ),
  engagementData: z
    .string()
    .describe(
      'The engagement data for each video, including views, likes, comments, and shares.'
    ),
  linguisticTone: z
    .string()
    .describe(
      'The linguistic tone of the video, including the sentiment and style of language used.'
    ),
});
export type ContentStrategyAdviceInput = z.infer<
  typeof ContentStrategyAdviceInputSchema
>;

const ContentStrategyAdviceOutputSchema = z.object({
  contentProductionRecommendations: z
    .string()
    .describe(
      'Suggested posting times, ideal video length, and optimal formats.'
    ),
  languageOptimization: z
    .string()
    .describe(
      'Keywords and tone variants that historically drive higher engagement.'
    ),
  personaReinforcement: z
    .string()
    .describe(
      'Behavioral cues to strengthen creator identity (e.g., lean more into humor, reduce jargon).' 
    )
});
export type ContentStrategyAdviceOutput = z.infer<
  typeof ContentStrategyAdviceOutputSchema
>;

export async function getContentStrategyAdvice(
  input: ContentStrategyAdviceInput
): Promise<ContentStrategyAdviceOutput> {
  return getContentStrategyAdviceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'contentStrategyAdvicePrompt',
  input: {schema: ContentStrategyAdviceInputSchema},
  output: {schema: ContentStrategyAdviceOutputSchema},
  prompt: `You are an expert content strategist. Based on the user's upload schedule, engagement data, and linguistic tone, you will provide content production recommendations, language optimization suggestions, and persona reinforcement advice.

Upload Schedule: {{{uploadSchedule}}}
Engagement Data: {{{engagementData}}}
Linguistic Tone: {{{linguisticTone}}}

Here is the output format you will follow:
Content Production Recommendations: <recommendations>
Language Optimization: <suggestions>
Persona Reinforcement: <advice>`,
});

const getContentStrategyAdviceFlow = ai.defineFlow(
  {
    name: 'getContentStrategyAdviceFlow',
    inputSchema: ContentStrategyAdviceInputSchema,
    outputSchema: ContentStrategyAdviceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
