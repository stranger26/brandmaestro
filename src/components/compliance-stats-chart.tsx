'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, TrendingUp, BarChart3 } from 'lucide-react';
import type { CheckVideoForBrandComplianceOutput } from '@/ai/flows/check-video-for-brand-compliance';

interface ComplianceStatsChartProps {
  report: CheckVideoForBrandComplianceOutput;
}

export function ComplianceStatsChart({ report }: ComplianceStatsChartProps) {
  // Calculate severity statistics
  const severityStats = report.reduce((acc, issue) => {
    const severity = issue.severity || 'medium';
    acc[severity] = (acc[severity] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Calculate category statistics
  const categoryStats = report.reduce((acc, issue) => {
    const category = issue.category || 'visual';
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Get severity color and styling
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getSeverityBadgeColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'secondary';
    }
  };

  // Get category icon
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'visual': return '👁️';
      case 'audio': return '🔊';
      case 'text': return '📝';
      case 'branding': return '🏷️';
      case 'technical': return '⚙️';
      default: return '⚠️';
    }
  };

  // Calculate total issues
  const totalIssues = report.length;
  const criticalIssues = severityStats.critical || 0;
  const highIssues = severityStats.high || 0;
  const mediumIssues = severityStats.medium || 0;
  const lowIssues = severityStats.low || 0;

  // Calculate percentages
  const criticalPercentage = totalIssues > 0 ? Math.round((criticalIssues / totalIssues) * 100) : 0;
  const highPercentage = totalIssues > 0 ? Math.round((highIssues / totalIssues) * 100) : 0;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Compliance Statistics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Overall Stats */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm text-muted-foreground">OVERALL</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{totalIssues}</span>
                <AlertCircle className="w-5 h-5 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">Total Issues</p>
            </div>
          </div>

          {/* Severity Distribution */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm text-muted-foreground">SEVERITY</h3>
            <div className="space-y-2">
              {Object.entries(severityStats)
                .sort(([a], [b]) => {
                  const order = { critical: 0, high: 1, medium: 2, low: 3 };
                  return (order[a as keyof typeof order] || 4) - (order[b as keyof typeof order] || 4);
                })
                .map(([severity, count]) => {
                  const percentage = totalIssues > 0 ? Math.round((count / totalIssues) * 100) : 0;
                  return (
                    <div key={severity} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${getSeverityColor(severity)}`} />
                        <span className="text-sm font-medium capitalize">{severity}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold">{count}</span>
                        <Badge variant={getSeverityBadgeColor(severity)} className="text-xs">
                          {percentage}%
                        </Badge>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Category Distribution */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm text-muted-foreground">CATEGORIES</h3>
            <div className="space-y-2">
              {Object.entries(categoryStats)
                .sort(([, a], [, b]) => b - a)
                .map(([category, count]) => {
                  const percentage = totalIssues > 0 ? Math.round((count / totalIssues) * 100) : 0;
                  return (
                    <div key={category} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{getCategoryIcon(category)}</span>
                        <span className="text-sm font-medium capitalize">{category}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold">{count}</span>
                        <Badge variant="outline" className="text-xs">
                          {percentage}%
                        </Badge>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Priority Issues */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm text-muted-foreground">PRIORITY</h3>
            <div className="space-y-2">
              {/* Critical Issues - Always first */}
              {criticalIssues > 0 && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <span className="text-sm font-medium">Critical</span>
                  </div>
                  <span className="text-sm font-bold text-red-600">{criticalIssues}</span>
                </div>
              )}
              
              {/* High Issues - Second */}
              {highIssues > 0 && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-orange-500" />
                    <span className="text-sm font-medium">High</span>
                  </div>
                  <span className="text-sm font-bold text-orange-600">{highIssues}</span>
                </div>
              )}
              
              {/* Medium Issues - Third */}
              {mediumIssues > 0 && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <span className="text-sm font-medium">Medium</span>
                  </div>
                  <span className="text-sm font-bold text-yellow-600">{mediumIssues}</span>
                </div>
              )}
              
              {/* Low Issues - Last */}
              {lowIssues > 0 && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                    <span className="text-sm font-medium">Low</span>
                  </div>
                  <span className="text-sm font-bold text-blue-600">{lowIssues}</span>
                </div>
              )}
              
              <div className="text-xs text-muted-foreground mt-2">
                {criticalIssues + highIssues > 0 && (
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    <span>{criticalIssues + highIssues} urgent issues need attention</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Visual Bar Chart */}
        {totalIssues > 0 && (
          <div className="mt-6 pt-6 border-t">
            <h3 className="font-semibold text-sm text-muted-foreground mb-3">SEVERITY DISTRIBUTION</h3>
            <div className="flex h-8 rounded-lg overflow-hidden bg-muted">
              {Object.entries(severityStats)
                .sort(([a], [b]) => {
                  const order = { critical: 0, high: 1, medium: 2, low: 3 };
                  return (order[a as keyof typeof order] || 4) - (order[b as keyof typeof order] || 4);
                })
                .map(([severity, count]) => {
                  const percentage = (count / totalIssues) * 100;
                  return (
                    <div
                      key={severity}
                      className={`${getSeverityColor(severity)} flex items-center justify-center text-white text-xs font-medium`}
                      style={{ width: `${percentage}%` }}
                      title={`${severity}: ${count} issues (${Math.round(percentage)}%)`}
                    >
                      {percentage > 10 && `${Math.round(percentage)}%`}
                    </div>
                  );
                })}
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>Most Critical</span>
              <span>Least Critical</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
