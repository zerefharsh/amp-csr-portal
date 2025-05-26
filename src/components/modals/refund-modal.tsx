"use client";

import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  RotateCcw, 
  DollarSign, 
  CreditCard, 
  AlertTriangle, 
  CheckCircle,
  Receipt,
  X
} from "lucide-react";

interface RefundModalProps {
  isOpen: boolean;
  onClose: () => void;
  subscription?: {
    id: string;
    planName: string;
    amount: number;
    member: {
      name: string;
      email: string;
    };
    vehicle: {
      make: string;
      model: string;
      year: number;
      licensePlate: string;
    };
  };
}

// Mock payment history for refund options
const mockPayments = [
  {
    id: "pay1",
    date: "2024-01-15T10:30:00Z",
    amount: 29.99,
    method: "Credit Card ****1234",
    transactionId: "txn_abc123"
  },
  {
    id: "pay2", 
    date: "2023-12-15T10:30:00Z",
    amount: 29.99,
    method: "Credit Card ****1234",
    transactionId: "txn_def456"
  }
];

const refundReasons = [
  "Customer requested cancellation",
  "Service not delivered",
  "Billing error",
  "Duplicate charge",
  "Customer dispute",
  "Technical issue",
  "Other"
];

export function RefundModal({ 
  isOpen, 
  onClose, 
  subscription 
}: RefundModalProps) {
    console.log("RefundModal rendered", isOpen);

  const [loading, setLoading] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState("");
  const [refundAmount, setRefundAmount] = useState("");
  const [refundType, setRefundType] = useState<"full" | "partial">("full");
  const [reason, setReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [notifyCustomer, setNotifyCustomer] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleRefund = async () => {
    // Validate form
    const newErrors: Record<string, string> = {};
    
    if (!selectedPayment) {
      newErrors.payment = "Please select a payment to refund";
    }
    
    if (!refundAmount || parseFloat(refundAmount) <= 0) {
      newErrors.amount = "Please enter a valid refund amount";
    }
    
    if (!reason) {
      newErrors.reason = "Please select a reason for the refund";
    }
    
    if (reason === "Other" && !customReason.trim()) {
      newErrors.customReason = "Please provide a custom reason";
    }
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0) {
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log("Refund processed:", {
        subscriptionId: subscription?.id,
        paymentId: selectedPayment,
        amount: parseFloat(refundAmount),
        reason: reason === "Other" ? customReason : reason,
        notifyCustomer
      });
      handleClose();
    } catch (error) {
      console.error("Refund failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedPayment("");
    setRefundAmount("");
    setRefundType("full");
    setReason("");
    setCustomReason("");
    setNotifyCustomer(true);
    setErrors({});
    onClose();
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

  const selectedPaymentData = mockPayments.find(p => p.id === selectedPayment);
  const maxRefundAmount = selectedPaymentData?.amount || 0;

  if (!subscription) return null;
  console.log("RefundModal rendered After", isOpen);


  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent 
        className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-labelledby="refund-dialog-title"
        aria-describedby="refund-dialog-description"
      >
        <DialogHeader>
          <DialogTitle 
            className="flex items-center space-x-2"
            id="refund-dialog-title"
          >
            <RotateCcw className="h-5 w-5 text-warning" aria-hidden="true" />
            <span>Process Refund</span>
          </DialogTitle>
          <DialogDescription id="refund-dialog-description">
            Issue a refund for this subscription. The refund will be processed to the original payment method.
          </DialogDescription>
        </DialogHeader>

        <form 
          className="space-y-6"
          onSubmit={(e) => { e.preventDefault(); handleRefund(); }}
          noValidate
        >
          {/* Subscription Details */}
          <div 
            className="bg-muted/50 rounded-lg p-4"
            role="group"
            aria-labelledby="subscription-details-title"
          >
            <h4 className="font-medium text-foreground mb-3" id="subscription-details-title">
              Subscription Details
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Member</p>
                <p className="font-medium">{subscription.member.name}</p>
                <p className="text-xs text-muted-foreground">{subscription.member.email}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Plan</p>
                <p className="font-medium">{subscription.planName}</p>
                <p className="text-xs text-muted-foreground">{formatCurrency(subscription.amount)}/month</p>
              </div>
              <div className="col-span-2">
                <p className="text-muted-foreground">Vehicle</p>
                <p className="font-medium">
                  {subscription.vehicle.year} {subscription.vehicle.make} {subscription.vehicle.model} ({subscription.vehicle.licensePlate})
                </p>
              </div>
            </div>
          </div>

          {/* Payment Selection */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="payment-select" className="text-sm font-medium">
                Select Payment to Refund *
              </Label>
              <Select 
                value={selectedPayment} 
                onValueChange={(value) => {
                  setSelectedPayment(value);
                  setErrors(prev => ({ ...prev, payment: "" }));
                  
                  // Auto-set full refund amount
                  const payment = mockPayments.find(p => p.id === value);
                  if (payment) {
                    setRefundAmount(payment.amount.toString());
                    setRefundType("full");
                  }
                }}
              >
                <SelectTrigger 
                  id="payment-select"
                  className={errors.payment ? "border-destructive" : ""}
                  aria-describedby={errors.payment ? "payment-error" : "payment-help"}
                  aria-invalid={!!errors.payment}
                >
                  <SelectValue placeholder="Choose a recent payment" />
                </SelectTrigger>
                <SelectContent>
                  {mockPayments.map((payment) => (
                    <SelectItem key={payment.id} value={payment.id}>
                      <div className="flex items-center justify-between w-full">
                        <span>{formatDate(payment.date)} - {formatCurrency(payment.amount)}</span>
                        <span className="text-xs text-muted-foreground ml-2">{payment.method}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div id="payment-help" className="sr-only">
                Select which payment transaction to refund from the recent payment history
              </div>
              {errors.payment && (
                <p 
                  className="text-sm text-destructive flex items-center space-x-1"
                  id="payment-error"
                  role="alert"
                >
                  <AlertTriangle className="h-3 w-3" aria-hidden="true" />
                  <span>{errors.payment}</span>
                </p>
              )}
            </div>

            {selectedPaymentData && (
              <div 
                className="bg-primary/5 border border-primary/20 rounded-lg p-3"
                role="region"
                aria-label="Selected payment details"
              >
                <div className="flex items-center space-x-2 mb-2">
                  <Receipt className="h-4 w-4 text-primary" aria-hidden="true" />
                  <span className="font-medium text-sm">Payment Details</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-muted-foreground">Transaction ID:</span>
                    <span className="font-mono ml-1">{selectedPaymentData.transactionId}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Method:</span>
                    <span className="ml-1">{selectedPaymentData.method}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Refund Amount */}
          {selectedPaymentData && (
            <div className="space-y-4">
              <fieldset className="space-y-3">
                <legend className="text-sm font-medium">Refund Type *</legend>
                <div 
                  className="flex space-x-4"
                  role="radiogroup"
                  aria-labelledby="refund-type-legend"
                >
                  <button
                    type="button"
                    onClick={() => {
                      setRefundType("full");
                      setRefundAmount(selectedPaymentData.amount.toString());
                      setErrors(prev => ({ ...prev, amount: "" }));
                    }}
                    className={`p-3 rounded-lg border-2 transition-colors ${
                      refundType === "full" 
                        ? "border-primary bg-primary/5" 
                        : "border-border hover:border-border/80"
                    }`}
                    role="radio"
                    aria-checked={refundType === "full"}
                    aria-label={`Full refund of ${formatCurrency(selectedPaymentData.amount)}`}
                  >
                    <div className="text-center">
                      <p className="font-medium">Full Refund</p>
                      <p className="text-sm text-muted-foreground">{formatCurrency(selectedPaymentData.amount)}</p>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setRefundType("partial");
                      setRefundAmount("");
                      setErrors(prev => ({ ...prev, amount: "" }));
                    }}
                    className={`p-3 rounded-lg border-2 transition-colors ${
                      refundType === "partial" 
                        ? "border-primary bg-primary/5" 
                        : "border-border hover:border-border/80"
                    }`}
                    role="radio"
                    aria-checked={refundType === "partial"}
                    aria-label="Partial refund with custom amount"
                  >
                    <div className="text-center">
                      <p className="font-medium">Partial Refund</p>
                      <p className="text-sm text-muted-foreground">Custom amount</p>
                    </div>
                  </button>
                </div>
              </fieldset>

              {refundType === "partial" && (
                <div className="space-y-2">
                  <Label htmlFor="refund-amount" className="text-sm font-medium">
                    Refund Amount *
                  </Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" aria-hidden="true" />
                    <Input
                      id="refund-amount"
                      type="number"
                      step="0.01"
                      min="0"
                      max={maxRefundAmount}
                      placeholder="0.00"
                      value={refundAmount}
                      onChange={(e) => {
                        setRefundAmount(e.target.value);
                        setErrors(prev => ({ ...prev, amount: "" }));
                      }}
                      className={`pl-10 ${errors.amount ? "border-destructive" : ""}`}
                      aria-describedby={errors.amount ? "amount-error" : "amount-help"}
                      aria-invalid={!!errors.amount}
                    />
                  </div>
                  <div id="amount-help" className="sr-only">
                    Enter the partial refund amount, maximum {formatCurrency(maxRefundAmount)}
                  </div>
                  {parseFloat(refundAmount) > maxRefundAmount && (
                    <p className="text-sm text-destructive">
                      Amount cannot exceed {formatCurrency(maxRefundAmount)}
                    </p>
                  )}
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
              )}
            </div>
          )}

          {/* Reason */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="refund-reason" className="text-sm font-medium">
                Reason for Refund *
              </Label>
              <Select 
                value={reason} 
                onValueChange={(value) => {
                  setReason(value);
                  setErrors(prev => ({ ...prev, reason: "" }));
                }}
              >
                <SelectTrigger 
                  id="refund-reason"
                  className={errors.reason ? "border-destructive" : ""}
                  aria-describedby={errors.reason ? "reason-error" : "reason-help"}
                  aria-invalid={!!errors.reason}
                >
                  <SelectValue placeholder="Select a reason" />
                </SelectTrigger>
                <SelectContent>
                  {refundReasons.map((reasonOption) => (
                    <SelectItem key={reasonOption} value={reasonOption}>
                      {reasonOption}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div id="reason-help" className="sr-only">
                Select the primary reason for processing this refund
              </div>
              {errors.reason && (
                <p 
                  className="text-sm text-destructive flex items-center space-x-1"
                  id="reason-error"
                  role="alert"
                >
                  <AlertTriangle className="h-3 w-3" aria-hidden="true" />
                  <span>{errors.reason}</span>
                </p>
              )}
            </div>

            {reason === "Other" && (
              <div className="space-y-2">
                <Label htmlFor="custom-reason" className="text-sm font-medium">
                  Custom Reason *
                </Label>
                <Textarea
                  id="custom-reason"
                  placeholder="Please specify the reason for this refund..."
                  value={customReason}
                  onChange={(e) => {
                    setCustomReason(e.target.value);
                    setErrors(prev => ({ ...prev, customReason: "" }));
                  }}
                  rows={3}
                  className={errors.customReason ? "border-destructive" : ""}
                  aria-describedby={errors.customReason ? "custom-reason-error" : "custom-reason-help"}
                  aria-invalid={!!errors.customReason}
                />
                <div id="custom-reason-help" className="sr-only">
                  Provide a detailed explanation for the refund request
                </div>
                {errors.customReason && (
                  <p 
                    className="text-sm text-destructive flex items-center space-x-1"
                    id="custom-reason-error"
                    role="alert"
                  >
                    <AlertTriangle className="h-3 w-3" aria-hidden="true" />
                    <span>{errors.customReason}</span>
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Options */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="notify-customer"
                checked={notifyCustomer}
                onChange={(e) => setNotifyCustomer(e.target.checked)}
                className="rounded border-border"
                aria-describedby="notify-help"
              />
              <Label htmlFor="notify-customer" className="text-sm cursor-pointer">
                Send email notification to customer
              </Label>
              <div id="notify-help" className="sr-only">
                When checked, the customer will receive an email notification about the refund
              </div>
            </div>
          </div>

          {/* Warning */}
          <div 
            className="bg-warning/10 border border-warning/20 rounded-lg p-3"
            role="note"
            aria-labelledby="processing-warning-title"
          >
            <div className="flex items-start space-x-2">
              <AlertTriangle className="h-4 w-4 text-warning mt-0.5" aria-hidden="true" />
              <div className="text-sm">
                <p className="font-medium text-warning" id="processing-warning-title">
                  Processing Time
                </p>
                <p className="text-muted-foreground">
                  Refunds typically take 3-5 business days to appear on the customer's statement.
                </p>
              </div>
            </div>
          </div>
        </form>

        <DialogFooter>
          <div className="flex justify-end space-x-2">
            <Button 
              variant="outline" 
              onClick={handleClose} 
              disabled={loading}
              type="button"
              aria-label="Cancel refund process"
            >
              <X className="h-4 w-4 mr-2" aria-hidden="true" />
              Cancel
            </Button>
            <Button 
              onClick={handleRefund} 
              disabled={loading || !selectedPayment || !refundAmount || !reason || (reason === "Other" && !customReason.trim())}
              className="bg-warning text-warning-foreground"
              aria-label={
                loading 
                  ? "Processing refund..." 
                  : `Process ${formatCurrency(parseFloat(refundAmount) || 0)} refund`
              }
            >
              <RotateCcw className="h-4 w-4 mr-2" aria-hidden="true" />
              {loading ? "Processing..." : `Process ${formatCurrency(parseFloat(refundAmount) || 0)} Refund`}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}