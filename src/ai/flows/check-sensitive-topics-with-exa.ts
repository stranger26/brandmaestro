'use server';
/**
 * @fileOverview Checks for sensitive topics and contextual risks using Exa search API.
 * 
 * This flow uses Exa's neural search capabilities to find recent articles and discussions
 * about topics that may be sensitive or controversial in relation to the video content.
 */

import { z } from 'genkit';
import Exa from 'exa-js';
import type { VideoSummary } from './generate-video-summary';

// Initialize Exa client
const exa = new Exa(process.env.EXA_API_KEY);

// Check if API key is available
if (!process.env.EXA_API_KEY) {
  console.warn('EXA_API_KEY not found in environment variables');
}

const CheckSensitiveTopicsInputSchema = z.object({
  brandName: z.string().describe('The brand name to search for'),
  videoSummary: z.object({
    mainTopics: z.array(z.string()),
    keyMessages: z.array(z.string()),
    visualElements: z.array(z.string()),
    targetAudience: z.string(),
    contentTheme: z.string(),
    productsMentioned: z.array(z.string()).optional(),
    tone: z.string(),
    culturalElements: z.array(z.string()).optional(),
  }).describe('Structured summary of video content'),
});

export type CheckSensitiveTopicsInput = z.infer<
  typeof CheckSensitiveTopicsInputSchema
>;

const SensitiveTopicFindingSchema = z.object({
  topicName: z.string().describe('Name of the sensitive topic or issue'),
  description: z.string().describe('Description of the finding and its relevance'),
  url: z.string().describe('URL of the source article or discussion'),
  publishedDate: z.string().describe('Publication date of the source'),
  riskLevel: z.enum(['low', 'medium', 'high', 'critical']).describe('Risk level of the finding'),
  recommendation: z.string().describe('Recommended action or consideration'),
  relevanceScore: z.number().describe('Relevance score from 0-1'),
});

export type SensitiveTopicFinding = z.infer<typeof SensitiveTopicFindingSchema>;

const CheckSensitiveTopicsOutputSchema = z.object({
  findings: z.array(SensitiveTopicFindingSchema),
  searchQueries: z.array(z.string()).describe('The search queries that were executed'),
  totalResults: z.number().describe('Total number of search results analyzed'),
});

export type CheckSensitiveTopicsOutput = z.infer<
  typeof CheckSensitiveTopicsOutputSchema
>;

/**
 * Generates targeted search queries based on video content and brand
 */
function generateSearchQueries(brandName: string, videoSummary: VideoSummary): string[] {
  const queries: string[] = [];
  
  // Brand-specific business risk searches - focus on actual impact
  queries.push(`Recent news about ${brandName} business impact reputation damage:`);
  queries.push(`Recent news about ${brandName} legal issues regulatory problems:`);
  queries.push(`Recent news about ${brandName} customer complaints boycott:`);
  queries.push(`Recent news about ${brandName} financial losses revenue impact:`);
  
  // Content-specific business risk searches - focus on actionable risks
  for (const topic of videoSummary.mainTopics.slice(0, 3)) { // Limit to top 3 topics
    queries.push(`Business risks associated with ${topic} industry impact:`);
    queries.push(`Legal regulatory issues with ${topic} compliance problems:`);
    queries.push(`Market backlash against ${topic} consumer response:`);
  }
  
  // Cultural sensitivity searches - focus on real sensitivity issues with business impact
  if (videoSummary.culturalElements && videoSummary.culturalElements.length > 0) {
    for (const culturalElement of videoSummary.culturalElements.slice(0, 2)) {
      queries.push(`${culturalElement} cultural appropriation sensitivity backlash:`);
      queries.push(`${culturalElement} cultural insensitivity business impact:`);
    }
  }
  
  // Visual elements that might cause business problems
  for (const visualElement of videoSummary.visualElements.slice(0, 2)) {
    queries.push(`${visualElement} problematic imagery business impact:`);
    queries.push(`${visualElement} visual content legal issues:`);
  }
  
  // Tone-based searches for serious business risks
  if (videoSummary.tone.toLowerCase().includes('urgent') || 
      videoSummary.tone.toLowerCase().includes('serious')) {
    queries.push(`Current business risks trending news brand impact:`);
    queries.push(`Recent regulatory changes affecting brands:`);
  }
  
  return queries;
}

/**
 * Analyzes search results to determine risk level and relevance
 */
function analyzeSearchResult(result: any, query: string, videoSummary: VideoSummary): SensitiveTopicFinding | null {
  const title = result.title || '';
  const text = result.text || '';
  const url = result.url || '';
  const publishedDate = result.publishedDate || new Date().toISOString();
  
  // Calculate relevance score based on content overlap
  let relevanceScore = 0;
  const allContent = `${title} ${text}`.toLowerCase();
  
  // Check for brand mentions
  if (allContent.includes(videoSummary.contentTheme.toLowerCase())) {
    relevanceScore += 0.3;
  }
  
  // Check for topic mentions
  for (const topic of videoSummary.mainTopics) {
    if (allContent.includes(topic.toLowerCase())) {
      relevanceScore += 0.2;
    }
  }
  
  // Check for cultural elements
  if (videoSummary.culturalElements) {
    for (const culturalElement of videoSummary.culturalElements) {
      if (allContent.includes(culturalElement.toLowerCase())) {
        relevanceScore += 0.2;
      }
    }
  }
  
  // Only return findings with sufficient relevance (lowered threshold for better results)
  if (relevanceScore < 0.1) {
    console.log(`Filtering out result with relevance score ${relevanceScore}: ${title}`);
    return null;
  }
  
  console.log(`Including result with relevance score ${relevanceScore}: ${title}`);
  
  // Determine risk level based on content analysis - focus on business impact
  let riskLevel: 'low' | 'medium' | 'high' | 'critical' = 'low';
  const riskKeywords = {
    critical: ['lawsuit', 'boycott', 'crisis', 'illegal', 'fraud', 'corruption', 'criminal', 'bankruptcy', 'shutdown', 'banned', 'prosecution'],
    high: ['backlash', 'criticism', 'protest', 'negative', 'accusation', 'allegation', 'investigation', 'resignation', 'fired', 'terminated', 'recall', 'withdrawal'],
    medium: ['concern', 'issue', 'problem', 'debate', 'discussion', 'question', 'challenge', 'complaint', 'review'],
  };
  
  for (const [level, keywords] of Object.entries(riskKeywords)) {
    if (keywords.some(keyword => allContent.includes(keyword))) {
      riskLevel = level as any;
      break;
    }
  }
  
  // Only return findings with high or critical risk levels
  if (riskLevel !== 'high' && riskLevel !== 'critical') {
    console.log(`Filtering out result with risk level ${riskLevel}: ${title}`);
    return null;
  }
  
  // Additional filtering to avoid "stir" or clickbait content
  const businessImpactIndicators = [
    'revenue', 'sales', 'profit', 'loss', 'stock', 'market', 'shareholder', 'investor',
    'customer', 'client', 'user', 'subscriber', 'audience', 'viewer', 'follower',
    'regulatory', 'compliance', 'legal', 'court', 'settlement', 'fine', 'penalty',
    'partnership', 'sponsor', 'advertiser', 'brand', 'reputation', 'pr', 'public relations',
    'employee', 'staff', 'workforce', 'hiring', 'layoff', 'termination'
  ];
  
  const hasBusinessImpact = businessImpactIndicators.some(indicator => 
    allContent.includes(indicator)
  );
  
  if (!hasBusinessImpact) {
    console.log(`Filtering out result without clear business impact: ${title}`);
    return null;
  }
  
  return {
    topicName: title.substring(0, 100),
    description: text.substring(0, 300) + (text.length > 300 ? '...' : ''),
    url,
    publishedDate,
    riskLevel,
    recommendation: riskLevel === 'critical' || riskLevel === 'high' 
      ? 'Consider reviewing content for potential brand impact and cultural sensitivity'
      : 'Monitor this topic for potential relevance to your brand',
    relevanceScore,
  };
}

/**
 * Checks for sensitive topics using Exa search
 */
export async function checkSensitiveTopicsWithExa(
  input: CheckSensitiveTopicsInput
): Promise<CheckSensitiveTopicsOutput> {
  // Check if API key is available
  if (!process.env.EXA_API_KEY) {
    console.warn('EXA_API_KEY not found, returning empty results');
    return {
      findings: [],
      searchQueries: [],
      totalResults: 0,
    };
  }

  try {
    const searchQueries = generateSearchQueries(input.brandName, input.videoSummary);
    const findings: SensitiveTopicFinding[] = [];
    let totalResults = 0;
    
    console.log(`Executing ${searchQueries.length} search queries for brand: ${input.brandName}`);
    
    // Get current date for filtering recent results
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const startDate = thirtyDaysAgo.toISOString().split('T')[0];
    
    // Execute searches in parallel
    const searchPromises = searchQueries.map(async (query) => {
      try {
        console.log(`Searching Exa for: "${query}"`);
        const searchResponse = await exa.search(query, {
          numResults: 3, // Limit results per query
          startPublishedDate: startDate,
          useAutoprompt: false,
        });
        
        console.log(`Found ${searchResponse.results.length} results for query: "${query}"`);
        totalResults += searchResponse.results.length;
        
        // Analyze each result
        const queryFindings = searchResponse.results
          .map(result => analyzeSearchResult(result, query, input.videoSummary))
          .filter(finding => finding !== null) as SensitiveTopicFinding[];
        
        return queryFindings;
      } catch (error) {
        console.error(`Error searching for query "${query}":`, error);
        return [];
      }
    });
    
    const allQueryFindings = await Promise.all(searchPromises);
    
    // Flatten and deduplicate findings
    const allFindings = allQueryFindings.flat();
    console.log(`Total findings before deduplication: ${allFindings.length}`);
    
    const uniqueFindings = allFindings.filter((finding, index, self) => 
      index === self.findIndex(f => f.url === finding.url)
    );
    
    console.log(`Total findings after deduplication: ${uniqueFindings.length}`);
    
    // Sort by relevance score and risk level
    uniqueFindings.sort((a, b) => {
      const riskOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      const riskDiff = riskOrder[b.riskLevel] - riskOrder[a.riskLevel];
      if (riskDiff !== 0) return riskDiff;
      return b.relevanceScore - a.relevanceScore;
    });
    
    const finalFindings = uniqueFindings.slice(0, 10); // Limit to top 10 findings
    console.log(`Final findings to return: ${finalFindings.length}`);
    
    return {
      findings: finalFindings,
      searchQueries,
      totalResults,
    };
  } catch (error) {
    console.error('Error in checkSensitiveTopicsWithExa:', error);
    throw new Error('Failed to check sensitive topics with Exa');
  }
}
