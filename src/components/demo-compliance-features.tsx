/**
 * Demo component showing the new compliance report features
 * This demonstrates the filtering and timestamp scrubbing capabilities
 */

import { ComplianceReportCard } from './compliance-report-card';
import type { CheckVideoForBrandComplianceOutput } from '@/ai/flows/check-video-for-brand-compliance';

// Mock data to demonstrate the features
const mockComplianceReport: CheckVideoForBrandComplianceOutput = [
  {
    timestamp: 0.0,
    issue: "Brand logo is missing from the top-right corner",
    suggestedFix: "Apply automated GenAI overlay to place brand logo in top-right corner (15px from edges) with 85% opacity",
    severity: "critical",
    category: "branding"
  },
  {
    timestamp: 3.2,
    issue: "Text color #FF0000 violates brand color palette (should be #1E40AF)",
    suggestedFix: "Apply automated color correction to change text color from #FF0000 to #1E40AF with smooth transition over 0.5s",
    severity: "high",
    category: "visual"
  },
  {
    timestamp: 7.5,
    issue: "Font 'Comic Sans' used instead of brand font 'Inter'",
    suggestedFix: "Replace font with Inter and adjust sizing to maintain 14px body text standard",
    severity: "medium",
    category: "text"
  },
  {
    timestamp: 12.1,
    issue: "Logo transparency is 100% but brand guidelines require 85% opacity",
    suggestedFix: "Adjust logo opacity from 100% to 85% with fade-in animation over 0.7s",
    severity: "medium",
    category: "branding"
  },
  {
    timestamp: 15.8,
    issue: "Audio volume exceeds brand standard of -12dB",
    suggestedFix: "Apply audio normalization to reduce volume to -12dB while maintaining clarity",
    severity: "low",
    category: "audio"
  },
  {
    timestamp: 22.3,
    issue: "Background color #F0F0F0 doesn't match brand standard #F3F4F6",
    suggestedFix: "Apply color correction to change background from #F0F0F0 to #F3F4F6",
    severity: "low",
    category: "visual"
  }
];

const mockVideoSrc = "data:video/mp4;base64,mock-video-data";

export function DemoComplianceFeatures() {
  return (
    <div className="p-6 space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Enhanced Compliance Report Features</h2>
        <p className="text-muted-foreground">
          New filtering and timestamp scrubbing capabilities
        </p>
      </div>
      
      <ComplianceReportCard 
        report={mockComplianceReport}
        videoSrc={mockVideoSrc}
        onTimestampSeek={(timestamp) => {
          console.log(`Seeking to timestamp: ${timestamp}s`);
        }}
      />
      
      <div className="bg-muted/50 p-4 rounded-lg">
        <h3 className="font-semibold mb-2">New Features:</h3>
        <ul className="space-y-1 text-sm text-muted-foreground">
          <li>✅ <strong>Severity Filtering:</strong> Filter issues by Critical, High, Medium, Low</li>
          <li>✅ <strong>Category Filtering:</strong> Filter by Visual, Audio, Text, Branding, Technical</li>
          <li>✅ <strong>Timestamp Scrubbing:</strong> Click any timestamp to jump to that moment in the video</li>
          <li>✅ <strong>Video Controls:</strong> Play/pause, skip forward/backward, timeline scrubbing</li>
          <li>✅ <strong>Separate Card:</strong> Compliance report is now in its own dedicated card</li>
          <li>✅ <strong>Enhanced UI:</strong> Better visual hierarchy and organization</li>
        </ul>
      </div>
    </div>
  );
}
