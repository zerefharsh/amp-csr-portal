// Core entity types for AMP CSR Portal

export interface Member {
  id: string;
  email: string;
  name: string;
  phone?: string;
  status: MemberStatus;
  createdAt: string;
  updatedAt: string;
  lastActivity: string;
  // Calculated fields
  totalSubscriptions: number;
  monthlyRevenue: number;
  isOverdue: boolean;
}

export interface Vehicle {
  id: string;
  memberId: string;
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  color?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Subscription {
  id: string;
  memberId: string;
  vehicleId: string;
  planName: string;
  amount: number;
  status: SubscriptionStatus;
  billingCycle: BillingCycle;
  nextBillingDate: string;
  startDate: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
  // Related data
  member?: Member;
  vehicle?: Vehicle;
}

export interface SupportTicket {
  id: string;
  subject: string;
  description: string;
  status: "open" | "in_progress" | "resolved" | "closed";
  priority: "high" | "medium" | "low";
  category: "billing" | "technical" | "account" | "general";
  member: {
    id: string;
    name: string;
    email: string;
  };
  assignedTo: string;
  createdAt: string;
  lastResponse?: string;
}

// Enums and union types
export type MemberStatus = 'active' | 'suspended' | 'cancelled';
export type SubscriptionStatus = 'active' | 'paused' | 'overdue' | 'cancelled';
export type BillingCycle = 'monthly' | 'yearly';

// Extended types with relationships
export interface MemberWithDetails extends Member {
  subscriptions: SubscriptionWithVehicle[];
  vehicles: Vehicle[];
  recentActivity: never[]; // Simplified - no activity tracking
}

export interface SubscriptionWithDetails extends Omit<Subscription, 'member'> {
  member: Pick<Member, 'id' | 'name' | 'email' | 'phone' | 'status'>;
  vehicle: Vehicle;
}

export interface SubscriptionWithVehicle extends Subscription {
  vehicle: Vehicle;
}

// Dashboard metrics types
export interface DashboardMetrics {
  totalMembers: number;
  activeMembers: number;
  totalSubscriptions: number;
  activeSubscriptions: number;
  overdueSubscriptions: number;
  monthlyRevenue: number;
  memberGrowth: MetricChange;
  subscriptionGrowth: MetricChange;
  revenueGrowth: MetricChange;
}

export interface MetricChange {
  value: number;
  percentage: number;
  trend: 'up' | 'down' | 'stable';
}

// API response types
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Search and filter types
export interface MemberFilters {
  search?: string;
  status?: MemberStatus;
}

export interface SubscriptionFilters {
  search?: string;
  status?: SubscriptionStatus;
  planName?: string;
}

// Export commonly used composed types
export type MembersListResponse = PaginatedResponse<Member>;
export type SubscriptionsListResponse = PaginatedResponse<SubscriptionWithDetails>;

// Constants for validation and UI
export const MEMBER_STATUSES: MemberStatus[] = ['active', 'suspended', 'cancelled'];
export const SUBSCRIPTION_STATUSES: SubscriptionStatus[] = ['active', 'paused', 'overdue', 'cancelled'];
export const BILLING_CYCLES: BillingCycle[] = ['monthly', 'yearly'];
