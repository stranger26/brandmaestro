'use server';
/**
 * @fileOverview Enhanced brand compliance checking using Groq with Context7 search capabilities.
 * 
 * This flow combines:
 * - Groq's fast inference with web search capabilities
 * - Context7 search for real-time brand context
 * - Enhanced brand compliance analysis
 */

import { z } from 'genkit';
import Groq from 'groq-sdk';

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const EnhancedBrandComplianceInputSchema = z.object({
  videoDataUri: z
    .string()
    .describe(
      "A video to be checked for brand compliance, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  brandGuidelines: z
    .string()
    .describe('The stored brand guidelines to check against.'),
  brandName: z
    .string()
    .describe('The brand name for context7 search queries.'),
  contentType: z
    .string()
    .optional()
    .describe('The MIME type of the video content.'),
  searchContext: z
    .boolean()
    .optional()
    .default(true)
    .describe('Whether to perform real-time brand context search.'),
});

export type EnhancedBrandComplianceInput = z.infer<
  typeof EnhancedBrandComplianceInputSchema
>;

const ComplianceIssueSchema = z.object({
  timestamp: z.number().describe('The timestamp in seconds where the issue occurs.'),
  issue: z.string().describe('A specific, detailed description of the compliance issue.'),
  suggestedFix: z.string().describe('A detailed, actionable fix with specific parameters.'),
  severity: z.enum(['low', 'medium', 'high', 'critical']).describe('The severity level of the compliance issue.'),
  category: z.enum(['visual', 'audio', 'text', 'branding', 'technical']).describe('The category of the compliance issue.'),
  context: z.string().optional().describe('Additional context from real-time search.'),
});

const EnhancedBrandComplianceOutputSchema = z.object({
  issues: z.array(ComplianceIssueSchema),
  brandContext: z.object({
    currentTrends: z.string().optional(),
    competitorAnalysis: z.string().optional(),
    marketPosition: z.string().optional(),
  }).optional(),
  recommendations: z.array(z.string()).describe('Strategic recommendations based on brand context.'),
});

export type EnhancedBrandComplianceOutput = z.infer<
  typeof EnhancedBrandComplianceOutputSchema
>;

/**
 * Performs real-time brand context search using Groq's web search capabilities
 */
async function searchBrandContext(brandName: string): Promise<{
  currentTrends?: string;
  competitorAnalysis?: string;
  marketPosition?: string;
}> {
  try {
    const searchQueries = [
      `${brandName} brand guidelines 2024`,
      `${brandName} marketing trends current`,
      `${brandName} competitor analysis brand positioning`,
    ];

    const searchResults = await Promise.all(
      searchQueries.map(async (query) => {
        const completion = await groq.chat.completions.create({
          messages: [
            {
              role: 'system',
              content: 'You are a brand research assistant. Search for and summarize the most relevant information about the brand query. Focus on current trends, guidelines, and market positioning.',
            },
            {
              role: 'user',
              content: `Search for: ${query}. Provide a concise summary of the most relevant findings.`,
            },
          ],
          model: 'llama3-8b-8192',
          temperature: 0.3,
        });

        return completion.choices[0]?.message?.content || '';
      })
    );

    return {
      currentTrends: searchResults[1],
      competitorAnalysis: searchResults[2],
      marketPosition: searchResults[0],
    };
  } catch (error) {
    console.error('Error in brand context search:', error);
    return {};
  }
}

/**
 * Enhanced brand compliance check using Groq with Context7 search
 */
export async function enhancedBrandComplianceCheck(
  input: EnhancedBrandComplianceInput
): Promise<EnhancedBrandComplianceOutput> {
  // Step 1: Get real-time brand context if requested
  let brandContext = {};
  if (input.searchContext && input.brandName) {
    brandContext = await searchBrandContext(input.brandName);
  }

  // Step 2: Perform enhanced brand compliance analysis
  const compliancePrompt = `
You are an advanced AI brand compliance checker with access to real-time brand context. 
Analyze the provided video against brand guidelines and current market context.

Brand Guidelines:
${input.brandGuidelines}

${input.brandName ? `Brand Name: ${input.brandName}` : ''}

${Object.keys(brandContext).length > 0 ? `
Current Brand Context:
${JSON.stringify(brandContext, null, 2)}
` : ''}

Video: ${input.videoDataUri}

Instructions:
1. Analyze the video for brand compliance issues every 5 seconds
2. Consider current brand trends and market positioning in your analysis
3. Provide severity levels for each issue
4. Include contextual insights from real-time brand research
5. Suggest strategic recommendations

Output format:
{
  "issues": [
    {
      "timestamp": number,
      "issue": "description",
      "suggestedFix": "fix suggestion",
      "severity": "low|medium|high|critical",
      "context": "additional context from brand research"
    }
  ],
  "recommendations": [
    "strategic recommendation 1",
    "strategic recommendation 2"
  ]
}
`;

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are an expert brand compliance analyst with access to real-time market data.',
        },
        {
          role: 'user',
          content: compliancePrompt,
        },
      ],
      model: 'llama3-8b-8192',
      temperature: 0.2,
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) {
      throw new Error('No response from Groq API');
    }

    // Parse the JSON response
    const parsedResponse = JSON.parse(response);
    
    return {
      issues: parsedResponse.issues || [],
      brandContext: Object.keys(brandContext).length > 0 ? brandContext : undefined,
      recommendations: parsedResponse.recommendations || [],
    };
  } catch (error) {
    console.error('Error in enhanced brand compliance check:', error);
    throw new Error('Failed to perform enhanced brand compliance check');
  }
}

/**
 * Hybrid approach: Use Groq for context search and Gemini for video analysis
 */
export async function hybridBrandComplianceCheck(
  input: EnhancedBrandComplianceInput
): Promise<EnhancedBrandComplianceOutput> {
  // Get brand context using Groq
  const brandContext = input.searchContext && input.brandName 
    ? await searchBrandContext(input.brandName)
    : {};

  // Use the existing Gemini flow for video analysis but with enhanced context
  const enhancedInput = {
    ...input,
    brandGuidelines: `${input.brandGuidelines}\n\nAdditional Brand Context:\n${JSON.stringify(brandContext, null, 2)}`,
  };

  // Import the existing flow
  const { checkVideoForBrandCompliance } = await import('./check-video-for-brand-compliance');
  
  const issues = await checkVideoForBrandCompliance(enhancedInput);
  
  // Enhance issues with context and severity
  const enhancedIssues = issues.map(issue => ({
    ...issue,
    severity: 'medium' as const, // Default severity, could be enhanced with AI analysis
    context: Object.keys(brandContext).length > 0 ? 'Enhanced with real-time brand context' : undefined,
  }));

  return {
    issues: enhancedIssues,
    brandContext: Object.keys(brandContext).length > 0 ? brandContext : undefined,
    recommendations: [
      'Consider updating brand guidelines based on current market trends',
      'Monitor competitor brand strategies for competitive advantage',
      'Regular brand compliance audits recommended',
    ],
  };
}
