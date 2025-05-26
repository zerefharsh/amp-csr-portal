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
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeftRight, 
  User, 
  Car, 
  AlertTriangle, 
  CheckCircle,
  Search,
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
      make: string;
      model: string;
      year: number;
      licensePlate: string;
    };
  };
}

// Mock member search results
const mockMembers = [
  { id: "2", name: "Emily Davis", email: "emily.davis@email.com", phone: "(555) 987-6543" },
  { id: "3", name: "Michael Johnson", email: "michael.j@email.com", phone: "(555) 456-7890" },
  { id: "4", name: "Sarah Wilson", email: "sarah.wilson@email.com", phone: "(555) 321-0987" },
  { id: "5", name: "David Brown", email: "david.brown@email.com", phone: "(555) 654-3210" }
];

export function TransferSubscriptionModal({ 
  isOpen, 
  onClose, 
  subscription 
}: TransferSubscriptionModalProps) {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"search" | "confirm">("search");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [reason, setReason] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Filter members based on search
  const filteredMembers = mockMembers.filter(member =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTransfer = async () => {
    // Validate form
    const newErrors: Record<string, string> = {};
    
    if (!selectedMember) {
      newErrors.member = "Please select a member";
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
        fromMemberId: subscription?.member.id,
        toMemberId: selectedMember.id,
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
    setStep("search");
    setSearchQuery("");
    setSelectedMember(null);
    setReason("");
    setErrors({});
    onClose();
  };

  const handleMemberSelect = (member: any) => {
    setSelectedMember(member);
    setStep("confirm");
    setErrors({});
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (!subscription) return null;

  const stepTitle = step === "search" ? "Select New Owner" : "Confirm Transfer";
  const stepDescription = step === "search" 
    ? "Search and select which member will receive this subscription"
    : "Review and confirm the subscription transfer details";

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
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
            <span>Transfer Subscription - {stepTitle}</span>
          </DialogTitle>
          <DialogDescription id="transfer-dialog-description">
            {stepDescription}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Subscription Details */}
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
                <p className="text-muted-foreground">Plan</p>
                <p className="font-medium">{subscription.planName}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Amount</p>
                <p className="font-medium">{formatCurrency(subscription.amount)}/month</p>
              </div>
              <div>
                <p className="text-muted-foreground">Vehicle</p>
                <p className="font-medium">
                  {subscription.vehicle.year} {subscription.vehicle.make} {subscription.vehicle.model}
                </p>
                <p className="text-xs text-muted-foreground">{subscription.vehicle.licensePlate}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Current Owner</p>
                <p className="font-medium">{subscription.member.name}</p>
                <p className="text-xs text-muted-foreground">{subscription.member.email}</p>
              </div>
            </div>
          </div>

          {step === "search" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="member-search" className="text-sm font-medium">
                  Search New Owner *
                </Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" aria-hidden="true" />
                  <Input
                    id="member-search"
                    placeholder="Search members by name or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                    aria-describedby="search-help"
                  />
                  <div id="search-help" className="sr-only">
                    Type to search for members by name or email address
                  </div>
                </div>
              </div>

              {/* Member Results */}
              <div 
                className="max-h-64 overflow-y-auto border rounded-lg"
                role="listbox"
                aria-label="Member search results"
                aria-describedby="search-results-description"
              >
                <div id="search-results-description" className="sr-only">
                  {filteredMembers.length} member{filteredMembers.length !== 1 ? 's' : ''} found. Use arrow keys to navigate and Enter to select.
                </div>
                
                {filteredMembers.length === 0 ? (
                  <div className="p-4 text-center text-muted-foreground">
                    {searchQuery ? "No members found matching your search" : "Start typing to search for members"}
                  </div>
                ) : (
                  <div className="space-y-1 p-2">
                    {filteredMembers.map((member, index) => (
                      <button
                        key={member.id}
                        onClick={() => handleMemberSelect(member)}
                        className="w-full text-left p-3 rounded-lg hover:bg-accent transition-colors focus:bg-accent focus:outline-none focus:ring-2 focus:ring-primary"
                        role="option"
                        aria-selected={false}
                        aria-label={`Select ${member.name}, ${member.email}`}
                      >
                        <div className="flex items-center space-x-3">
                          <div 
                            className="w-8 h-8 bg-muted rounded-full flex items-center justify-center"
                            role="img"
                            aria-label={`Avatar for ${member.name}`}
                          >
                            <User className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{member.name}</p>
                            <p className="text-sm text-muted-foreground">{member.email}</p>
                            {member.phone && (
                              <p className="text-xs text-muted-foreground">{member.phone}</p>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {step === "confirm" && selectedMember && (
            <div className="space-y-4">
              {/* Transfer Summary */}
              <div 
                className="bg-primary/5 border border-primary/20 rounded-lg p-4"
                role="group"
                aria-labelledby="transfer-summary-title"
              >
                <div className="flex items-center space-x-2 mb-3">
                  <CheckCircle className="h-4 w-4 text-primary" aria-hidden="true" />
                  <h4 className="font-medium text-foreground" id="transfer-summary-title">
                    Transfer Summary
                  </h4>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">From</p>
                    <p className="font-medium">{subscription.member.name}</p>
                    <p className="text-xs text-muted-foreground">{subscription.member.email}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">To</p>
                    <p className="font-medium">{selectedMember.name}</p>
                    <p className="text-xs text-muted-foreground">{selectedMember.email}</p>
                  </div>
                </div>
              </div>

              {/* Reason */}
              <div className="space-y-2">
                <Label htmlFor="transfer-reason" className="text-sm font-medium">
                  Reason for Transfer *
                </Label>
                <Textarea
                  id="transfer-reason"
                  placeholder="Provide a reason for this transfer (e.g., vehicle sold, family transfer, account consolidation, etc.)"
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
                  Provide a detailed explanation for why this subscription is being transferred
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

              {/* Warning */}
              <div 
                className="bg-warning/10 border border-warning/20 rounded-lg p-3"
                role="note"
                aria-labelledby="transfer-warning-title"
              >
                <div className="flex items-start space-x-2">
                  <AlertTriangle className="h-4 w-4 text-warning mt-0.5" aria-hidden="true" />
                  <div className="text-sm">
                    <p className="font-medium text-warning" id="transfer-warning-title">
                      Important Notice
                    </p>
                    <p className="text-muted-foreground">
                      This transfer will immediately move the subscription and vehicle to the new member. 
                      The billing will continue under the new member's account. This action cannot be undone.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          {step === "search" ? (
            <div className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                onClick={handleClose}
                aria-label="Cancel transfer and close dialog"
              >
                <X className="h-4 w-4 mr-2" aria-hidden="true" />
                Cancel
              </Button>
            </div>
          ) : (
            <div className="flex justify-between w-full">
              <Button 
                variant="outline" 
                onClick={() => {
                  setStep("search");
                  setErrors({});
                }}
                disabled={loading}
                aria-label="Go back to member selection"
              >
                Back
              </Button>
              <div className="flex space-x-2">
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
                  disabled={loading || !reason.trim()}
                  className="bg-primary text-primary-foreground"
                  aria-label={
                    loading 
                      ? "Processing transfer..." 
                      : !reason.trim() 
                        ? "Complete transfer - reason required" 
                        : `Complete transfer to ${selectedMember?.name}`
                  }
                >
                  <ArrowLeftRight className="h-4 w-4 mr-2" aria-hidden="true" />
                  {loading ? "Transferring..." : "Complete Transfer"}
                </Button>
              </div>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}