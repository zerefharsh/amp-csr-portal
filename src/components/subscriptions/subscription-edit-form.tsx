"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  CreditCard, 
  Car, 
  DollarSign,
  Calendar,
  Save, 
  X, 
  AlertTriangle,
  CheckCircle,
  Pause,
  XCircle,
  ArrowLeftRight,
  RotateCcw,
  User,
  Plus
} from "lucide-react";
import { 
  SubscriptionStatus,
  BillingCycle,
  type SubscriptionWithDetails
} from "@/types";
import { useRouter } from "next/navigation";
import { apiService } from "@/services/api";
import { AddVehicleModal } from "../modals/add-vehicle-modal";
import { TransferSubscriptionModal } from "../modals/transfer-subscription-modal";

interface SubscriptionEditFormProps {
  subscriptionId: string;
}

// Available plans with pricing
const availablePlans = [
  { name: "Basic Wash", monthlyPrice: 19.99, yearlyPrice: 199.99 },
  { name: "Premium Wash", monthlyPrice: 29.99, yearlyPrice: 299.99 },
  { name: "Deluxe Wash", monthlyPrice: 39.99, yearlyPrice: 399.99 },
  { name: "Ultimate Wash", monthlyPrice: 49.99, yearlyPrice: 499.99 }
];

export function SubscriptionEditForm({ subscriptionId }: SubscriptionEditFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [subscription, setSubscription] = useState<SubscriptionWithDetails | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [isAddVehicleModalOpen, setIsAddVehicleModalOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    planName: "",
    amount: "",
    billingCycle: "monthly" as BillingCycle,
    status: "active" as SubscriptionStatus,
    nextBillingDate: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const getNextBillingDateDefault = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const next = new Date(today);
    next.setDate(next.getDate() + 30);
    return next.toISOString().split('T')[0]; // yyyy-mm-dd
  };


  // Fetch subscription data on mount
  useEffect(() => {
    const fetchSubscription = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const subscriptionData = await apiService.getSubscriptionById(subscriptionId);
        setSubscription(subscriptionData);
        
        // Initialize form data with fetched subscription data
        setFormData({
          planName: subscriptionData.planName,
          amount: subscriptionData.amount.toString(),
          billingCycle: subscriptionData.billingCycle,
          status: subscriptionData.status,
          nextBillingDate: new Date(subscriptionData.nextBillingDate) < new Date()
          ? getNextBillingDateDefault()
          : subscriptionData.nextBillingDate.split('T')[0], // Format for date input
        });
      } catch (err) {
        console.error("Error fetching subscription:", err);
        setError("Failed to load subscription data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, [subscriptionId]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
    
    // Auto-update amount when plan changes
    if (field === "planName") {
      const selectedPlan = availablePlans.find(plan => plan.name === value);
      if (selectedPlan) {
        const newAmount = formData.billingCycle === "monthly" 
          ? selectedPlan.monthlyPrice 
          : selectedPlan.yearlyPrice;
        setFormData(prev => ({ ...prev, amount: newAmount.toString() }));
      }
    }
    
    // Auto-update amount when billing cycle changes
    if (field === "billingCycle") {
      const selectedPlan = availablePlans.find(plan => plan.name === formData.planName);
      if (selectedPlan) {
        const newAmount = value === "monthly" 
          ? selectedPlan.monthlyPrice 
          : selectedPlan.yearlyPrice;
        setFormData(prev => ({ ...prev, amount: newAmount.toString() }));
      }
    }
    
    // Clear error when member starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.planName) {
      newErrors.planName = "Plan is required";
    }

    const amount = parseFloat(formData.amount);
    if (!formData.amount || isNaN(amount) || amount <= 0) {
      newErrors.amount = "Amount must be a valid positive number";
    }

    if (!formData.nextBillingDate) {
      newErrors.nextBillingDate = "Next billing date is required";
    } else {
      const billingDate = new Date(formData.nextBillingDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (billingDate < today) {
        newErrors.nextBillingDate = "Next billing date cannot be in the past";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setSaving(true);
    setError(null);
    
    try {
      const updatedSubscription = await apiService.updateSubscription(subscriptionId, {
        planName: formData.planName,
        amount: parseFloat(formData.amount),
        status: formData.status,
        billingCycle: formData.billingCycle,
        nextBillingDate: formData.nextBillingDate,
      });
      
      // Update local state with the response
      setSubscription(updatedSubscription);
      setHasChanges(false);
      
      console.log("Subscription updated successfully");
      
      // Navigate back to subscriptions page after successful save
      router.push('/subscriptions');
      
    } catch (err) {
      console.error("Error updating subscription:", err);
      setError("Failed to update subscription. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (hasChanges) {
      setShowCancelDialog(true);
    } else {
      router.back();
    }
  };

  const confirmCancel = () => {
    setShowCancelDialog(false);
    router.back();
  };

  const handleSpecialAction = async (action: string, newStatus?: SubscriptionStatus) => {
    setSaving(true);
    try {
      // Simulate API call for special actions
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (newStatus) {
        setSubscription(prev => prev ? { ...prev, status: newStatus } : null);
        setFormData(prev => ({ ...prev, status: newStatus }));
      }
      
      console.log(`${action} completed successfully`);
      
    } catch (error) {
      console.error(`Error performing ${action}:`, error);
    } finally {
      setSaving(false);
    }
  };

  const getStatusBadge = (status: SubscriptionStatus) => {
    const variants = {
      active: { className: "status-active", icon: CheckCircle },
      paused: { className: "status-suspended", icon: Pause },
      overdue: { className: "status-overdue", icon: AlertTriangle },
      cancelled: { className: "status-cancelled", icon: XCircle }
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="space-y-6" role="main" aria-label="Loading subscription edit form">
        <Card>
          <CardHeader>
            <Skeleton className="skeleton-text w-48 h-6" aria-hidden="true" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="skeleton-text w-full h-10" aria-hidden="true" />
            <Skeleton className="skeleton-text w-full h-10" aria-hidden="true" />
            <Skeleton className="skeleton-text w-full h-10" aria-hidden="true" />
          </CardContent>
        </Card>
        <span className="sr-only">Loading subscription edit form</span>
      </div>
    );
  }

  if (error && !subscription) {
    return (
      <div className="text-center py-12" role="main" aria-label="Error loading subscription">
        <AlertTriangle className="h-12 w-12 text-destructive opacity-50 mx-auto mb-3" aria-hidden="true" />
        <p className="text-destructive mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="text-center py-12" role="main" aria-label="Subscription not found">
        <CreditCard className="h-12 w-12 text-muted-foreground opacity-50 mx-auto mb-3" aria-hidden="true" />
        <p className="text-muted-foreground">Subscription not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl" role="main" aria-labelledby="edit-subscription-title">
      {/* Error Alert */}
      {error && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4" role="alert">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-4 w-4 text-destructive" aria-hidden="true" />
            <span className="text-destructive text-sm">{error}</span>
          </div>
        </div>
      )}

      {/* Header with Subscription Info and Quick Actions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div 
                className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center"
                role="img"
                aria-label="Subscription icon"
              >
                <CreditCard className="h-6 w-6 text-primary" aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground" id="edit-subscription-title">
                  {subscription.planName}
                </h2>
                <div className="flex items-center space-x-2 mt-1">
                  <div aria-label={`Current status: ${subscription.status}`}>
                    {getStatusBadge(subscription.status)}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    Last updated: <time dateTime={subscription.updatedAt}>{formatDate(subscription.updatedAt)}</time>
                  </span>
                </div>
              </div>
            </div>
            
            {/* Quick Actions */}
            <div 
              className="flex items-center space-x-2"
              role="group"
              aria-label="Quick subscription actions"
            >
              <Button 
                variant="outline" 
                size="sm" 
                className="text-primary"
                onClick={() => setIsTransferModalOpen(true)}
                aria-label="Transfer this subscription to another customer"
              >
                <ArrowLeftRight className="h-4 w-4 mr-2" aria-hidden="true" />
                Transfer
              </Button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-warning"
                    aria-label="Process refund for this subscription"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" aria-hidden="true" />
                    Refund
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent role="dialog" aria-labelledby="refund-dialog-title">
                  <AlertDialogHeader>
                    <AlertDialogTitle id="refund-dialog-title">
                      Process Refund?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Issue a refund for the most recent payment. This will process immediately.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={() => handleSpecialAction("Refund")}
                      className="bg-warning text-warning-foreground"
                      aria-label="Confirm refund processing"
                    >
                      Process Refund
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Customer and Vehicle Info (Read-only) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2" id="customer-section-title">
              <User className="h-5 w-5" aria-hidden="true" />
              <span>Customer</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div 
              className="flex items-start space-x-3"
              role="group"
              aria-labelledby="customer-section-title"
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
                <p className="text-sm text-muted-foreground">{subscription.member.email}</p>
                {subscription.member.phone && (
                  <p className="text-sm text-muted-foreground">{subscription.member.phone}</p>
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2" id="vehicle-section-title">
                <Car className="h-5 w-5" aria-hidden="true" />
                <span>Vehicle</span>
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsAddVehicleModalOpen(true)}
                aria-label={`Add new vehicle for ${subscription.member.name}`}
              >
                <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
                Add Vehicle
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div
              className="flex items-start space-x-3"
              role="group"
              aria-labelledby="vehicle-section-title"
            >
              <Car className="h-5 w-5 text-muted-foreground mt-1" aria-hidden="true" />
              <div className="space-y-1">
                <p className="font-medium text-foreground">
                  {subscription.vehicle.year} {subscription.vehicle.make} {subscription.vehicle.model}
                </p>
                <p className="text-sm text-muted-foreground">
                  {subscription.vehicle.licensePlate} • {subscription.vehicle.color}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Edit Form */}
      <Card>
        <CardHeader>
          <CardTitle className="form-section-title" id="subscription-details-title">
            Subscription Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form 
            className="space-y-6"
            onSubmit={(e) => { e.preventDefault(); handleSave(); }}
            aria-labelledby="subscription-details-title"
            noValidate
          >
            {/* Plan Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label 
                  htmlFor="planName" 
                  className="flex items-center space-x-2 text-sm font-medium"
                >
                  <CreditCard className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  <span>Plan *</span>
                </Label>
                <Select 
                  value={formData.planName} 
                  onValueChange={(value) => handleInputChange("planName", value)}
                  disabled={saving}
                >
                  <SelectTrigger 
                    className={errors.planName ? "border-destructive" : ""}
                    id="planName"
                    aria-describedby={errors.planName ? "plan-error" : "plan-help"}
                    aria-invalid={!!errors.planName}
                  >
                    <SelectValue placeholder="Select a plan" />
                  </SelectTrigger>
                  <SelectContent>
                    {availablePlans.map((plan) => (
                      <SelectItem key={plan.name} value={plan.name}>
                        <div className="flex items-center justify-between w-full">
                          <span>{plan.name}</span>
                          <span className="text-muted-foreground ml-4">
                            {formatCurrency(formData.billingCycle === "monthly" ? plan.monthlyPrice : plan.yearlyPrice)}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div id="plan-help" className="sr-only">
                  Select the subscription plan type for this customer
                </div>
                {errors.planName && (
                  <p 
                    className="text-sm text-destructive flex items-center space-x-1"
                    id="plan-error"
                    role="alert"
                  >
                    <AlertTriangle className="h-3 w-3" aria-hidden="true" />
                    <span>{errors.planName}</span>
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="billingCycle" className="text-sm font-medium">
                  Billing Cycle
                </Label>
                <Select 
                  value={formData.billingCycle} 
                  onValueChange={(value: BillingCycle) => handleInputChange("billingCycle", value)}
                  disabled={saving}
                >
                  <SelectTrigger id="billingCycle" aria-describedby="billing-help">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="yearly">Yearly (Save 17%)</SelectItem>
                  </SelectContent>
                </Select>
                <div id="billing-help" className="sr-only">
                  Choose how often this subscription will be billed
                </div>
              </div>
            </div>

            {/* Amount and Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label 
                  htmlFor="amount" 
                  className="flex items-center space-x-2 text-sm font-medium"
                >
                  <DollarSign className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  <span>Amount *</span>
                </Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.amount}
                  onChange={(e) => handleInputChange("amount", e.target.value)}
                  placeholder="0.00"
                  className={errors.amount ? "border-destructive" : ""}
                  aria-describedby={errors.amount ? "amount-error" : "amount-help"}
                  aria-invalid={!!errors.amount}
                  required
                  disabled={saving}
                />
                <div id="amount-help" className="sr-only">
                  Enter the subscription amount in dollars and cents
                </div>
                {errors.amount && (
                  <p 
                    className="text-sm text-destructive flex items-center space-x-1"
                    id="amount-error"
                    role="alert"
                  >
                    <AlertTriangle className="h-3 w-3" aria-hidden="true" />
                    <span>{errors.amount}</span>
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="status" className="text-sm font-medium">
                  Status
                </Label>
                <Select 
                  value={formData.status} 
                  onValueChange={(value: SubscriptionStatus) => handleInputChange("status", value)}
                  disabled={saving}
                >
                  <SelectTrigger id="status" aria-describedby="status-help">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="paused">Paused</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                <div id="status-help" className="sr-only">
                  Select the current status of this subscription
                </div>
              </div>
            </div>

            {/* Next Billing Date */}
            <div className="space-y-2">
              <Label 
                htmlFor="nextBillingDate" 
                className="flex items-center space-x-2 text-sm font-medium"
              >
                <Calendar className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                <span>Next Billing Date *</span>
              </Label>
              <Input
                id="nextBillingDate"
                type="date"
                value={formData.nextBillingDate}
                onChange={(e) => handleInputChange("nextBillingDate", e.target.value)}
                className={errors.nextBillingDate ? "border-destructive" : ""}
                aria-describedby={errors.nextBillingDate ? "billing-date-error" : "billing-date-help"}
                aria-invalid={!!errors.nextBillingDate}
                required
                disabled={saving}
              />
              <div id="billing-date-help" className="sr-only">
                Select the date for the next billing cycle
              </div>
              {errors.nextBillingDate && (
                <p 
                  className="text-sm text-destructive flex items-center space-x-1"
                  id="billing-date-error"
                  role="alert"
                >
                  <AlertTriangle className="h-3 w-3" aria-hidden="true" />
                  <span>{errors.nextBillingDate}</span>
                </p>
              )}
            </div>

            {/* Save Changes Alert */}
            {hasChanges && (
              <div 
                className="bg-muted/50 border border-border rounded-lg p-4"
                role="alert"
                aria-live="polite"
              >
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <AlertTriangle className="h-4 w-4" aria-hidden="true" />
                  <span>You have unsaved changes. Use the Save Changes button below to save your work.</span>
                </div>
              </div>
            )}
          </form>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div 
        className="flex items-center justify-between"
        role="group"
        aria-label="Form actions"
      >
        <Button 
          variant="outline" 
          onClick={handleCancel}
          type="button"
          disabled={saving}
          aria-label="Cancel editing and return to subscription details"
        >
          <X className="h-4 w-4 mr-2" aria-hidden="true" />
          Cancel
        </Button>
        
        <div className="flex items-center space-x-3">
          <Button 
            variant="outline" 
            asChild
            aria-label="View subscription details"
          >
            <Link href={`/subscriptions/${subscriptionId}`}>
              View Details
            </Link>
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={!hasChanges || saving}
            aria-label={
              !hasChanges 
                ? "No changes to save" 
                : saving 
                  ? "Saving changes..." 
                  : "Save all changes"
            }
          >
            <Save className="h-4 w-4 mr-2" aria-hidden="true" />
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      {/* Cancel Confirmation Dialog */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Discard Changes?</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes that will be lost if you leave this page.
              Are you sure you want to continue without saving?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Stay on Page</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-destructive-foreground" onClick={confirmCancel}>
              Discard Changes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <TransferSubscriptionModal 
        isOpen={isTransferModalOpen} 
        subscription={subscription}
        onClose={() => setIsTransferModalOpen(false)}
      />

      <AddVehicleModal
        isOpen={isAddVehicleModalOpen}
        onClose={() => setIsAddVehicleModalOpen(false)}
        memberId={subscription.memberId}
        memberName={subscription.member.name}
      />
    </div>
  );
}