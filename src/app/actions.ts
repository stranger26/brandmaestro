'use server';

import {
  checkVideoForBrandCompliance,
  type CheckVideoForBrandComplianceInput,
  type CheckVideoForBrandComplianceOutput,
} from '@/ai/flows/check-video-for-brand-compliance';
import {
  extractBrandElements,
  type ExtractBrandElementsInput,
  type ExtractBrandElementsOutput,
} from '@/ai/flows/extract-brand-elements-from-videos';
import {
  getContentStrategyAdvice,
  type ContentStrategyAdviceInput,
  type ContentStrategyAdviceOutput,
} from '@/ai/flows/get-content-strategy-advice';
import {
  generateVideoFromScript,
  type GenerateVideoFromScriptInput,
  type GenerateVideoFromScriptOutput,
} from '@/ai/flows/generate-video-from-script';
import {
  enhancedBrandComplianceCheck,
  hybridBrandComplianceCheck,
  type EnhancedBrandComplianceInput,
  type EnhancedBrandComplianceOutput,
} from '@/ai/flows/enhanced-brand-compliance-with-groq';
import {
  enhancedComplianceWithExaSync,
  type EnhancedComplianceWithExaInput,
  type EnhancedComplianceWithExaOutput,
} from '@/ai/flows/enhanced-compliance-with-exa';

export async function handleExtractBrandElements(
  data: ExtractBrandElementsInput
): Promise<ExtractBrandElementsOutput> {
  try {
    const result = await extractBrandElements(data);
    return result;
  } catch (error) {
    console.error('Error in handleExtractBrandElements:', error);
    throw new Error('Failed to extract brand elements.');
  }
}

export async function handleCheckCompliance(
  data: CheckVideoForBrandComplianceInput
): Promise<CheckVideoForBrandComplianceOutput> {
  try {
    const result = await checkVideoForBrandCompliance(data);
    return result;
  } catch (error) {
    console.error('Error in handleCheckCompliance:', error);
    throw new Error('Failed to check video for compliance.');
  }
}

export async function handleGetStrategy(
  data: ContentStrategyAdviceInput
): Promise<ContentStrategyAdviceOutput> {
  try {
    const result = await getContentStrategyAdvice(data);
    return result;
  } catch (error) {
    console.error('Error in handleGetStrategy:', error);
    throw new Error('Failed to get content strategy advice.');
  }
}

export async function handleGenerateVideoFromScript(
  data: GenerateVideoFromScriptInput
): Promise<GenerateVideoFromScriptOutput> {
  try {
    const result = await generateVideoFromScript(data);
    return result;
  } catch (error) {
    console.error('Error in handleGenerateVideoFromScript:', error);
    throw error as Error;
  }
}

export async function handleEnhancedBrandCompliance(
  data: EnhancedBrandComplianceInput
): Promise<EnhancedBrandComplianceOutput> {
  try {
    const result = await enhancedBrandComplianceCheck(data);
    return result;
  } catch (error) {
    console.error('Error in handleEnhancedBrandCompliance:', error);
    throw new Error('Failed to perform enhanced brand compliance check.');
  }
}

export async function handleHybridBrandCompliance(
  data: EnhancedBrandComplianceInput
): Promise<EnhancedBrandComplianceOutput> {
  try {
    const result = await hybridBrandComplianceCheck(data);
    return result;
  } catch (error) {
    console.error('Error in handleHybridBrandCompliance:', error);
    throw new Error('Failed to perform hybrid brand compliance check.');
  }
}

export async function handleEnhancedComplianceWithExa(
  data: EnhancedComplianceWithExaInput
): Promise<EnhancedComplianceWithExaOutput> {
  try {
    const result = await enhancedComplianceWithExaSync(data);
    return result;
  } catch (error) {
    console.error('Error in handleEnhancedComplianceWithExa:', error);
    throw new Error('Failed to perform enhanced compliance check with Exa.');
  }
}
