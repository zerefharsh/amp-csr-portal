"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
  RotateCcw, 
  ArrowLeftRight, 
  AlertTriangle, 
  CheckCircle,
  Search,
  Filter,
  Clock,
  MessageSquare,
  Headphones,
  Plus,
  User,
  UserPlus
} from "lucide-react";
import { apiService } from "@/services/api";
import { SupportTicket } from "@/types";
import { SupportTicketResponseModal } from "../modals/support-ticket-response-modal";
import { NewSupportTicketModal } from "../modals/new-support-ticket-modal";

export function SupportDashboard() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [isResponseModalOpen, setIsResponseModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [isNewTicketModalOpen, setIsNewTicketModalOpen] = useState(false);

  useEffect(() => {
    const fetchTickets = async () => {
      setLoading(true);
      try {
        const filters = {
          search: searchQuery,
          status: statusFilter,
          priority: priorityFilter,
          category: categoryFilter
        };
        const ticketsData = await apiService.getSupportTickets(filters);
        setTickets(ticketsData);
      } catch (error) {
        console.error("Error fetching support tickets:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [searchQuery, statusFilter, priorityFilter, categoryFilter]);

  // Quick action handlers
  const handleQuickAction = async (action: string) => {
    console.log(`Starting ${action} workflow...`);
  };

  // Quick actions configuration
  const quickActions = [
    {
      title: "Process Refund",
      description: "Handle payment refunds and billing disputes",
      icon: RotateCcw,
      action: () => handleQuickAction("refund"),
      variant: "success" as const,
      stats: "23 pending"
    },
    {
      title: "Transfer Subscription",
      description: "Move subscription between customer accounts",
      icon: ArrowLeftRight,
      action: () => handleQuickAction("transfer"),
      variant: "warning" as const,
      stats: "5 pending"
    },
    {
      title: "Account Recovery",
      description: "Help customers regain access to accounts",
      icon: User,
      action: () => handleQuickAction("recovery"),
      variant: "primary" as const,
      stats: "12 pending"
    },
    {
      title: "Create User Account",
      description: "Set up new customer accounts",
      icon: UserPlus,
      action: () => handleQuickAction("create"),
      variant: "primary" as const,
      stats: "New requests"
    }
  ];

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge className="status-overdue">High</Badge>;
      case "medium":
        return <Badge className="status-suspended">Medium</Badge>;
      case "low":
        return <Badge className="status-active">Low</Badge>;
      default:
        return <Badge variant="secondary">{priority}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return <Badge className="status-overdue">Open</Badge>;
      case "in_progress":
        return <Badge className="status-suspended">In Progress</Badge>;
      case "resolved":
        return <Badge className="status-active">Resolved</Badge>;
      case "closed":
        return <Badge variant="secondary">Closed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case "billing":
        return <Badge variant="outline" className="text-primary border-primary/20 bg-primary/10">Billing</Badge>;
      case "technical":
        return <Badge variant="outline" className="text-destructive border-destructive/20 bg-destructive/10">Technical</Badge>;
      case "account":
        return <Badge variant="outline" className="text-success border-success/20 bg-success/10">Account</Badge>;
      default:
        return <Badge variant="outline">{category}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return formatDate(dateString);
  };

  // Calculate stats
  const stats = {
    total: tickets.length,
    open: tickets.filter(t => t.status === "open").length,
    inProgress: tickets.filter(t => t.status === "in_progress").length,
    avgResponseTime: "2.4h",
    resolutionRate: "94%"
  };

  return (
    <>
      <div className="space-y-6">
        {/* Support Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card className="metric-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="metric-label">Open Tickets</p>
                  <p className="metric-value text-2xl text-destructive">{loading ? "..." : stats.open}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-destructive opacity-70" />
              </div>
            </CardContent>
          </Card>

          <Card className="metric-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="metric-label">In Progress</p>
                  <p className="metric-value text-2xl text-warning">{loading ? "..." : stats.inProgress}</p>
                </div>
                <Clock className="h-8 w-8 text-warning opacity-70" />
              </div>
            </CardContent>
          </Card>

          <Card className="metric-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="metric-label">Total Tickets</p>
                  <p className="metric-value text-2xl">{loading ? "..." : stats.total}</p>
                </div>
                <MessageSquare className="h-8 w-8 text-primary opacity-70" />
              </div>
            </CardContent>
          </Card>

          <Card className="metric-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="metric-label">Avg Response</p>
                  <p className="metric-value text-2xl text-success">{stats.avgResponseTime}</p>
                </div>
                <Clock className="h-8 w-8 text-success opacity-70" />
              </div>
            </CardContent>
          </Card>

          <Card className="metric-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="metric-label">Resolution Rate</p>
                  <p className="metric-value text-2xl text-success">{stats.resolutionRate}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-success opacity-70" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Support Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Headphones className="h-5 w-5" />
              <span>Quick Support Actions</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-center space-y-3 hover:bg-accent/50 transition-colors w-full"
                  onClick={action.action}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 quick-action-${action.variant}`}>
                    <action.icon className="h-5 w-5" />
                  </div>
                  <div className="text-center flex-1 min-w-0">
                    <p className="font-medium text-foreground text-sm leading-tight">{action.title}</p>
                    <p className="text-xs text-wrap text-muted-foreground mt-1 line-clamp-2 leading-relaxed">{action.description}</p>
                    <p className="text-xs text-primary font-medium mt-2">{action.stats}</p>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Support Tickets */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Support Tickets ({tickets.length})</CardTitle>
              <Button onClick={() => setIsNewTicketModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                New Ticket
              </Button>
            </div>
            
            {/* Filters */}
            <div className="flex items-center space-x-4 mt-4">
              <div className="search-input flex-1 max-w-sm">
                <Search className="search-icon" />
                <Input
                  placeholder="Search tickets, customers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>

              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="billing">Billing</SelectItem>
                  <SelectItem value="technical">Technical</SelectItem>
                  <SelectItem value="account">Account</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="data-table-header">
                    <TableHead>Ticket</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead>Last Response</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    // Loading skeleton
                    [...Array(5)].map((_, i) => (
                      <TableRow key={i}>
                        <TableCell><Skeleton className="skeleton-text w-16" /></TableCell>
                        <TableCell>
                          <div className="space-y-2">
                            <Skeleton className="skeleton-text w-32" />
                            <Skeleton className="skeleton-text w-40" />
                          </div>
                        </TableCell>
                        <TableCell><Skeleton className="skeleton-text w-48" /></TableCell>
                        <TableCell><Skeleton className="skeleton-text w-16" /></TableCell>
                        <TableCell><Skeleton className="skeleton-text w-20" /></TableCell>
                        <TableCell><Skeleton className="skeleton-text w-16" /></TableCell>
                        <TableCell><Skeleton className="skeleton-text w-24" /></TableCell>
                        <TableCell><Skeleton className="skeleton-text w-16" /></TableCell>
                        <TableCell>
                          <div className="flex justify-end space-x-2">
                            <Skeleton className="w-16 h-8 rounded" />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : tickets.length === 0 ? (
                    // Empty state
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-12">
                        <div className="flex flex-col items-center space-y-3">
                          <MessageSquare className="h-12 w-12 text-muted-foreground opacity-50" />
                          <div>
                            <p className="text-muted-foreground">No tickets found</p>
                            {searchQuery && (
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => setSearchQuery("")}
                                className="mt-2"
                              >
                                Clear search
                              </Button>
                            )}
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    // Ticket rows
                    tickets.map((ticket) => (
                      <TableRow key={ticket.id} className="data-table-row">
                        <TableCell className="font-mono font-medium text-primary">
                          {ticket.id}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                              <User className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <div>
                              <p className="font-medium text-foreground">{ticket.customer.name}</p>
                              <p className="text-sm text-muted-foreground">{ticket.customer.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium text-foreground">{ticket.subject}</p>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {ticket.description}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>{getPriorityBadge(ticket.priority)}</TableCell>
                        <TableCell>{getStatusBadge(ticket.status)}</TableCell>
                        <TableCell>{getCategoryBadge(ticket.category)}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {ticket.assignedTo}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {formatTimeAgo(ticket.lastResponse || ticket.createdAt)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end space-x-1">
                            <Button variant="ghost" size="sm">
                              View
                            </Button>
                            {ticket.status !== "resolved" && ticket.status !== "closed" && (
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-primary"
                                onClick={() => {
                                  setSelectedTicket(ticket);
                                  setIsResponseModalOpen(true);
                                }}
                              >
                                Respond
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      <SupportTicketResponseModal
        isOpen={isResponseModalOpen}
        onClose={() => {
          setIsResponseModalOpen(false);
          setSelectedTicket(null);
        }}
        ticket={selectedTicket}
      />

      <NewSupportTicketModal
        isOpen={isNewTicketModalOpen}
        onClose={() => setIsNewTicketModalOpen(false)}
      />
    </>
  );
}