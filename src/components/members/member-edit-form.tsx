"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { MemberStatus, type Member as MemberType } from "@/types";

interface MemberEditFormProps {
  memberId: string;
}

// Mock member data - in real app this would be fetched
const mockUser: MemberType = {
  id: "1",
  name: "John Smith",
  email: "john.smith@email.com",
  phone: "(555) 123-4567",
  status: "active",
  createdAt: "2024-01-15T10:30:00Z",
  updatedAt: "2024-01-20T14:45:00Z",
  lastActivity: "2024-01-20T14:45:00Z",
  totalSubscriptions: 2,
  monthlyRevenue: 59.98,
  isOverdue: false,
};

export function MemberEditForm({ memberId }: MemberEditFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [member, setUser] = useState<MemberType>(mockUser);
  const [hasChanges, setHasChanges] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: member.name,
    email: member.email,
    phone: member.phone || "",
    status: member.status,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

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

    if (formData.phone && !/^\(\d{3}\) \d{3}-\d{4}$/.test(formData.phone)) {
      newErrors.phone = "Phone must be in format (555) 123-4567";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update member data
      setUser(prev => ({ ...prev, ...formData, updatedAt: new Date().toISOString() }));
      setHasChanges(false);
      
      // Show success message or redirect
      console.log("User updated successfully");
      
    } catch (error) {
      console.error("Error updating member:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (hasChanges) {
      if (confirm("You have unsaved changes. Are you sure you want to leave?")) {
        router.back();
      }
    } else {
      router.back();
    }
  };

  const handleStatusChange = async (newStatus: MemberStatus, action: string) => {
    setSaving(true);
    try {
      // Simulate API call for status change
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setUser(prev => ({ ...prev, status: newStatus }));
      setFormData(prev => ({ ...prev, status: newStatus }));
      
      console.log(`User ${action} successfully`);
      
    } catch (error) {
      console.error(`Error ${action} member:`, error);
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

  return (
    <div className="space-y-6 max-w-4xl" role="main" aria-labelledby="edit-form-title">
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
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="(555) 123-4567"
                className={errors.phone ? "border-destructive" : ""}
                aria-describedby={errors.phone ? "phone-error" : "phone-help"}
                aria-invalid={!!errors.phone}
              />
              <div id="phone-help" className="sr-only">
                Optional phone number in format (555) 123-4567
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
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <AlertTriangle className="h-4 w-4" aria-hidden="true" />
                    <span>You have unsaved changes</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleCancel}
                      type="button"
                      aria-label="Cancel changes and return to previous page"
                    >
                      <X className="h-4 w-4 mr-2" aria-hidden="true" />
                      Cancel
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={handleSave} 
                      disabled={saving}
                      type="submit"
                      aria-label={saving ? "Saving changes..." : "Save all changes"}
                    >
                      <Save className="h-4 w-4 mr-2" aria-hidden="true" />
                      {saving ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
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
    </div>
  );
}