/**
 * Demo component showing the full-width compliance report with stats chart
 */

import { ComplianceReportCard } from './compliance-report-card';
import type { CheckVideoForBrandComplianceOutput } from '@/ai/flows/check-video-for-brand-compliance';

// Mock data with diverse issues to demonstrate the stats chart
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
    severity: "critical",
    category: "visual"
  },
  {
    timestamp: 7.5,
    issue: "Font 'Comic Sans' used instead of brand font 'Inter'",
    suggestedFix: "Replace font with Inter and adjust sizing to maintain 14px body text standard",
    severity: "high",
    category: "text"
  },
  {
    timestamp: 12.1,
    issue: "Logo transparency is 100% but brand guidelines require 85% opacity",
    suggestedFix: "Adjust logo opacity from 100% to 85% with fade-in animation over 0.7s",
    severity: "high",
    category: "branding"
  },
  {
    timestamp: 15.8,
    issue: "Audio volume exceeds brand standard of -12dB",
    suggestedFix: "Apply audio normalization to reduce volume to -12dB while maintaining clarity",
    severity: "medium",
    category: "audio"
  },
  {
    timestamp: 22.3,
    issue: "Background color #F0F0F0 doesn't match brand standard #F3F4F6",
    suggestedFix: "Apply color correction to change background from #F0F0F0 to #F3F4F6",
    severity: "medium",
    category: "visual"
  },
  {
    timestamp: 28.7,
    issue: "Text spacing is 12px but brand guidelines require 16px",
    suggestedFix: "Adjust line height and spacing to meet 16px standard",
    severity: "low",
    category: "text"
  },
  {
    timestamp: 35.2,
    issue: "Video resolution is 720p but brand standard requires 1080p minimum",
    suggestedFix: "Upscale video to 1080p using AI enhancement",
    severity: "low",
    category: "technical"
  }
];

const mockVideoSrc = "data:video/mp4;base64,mock-video-data";

export function DemoFullWidthCompliance() {
  return (
    <div className="p-6 space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Full-Width Compliance Report with Statistics</h2>
        <p className="text-muted-foreground">
          Enhanced layout with comprehensive issue statistics and full-width design
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
          <li>✅ <strong>Full-Width Layout:</strong> Compliance report now spans the entire page width</li>
          <li>✅ <strong>Statistics Chart:</strong> Visual breakdown of issues by severity and category</li>
          <li>✅ <strong>Issue Distribution:</strong> See critical vs. low priority issues at a glance</li>
          <li>✅ <strong>Category Breakdown:</strong> Visual, Audio, Text, Branding, Technical distribution</li>
          <li>✅ <strong>Priority Indicators:</strong> Highlight urgent issues that need immediate attention</li>
          <li>✅ <strong>Visual Bar Chart:</strong> Color-coded severity distribution chart</li>
          <li>✅ <strong>Percentage Breakdown:</strong> See what percentage of issues are critical/high</li>
        </ul>
      </div>
    </div>
  );
}
