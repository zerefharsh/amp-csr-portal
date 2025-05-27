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
  User, 
  Eye, 
  Edit, 
  MoreVertical,
  UserPlus
} from "lucide-react";
import { MemberStatus, MembersListResponse, SubscriptionStatus } from "@/types";
import { apiService } from "@/services/api";

export function MembersTable() {
  const [data, setData] = useState<MembersListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  
  const membersPerPage = 10;

  useEffect(() => {
    const fetchMembers = async () => {
      setLoading(true);
      try {
        // Handle special filters
        let filters: any = {
          search: searchQuery
        };

        if (statusFilter === "overdue") {
          // For overdue, we want active members who have overdue status
          filters.status = "active";
          filters.hasOverdueSubscriptions = true;
        } else if (statusFilter !== "all") {
          filters.status = statusFilter as MemberStatus;
        }

        const result = await apiService.getMembers(filters, currentPage, membersPerPage);
        setData(result);
      } catch (error) {
        console.error("Error fetching members:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [searchQuery, statusFilter, currentPage]);

  const getStatusBadge = (status: SubscriptionStatus | MemberStatus) => {
    const variants = {
      active: "bg-success/10 text-success border-success/20",
      suspended: "bg-warning/10 text-warning border-warning/20",
      paused: "bg-amber-100 text-amber-700 border-amber-200",
      overdue: "bg-destructive/10 text-destructive border-destructive/20",
      cancelled: "bg-muted text-muted-foreground border-border"
    };

    return (
      <Badge className={`status-badge ${variants[status] || variants.cancelled}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is already handled by useEffect
  };

  const totalMembers = data?.total || 0;
  const currentMembersCount = data?.data?.length || 0;
  const startIndex = data ? ((currentPage - 1) * membersPerPage) + 1 : 0;
  const endIndex = data ? Math.min(currentPage * membersPerPage, data.total) : 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle id="members-table-title">
            All Members ({totalMembers})
          </CardTitle>
          {/* <Button aria-label="Add new member">
            <UserPlus className="h-4 w-4 mr-2" aria-hidden="true" />
            Add Member
          </Button> */}
        </div>
        
        {/* Search and Filters */}
        <div className="flex items-center space-x-4 mt-4" role="search">
          <form onSubmit={handleSearchSubmit} className="search-input flex-1 max-w-sm">
            <label htmlFor="members-search" className="sr-only">
              Search members by name or email
            </label>
            <Search className="search-icon" aria-hidden="true" />
            <Input
              id="members-search"
              placeholder="Search members..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              aria-describedby="members-search-help"
            />
            <div id="members-search-help" className="sr-only">
              Search by member name, email, or phone number
            </div>
          </form>
          
          <div className="flex items-center space-x-2">
            <label htmlFor="status-filter" className="sr-only">
              Filter members by status
            </label>
            <Select 
              value={statusFilter} 
              onValueChange={setStatusFilter}
              aria-label="Filter by member status"
            >
              <SelectTrigger className="w-48" id="status-filter">
                <Filter className="h-4 w-4 mr-2" aria-hidden="true" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="overdue">Overdue Payments</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        {/* Screen reader description outside the table */}
        <div id="members-table-description" className="sr-only">
          Table showing {totalMembers} members with their status, subscriptions, revenue, and last activity. Use arrow keys to navigate and Tab to access action buttons.
        </div>
        
        <div className="overflow-x-auto">
          <Table
            role="table"
            aria-labelledby="members-table-title"
            aria-describedby="members-table-description"
          >
            <TableHeader>
              <TableRow className="data-table-header" role="row">
                <TableHead role="columnheader" scope="col">
                  Member
                  <span className="sr-only">(Name, email, and phone)</span>
                </TableHead>
                <TableHead role="columnheader" scope="col">
                  Status
                  <span className="sr-only">(Account status and payment status)</span>
                </TableHead>
                <TableHead role="columnheader" scope="col">
                  Subscriptions
                  <span className="sr-only">(Number of active subscriptions)</span>
                </TableHead>
                <TableHead role="columnheader" scope="col">
                  Revenue
                  <span className="sr-only">(Monthly revenue amount)</span>
                </TableHead>
                <TableHead role="columnheader" scope="col">
                  Last Activity
                  <span className="sr-only">(Time since last account activity)</span>
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
                      <span className="sr-only">Loading member information</span>
                    </TableCell>
                    <TableCell role="cell">
                      <Skeleton className="skeleton-text w-16" aria-hidden="true" />
                      <span className="sr-only">Loading status</span>
                    </TableCell>
                    <TableCell role="cell">
                      <Skeleton className="skeleton-text w-12" aria-hidden="true" />
                      <span className="sr-only">Loading subscription count</span>
                    </TableCell>
                    <TableCell role="cell">
                      <Skeleton className="skeleton-text w-20" aria-hidden="true" />
                      <span className="sr-only">Loading revenue</span>
                    </TableCell>
                    <TableCell role="cell">
                      <Skeleton className="skeleton-text w-16" aria-hidden="true" />
                      <span className="sr-only">Loading activity time</span>
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
              ) : currentMembersCount === 0 ? (
                // Empty state
                <TableRow role="row">
                  <TableCell colSpan={6} className="text-center py-12" role="cell">
                    <div className="flex flex-col items-center space-y-3">
                      <User className="h-12 w-12 text-muted-foreground opacity-50" aria-hidden="true" />
                      <div>
                        <p className="text-muted-foreground">
                          {statusFilter === "overdue" ? "No members with overdue payments" : "No members found"}
                        </p>
                        {searchQuery && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => setSearchQuery("")}
                            className="mt-2"
                            aria-label="Clear search to show all members"
                          >
                            Clear search
                          </Button>
                        )}
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                // Member rows
                data?.data?.map((member, index) => (
                  <TableRow 
                    key={member.id} 
                    className="data-table-row" 
                    role="row"
                    aria-rowindex={startIndex + index}
                  >
                    <TableCell role="cell">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-10 h-10 bg-muted rounded-full flex items-center justify-center"
                          role="img"
                          aria-label={`Avatar for ${member.name}`}
                        >
                          <User className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{member.name}</p>
                          <p className="text-sm text-muted-foreground">{member.email}</p>
                          {member.phone && (
                            <p className="text-xs text-muted-foreground">{member.phone}</p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell role="cell">
                      <div aria-label={`Status: ${member.status}${member.isOverdue ? ', with overdue payments' : ''}`}>
                        {getStatusBadge(member.status)}
                      </div>
                    </TableCell>
                    <TableCell role="cell">
                      <span className="font-medium">{member.totalSubscriptions}</span>
                      <span className="text-muted-foreground text-sm ml-1">active</span>
                      <span className="sr-only">
                        {member.totalSubscriptions} active subscription{member.totalSubscriptions !== 1 ? 's' : ''}
                      </span>
                    </TableCell>
                    <TableCell role="cell">
                      <span className="font-medium">{formatCurrency(member.monthlyRevenue)}</span>
                      <span className="text-muted-foreground text-sm">/mo</span>
                      <span className="sr-only">
                        {formatCurrency(member.monthlyRevenue)} per month
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground" role="cell">
                      <time dateTime={member.lastActivity}>
                        {formatTimeAgo(member.lastActivity)}
                      </time>
                    </TableCell>
                    <TableCell role="cell">
                      <div 
                        className="flex items-center justify-end space-x-1"
                        role="group"
                        aria-label={`Actions for ${member.name}`}
                      >
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          asChild
                          aria-label={`View details for ${member.name}`}
                        >
                          <Link href={`/members/${member.id}`}>
                            <Eye className="h-4 w-4" aria-hidden="true" />
                          </Link>
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          asChild
                          aria-label={`Edit profile for ${member.name}`}
                        >
                          <Link href={`/members/${member.id}/edit`}>
                            <Edit className="h-4 w-4" aria-hidden="true" />
                          </Link>
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          aria-label={`More options for ${member.name}`}
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
            aria-label="Members table pagination"
          >
            <div 
              className="text-sm text-muted-foreground"
              aria-live="polite"
              aria-atomic="true"
            >
              Showing {startIndex} to {endIndex} of {data.total} members
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
  );
}