"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Search, 
  Filter, 
  CreditCard,  
  Car, 
  Eye, 
  Edit, 
  MoreVertical,
  Plus,
  AlertTriangle,
  DollarSign,
  User
} from "lucide-react";
import { SubscriptionStatus, SubscriptionsListResponse } from "@/types";
import { apiService } from "@/services/api";

export function SubscriptionsTable() {
  const [data, setData] = useState<SubscriptionsListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [planFilter, setPlanFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  
  const subscriptionsPerPage = 10;

  useEffect(() => {
    const fetchSubscriptions = async () => {
      setLoading(true);
      try {
        const filters = {
          search: searchQuery,
          status: statusFilter === "all" ? undefined : statusFilter as SubscriptionStatus,
          planName: planFilter === "all" ? undefined : planFilter
        };
        const result = await apiService.getSubscriptions(filters, currentPage, subscriptionsPerPage);
        setData(result);
      } catch (error) {
        console.error("Error fetching subscriptions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, [searchQuery, statusFilter, planFilter, currentPage]);

  // Get unique plan names for filter (when data is available)
  const planNames = data ? Array.from(new Set(data.data.map(sub => sub.planName))) : [];

  const getStatusBadge = (status: SubscriptionStatus) => {
    const variants = {
      active: "status-active",
      paused: "status-suspended",
      overdue: "status-overdue",
      cancelled: "status-cancelled"
    };
    
    return (
      <Badge className={`status-badge ${variants[status] || variants.cancelled}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getMemberStatusBadge = (status: string) => {
    if (status === "suspended") {
      return (
        <Badge variant="outline" className="text-warning border-warning/20 bg-warning/10">
          Suspended
        </Badge>
      );
    }
    return null;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const isOverdue = (status: SubscriptionStatus, nextBillingDate: string) => {
    if (status !== "active") return false;
    return new Date(nextBillingDate) < new Date();
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is already handled by useEffect
  };

  // Calculate summary stats
  const stats = data ? {
    total: data.total,
    active: data.data.filter(s => s.status === "active").length,
    overdue: data.data.filter(s => s.status === "overdue").length,
    revenue: data.data
      .filter(s => s.status === "active")
      .reduce((sum, s) => sum + s.amount, 0)
  } : { total: 0, active: 0, overdue: 0, revenue: 0 };

  const totalSubscriptions = data?.total || 0;
  const currentSubscriptionsCount = data?.data?.length || 0;
  const startIndex = data ? ((currentPage - 1) * subscriptionsPerPage) + 1 : 0;
  const endIndex = data ? Math.min(currentPage * subscriptionsPerPage, data.total) : 0;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div 
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
        role="region"
        aria-label="Subscription statistics overview"
      >
        <Card className="metric-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="metric-label">Total Subscriptions</p>
                <p className="metric-value text-2xl" aria-label={`${stats.total} total subscriptions`}>
                  {loading ? "..." : stats.total}
                </p>
              </div>
              <CreditCard className="h-8 w-8 text-primary opacity-70" aria-hidden="true" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="metric-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="metric-label">Active</p>
                <p className="metric-value text-2xl text-success" aria-label={`${stats.active} active subscriptions`}>
                  {loading ? "..." : stats.active}
                </p>
              </div>
              <div className="quick-action-icon quick-action-success" aria-hidden="true">
                <CreditCard className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="metric-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="metric-label">Overdue</p>
                <p className="metric-value text-2xl text-destructive" aria-label={`${stats.overdue} overdue subscriptions`}>
                  {loading ? "..." : stats.overdue}
                </p>
              </div>
              <div className="quick-action-icon bg-destructive/10 text-destructive" aria-hidden="true">
                <AlertTriangle className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="metric-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="metric-label">Monthly Revenue</p>
                <p className="metric-value text-2xl" aria-label={`${formatCurrency(stats.revenue)} monthly revenue`}>
                  {loading ? "..." : formatCurrency(stats.revenue)}
                </p>
              </div>
              <div className="quick-action-icon quick-action-success" aria-hidden="true">
                <DollarSign className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle id="subscriptions-table-title">
              All Subscriptions ({totalSubscriptions})
            </CardTitle>
            <Button aria-label="Add new subscription">
              <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
              Add Subscription
            </Button>
          </div>
          
          {/* Search and Filters */}
          <div className="flex items-center space-x-4 mt-4" role="search">
            <form onSubmit={handleSearchSubmit} className="search-input flex-1 max-w-sm">
              <label htmlFor="subscriptions-search" className="sr-only">
                Search subscriptions by customer name, vehicle, or license plate
              </label>
              <Search className="search-icon" aria-hidden="true" />
              <Input
                id="subscriptions-search"
                placeholder="Search customers, vehicles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                aria-describedby="subscriptions-search-help"
              />
              <div id="subscriptions-search-help" className="sr-only">
                Search by customer name, email, vehicle make and model, or license plate
              </div>
            </form>
            
            <Select 
              value={statusFilter} 
              onValueChange={setStatusFilter}
              aria-label="Filter by subscription status"
            >
              <SelectTrigger className="w-48">
                <Filter className="h-4 w-4 mr-2" aria-hidden="true" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            <Select 
              value={planFilter} 
              onValueChange={setPlanFilter}
              aria-label="Filter by subscription plan"
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by plan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Plans</SelectItem>
                {planNames.map(plan => (
                  <SelectItem key={plan} value={plan}>{plan}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          {/* Screen reader description outside the table */}
          <div id="subscriptions-table-description" className="sr-only">
            Table showing {totalSubscriptions} subscriptions with customer information, vehicle details, plan type, amount, status, and billing dates. Use arrow keys to navigate and Tab to access action buttons.
          </div>
          
          <div className="overflow-x-auto">
            <Table
              role="table"
              aria-labelledby="subscriptions-table-title"
              aria-describedby="subscriptions-table-description"
            >
              <TableHeader>
                <TableRow className="data-table-header" role="row">
                  <TableHead role="columnheader" scope="col">
                    Customer
                    <span className="sr-only">(Name, email, and status)</span>
                  </TableHead>
                  <TableHead role="columnheader" scope="col">
                    Vehicle
                    <span className="sr-only">(Make, model, year, and license plate)</span>
                  </TableHead>
                  <TableHead role="columnheader" scope="col">
                    Plan
                    <span className="sr-only">(Subscription plan name)</span>
                  </TableHead>
                  <TableHead role="columnheader" scope="col">
                    Amount
                    <span className="sr-only">(Monthly or yearly cost)</span>
                  </TableHead>
                  <TableHead role="columnheader" scope="col">
                    Status
                    <span className="sr-only">(Subscription status and payment status)</span>
                  </TableHead>
                  <TableHead role="columnheader" scope="col">
                    Next Billing
                    <span className="sr-only">(Next billing date)</span>
                  </TableHead>
                  <TableHead role="columnheader" scope="col" className="text-right">
                    Actions
                    <span className="sr-only">(View, edit, and more options)</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  // Loading skeleton
                  [...Array(5)].map((_, i) => (
                    <TableRow key={i} role="row">
                      <TableCell role="cell">
                        <div className="flex items-center space-x-3">
                          <Skeleton className="skeleton-avatar" aria-hidden="true" />
                          <div className="space-y-2">
                            <Skeleton className="skeleton-text w-32" aria-hidden="true" />
                            <Skeleton className="skeleton-text w-40" aria-hidden="true" />
                          </div>
                        </div>
                        <span className="sr-only">Loading customer information</span>
                      </TableCell>
                      <TableCell role="cell">
                        <div className="space-y-2">
                          <Skeleton className="skeleton-text w-28" aria-hidden="true" />
                          <Skeleton className="skeleton-text w-20" aria-hidden="true" />
                        </div>
                        <span className="sr-only">Loading vehicle information</span>
                      </TableCell>
                      <TableCell role="cell">
                        <Skeleton className="skeleton-text w-24" aria-hidden="true" />
                        <span className="sr-only">Loading plan information</span>
                      </TableCell>
                      <TableCell role="cell">
                        <Skeleton className="skeleton-text w-16" aria-hidden="true" />
                        <span className="sr-only">Loading amount</span>
                      </TableCell>
                      <TableCell role="cell">
                        <Skeleton className="skeleton-text w-16" aria-hidden="true" />
                        <span className="sr-only">Loading status</span>
                      </TableCell>
                      <TableCell role="cell">
                        <Skeleton className="skeleton-text w-20" aria-hidden="true" />
                        <span className="sr-only">Loading billing date</span>
                      </TableCell>
                      <TableCell role="cell">
                        <div className="flex justify-end space-x-2">
                          <Skeleton className="w-8 h-8 rounded" aria-hidden="true" />
                          <Skeleton className="w-8 h-8 rounded" aria-hidden="true" />
                          <Skeleton className="w-8 h-8 rounded" aria-hidden="true" />
                        </div>
                        <span className="sr-only">Loading actions</span>
                      </TableCell>
                    </TableRow>
                  ))
                ) : currentSubscriptionsCount === 0 ? (
                  // Empty state
                  <TableRow role="row">
                    <TableCell colSpan={7} className="text-center py-12" role="cell">
                      <div className="flex flex-col items-center space-y-3">
                        <CreditCard className="h-12 w-12 text-muted-foreground opacity-50" aria-hidden="true" />
                        <div>
                          <p className="text-muted-foreground">No subscriptions found</p>
                          {searchQuery && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => setSearchQuery("")}
                              className="mt-2"
                              aria-label="Clear search to show all subscriptions"
                            >
                              Clear search
                            </Button>
                          )}
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  // Subscription rows
                  data?.data?.map((subscription, index) => (
                    <TableRow 
                      key={subscription.id} 
                      className="data-table-row" 
                      role="row"
                      aria-rowindex={startIndex + index}
                    >
                      <TableCell role="cell">
                        <div className="flex items-center space-x-3">
                          <div 
                            className="w-10 h-10 bg-muted rounded-full flex items-center justify-center"
                            role="img"
                            aria-label={`Avatar for ${subscription.member.name}`}
                          >
                            <User className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <p className="font-medium text-foreground">{subscription.member.name}</p>
                              {getMemberStatusBadge(subscription.member.status)}
                            </div>
                            <p className="text-sm text-muted-foreground">{subscription.member.email}</p>
                            {subscription.member.phone && (
                              <p className="text-xs text-muted-foreground">{subscription.member.phone}</p>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell role="cell">
                        <div className="flex items-center space-x-2">
                          <Car className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                          <div>
                            <p className="font-medium text-foreground">
                              {subscription.vehicle.year} {subscription.vehicle.make} {subscription.vehicle.model}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {subscription.vehicle.licensePlate} • {subscription.vehicle.color}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium" role="cell">
                        {subscription.planName}
                      </TableCell>
                      <TableCell role="cell">
                        <span className="font-medium">{formatCurrency(subscription.amount)}</span>
                        <span className="text-muted-foreground text-sm">
                          /{subscription.billingCycle.slice(0, -2)}
                        </span>
                        <span className="sr-only">
                          {formatCurrency(subscription.amount)} per {subscription.billingCycle.slice(0, -2)}
                        </span>
                      </TableCell>
                      <TableCell role="cell">
                        <div className="flex items-center space-x-2">
                          <div aria-label={`Status: ${subscription.status}${isOverdue(subscription.status, subscription.nextBillingDate) ? ', payment overdue' : ''}`}>
                            {getStatusBadge(subscription.status)}
                          </div>
                          {isOverdue(subscription.status, subscription.nextBillingDate) && (
                            <Badge variant="destructive" className="text-xs">
                              Late
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground" role="cell">
                        {subscription.status !== "cancelled" ? (
                          <time dateTime={subscription.nextBillingDate}>
                            {formatDate(subscription.nextBillingDate)}
                          </time>
                        ) : (
                          <span className="text-muted-foreground" aria-label="No billing date - subscription cancelled">—</span>
                        )}
                      </TableCell>
                      <TableCell role="cell">
                        <div 
                          className="flex items-center justify-end space-x-1"
                          role="group"
                          aria-label={`Actions for ${subscription.member.name}'s subscription`}
                        >
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            asChild
                            aria-label={`View subscription details for ${subscription.member.name}`}
                          >
                            <Link href={`/subscriptions/${subscription.id}`}>
                              <Eye className="h-4 w-4" aria-hidden="true" />
                            </Link>
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            asChild
                            aria-label={`Edit subscription for ${subscription.member.name}`}
                          >
                            <Link href={`/subscriptions/${subscription.id}/edit`}>
                              <Edit className="h-4 w-4" aria-hidden="true" />
                            </Link>
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            aria-label={`More options for ${subscription.member.name}'s subscription`}
                            aria-haspopup="menu"
                          >
                            <MoreVertical className="h-4 w-4" aria-hidden="true" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          
          {/* Pagination */}
          {data && data.totalPages > 1 && (
            <nav 
              className="flex items-center justify-between px-6 py-4 border-t border-border"
              role="navigation"
              aria-label="Subscriptions table pagination"
            >
              <div 
                className="text-sm text-muted-foreground"
                aria-live="polite"
                aria-atomic="true"
              >
                Showing {startIndex} to {endIndex} of {data.total} subscriptions
              </div>
              <div 
                className="flex items-center space-x-2"
                role="group"
                aria-label="Pagination controls"
              >
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  aria-label="Go to previous page"
                >
                  Previous
                </Button>
                
                {/* Page numbers */}
                {[...Array(Math.min(5, data.totalPages))].map((_, i) => {
                  const pageNum = Math.max(1, Math.min(currentPage - 2, data.totalPages - 4)) + i;
                  if (pageNum > data.totalPages) return null;
                  
                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(pageNum)}
                      aria-label={`Go to page ${pageNum}`}
                      aria-current={currentPage === pageNum ? "page" : undefined}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(data.totalPages, currentPage + 1))}
                  disabled={currentPage === data.totalPages}
                  aria-label="Go to next page"
                >
                  Next
                </Button>
              </div>
            </nav>
          )}
        </CardContent>
      </Card>
    </div>
  );
}