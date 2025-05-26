"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Mail, 
  Phone, 
  Calendar, 
  Edit, 
  Car, 
  CreditCard,
  AlertTriangle,
  DollarSign,
  User
} from "lucide-react";
import { 
  MemberStatus, 
  SubscriptionStatus,
  type MemberWithDetails
} from "@/types";
import { apiService } from "@/services/api";

interface MemberDetailClientProps {
  memberId: string;
}

export function MemberDetailClient({ memberId }: MemberDetailClientProps) {
  const [member, setUser] = useState<MemberWithDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const MemberData = await apiService.getMemberById(memberId);
        setUser(MemberData);
      } catch (error) {
        console.error("Error fetching member:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [memberId]);

  const getStatusBadge = (status: MemberStatus | SubscriptionStatus) => {
    const variants = {
      active: "status-active",
      suspended: "status-suspended",
      cancelled: "status-cancelled",
      overdue: "status-overdue",
      paused: "status-suspended"
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="space-y-6" role="main" aria-label="Loading member details">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start space-x-6">
              <Skeleton className="skeleton-avatar w-20 h-20" aria-hidden="true" />
              <div className="space-y-3 flex-1">
                <Skeleton className="skeleton-text w-48 h-6" aria-hidden="true" />
                <Skeleton className="skeleton-text w-32 h-4" aria-hidden="true" />
                <Skeleton className="skeleton-text w-64 h-4" aria-hidden="true" />
              </div>
            </div>
            <span className="sr-only">Loading member profile information</span>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!member) {
    return (
      <div 
        className="text-center py-12"
        role="main"
        aria-label="Member not found"
      >
        <User className="h-12 w-12 text-muted-foreground opacity-50 mx-auto mb-3" aria-hidden="true" />
        <p className="text-muted-foreground">User not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6" role="main" aria-labelledby="member-name">
      {/* User Profile Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2" id="profile-section-title">
              <User className="h-5 w-5" aria-hidden="true" />
              <span>User Profile</span>
            </CardTitle>
            <Button 
              variant="outline" 
              asChild
              aria-label={`Edit profile for ${member.name}`}
            >
              <Link href={`/members/${memberId}/edit`}>
                <Edit className="h-4 w-4 mr-2" aria-hidden="true" />
                Edit Profile
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-start space-x-6">
            {/* Avatar */}
            <div 
              className="w-20 h-20 bg-muted rounded-full flex items-center justify-center"
              role="img"
              aria-label={`Profile picture for ${member.name}`}
            >
              <User className="h-10 w-10 text-muted-foreground" aria-hidden="true" />
            </div>
            
            {/* User Info */}
            <div className="flex-1 space-y-4">
              <div>
                <h2 className="text-2xl font-bold text-foreground" id="member-name">
                  {member.name}
                </h2>
                <div className="flex items-center space-x-4 mt-2">
                  <div aria-label={`Account status: ${member.status}`}>
                    {getStatusBadge(member.status)}
                  </div>
                  {member.isOverdue && (
                    <Badge 
                      variant="destructive" 
                      className="flex items-center space-x-1"
                      aria-label="Payment overdue - requires attention"
                    >
                      <AlertTriangle className="h-3 w-3" aria-hidden="true" />
                      <span>Payment Overdue</span>
                    </Badge>
                  )}
                  <span 
                    className="text-sm text-muted-foreground"
                    aria-label={`Monthly revenue: ${formatCurrency(member.monthlyRevenue)}`}
                  >
                    Monthly Revenue: {formatCurrency(member.monthlyRevenue)}
                  </span>
                </div>
              </div>
              
              {/* Contact Info */}
              <div 
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
                role="group"
                aria-label="Contact information"
              >
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  <span className="text-sm">{member.email}</span>
                  <span className="sr-only">Email address</span>
                </div>
                {member.phone && (
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                    <span className="text-sm">{member.phone}</span>
                    <span className="sr-only">Phone number</span>
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  <span className="text-sm">
                    Joined <time dateTime={member.createdAt}>{formatDate(member.createdAt)}</time>
                  </span>
                </div>
              </div>

              {/* Quick Stats */}
              <div 
                className="grid grid-cols-3 gap-4 pt-4 border-t border-border"
                role="group"
                aria-label="Account statistics"
              >
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground" aria-label={`${member.totalSubscriptions} active subscriptions`}>
                    {member.totalSubscriptions}
                  </div>
                  <div className="text-xs text-muted-foreground">Active Subscriptions</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground" aria-label={`${member.vehicles.length} registered vehicles`}>
                    {member.vehicles.length}
                  </div>
                  <div className="text-xs text-muted-foreground">Registered Vehicles</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground" aria-label={`${formatCurrency(member.monthlyRevenue)} monthly revenue`}>
                    {formatCurrency(member.monthlyRevenue)}
                  </div>
                  <div className="text-xs text-muted-foreground">Monthly Revenue</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subscriptions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2" id="subscriptions-section-title">
              <CreditCard className="h-5 w-5" aria-hidden="true" />
              <span>Subscriptions ({member.subscriptions.length})</span>
            </CardTitle>
            <Button 
              variant="outline" 
              size="sm"
              aria-label={`Add new subscription for ${member.name}`}
            >
              Add Subscription
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {member.subscriptions.length === 0 ? (
            <div 
              className="text-center py-12"
              role="region"
              aria-labelledby="subscriptions-section-title"
            >
              <CreditCard className="h-12 w-12 text-muted-foreground opacity-50 mx-auto mb-3" aria-hidden="true" />
              <p className="text-muted-foreground">No active subscriptions</p>
            </div>
          ) : (
            <Table
              role="table"
              aria-labelledby="subscriptions-section-title"
              aria-describedby="subscriptions-table-description"
            >
              <div id="subscriptions-table-description" className="sr-only">
                Table showing {member.subscriptions.length} subscriptions for {member.name}, including vehicle details, plan information, amounts, status, and billing dates.
              </div>
              
              <TableHeader>
                <TableRow className="data-table-header" role="row">
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
                    <span className="sr-only">(Cost and billing frequency)</span>
                  </TableHead>
                  <TableHead role="columnheader" scope="col">
                    Status
                    <span className="sr-only">(Current subscription status)</span>
                  </TableHead>
                  <TableHead role="columnheader" scope="col">
                    Next Billing
                    <span className="sr-only">(Next billing date)</span>
                  </TableHead>
                  <TableHead role="columnheader" scope="col" className="text-right">
                    Actions
                    <span className="sr-only">(View and edit options)</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {member.subscriptions.map((subscription, index) => (
                  <TableRow 
                    key={subscription.id} 
                    className="data-table-row" 
                    role="row"
                    aria-rowindex={index + 1}
                  >
                    <TableCell role="cell">
                      <div className="flex items-center space-x-3">
                        <Car className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                        <div>
                          <p className="font-medium">
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
                      <div aria-label={`Subscription status: ${subscription.status}`}>
                        {getStatusBadge(subscription.status)}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground" role="cell">
                      <time dateTime={subscription.nextBillingDate}>
                        {formatDate(subscription.nextBillingDate)}
                      </time>
                    </TableCell>
                    <TableCell role="cell">
                      <div 
                        className="flex items-center justify-end space-x-1"
                        role="group"
                        aria-label={`Actions for ${subscription.vehicle.year} ${subscription.vehicle.make} ${subscription.vehicle.model} subscription`}
                      >
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          asChild
                          aria-label={`View subscription details for ${subscription.vehicle.year} ${subscription.vehicle.make} ${subscription.vehicle.model}`}
                        >
                          <Link href={`/subscriptions/${subscription.id}`}>
                            View
                          </Link>
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          asChild
                          aria-label={`Edit subscription for ${subscription.vehicle.year} ${subscription.vehicle.make} ${subscription.vehicle.model}`}
                        >
                          <Link href={`/subscriptions/${subscription.id}/edit`}>
                            Edit
                          </Link>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}