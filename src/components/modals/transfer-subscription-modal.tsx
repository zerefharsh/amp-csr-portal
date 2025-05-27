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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  ArrowLeftRight, 
  Car, 
  AlertTriangle, 
  CheckCircle,
  X
} from "lucide-react";

interface TransferSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  subscription?: {
    id: string;
    planName: string;
    amount: number;
    member: {
      id: string;
      name: string;
      email: string;
    };
    vehicle: {
      id: string;
      make: string;
      model: string;
      year: number;
      licensePlate: string;
      color?: string;
    };
  };
}

// Mock vehicles for the same user (in real app, would fetch from API)
const mockUserVehicles = [
  { 
    id: "veh1", 
    make: "BMW", 
    model: "X5", 
    year: 2022, 
    licensePlate: "ABC-123", 
    color: "Black" 
  },
  { 
    id: "veh2", 
    make: "Honda", 
    model: "Civic", 
    year: 2021, 
    licensePlate: "XYZ-789", 
    color: "White" 
  },
  { 
    id: "veh3", 
    make: "Tesla", 
    model: "Model Y", 
    year: 2023, 
    licensePlate: "TSL-456", 
    color: "Red" 
  }
];

export function TransferSubscriptionModal({ 
  isOpen, 
  onClose, 
  subscription 
}: TransferSubscriptionModalProps) {
  const [loading, setLoading] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [reason, setReason] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Filter out the current vehicle from the options
  const availableVehicles = mockUserVehicles.filter(
    vehicle => vehicle.id !== subscription?.vehicle.id
  );

  const handleTransfer = async () => {
    // Validate form
    const newErrors: Record<string, string> = {};
    
    if (!selectedVehicle) {
      newErrors.vehicle = "Please select a vehicle to transfer to";
    }
    
    if (!reason.trim()) {
      newErrors.reason = "Please provide a reason for the transfer";
    }
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0) {
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log("Transfer completed:", {
        subscriptionId: subscription?.id,
        fromVehicleId: subscription?.vehicle.id,
        toVehicleId: selectedVehicle,
        memberId: subscription?.member.id,
        reason
      });
      handleClose();
    } catch (error) {
      console.error("Transfer failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedVehicle("");
    setReason("");
    setErrors({});
    onClose();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const selectedVehicleData = availableVehicles.find(v => v.id === selectedVehicle);

  if (!subscription) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogTitle className="sr-only"></DialogTitle>
      <DialogContent 
        className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-labelledby="transfer-dialog-title"
        aria-describedby="transfer-dialog-description"
      >
        <DialogHeader>
          <DialogTitle 
            className="flex items-center space-x-2"
            id="transfer-dialog-title"
          >
            <ArrowLeftRight className="h-5 w-5 text-primary" aria-hidden="true" />
            <span>Transfer Subscription</span>
          </DialogTitle>
          <DialogDescription id="transfer-dialog-description">
            Move this subscription from the current vehicle to another vehicle owned by {subscription.member.name}.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Subscription & Customer Details */}
          <div 
            className="bg-muted/50 rounded-lg p-4"
            role="group"
            aria-labelledby="subscription-info-title"
          >
            <h4 className="font-medium text-foreground mb-3" id="subscription-info-title">
              Subscription Details
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Customer</p>
                <p className="font-medium">{subscription.member.name}</p>
                <p className="text-xs text-muted-foreground">{subscription.member.email}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Plan</p>
                <p className="font-medium">{subscription.planName}</p>
                <p className="text-xs text-muted-foreground">{formatCurrency(subscription.amount)}/month</p>
              </div>
            </div>
          </div>

          {/* Current Vehicle */}
          <div 
            className="bg-primary/5 border border-primary/20 rounded-lg p-4"
            role="group"
            aria-labelledby="current-vehicle-title"
          >
            <h4 className="font-medium text-foreground mb-3" id="current-vehicle-title">
              Current Vehicle
            </h4>
            <div className="flex items-center space-x-3">
              <Car className="h-5 w-5 text-primary" aria-hidden="true" />
              <div>
                <p className="font-medium text-foreground">
                  {subscription.vehicle.year} {subscription.vehicle.make} {subscription.vehicle.model}
                </p>
                <p className="text-sm text-muted-foreground">
                  {subscription.vehicle.licensePlate}
                  {subscription.vehicle.color && ` • ${subscription.vehicle.color}`}
                </p>
              </div>
            </div>
          </div>

          {/* Vehicle Selection */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="vehicle-select" className="text-sm font-medium">
                Transfer To Vehicle *
              </Label>
              {availableVehicles.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Car className="h-12 w-12 mx-auto mb-3 opacity-50" aria-hidden="true" />
                  <p>No other vehicles available for this customer.</p>
                  <p className="text-xs mt-1">The customer needs to add another vehicle first.</p>
                </div>
              ) : (
                <>
                  <Select 
                    value={selectedVehicle} 
                    onValueChange={(value) => {
                      setSelectedVehicle(value);
                      setErrors(prev => ({ ...prev, vehicle: "" }));
                    }}
                  >
                    <SelectTrigger 
                      id="vehicle-select"
                      className={errors.vehicle ? "border-destructive" : ""}
                      aria-describedby={errors.vehicle ? "vehicle-error" : "vehicle-help"}
                      aria-invalid={!!errors.vehicle}
                    >
                      <SelectValue placeholder="Choose destination vehicle" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableVehicles.map((vehicle) => (
                        <SelectItem key={vehicle.id} value={vehicle.id}>
                          <div className="flex items-center space-x-2">
                            <Car className="h-4 w-4" aria-hidden="true" />
                            <div>
                              <p className="font-medium">
                                {vehicle.year} {vehicle.make} {vehicle.model}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {vehicle.licensePlate}
                                {vehicle.color && ` • ${vehicle.color}`}
                              </p>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div id="vehicle-help" className="sr-only">
                    Select which vehicle should receive this subscription
                  </div>
                  {errors.vehicle && (
                    <p 
                      className="text-sm text-destructive flex items-center space-x-1"
                      id="vehicle-error"
                      role="alert"
                    >
                      <AlertTriangle className="h-3 w-3" aria-hidden="true" />
                      <span>{errors.vehicle}</span>
                    </p>
                  )}
                </>
              )}
            </div>

            {/* Transfer Summary */}
            {selectedVehicleData && (
              <div 
                className="bg-success/5 border border-success/20 rounded-lg p-4"
                role="group"
                aria-labelledby="transfer-summary-title"
              >
                <div className="flex items-center space-x-2 mb-3">
                  <CheckCircle className="h-4 w-4 text-success" aria-hidden="true" />
                  <h4 className="font-medium text-foreground" id="transfer-summary-title">
                    Transfer Summary
                  </h4>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">From</p>
                    <p className="font-medium">
                      {subscription.vehicle.year} {subscription.vehicle.make} {subscription.vehicle.model}
                    </p>
                    <p className="text-xs text-muted-foreground">{subscription.vehicle.licensePlate}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">To</p>
                    <p className="font-medium">
                      {selectedVehicleData.year} {selectedVehicleData.make} {selectedVehicleData.model}
                    </p>
                    <p className="text-xs text-muted-foreground">{selectedVehicleData.licensePlate}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Reason */}
            <div className="space-y-2">
              <Label htmlFor="transfer-reason" className="text-sm font-medium">
                Reason for Transfer *
              </Label>
              <Textarea
                id="transfer-reason"
                placeholder="Why is this subscription being transferred? (e.g., sold old vehicle, primary vehicle changed, customer preference, etc.)"
                value={reason}
                onChange={(e) => {
                  setReason(e.target.value);
                  setErrors(prev => ({ ...prev, reason: "" }));
                }}
                rows={3}
                className={errors.reason ? "border-destructive" : ""}
                aria-describedby={errors.reason ? "reason-error" : "reason-help"}
                aria-invalid={!!errors.reason}
                required
              />
              <div id="reason-help" className="sr-only">
                Provide a detailed explanation for why this subscription is being transferred between vehicles
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
          </div>

          {/* Information Notice */}
          <div 
            className="bg-blue-50 border border-blue-200 rounded-lg p-3"
            role="note"
            aria-labelledby="transfer-info-title"
          >
            <div className="flex items-start space-x-2">
              <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5" aria-hidden="true" />
              <div className="text-sm">
                <p className="font-medium text-blue-800" id="transfer-info-title">
                  What happens after transfer?
                </p>
                <ul className="text-blue-700 mt-1 space-y-1">
                  <li>• The subscription will immediately apply to the new vehicle</li>
                  <li>• Billing continues unchanged under the same customer account</li>
                  <li>• The customer will receive a confirmation email</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <div className="flex justify-end space-x-2">
            <Button 
              variant="outline" 
              onClick={handleClose} 
              disabled={loading}
              aria-label="Cancel transfer and close dialog"
            >
              <X className="h-4 w-4 mr-2" aria-hidden="true" />
              Cancel
            </Button>
            <Button 
              onClick={handleTransfer} 
              disabled={loading || !selectedVehicle || !reason.trim() || availableVehicles.length === 0}
              className="bg-primary text-primary-foreground"
              aria-label={
                loading 
                  ? "Processing transfer..." 
                  : availableVehicles.length === 0
                    ? "No vehicles available for transfer"
                    : !selectedVehicle || !reason.trim()
                      ? "Complete form to transfer subscription"
                      : `Transfer subscription to ${selectedVehicleData?.make} ${selectedVehicleData?.model}`
              }
            >
              <ArrowLeftRight className="h-4 w-4 mr-2" aria-hidden="true" />
              {loading ? "Transferring..." : "Complete Transfer"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}