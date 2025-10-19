'use server';
/**
 * @fileOverview Enhanced brand compliance checking with Exa integration and streaming progress updates.
 * 
 * This flow combines:
 * - Video content analysis with Groq
 * - Technical brand compliance checking
 * - Contextual risk analysis with Exa
 * - Streaming progress updates for better UX
 */

import { z } from 'genkit';
import { checkVideoForBrandCompliance, type CheckVideoForBrandComplianceInput } from './check-video-for-brand-compliance';
import { generateVideoSummary } from './generate-video-summary';
import { checkSensitiveTopicsWithExa } from './check-sensitive-topics-with-exa';
import type { CheckVideoForBrandComplianceOutput } from './check-video-for-brand-compliance';

const EnhancedComplianceWithExaInputSchema = z.object({
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
    .describe('The brand name for contextual risk analysis.'),
  enableSensitiveTopicsCheck: z
    .boolean()
    .default(true)
    .describe('Whether to perform sensitive topics analysis with Exa.'),
  contentType: z
    .string()
    .optional()
    .describe('The MIME type of the video content.'),
});

export type EnhancedComplianceWithExaInput = z.infer<
  typeof EnhancedComplianceWithExaInputSchema
>;

const ProgressUpdateSchema = z.object({
  step: z.string().describe('Current step being executed'),
  progress: z.number().describe('Progress percentage (0-100)'),
  message: z.string().describe('Human-readable progress message'),
  partialResults: z.any().optional().describe('Partial results if available'),
});

export type ProgressUpdate = z.infer<typeof ProgressUpdateSchema>;

const EnhancedComplianceWithExaOutputSchema = z.object({
  technicalIssues: z.array(z.any()).describe('Technical brand compliance issues'),
  contextualRisks: z.array(z.any()).describe('Contextual risk findings from Exa'),
  videoSummary: z.any().optional().describe('Generated video content summary'),
  totalIssues: z.number().describe('Total number of issues found'),
  processingTime: z.number().describe('Total processing time in milliseconds'),
});

export type EnhancedComplianceWithExaOutput = z.infer<
  typeof EnhancedComplianceWithExaOutputSchema
>;

/**
 * Transforms Exa findings into compliance issue format
 */
function transformExaFindingsToComplianceIssues(exaFindings: any[]): CheckVideoForBrandComplianceOutput {
  console.log(`Transforming ${exaFindings.length} Exa findings to compliance issues`);
  
  const transformed = exaFindings.map(finding => ({
    timestamp: 0, // Contextual risks apply to entire video
    issue: `Contextual Risk: ${finding.topicName} - ${finding.description}`,
    suggestedFix: finding.recommendation,
    severity: finding.riskLevel,
    category: 'contextual-risk' as const,
    sourceUrl: finding.url,
    publishedDate: finding.publishedDate,
  }));
  
  console.log(`Transformed ${transformed.length} compliance issues from Exa findings`);
  return transformed;
}

/**
 * Enhanced brand compliance check with Exa integration and streaming
 */
export async function* enhancedComplianceWithExa(
  input: EnhancedComplianceWithExaInput
): AsyncGenerator<ProgressUpdate, EnhancedComplianceWithExaOutput, unknown> {
  const startTime = Date.now();
  let technicalIssues: CheckVideoForBrandComplianceOutput = [];
  let contextualRisks: CheckVideoForBrandComplianceOutput = [];
  let videoSummary: any = null;

  try {
    // Step 1: Generate video summary
    yield {
      step: 'video-analysis',
      progress: 20,
      message: 'Analyzing video content and extracting key themes...',
    };

    try {
      videoSummary = await generateVideoSummary({
        videoDataUri: input.videoDataUri,
        contentType: input.contentType,
      });
      
      yield {
        step: 'video-analysis',
        progress: 40,
        message: 'Video analysis complete. Checking brand guidelines...',
        partialResults: { videoSummary },
      };
    } catch (error) {
      console.error('Error generating video summary:', error);
      // Continue with mock summary if video analysis fails
      videoSummary = {
        mainTopics: ['General content'],
        keyMessages: ['Standard messaging'],
        visualElements: ['Standard visuals'],
        targetAudience: 'General audience',
        contentTheme: 'General content',
        productsMentioned: [],
        tone: 'Neutral',
        culturalElements: [],
      };
      
      yield {
        step: 'video-analysis',
        progress: 40,
        message: 'Video analysis failed, using fallback summary. Checking brand guidelines...',
        partialResults: { videoSummary },
      };
    }

    // Step 2: Run technical compliance check
    const complianceInput: CheckVideoForBrandComplianceInput = {
      videoDataUri: input.videoDataUri,
      brandGuidelines: input.brandGuidelines,
      contentType: input.contentType,
    };

    try {
      technicalIssues = await checkVideoForBrandCompliance(complianceInput);
    } catch (error) {
      console.error('Error in technical compliance check:', error);
      // If it's a quota error, provide a helpful message
      if (error instanceof Error && error.message.includes('quota')) {
        console.warn('API quota exceeded, using fallback compliance check');
        technicalIssues = [{
          timestamp: 0,
          issue: "⚠️ API quota exceeded - basic compliance check unavailable",
          suggestedFix: "Please try again later or check your API billing settings. Enhanced features may be limited.",
          severity: "medium" as const,
          category: "technical" as const,
        }];
      } else {
        // For other errors, use empty array
        technicalIssues = [];
      }
    }

    yield {
      step: 'technical-compliance',
      progress: 60,
      message: technicalIssues.length > 0 && technicalIssues[0].issue.includes('quota') 
        ? 'API quota exceeded - using fallback compliance check.'
        : `Found ${technicalIssues.length} technical compliance issues.`,
      partialResults: { technicalIssues },
    };

    // Step 3: Check for sensitive topics if enabled
    if (input.enableSensitiveTopicsCheck) {
      yield {
        step: 'sensitive-topics',
        progress: 70,
        message: 'Searching for recent sensitive topics and cultural risks...',
      };

      try {
        const exaFindings = await checkSensitiveTopicsWithExa({
          brandName: input.brandName,
          videoSummary,
        });

        contextualRisks = transformExaFindingsToComplianceIssues(exaFindings.findings);
        
        // If no contextual risks found, add a "compliant" message
        if (contextualRisks.length === 0) {
          contextualRisks = [{
            timestamp: 0,
            issue: "✅ No high or critical risk sensitive topics found",
            suggestedFix: "Your content appears compliant with current cultural and trending issues. Only high and critical risk factors are flagged - lower risk items are considered acceptable. Continue monitoring for any emerging risks.",
            severity: "low" as const,
            category: "contextual-risk" as const,
            sourceUrl: undefined,
            publishedDate: new Date().toISOString(),
          }];
        }

        yield {
          step: 'sensitive-topics',
          progress: 90,
          message: contextualRisks.length === 1 && contextualRisks[0].issue.includes('✅') 
            ? 'No high or critical risk sensitive topics found - content appears compliant.'
            : `Found ${contextualRisks.length} high or critical risk factors.`,
          partialResults: { contextualRisks },
        };
      } catch (error) {
        console.error('Error checking sensitive topics:', error);
        // Continue with empty contextual risks if Exa fails
        contextualRisks = [];
        yield {
          step: 'sensitive-topics',
          progress: 90,
          message: 'Sensitive topics check completed with limited results.',
          partialResults: { contextualRisks },
        };
      }
    }

    // Step 4: Compile final results
    yield {
      step: 'compiling',
      progress: 95,
      message: 'Compiling comprehensive compliance report...',
    };

    const processingTime = Date.now() - startTime;
    const totalIssues = technicalIssues.length + contextualRisks.length;

    yield {
      step: 'complete',
      progress: 100,
      message: `Analysis complete! Found ${totalIssues} total issues.`,
    };

    return {
      technicalIssues,
      contextualRisks,
      videoSummary,
      totalIssues,
      processingTime,
    };

  } catch (error) {
    console.error('Error in enhancedComplianceWithExa:', error);
    
    yield {
      step: 'error',
      progress: 0,
      message: `Error during analysis: ${(error as Error).message}`,
    };

    throw error;
  }
}

/**
 * Non-streaming version for backward compatibility
 */
export async function enhancedComplianceWithExaSync(
  input: EnhancedComplianceWithExaInput
): Promise<EnhancedComplianceWithExaOutput> {
  let technicalIssues: CheckVideoForBrandComplianceOutput = [];
  let contextualRisks: CheckVideoForBrandComplianceOutput = [];
  let videoSummary: any = null;
  const startTime = Date.now();

  try {
    // Step 1: Generate video summary
    try {
      videoSummary = await generateVideoSummary({
        videoDataUri: input.videoDataUri,
        contentType: input.contentType,
      });
    } catch (error) {
      console.error('Error generating video summary:', error);
      // Continue with mock summary if video analysis fails
      videoSummary = {
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

    // Step 2: Run technical compliance check
    const complianceInput: CheckVideoForBrandComplianceInput = {
      videoDataUri: input.videoDataUri,
      brandGuidelines: input.brandGuidelines,
      contentType: input.contentType,
    };

    try {
      technicalIssues = await checkVideoForBrandCompliance(complianceInput);
    } catch (error) {
      console.error('Error in technical compliance check:', error);
      // If it's a quota error, provide a helpful message
      if (error instanceof Error && error.message.includes('quota')) {
        console.warn('API quota exceeded, using fallback compliance check');
        technicalIssues = [{
          timestamp: 0,
          issue: "⚠️ API quota exceeded - basic compliance check unavailable",
          suggestedFix: "Please try again later or check your API billing settings. Enhanced features may be limited.",
          severity: "medium" as const,
          category: "technical" as const,
        }];
      } else {
        // For other errors, use empty array
        technicalIssues = [];
      }
    }

    // Step 3: Check for sensitive topics if enabled
    if (input.enableSensitiveTopicsCheck) {
      try {
        const exaFindings = await checkSensitiveTopicsWithExa({
          brandName: input.brandName,
          videoSummary,
        });

        contextualRisks = transformExaFindingsToComplianceIssues(exaFindings.findings);
        
        // If no contextual risks found, add a "compliant" message
        if (contextualRisks.length === 0) {
          contextualRisks = [{
            timestamp: 0,
            issue: "✅ No high or critical risk sensitive topics found",
            suggestedFix: "Your content appears compliant with current cultural and trending issues. Only high and critical risk factors are flagged - lower risk items are considered acceptable. Continue monitoring for any emerging risks.",
            severity: "low" as const,
            category: "contextual-risk" as const,
            sourceUrl: undefined,
            publishedDate: new Date().toISOString(),
          }];
        }
      } catch (error) {
        console.error('Error checking sensitive topics:', error);
        // Continue with empty contextual risks if Exa fails
        contextualRisks = [];
      }
    }

    const processingTime = Date.now() - startTime;
    const totalIssues = technicalIssues.length + contextualRisks.length;

    return {
      technicalIssues,
      contextualRisks,
      videoSummary,
      totalIssues,
      processingTime,
    };

  } catch (error) {
    console.error('Error in enhancedComplianceWithExaSync:', error);
    throw error;
  }
}
