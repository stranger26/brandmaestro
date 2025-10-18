'use server';
/**
 * @fileOverview Checks a video for brand compliance against stored brand guidelines.
 *
 * - checkVideoForBrandCompliance - A function that handles the video compliance check process.
 * - CheckVideoForBrandComplianceInput - The input type for the checkVideoForBrandCompliance function.
 * - CheckVideoForBrandComplianceOutput - The return type for the checkVideoForBrandCompliance function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CheckVideoForBrandComplianceInputSchema = z.object({
  videoDataUri: z
    .string()
    .describe(
      "A video to be checked for brand compliance, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  brandGuidelines: z
    .string()
    .describe('The stored brand guidelines to check against.'),
});
export type CheckVideoForBrandComplianceInput = z.infer<
  typeof CheckVideoForBrandComplianceInputSchema
>;

const ComplianceIssueSchema = z.object({
  timestamp: z.number().describe('The timestamp in seconds where the issue occurs.'),
  issue: z.string().describe('A description of the compliance issue.'),
  suggestedFix: z.string().describe('A suggested one-click fix for the issue.'),
});

const CheckVideoForBrandComplianceOutputSchema = z.array(
  ComplianceIssueSchema
);
export type CheckVideoForBrandComplianceOutput = z.infer<
  typeof CheckVideoForBrandComplianceOutputSchema
>;

export async function checkVideoForBrandCompliance(
  input: CheckVideoForBrandComplianceInput
): Promise<CheckVideoForBrandComplianceOutput> {
  return checkVideoForBrandComplianceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'checkVideoForBrandCompliancePrompt',
  input: {schema: CheckVideoForBrandComplianceInputSchema},
  output: {schema: CheckVideoForBrandComplianceOutputSchema},
  prompt: `You are an AI brand compliance checker. You will analyze a video and flag any inconsistencies with the provided brand guidelines every 5 seconds. You will also suggest one-click fixes using GenAI.

  Brand Guidelines:
  {{brandGuidelines}}

  Video: {{media url=videoDataUri}}

  Output the inconsistencies as a JSON array of objects with the following schema:
  [{
    "timestamp": "The timestamp in seconds where the issue occurs.",
    "issue": "A description of the compliance issue.",
    "suggestedFix": "A suggested one-click fix for the issue."
  }]

  Only include issues that occur at 5 second intervals.
  `,
});

const checkVideoForBrandComplianceFlow = ai.defineFlow(
  {
    name: 'checkVideoForBrandComplianceFlow',
    inputSchema: CheckVideoForBrandComplianceInputSchema,
    outputSchema: CheckVideoForBrandComplianceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
