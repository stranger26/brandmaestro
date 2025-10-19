'use client';

import { useState } from 'react';
import {
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ComplianceStatsChart } from '@/components/compliance-stats-chart';
import type { CheckVideoForBrandComplianceOutput } from '@/ai/flows/check-video-for-brand-compliance';

interface ComplianceReportCardProps {
  report: CheckVideoForBrandComplianceOutput;
}

export function ComplianceReportCard({ 
  report
}: ComplianceReportCardProps) {
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Filter issues based on selected filters
  const filteredIssues = report.filter(issue => {
    const severityMatch = severityFilter === 'all' || issue.severity === severityFilter;
    const categoryMatch = categoryFilter === 'all' || issue.category === categoryFilter;
    return severityMatch && categoryMatch;
  });

  // Get unique severities and categories for filter options
  const severities = Array.from(new Set(report.map(issue => issue.severity).filter(Boolean)));
  const categories = Array.from(new Set(report.map(issue => issue.category).filter(Boolean)));

  // Format timestamp for display
  const formatTimestamp = (timestamp: number) => {
    const minutes = Math.floor(timestamp / 60);
    const seconds = (timestamp % 60).toFixed(1);
    return minutes > 0 ? `${minutes}:${seconds.padStart(4, '0')}` : `${seconds}s`;
  };

  // Get severity color and styling
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'secondary';
    }
  };

  // Get category icon
  const getCategoryIcon = (category: string, issue?: string) => {
    switch (category) {
      case 'visual': return '👁️';
      case 'audio': return '🔊';
      case 'text': return '📝';
      case 'branding': return '🏷️';
      case 'technical': return '⚙️';
      case 'contextual-risk': 
        return issue?.includes('✅') ? '✅' : '🔍';
      default: return '⚠️';
    }
  };

  // Get severity badge color
  const getSeverityBadgeColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'secondary';
    }
  };


  return (
    <div className="w-full space-y-6">
      {/* Statistics Chart */}
      <ComplianceStatsChart report={report} />

      {/* Compliance Report */}
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                Compliance Report
              </CardTitle>
              <CardDescription>
                Found {filteredIssues.length} of {report.length} issues
              </CardDescription>
            </div>
            
            {/* Filters */}
            <div className="space-y-3">
              {/* Severity Pills */}
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Filter by Severity:</h4>
                <div className="flex flex-wrap gap-1">
                  <Badge
                    variant={severityFilter === 'all' ? 'default' : 'outline'}
                    className="cursor-pointer hover:bg-primary/10 transition-colors"
                    onClick={() => setSeverityFilter('all')}
                  >
                    All Severity
                  </Badge>
                  {severities.map(severity => (
                    <Badge
                      key={severity}
                      variant={severityFilter === severity ? getSeverityBadgeColor(severity) : 'outline'}
                      className="cursor-pointer hover:bg-primary/10 transition-colors"
                      onClick={() => setSeverityFilter(severity)}
                    >
                      {severity?.toUpperCase()}
                    </Badge>
                  ))}
                </div>
              </div>
              
              {/* Category Pills */}
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Filter by Category:</h4>
                <div className="flex flex-wrap gap-1">
                  <Badge
                    variant={categoryFilter === 'all' ? 'default' : 'outline'}
                    className="cursor-pointer hover:bg-primary/10 transition-colors"
                    onClick={() => setCategoryFilter('all')}
                  >
                    All Categories
                  </Badge>
                  {categories.map(category => (
                    <Badge
                      key={category}
                      variant={categoryFilter === category ? 'secondary' : 'outline'}
                      className="cursor-pointer hover:bg-primary/10 transition-colors flex items-center gap-1"
                      onClick={() => setCategoryFilter(category)}
                    >
                      <span>{getCategoryIcon(category)}</span>
                      <span className="capitalize">{category}</span>
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="max-h-96 overflow-y-auto">
          {filteredIssues.length > 0 ? (
            <div className="space-y-4">
            {filteredIssues.map((issue, i) => (
              <div key={i} className={`flex items-start gap-3 p-4 border rounded-lg ${
                issue.category === 'contextual-risk' 
                  ? issue.issue.includes('✅') 
                    ? 'bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800'
                    : 'bg-orange-50 border-orange-200 dark:bg-orange-950/20 dark:border-orange-800'
                  : 'bg-card'
              }`}>
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm">
                      {getCategoryIcon(issue.category || 'visual', issue.issue)}
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg font-mono font-medium text-primary">
                        {formatTimestamp(issue.timestamp)}
                      </span>
                      
                      {issue.severity && (
                        <Badge variant={getSeverityColor(issue.severity)}>
                          {issue.severity.toUpperCase()}
                        </Badge>
                      )}
                      
                      {issue.category && (
                        <Badge variant="outline">
                          {issue.category}
                        </Badge>
                      )}
                    </div>
                    
                    <p className="font-medium text-sm mb-2">
                      {issue.issue}
                    </p>
                    
                    <div className="bg-muted/50 p-3 rounded-md">
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium text-foreground">Fix:</span> {issue.suggestedFix}
                      </p>
                      
                      {/* Show source URL and published date for contextual risks */}
                      {issue.category === 'contextual-risk' && (
                        <div className="mt-2 pt-2 border-t border-muted">
                          {issue.sourceUrl && (
                            <p className="text-xs text-muted-foreground">
                              <span className="font-medium">Source:</span>{' '}
                              <a 
                                href={issue.sourceUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-primary hover:underline"
                              >
                                View Article
                              </a>
                            </p>
                          )}
                          {issue.publishedDate && (
                            <p className="text-xs text-muted-foreground">
                              <span className="font-medium">Published:</span>{' '}
                              {new Date(issue.publishedDate).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                    
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-6">
              <CheckCircle className="w-12 h-12 text-green-500 mb-2"/>
              <p className="font-semibold">All Clear!</p>
              <p className="text-sm text-muted-foreground">
                No issues found with current filters.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
