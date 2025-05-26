"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  FileBarChart, 
  Download,
  Calendar,
  TrendingUp,
  Users,
  CreditCard,
  DollarSign,
  MessageSquare,
  FileText,
  AlertTriangle,
  Activity,
  RefreshCw
} from "lucide-react";

export function ReportsDashboard() {
  const [isGenerating, setIsGenerating] = useState<string | null>(null);

  const reportTypes = [
    {
      id: "user-activity",
      title: "Member Activity Report",
      description: "Detailed member engagement, login patterns, and service usage metrics",
      icon: Activity,
      lastGenerated: "2 hours ago",
      category: "Members",
      estimatedTime: "2-3 minutes"
    },
    {
      id: "subscription-analytics",
      title: "Subscription Analytics", 
      description: "Revenue performance, plan distribution, churn analysis, and growth trends",
      icon: CreditCard,
      lastGenerated: "1 day ago",
      category: "Revenue",
      estimatedTime: "3-4 minutes"
    },
    {
      id: "payment-report",
      title: "Payment & Billing Report",
      description: "Transaction history, payment failures, refund analysis, and billing issues",
      icon: DollarSign,
      lastGenerated: "3 hours ago",
      category: "Finance",
      estimatedTime: "2-3 minutes"
    },
    {
      id: "support-metrics",
      title: "Customer Support Metrics",
      description: "Ticket volume, resolution times, agent performance, and satisfaction scores",
      icon: MessageSquare,
      lastGenerated: "6 hours ago",
      category: "Support",
      estimatedTime: "1-2 minutes"
    },
    {
      id: "growth-analysis",
      title: "Growth & Retention Analysis",
      description: "Customer acquisition trends, retention rates, and lifetime value metrics",
      icon: TrendingUp,
      lastGenerated: "12 hours ago",
      category: "Analytics",
      estimatedTime: "4-5 minutes"
    },
    {
      id: "operational-summary",
      title: "Operational Summary",
      description: "Daily operations overview, system performance, and key business indicators",
      icon: FileBarChart,
      lastGenerated: "4 hours ago",
      category: "Operations",
      estimatedTime: "1-2 minutes"
    }
  ];

  const recentReports = [
    {
      name: "Monthly Revenue Report - December 2024",
      type: "Revenue",
      generated: "Dec 15, 2024",
      size: "2.4 MB",
      downloadCount: 12,
      status: "ready"
    },
    {
      name: "Member Growth Analysis - Q4 2024", 
      type: "Analytics",
      generated: "Dec 10, 2024",
      size: "1.8 MB",
      downloadCount: 8,
      status: "ready"
    },
    {
      name: "Support Performance - November 2024",
      type: "Support", 
      generated: "Dec 5, 2024",
      size: "3.1 MB",
      downloadCount: 15,
      status: "ready"
    },
    {
      name: "Payment Failure Analysis - Week 49",
      type: "Finance",
      generated: "Dec 8, 2024", 
      size: "892 KB",
      downloadCount: 5,
      status: "ready"
    },
    {
      name: "Churn Prevention Report - Q4 2024",
      type: "Analytics",
      generated: "Dec 1, 2024",
      size: "2.7 MB",
      downloadCount: 22,
      status: "archived"
    }
  ];

  const handleGenerateReport = async (reportId: string) => {
    setIsGenerating(reportId);
    try {
      // Simulate report generation
      await new Promise(resolve => setTimeout(resolve, 3000));
      console.log(`Generated report: ${reportId}`);
    } finally {
      setIsGenerating(null);
    }
  };

  const handleDownloadReport = (reportName: string) => {
    console.log(`Downloading report: ${reportName}`);
  };

  const getCategoryBadge = (category: string) => {
    const colors = {
      Members: "bg-blue-100 text-blue-800",
      Revenue: "bg-green-100 text-green-800", 
      Finance: "bg-emerald-100 text-emerald-800",
      Support: "bg-orange-100 text-orange-800",
      Analytics: "bg-purple-100 text-purple-800",
      Operations: "bg-gray-100 text-gray-800"
    };
    
    return (
      <Badge className={`text-xs ${colors[category as keyof typeof colors] || colors.Operations}`}>
        {category}
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    return (
      <Badge 
        className={`text-xs ${
          status === "ready" ? "status-active" : 
          status === "generating" ? "status-suspended" :
          "bg-gray-100 text-gray-600"
        }`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div 
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
        role="region"
        aria-label="Report generation statistics"
      >
        <Card className="metric-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <FileText className="h-8 w-8 text-primary" aria-hidden="true" />
              <div>
                <p className="text-2xl font-bold">147</p>
                <p className="text-sm text-muted-foreground">Reports Generated</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="metric-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Download className="h-8 w-8 text-success" aria-hidden="true" />
              <div>
                <p className="text-2xl font-bold">1,284</p>
                <p className="text-sm text-muted-foreground">Total Downloads</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="metric-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <TrendingUp className="h-8 w-8 text-warning" aria-hidden="true" />
              <div>
                <p className="text-2xl font-bold">23</p>
                <p className="text-sm text-muted-foreground">This Month</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="metric-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="h-8 w-8 text-destructive" aria-hidden="true" />
              <div>
                <p className="text-2xl font-bold">2</p>
                <p className="text-sm text-muted-foreground">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Report Generation */}
      <Card>
        <CardHeader>
          <CardTitle id="generate-reports-title">Generate Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div 
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            role="list"
            aria-labelledby="generate-reports-title"
          >
            {reportTypes.map((report) => (
              <div 
                key={report.id} 
                className="border border-border rounded-lg p-4 hover:shadow-md transition-shadow"
                role="listitem"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start space-x-3">
                    <div 
                      className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0"
                      role="img"
                      aria-label={`${report.title} icon`}
                    >
                      <report.icon className="h-5 w-5 text-primary" aria-hidden="true" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-medium text-foreground">{report.title}</h4>
                        {getCategoryBadge(report.category)}
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {report.description}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="text-xs text-muted-foreground">
                    <div>Last generated: {report.lastGenerated}</div>
                    <div>Est. time: {report.estimatedTime}</div>
                  </div>
                  <Button 
                    size="sm" 
                    onClick={() => handleGenerateReport(report.id)}
                    disabled={isGenerating === report.id}
                    aria-label={`Generate ${report.title}`}
                  >
                    {isGenerating === report.id ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" aria-hidden="true" />
                        Generating...
                      </>
                    ) : (
                      "Generate"
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Custom Report Builder */}
      <Card>
        <CardHeader>
          <CardTitle id="custom-builder-title">Custom Report Builder</CardTitle>
        </CardHeader>
        <CardContent>
          <form 
            className="space-y-6"
            aria-labelledby="custom-builder-title"
            onSubmit={(e) => { e.preventDefault(); console.log("Custom report submitted"); }}
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label htmlFor="report-type" className="sr-only">Select report type</label>
                <Select>
                  <SelectTrigger id="report-type" aria-describedby="report-type-help">
                    <SelectValue placeholder="Report Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="members">Member Data</SelectItem>
                    <SelectItem value="subscriptions">Subscriptions</SelectItem>
                    <SelectItem value="revenue">Revenue & Billing</SelectItem>
                    <SelectItem value="support">Support Tickets</SelectItem>
                    <SelectItem value="analytics">Growth Analytics</SelectItem>
                  </SelectContent>
                </Select>
                <div id="report-type-help" className="sr-only">
                  Choose the primary data type for your custom report
                </div>
              </div>

              <div>
                <label htmlFor="date-range" className="sr-only">Select date range</label>
                <Select>
                  <SelectTrigger id="date-range" aria-describedby="date-range-help">
                    <SelectValue placeholder="Date Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7d">Last 7 days</SelectItem>
                    <SelectItem value="30d">Last 30 days</SelectItem>
                    <SelectItem value="90d">Last 90 days</SelectItem>
                    <SelectItem value="6m">Last 6 months</SelectItem>
                    <SelectItem value="1y">Last year</SelectItem>
                    <SelectItem value="custom">Custom Range</SelectItem>
                  </SelectContent>
                </Select>
                <div id="date-range-help" className="sr-only">
                  Select the time period for your report data
                </div>
              </div>

              <div>
                <label htmlFor="format" className="sr-only">Select export format</label>
                <Select>
                  <SelectTrigger id="format" aria-describedby="format-help">
                    <SelectValue placeholder="Format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF Report</SelectItem>
                    <SelectItem value="csv">CSV Data</SelectItem>
                    <SelectItem value="excel">Excel Workbook</SelectItem>
                    <SelectItem value="json">JSON Data</SelectItem>
                  </SelectContent>
                </Select>
                <div id="format-help" className="sr-only">
                  Choose the file format for your exported report
                </div>
              </div>

              <Button 
                className="w-full"
                type="submit"
                aria-label="Generate custom report with selected parameters"
              >
                <Calendar className="h-4 w-4 mr-2" aria-hidden="true" />
                Generate Custom Report
              </Button>
            </div>

            <div 
              className="bg-muted/30 rounded-lg p-4"
              role="region"
              aria-labelledby="available-metrics-title"
            >
              <h5 className="font-medium text-foreground mb-3" id="available-metrics-title">
                Available Metrics & Data Points
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                <div>
                  <strong className="text-foreground">Member Metrics:</strong>
                  <ul className="mt-1 space-y-1">
                    <li>• Registration trends</li>
                    <li>• Activity patterns</li>
                    <li>• Retention rates</li>
                    <li>• Geographic distribution</li>
                  </ul>
                </div>
                <div>
                  <strong className="text-foreground">Financial Data:</strong>
                  <ul className="mt-1 space-y-1">
                    <li>• Revenue by plan type</li>
                    <li>• Payment success rates</li>
                    <li>• Refund analysis</li>
                    <li>• Churn impact</li>
                  </ul>
                </div>
                <div>
                  <strong className="text-foreground">Support Analytics:</strong>
                  <ul className="mt-1 space-y-1">
                    <li>• Ticket volume trends</li>
                    <li>• Resolution times</li>
                    <li>• Satisfaction scores</li>
                    <li>• Agent performance</li>
                  </ul>
                </div>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Recent Reports */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle id="recent-reports-title">Recent Reports</CardTitle>
            <Button 
              variant="outline" 
              size="sm"
              aria-label="View archived reports"
            >
              View Archive
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div 
            className="space-y-3"
            role="list"
            aria-labelledby="recent-reports-title"
          >
            {recentReports.map((report, index) => (
              <div 
                key={index} 
                className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent/30 transition-colors"
                role="listitem"
              >
                <div className="flex items-center space-x-4">
                  <FileText className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <p className="font-medium text-foreground truncate">{report.name}</p>
                      {getStatusBadge(report.status)}
                    </div>
                    <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                      <span>{report.type}</span>
                      <span>•</span>
                      <span>Generated {report.generated}</span>
                      <span>•</span>
                      <span>{report.size}</span>
                      <span>•</span>
                      <span>{report.downloadCount} downloads</span>
                    </div>
                  </div>
                </div>
                <div 
                  className="flex items-center space-x-2"
                  role="group"
                  aria-label={`Actions for ${report.name}`}
                >
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleDownloadReport(report.name)}
                    aria-label={`Download ${report.name}`}
                  >
                    <Download className="h-4 w-4" aria-hidden="true" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    aria-label={`View ${report.name}`}
                  >
                    View
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}