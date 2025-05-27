"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  CreditCard,  
  Car, 
  Calendar, 
  DollarSign,
  Edit, 
  Pause, 
  Play, 
  XCircle,
  ArrowLeftRight,
  RotateCcw,
  Mail,
  Phone,
  AlertTriangle,
  CheckCircle,
  Clock,
  Receipt,
  User
} from "lucide-react";
import { 
  SubscriptionStatus,
  type SubscriptionWithDetails
} from "@/types";
import { apiService } from "@/services/api";
import { TransferSubscriptionModal } from "../modals/transfer-subscription-modal";
import { RefundModal } from "../modals/refund-modal";

interface SubscriptionDetailClientProps {
  subscriptionId: string;
}

// Mock payment history (static for now)
const mockPaymentHistory = [
  {
    id: "pay1",
    date: "2024-01-15T10:30:00Z",
    amount: 29.99,
    status: "completed",
    method: "Credit Card ****1234",
    transactionId: "txn_abc123"
  },
  {
    id: "pay2",
    date: "2023-12-15T10:30:00Z",
    amount: 29.99,
    status: "completed",
    method: "Credit Card ****1234",
    transactionId: "txn_def456"
  },
  {
    id: "pay3",
    date: "2023-11-15T10:30:00Z",
    amount: 29.99,
    status: "failed",
    method: "Credit Card ****1234",
    transactionId: "txn_ghi789"
  }
];

export function SubscriptionDetailClient({ subscriptionId }: SubscriptionDetailClientProps) {
  const [subscription, setSubscription] = useState<SubscriptionWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const subscriptionData = await apiService.getSubscriptionById(subscriptionId);
        setSubscription(subscriptionData);
      } catch (error) {
        console.error("Error fetching subscription:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, [subscriptionId]);

  const getStatusBadge = (status: SubscriptionStatus) => {
    const variants = {
      active: { className: "status-active bg-success/10 text-success border-success/20", icon: CheckCircle },
      paused: { className: "status-suspended bg-warning/10 text-warning border-warning/20", icon: Pause },
      overdue: { className: "status-overdue bg-destructive/10 text-destructive border-destructive/20", icon: AlertTriangle },
      cancelled: { className: "status-cancelled bg-muted text-muted-foreground border-border", icon: XCircle }
    };
    
    const variant = variants[status];
    const Icon = variant.icon;
    
    return (
      <Badge className={`status-badge ${variant.className} flex items-center space-x-1`}>
        <Icon className="h-3 w-3" aria-hidden="true" />
        <span>{status.charAt(0).toUpperCase() + status.slice(1)}</span>
      </Badge>
    );
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="status-active bg-success/10 text-success border-success/20">Completed</Badge>;
      case "failed":
        return <Badge className="status-overdue bg-destructive/10 text-destructive border-destructive/20">Failed</Badge>;
      case "pending":
        return <Badge className="status-suspended bg-amber-100 text-amber-700 border-amber-200">Pending</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
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

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isOverdue = () => {
    if (!subscription) return false;
    return subscription.status === "active" && new Date(subscription.nextBillingDate) < new Date();
  };

  const handleStatusChange = async (newStatus: SubscriptionStatus, actionName: string) => {
    setUpdating(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log(`Subscription ${actionName} successfully`);
      // In real app, would update subscription state and refetch
    } catch (error) {
      console.error(`Error ${actionName} subscription:`, error);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6" role="main" aria-label="Loading subscription details">
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <Skeleton className="skeleton-text w-48 h-6" aria-hidden="true" />
              <Skeleton className="skeleton-text w-32 h-4" aria-hidden="true" />
              <Skeleton className="skeleton-text w-64 h-4" aria-hidden="true" />
            </div>
            <span className="sr-only">Loading subscription information</span>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!subscription) {
    return (
      <div 
        className="text-center py-12"
        role="main"
        aria-label="Subscription not found"
      >
        <CreditCard className="h-12 w-12 text-muted-foreground opacity-50 mx-auto mb-3" aria-hidden="true" />
        <p className="text-muted-foreground">Subscription not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6" role="main" aria-labelledby="subscription-title">
      {/* Subscription Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2" id="subscription-title">
              <CreditCard className="h-5 w-5" aria-hidden="true" />
              <span>Subscription Overview</span>
            </CardTitle>
            <div 
              className="flex items-center space-x-2"
              role="group"
              aria-label="Subscription management actions"
            >
              {/* Quick Actions based on status */}
              {subscription.status === "active" && (
                <>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-warning"
                        aria-label="Pause this subscription"
                      >
                        <Pause className="h-4 w-4 mr-2" aria-hidden="true" />
                        Pause
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent role="dialog" aria-labelledby="pause-dialog-title">
                      <AlertDialogHeader>
                        <AlertDialogTitle id="pause-dialog-title">
                          Pause Subscription?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This will pause the subscription and stop future billing cycles. 
                          The customer can reactivate it later.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => handleStatusChange("paused", "paused")}
                          className="bg-warning text-warning-foreground"
                          aria-label="Confirm pausing subscription"
                        >
                          Pause Subscription
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-destructive"
                        aria-label="Cancel this subscription"
                      >
                        <XCircle className="h-4 w-4 mr-2" aria-hidden="true" />
                        Cancel
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent role="dialog" aria-labelledby="cancel-dialog-title">
                      <AlertDialogHeader>
                        <AlertDialogTitle id="cancel-dialog-title">
                          Cancel Subscription?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently cancel the subscription. This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => handleStatusChange("cancelled", "cancelled")}
                          className="bg-destructive text-destructive-foreground"
                          aria-label="Confirm cancelling subscription"
                        >
                          Cancel Subscription
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </>
              )}

              {subscription.status === "paused" && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-success"
                      aria-label="Resume this subscription"
                    >
                      <Play className="h-4 w-4 mr-2" aria-hidden="true" />
                      Resume
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent role="dialog" aria-labelledby="resume-dialog-title">
                    <AlertDialogHeader>
                      <AlertDialogTitle id="resume-dialog-title">
                        Resume Subscription?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This will reactivate the subscription and resume billing cycles.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={() => handleStatusChange("active", "resumed")}
                        className="bg-success text-success-foreground"
                        aria-label="Confirm resuming subscription"
                      >
                        Resume Subscription
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}

              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsTransferModalOpen(true)}
                aria-label="Transfer this subscription to another customer"
              >
                <ArrowLeftRight className="h-4 w-4 mr-2" aria-hidden="true" />
                Transfer
              </Button>

              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  console.log("Refund clicked!");
                  setIsRefundModalOpen(true);
                }}
                aria-label="Process refund for this subscription"
              >
                <RotateCcw className="h-4 w-4 mr-2" aria-hidden="true" />
                Refund
              </Button>

              <Button 
                variant="outline" 
                asChild
                aria-label="Edit subscription details"
              >
                <Link href={`/subscriptions/${subscriptionId}/edit`}>
                  <Edit className="h-4 w-4 mr-2" aria-hidden="true" />
                  Edit
                </Link>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Subscription Info */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground" id="plan-name">
                  {subscription.planName}
                </h3>
                <div className="flex items-center space-x-2 mt-1">
                  <div aria-label={`Subscription status: ${subscription.status}${isOverdue() ? ', payment overdue' : ''}`}>
                    {getStatusBadge(subscription.status)}
                  </div>
                  {isOverdue() && (
                    <Badge 
                      variant="destructive" 
                      className="flex items-center space-x-1"
                      aria-label="Payment overdue - requires immediate attention"
                    >
                      <AlertTriangle className="h-3 w-3" aria-hidden="true" />
                      <span>Payment Overdue</span>
                    </Badge>
                  )}
                </div>
              </div>

              <div className="space-y-3" role="group" aria-labelledby="plan-name">
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  <span className="text-sm">
                    <span className="font-medium">{formatCurrency(subscription.amount)}</span>
                    <span className="text-muted-foreground">/{subscription.billingCycle.slice(0, -2)}</span>
                  </span>
                  <span className="sr-only">
                    Cost: {formatCurrency(subscription.amount)} per {subscription.billingCycle.slice(0, -2)}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  <span className="text-sm">
                    Next billing: <time dateTime={subscription.nextBillingDate}>
                      <span className="font-medium">{formatDate(subscription.nextBillingDate)}</span>
                    </time>
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  <span className="text-sm">
                    Started: <time dateTime={subscription.startDate}>
                      <span className="font-medium">{formatDate(subscription.startDate)}</span>
                    </time>
                  </span>
                </div>
              </div>
            </div>

            {/* Customer Info */}
            <div className="space-y-4">
              <h4 className="font-medium text-foreground" id="customer-info-title">Customer</h4>
              <div 
                className="flex items-start space-x-3"
                role="group"
                aria-labelledby="customer-info-title"
              >
                <div 
                  className="w-10 h-10 bg-muted rounded-full flex items-center justify-center"
                  role="img"
                  aria-label={`Profile picture for ${subscription.member.name}`}
                >
                  <User className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                </div>
                <div className="space-y-1">
                  <p className="font-medium text-foreground">{subscription.member.name}</p>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Mail className="h-3 w-3" aria-hidden="true" />
                    <span>{subscription.member.email}</span>
                    <span className="sr-only">Email address</span>
                  </div>
                  {subscription.member.phone && (
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Phone className="h-3 w-3" aria-hidden="true" />
                      <span>{subscription.member.phone}</span>
                      <span className="sr-only">Phone number</span>
                    </div>
                  )}
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    asChild 
                    className="p-0 h-auto"
                    aria-label={`View full profile for ${subscription.member.name}`}
                  >
                    <Link href={`/members/${subscription.memberId}`}>
                      View Profile →
                    </Link>
                  </Button>
                </div>
              </div>
            </div>

            {/* Vehicle Info */}
            <div className="space-y-4">
              <h4 className="font-medium text-foreground" id="vehicle-info-title">Vehicle</h4>
              <div 
                className="flex items-start space-x-3"
                role="group"
                aria-labelledby="vehicle-info-title"
              >
                <Car className="h-5 w-5 text-muted-foreground mt-1" aria-hidden="true" />
                <div className="space-y-1">
                  <p className="font-medium text-foreground">
                    {subscription.vehicle.year} {subscription.vehicle.make} {subscription.vehicle.model}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {subscription.vehicle.licensePlate} • {subscription.vehicle.color}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Added <time dateTime={subscription.vehicle.createdAt}>
                      {formatDate(subscription.vehicle.createdAt)}
                    </time>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2" id="payment-history-title">
            <Receipt className="h-5 w-5" aria-hidden="true" />
            <span>Payment History</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table
            role="table"
            aria-labelledby="payment-history-title"
            aria-describedby="payment-history-description"
          >
            <div id="payment-history-description" className="sr-only">
              Payment history for this subscription showing {mockPaymentHistory.length} transactions with dates, amounts, payment methods, status, and transaction IDs.
            </div>
            
            <TableHeader>
              <TableRow className="data-table-header" role="row">
                <TableHead role="columnheader" scope="col">
                  Date
                  <span className="sr-only">(Transaction date and time)</span>
                </TableHead>
                <TableHead role="columnheader" scope="col">
                  Amount
                  <span className="sr-only">(Payment amount)</span>
                </TableHead>
                <TableHead role="columnheader" scope="col">
                  Method
                  <span className="sr-only">(Payment method)</span>
                </TableHead>
                <TableHead role="columnheader" scope="col">
                  Status
                  <span className="sr-only">(Payment status)</span>
                </TableHead>
                <TableHead role="columnheader" scope="col">
                  Transaction ID
                  <span className="sr-only">(Unique transaction identifier)</span>
                </TableHead>
                <TableHead role="columnheader" scope="col" className="text-right">
                  Actions
                  <span className="sr-only">(Available actions for this payment)</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockPaymentHistory.map((payment, index) => (
                <TableRow 
                  key={payment.id} 
                  className="data-table-row" 
                  role="row"
                  aria-rowindex={index + 1}
                >
                  <TableCell className="font-medium" role="cell">
                    <time dateTime={payment.date}>
                      {formatDateTime(payment.date)}
                    </time>
                  </TableCell>
                  <TableCell className="font-medium" role="cell">
                    {formatCurrency(payment.amount)}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground" role="cell">
                    {payment.method}
                  </TableCell>
                  <TableCell role="cell">
                    <div aria-label={`Payment status: ${payment.status}`}>
                      {getPaymentStatusBadge(payment.status)}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm font-mono text-muted-foreground" role="cell">
                    {payment.transactionId}
                  </TableCell>
                  <TableCell role="cell">
                    <div 
                      className="flex items-center justify-end space-x-1"
                      role="group"
                      aria-label={`Actions for payment ${payment.transactionId}`}
                    >
                      <Button 
                        variant="ghost" 
                        size="sm"
                        aria-label={`View receipt for payment ${payment.transactionId}`}
                      >
                        View Receipt
                      </Button>
                      {payment.status === "failed" && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-primary"
                          aria-label={`Retry failed payment ${payment.transactionId}`}
                        >
                          Retry
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modals */}
      <RefundModal
        isOpen={isRefundModalOpen}
        subscription={subscription}
        onClose={() => setIsRefundModalOpen(false)}
      />

      <TransferSubscriptionModal
        isOpen={isTransferModalOpen}
        subscription={subscription}
        onClose={() => setIsTransferModalOpen(false)}
      />
    </div>
  );
}