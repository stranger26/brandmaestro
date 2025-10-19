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
  contentType: z
    .string()
    .optional()
    .describe('The MIME type of the video content.'),
});
export type CheckVideoForBrandComplianceInput = z.infer<
  typeof CheckVideoForBrandComplianceInputSchema
>;

const ComplianceIssueSchema = z.object({
  timestamp: z.number().describe('The timestamp in seconds where the issue occurs.'),
  issue: z.string().describe('A specific, detailed description of the compliance issue.'),
  suggestedFix: z.string().describe('A detailed, actionable fix with specific parameters.'),
  severity: z.enum(['low', 'medium', 'high', 'critical']).describe('The severity level of the compliance issue.'),
  category: z.enum(['visual', 'audio', 'text', 'branding', 'technical', 'contextual-risk']).describe('The category of the compliance issue.'),
  sourceUrl: z.string().optional().describe('URL of the source for contextual risk findings.'),
  publishedDate: z.string().optional().describe('Publication date of the source for contextual risk findings.'),
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
  prompt: `You are an AI brand compliance checker. Analyze the video thoroughly and identify specific, unique compliance issues at different timestamps. Each issue should be distinct and address different aspects of brand compliance.

  Brand Guidelines:
  {{brandGuidelines}}

  Video: {{media url=videoDataUri contentType=contentType}}

  Instructions:
  1. Analyze the video frame by frame, looking for specific brand guideline violations
  2. Create UNIQUE issues - avoid repeating the same type of problem
  3. Focus on different aspects: visual elements, text, colors, logos, typography, spacing, audio, etc.
  4. Provide specific timestamps where issues occur (not just 5-second intervals)
  5. Give detailed, actionable fixes with specific parameters (colors, sizes, positions, etc.)
  6. Categorize each issue appropriately
  7. Assign realistic severity levels

  Output as a JSON array with this exact schema:
  [{
    "timestamp": number,
    "issue": "Specific description of what's wrong and which guideline it violates",
    "suggestedFix": "Detailed fix with specific parameters (colors, sizes, positions, timing, etc.)",
    "severity": "low|medium|high|critical",
    "category": "visual|audio|text|branding|technical"
  }]

  Examples of good issues:
  - "Brand logo is missing from the top-right corner at 0.0s"
  - "Text color #FF0000 violates brand color palette (should be #1E40AF) at 3.2s"
  - "Font 'Comic Sans' used instead of brand font 'Inter' at 7.5s"
  - "Logo transparency is 100% but brand guidelines require 85% opacity at 12.1s"
  - "Audio volume exceeds brand standard of -12dB at 15.8s"

  Make each issue specific, actionable, and unique. Avoid generic descriptions.
  `,
});

const checkVideoForBrandComplianceFlow = ai.defineFlow(
  {
    name: 'checkVideoForBrandComplianceFlow',
    inputSchema: CheckVideoForBrandComplianceInputSchema,
    outputSchema: CheckVideoForBrandComplianceOutputSchema,
  },
  async input => {
    // Extract content type from data URI if it's a data URI
    let contentType = 'video/mp4'; // default
    if (input.videoDataUri.startsWith('data:')) {
      const mimeMatch = input.videoDataUri.match(/data:([^;]+);/);
      if (mimeMatch) {
        contentType = mimeMatch[1];
      }
    }
    
    // Create the prompt input with proper content type
    const promptInput = {
      ...input,
      videoDataUri: input.videoDataUri,
      contentType
    };
    
    const {output} = await prompt(promptInput);
    return output!;
  }
);
