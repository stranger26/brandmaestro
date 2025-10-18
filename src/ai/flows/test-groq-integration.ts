/**
 * Test file for Groq integration with Context7 search capabilities
 * This file demonstrates how the enhanced brand compliance system works
 */

import { enhancedBrandComplianceCheck, hybridBrandComplianceCheck } from './enhanced-brand-compliance-with-groq';

// Test data
const testInput = {
  videoDataUri: 'data:video/mp4;base64,test-video-data',
  brandGuidelines: `
    Brand Guidelines for Test Brand:
    - Use consistent color palette: #FF6B6B, #4ECDC4, #45B7D1
    - Maintain professional tone in all communications
    - Include brand logo in top-right corner
    - Use clean, modern typography
    - Avoid cluttered layouts
  `,
  brandName: 'Test Brand',
  contentType: 'video/mp4',
  searchContext: true,
};

/**
 * Test the enhanced brand compliance check
 */
export async function testEnhancedBrandCompliance() {
  console.log('Testing Enhanced Brand Compliance with Groq...');
  
  try {
    const result = await enhancedBrandComplianceCheck(testInput);
    console.log('Enhanced Brand Compliance Result:', JSON.stringify(result, null, 2));
    return result;
  } catch (error) {
    console.error('Error in enhanced brand compliance test:', error);
    throw error;
  }
}

/**
 * Test the hybrid approach (Groq + Gemini)
 */
export async function testHybridBrandCompliance() {
  console.log('Testing Hybrid Brand Compliance (Groq + Gemini)...');
  
  try {
    const result = await hybridBrandComplianceCheck(testInput);
    console.log('Hybrid Brand Compliance Result:', JSON.stringify(result, null, 2));
    return result;
  } catch (error) {
    console.error('Error in hybrid brand compliance test:', error);
    throw error;
  }
}

/**
 * Run all tests
 */
export async function runAllTests() {
  console.log('Running Groq Integration Tests...');
  
  try {
    await testEnhancedBrandCompliance();
    console.log('✅ Enhanced Brand Compliance test passed');
    
    await testHybridBrandCompliance();
    console.log('✅ Hybrid Brand Compliance test passed');
    
    console.log('🎉 All tests passed!');
  } catch (error) {
    console.error('❌ Tests failed:', error);
    throw error;
  }
}
