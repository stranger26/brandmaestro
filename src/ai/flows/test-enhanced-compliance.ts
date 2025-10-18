/**
 * Test file to demonstrate the enhanced brand compliance system
 * This shows how the new system generates unique, specific issues with clear timestamps
 */

import { checkVideoForBrandCompliance } from './check-video-for-brand-compliance';

// Example brand guidelines that would generate diverse issues
const exampleBrandGuidelines = `
Brand Guidelines for TechCorp:

VISUAL ELEMENTS:
- Primary colors: #1E40AF (blue), #059669 (green), #DC2626 (red)
- Secondary colors: #F3F4F6 (light gray), #374151 (dark gray)
- Logo must be present in top-right corner with 15px margin
- Logo opacity should be 85% (not 100% or 50%)
- Background should be clean white (#FFFFFF) or light gray (#F3F4F6)

TYPOGRAPHY:
- Primary font: Inter (not Arial, Comic Sans, or Times New Roman)
- Headings: 24px, 20px, 16px (not 18px or 22px)
- Body text: 14px (not 12px or 16px)
- Text color: #374151 (dark gray) or #1E40AF (blue)

SPACING:
- Minimum 20px padding around all content
- 16px spacing between text elements
- No content should touch screen edges

AUDIO:
- Volume should not exceed -12dB
- Background music should be subtle
- Voice should be clear and professional

BRANDING:
- Company name "TechCorp" must be spelled correctly
- Tagline "Innovation First" should appear in videos
- No competitor logos or mentions
`;

// Test data
const testInput = {
  videoDataUri: 'data:video/mp4;base64,test-video-data',
  brandGuidelines: exampleBrandGuidelines,
  contentType: 'video/mp4',
};

/**
 * Test the enhanced brand compliance system
 */
export async function testEnhancedCompliance() {
  console.log('Testing Enhanced Brand Compliance System...');
  console.log('=====================================');
  
  try {
    const result = await checkVideoForBrandCompliance(testInput);
    
    console.log(`Found ${result.length} compliance issues:`);
    console.log('');
    
    result.forEach((issue, index) => {
      const formatTimestamp = (timestamp: number) => {
        const minutes = Math.floor(timestamp / 60);
        const seconds = (timestamp % 60).toFixed(1);
        return minutes > 0 ? `${minutes}:${seconds.padStart(4, '0')}` : `${seconds}s`;
      };

      console.log(`${index + 1}. [${formatTimestamp(issue.timestamp)}] ${issue.severity?.toUpperCase() || 'MEDIUM'} - ${issue.category?.toUpperCase() || 'VISUAL'}`);
      console.log(`   Issue: ${issue.issue}`);
      console.log(`   Fix: ${issue.suggestedFix}`);
      console.log('');
    });
    
    return result;
  } catch (error) {
    console.error('Error in enhanced compliance test:', error);
    throw error;
  }
}

/**
 * Expected improvements in the new system:
 * 1. Unique issues - no more repetitive "logo missing" messages
 * 2. Specific timestamps - exact moments when issues occur
 * 3. Detailed fixes - actionable solutions with parameters
 * 4. Severity levels - prioritize critical issues
 * 5. Categories - organize issues by type
 * 6. Better formatting - clear, readable timestamps
 */
