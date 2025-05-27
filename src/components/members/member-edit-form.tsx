"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { PhoneInput } from "@/components/ui/phone-input";
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
  Mail, 
  Phone, 
  Save, 
  X, 
  AlertTriangle,
  Shield,
  ShieldOff,
  CheckCircle,
  Clock,
  User,
  UserX
} from "lucide-react";
import { MemberStatus, type MemberWithDetails } from "@/types";
import { apiService } from "@/services/api";

interface MemberEditFormProps {
  memberId: string;
}

export function MemberEditForm({ memberId }: MemberEditFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [member, setMember] = useState<MemberWithDetails | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    status: "active" as MemberStatus,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch member data on mount
  useEffect(() => {
    const fetchMember = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const memberData = await apiService.getMemberById(memberId);
        setMember(memberData);
        
        // Initialize form data with fetched member data
        setFormData({
          name: memberData.name,
          email: memberData.email,
          phone: memberData.phone || "",
          status: memberData.status,
        });
      } catch (err) {
        console.error("Error fetching member:", err);
        setError("Failed to load member data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchMember();
  }, [memberId]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
    
    // Clear error when member starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // More flexible phone validation - just check if it has at least 10 digits when provided
    if (formData.phone) {
      const digits = formData.phone.replace(/\D/g, '');
      if (digits.length > 0 && digits.length < 10) {
        newErrors.phone = "Phone number must have at least 10 digits";
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
      const updatedMember = await apiService.updateMember(memberId, {
        name: formData.name,
        email: formData.email,
        phone: formData.phone || undefined,
        status: formData.status,
      });
      
      // Update local state with the response
      setMember(prev => prev ? { ...prev, ...updatedMember } : null);
      setHasChanges(false);
      
      console.log("Member updated successfully");
      
      // Navigate back to members page after successful save
      router.push('/members');
      
    } catch (err) {
      console.error("Error updating member:", err);
      setError("Failed to update member. Please try again.");
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

  const handleStatusChange = async (newStatus: MemberStatus, action: string) => {
    setSaving(true);
    setError(null);
    
    try {
      const updatedMember = await apiService.updateMember(memberId, {
        status: newStatus
      });
      
      setMember(prev => prev ? { ...prev, ...updatedMember } : null);
      setFormData(prev => ({ ...prev, status: newStatus }));
      
      console.log(`Member ${action} successfully`);
      
    } catch (err) {
      console.error(`Error ${action} member:`, err);
      setError(`Failed to ${action} member. Please try again.`);
    } finally {
      setSaving(false);
    }
  };

  const getStatusBadge = (status: MemberStatus) => {
    const variants = {
      active: { className: "status-active", icon: CheckCircle },
      suspended: { className: "status-suspended", icon: Clock },
      cancelled: { className: "status-cancelled", icon: UserX }
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
      <div className="space-y-6" role="main" aria-label="Loading member edit form">
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
        <span className="sr-only">Loading member edit form</span>
      </div>
    );
  }

  if (error && !member) {
    return (
      <div className="text-center py-12" role="main" aria-label="Error loading member">
        <AlertTriangle className="h-12 w-12 text-destructive opacity-50 mx-auto mb-3" aria-hidden="true" />
        <p className="text-destructive mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="text-center py-12" role="main" aria-label="Member not found">
        <User className="h-12 w-12 text-muted-foreground opacity-50 mx-auto mb-3" aria-hidden="true" />
        <p className="text-muted-foreground">Member not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl" role="main" aria-labelledby="edit-form-title">
      {/* Error Alert */}
      {error && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4" role="alert">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-4 w-4 text-destructive" aria-hidden="true" />
            <span className="text-destructive text-sm">{error}</span>
          </div>
        </div>
      )}

      {/* Header with Status and Actions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div 
                className="w-12 h-12 bg-muted rounded-full flex items-center justify-center"
                role="img"
                aria-label={`Profile picture for ${member.name}`}
              >
                <User className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground" id="edit-form-title">
                  {member.name}
                </h2>
                <div className="flex items-center space-x-2 mt-1">
                  <div aria-label={`Current status: ${member.status}`}>
                    {getStatusBadge(member.status)}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    Last updated: <time dateTime={member.updatedAt}>{formatDate(member.updatedAt)}</time>
                  </span>
                </div>
              </div>
            </div>
            
            {/* Quick Actions */}
            <div 
              className="flex items-center space-x-2"
              role="group"
              aria-label="Quick status change actions"
            >
              {member.status === "active" && (
                <>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-warning"
                        disabled={saving}
                        aria-label={`Suspend account for ${member.name}`}
                      >
                        <Shield className="h-4 w-4 mr-2" aria-hidden="true" />
                        Suspend
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent role="dialog" aria-labelledby="suspend-dialog-title">
                      <AlertDialogHeader>
                        <AlertDialogTitle id="suspend-dialog-title">
                          Suspend User Account?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This will temporarily disable the member's account and pause all active subscriptions. 
                          The member will not be able to access services until reactivated.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => handleStatusChange("suspended", "suspended")}
                          className="bg-warning text-warning-foreground"
                          aria-label="Confirm suspension of account"
                        >
                          Suspend Account
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
                        disabled={saving}
                        aria-label={`Cancel account for ${member.name}`}
                      >
                        <UserX className="h-4 w-4 mr-2" aria-hidden="true" />
                        Cancel
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent role="dialog" aria-labelledby="cancel-dialog-title">
                      <AlertDialogHeader>
                        <AlertDialogTitle id="cancel-dialog-title">
                          Cancel User Account?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently cancel the member's account and all subscriptions. 
                          This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => handleStatusChange("cancelled", "cancelled")}
                          className="bg-destructive text-destructive-foreground"
                          aria-label="Confirm cancellation of account"
                        >
                          Cancel Account
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </>
              )}
              
              {member.status === "suspended" && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-success"
                      disabled={saving}
                      aria-label={`Reactivate account for ${member.name}`}
                    >
                      <ShieldOff className="h-4 w-4 mr-2" aria-hidden="true" />
                      Reactivate
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent role="dialog" aria-labelledby="reactivate-dialog-title">
                    <AlertDialogHeader>
                      <AlertDialogTitle id="reactivate-dialog-title">
                        Reactivate User Account?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This will restore the member's account access and reactivate their subscriptions.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={() => handleStatusChange("active", "reactivated")}
                        className="bg-success text-success-foreground"
                        aria-label="Confirm reactivation of account"
                      >
                        Reactivate Account
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Edit Form */}
      <Card>
        <CardHeader>
          <CardTitle className="form-section-title" id="personal-info-title">
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form 
            className="space-y-6" 
            onSubmit={(e) => { e.preventDefault(); handleSave(); }}
            aria-labelledby="personal-info-title"
            noValidate
          >
            {/* Name Field */}
            <div className="space-y-2">
              <Label 
                htmlFor="name" 
                className="flex items-center space-x-2 text-sm font-medium"
              >
                <User className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                <span>Full Name *</span>
              </Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Enter full name"
                className={errors.name ? "border-destructive" : ""}
                aria-describedby={errors.name ? "name-error" : "name-help"}
                aria-invalid={!!errors.name}
                required
                disabled={saving}
              />
              <div id="name-help" className="sr-only">
                Enter the member's full name as it should appear on their account
              </div>
              {errors.name && (
                <p 
                  className="text-sm text-destructive flex items-center space-x-1"
                  id="name-error"
                  role="alert"
                >
                  <AlertTriangle className="h-3 w-3" aria-hidden="true" />
                  <span>{errors.name}</span>
                </p>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <Label 
                htmlFor="email" 
                className="flex items-center space-x-2 text-sm font-medium"
              >
                <Mail className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                <span>Email Address *</span>
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="Enter email address"
                className={errors.email ? "border-destructive" : ""}
                aria-describedby={errors.email ? "email-error" : "email-help"}
                aria-invalid={!!errors.email}
                required
                disabled={saving}
              />
              <div id="email-help" className="sr-only">
                Enter a valid email address for account communication
              </div>
              {errors.email && (
                <p 
                  className="text-sm text-destructive flex items-center space-x-1"
                  id="email-error"
                  role="alert"
                >
                  <AlertTriangle className="h-3 w-3" aria-hidden="true" />
                  <span>{errors.email}</span>
                </p>
              )}
            </div>

            {/* Phone Field */}
            <div className="space-y-2">
              <Label 
                htmlFor="phone" 
                className="flex items-center space-x-2 text-sm font-medium"
              >
                <Phone className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                <span>Phone Number</span>
              </Label>
              <PhoneInput
                id="phone"
                value={formData.phone}
                onChange={(value) => handleInputChange("phone", value)}
                className={errors.phone ? "border-destructive" : ""}
                aria-describedby={errors.phone ? "phone-error" : "phone-help"}
                aria-invalid={!!errors.phone}
                disabled={saving}
              />
              <div id="phone-help" className="sr-only">
                Enter phone number - formatting will be applied automatically
              </div>
              {errors.phone && (
                <p 
                  className="text-sm text-destructive flex items-center space-x-1"
                  id="phone-error"
                  role="alert"
                >
                  <AlertTriangle className="h-3 w-3" aria-hidden="true" />
                  <span>{errors.phone}</span>
                </p>
              )}
            </div>

            {/* Status Field */}
            <div className="space-y-2">
              <Label htmlFor="status" className="text-sm font-medium">
                Account Status
              </Label>
              <Select 
                value={formData.status} 
                onValueChange={(value: MemberStatus) => handleInputChange("status", value)}
                disabled={saving}
              >
                <SelectTrigger id="status" aria-describedby="status-help">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <div id="status-help" className="sr-only">
                Select the current status of the member's account
              </div>
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
          aria-label="Cancel editing and return to member details"
        >
          <X className="h-4 w-4 mr-2" aria-hidden="true" />
          Cancel
        </Button>
        
        <div className="flex items-center space-x-3">
          <Button 
            variant="outline" 
            asChild
            aria-label={`View profile for ${member.name}`}
          >
            <Link href={`/members/${memberId}`}>
              View Profile
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
        <AlertDialogContent role="dialog" aria-labelledby="cancel-dialog-title">
          <AlertDialogHeader>
            <AlertDialogTitle id="cancel-dialog-title">
              Discard Changes?
            </AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes that will be lost if you leave this page. 
              Are you sure you want to continue without saving?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowCancelDialog(false)}>
              Stay on Page
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmCancel}
              className="bg-destructive text-destructive-foreground"
              aria-label="Confirm discarding changes and leave page"
            >
              Discard Changes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}