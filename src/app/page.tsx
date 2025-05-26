"use client";

import { useEffect, useState } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  CreditCard, 
  AlertTriangle, 
  DollarSign,
  RotateCcw,
  ArrowLeftRight,
  Users,
  UserPlus
} from "lucide-react";
import { DashboardMetrics } from "@/types";
import { apiService } from "@/services/api";

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const data = await apiService.getDashboardMetrics();
        setMetrics(data);
      } catch (error) {
        console.error("Error fetching dashboard metrics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  const quickActions = [
    {
      title: "Create User",
      description: "Add a new customer account",
      icon: UserPlus,
      variant: "primary" as const,
    },
    {
      title: "Process Refund",
      description: "Handle payment refunds",
      icon: RotateCcw,
      variant: "success" as const,
    },
    {
      title: "Transfer Subscription",
      description: "Move subscription between accounts",
      icon: ArrowLeftRight,
      variant: "warning" as const,
    },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const metricsCards = metrics ? [
    {
      title: "Total Memberships",
      value: metrics.activeMembers.toLocaleString(),
      change: metrics.memberGrowth.percentage,
      changeType: "positive" as const,
      icon: Users,
      description: `${metrics.activeMembers} active members out of ${metrics.totalMembers} total`
    },
    {
      title: "Active Subscriptions",
      value: metrics.activeSubscriptions.toLocaleString(),
      change: metrics.subscriptionGrowth.percentage,
      changeType: "positive" as const,
      icon: CreditCard,
      description: `${metrics.activeSubscriptions} active out of ${metrics.totalSubscriptions} total subscriptions`
    },
    {
      title: "Overdue Accounts",
      value: metrics.overdueSubscriptions.toString(),
      change: -15, // Static for now
      changeType: "positive" as const,
      icon: AlertTriangle,
      description: `${metrics.overdueSubscriptions} accounts with overdue payments requiring attention`
    },
    {
      title: "Monthly Revenue",
      value: formatCurrency(metrics.monthlyRevenue),
      change: metrics.revenueGrowth.percentage,
      changeType: "positive" as const,
      icon: DollarSign,
      description: `${formatCurrency(metrics.monthlyRevenue)} in monthly recurring revenue`
    },
  ] : [];

  return (
    <MainLayout 
      title="Dashboard" 
      subtitle="Overview of your CSR portal activity"
    >
      {/* Metrics Cards */}
      <section 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        role="region"
        aria-label="Key performance metrics"
      >
        <h2 className="sr-only">Dashboard Metrics</h2>
        {loading ? (
          [...Array(4)].map((_, index) => (
            <Card key={index} className="metric-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <Skeleton className="skeleton-text w-24 h-4" aria-hidden="true" />
                    <Skeleton className="skeleton-text w-16 h-8" aria-hidden="true" />
                    <Skeleton className="skeleton-text w-32 h-4" aria-hidden="true" />
                  </div>
                  <Skeleton className="w-12 h-12 rounded-lg" aria-hidden="true" />
                </div>
                <span className="sr-only">Loading metric {index + 1}</span>
              </CardContent>
            </Card>
          ))
        ) : (
          metricsCards.map((metric, index) => (
            <Card key={index} className="metric-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="metric-label">{metric.title}</p>
                    <p 
                      className="metric-value"
                      aria-label={`${metric.title}: ${metric.value}`}
                    >
                      {metric.value}
                    </p>
                    <p className={`metric-change ${
                      metric.changeType === 'positive' 
                        ? 'metric-change-positive' 
                        : 'metric-change-negative'
                    }`}>
                      <span aria-label={`${metric.change > 0 ? 'Increased' : 'Decreased'} by ${Math.abs(metric.change)} percent`}>
                        +{metric.change}%
                      </span>
                      <span className="text-muted-foreground ml-1">vs last month</span>
                    </p>
                    <span className="sr-only">{metric.description}</span>
                  </div>
                  <div 
                    className="quick-action-icon quick-action-primary"
                    role="img"
                    aria-label={`${metric.title} icon`}
                  >
                    <metric.icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </section>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle id="quick-actions-title">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div 
            role="group"
            aria-labelledby="quick-actions-title"
            aria-describedby="quick-actions-description"
          >
            <div id="quick-actions-description" className="sr-only">
              Frequently used customer service actions. Use these buttons to quickly start common workflows.
            </div>
            {quickActions.map((action, index) => (
              <Button
                key={index}
                variant="ghost"
                className="w-full justify-start p-4 h-auto hover:bg-accent/50 transition-colors"
                aria-label={`${action.title}: ${action.description}`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 flex-shrink-0 quick-action-${action.variant}`} aria-hidden="true">
                  <action.icon className="h-5 w-5" />
                </div>
                <div className="text-left flex-1 min-w-0">
                  <p className="font-medium text-foreground text-sm leading-tight">{action.title}</p>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">{action.description}</p>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Members Preview */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle id="recent-members-title">Recent Members</CardTitle>
          <Button 
            variant="outline" 
            size="sm"
            aria-label="View all members page"
          >
            View All Members
          </Button>
        </CardHeader>
        <CardContent>
          <div 
            className="text-center py-8 text-muted-foreground"
            role="region"
            aria-labelledby="recent-members-title"
            aria-describedby="recent-members-description"
          >
            <Users className="h-12 w-12 mx-auto mb-3 opacity-50" aria-hidden="true" />
            <p id="recent-members-description">Navigate to Members page to see all customers</p>
          </div>
        </CardContent>
      </Card>
    </MainLayout>
  );
}