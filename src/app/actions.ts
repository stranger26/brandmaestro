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
    throw new Error('Failed to generate video from script.');
  }
}
