import { 
  Member, 
  MemberWithDetails, 
  SubscriptionWithDetails, 
  DashboardMetrics, 
  MembersListResponse, 
  SubscriptionsListResponse,
  MemberFilters,
  SubscriptionFilters,
  SupportTicket,
  MemberStatus
} from "@/types";

import {
  getMembers as dbGetMembers,
  getMemberById as dbGetMemberById,
  updateMember as dbUpdateMember,
  getSubscriptions as dbGetSubscriptions,
  getSubscriptionById as dbGetSubscriptionById,
  getSupportTickets as dbGetSupportTickets,
  getDashboardMetrics as dbGetDashboardMetrics
} from "@/services/db";

// API Service
export const apiService = {
  // Dashboard APIs
  async getDashboardMetrics(): Promise<DashboardMetrics> {
    return await dbGetDashboardMetrics();
  },

  // Members APIs
  async getMembers(filters: MemberFilters = {}, page = 1, limit = 10): Promise<MembersListResponse> {
    return await dbGetMembers(filters, page, limit);
  },

  async getMemberById(id: string): Promise<MemberWithDetails> {
    return await dbGetMemberById(id);
  },

  async updateMember(id: string, updates: Partial<{
    name: string;
    email: string;
    phone: string;
    status: MemberStatus;
  }>): Promise<Member> {
    return await dbUpdateMember(id, updates);
  },

  // Subscriptions APIs
  async getSubscriptions(filters: SubscriptionFilters = {}, page = 1, limit = 10): Promise<SubscriptionsListResponse> {
    return await dbGetSubscriptions(filters, page, limit);
  },

  async getSubscriptionById(id: string): Promise<SubscriptionWithDetails> {
    return await dbGetSubscriptionById(id);
  },

  // Support APIs
  async getSupportTickets(filters: any = {}): Promise<SupportTicket[]> {
    const tickets = await dbGetSupportTickets(filters);
    
    // Transform database format to expected API format
      return tickets.map((ticket: any) => ({
        id: ticket.id,
        member: ticket.member ?? {
            id: '',
            name: '',
            email: ''
        },
        subject: ticket.subject,
        description: ticket.description,
        priority: ticket.priority,
        status: ticket.status,
        category: ticket.category,
        createdAt: ticket.createdAt,
        assignedTo: ticket.assignedTo || '',
        lastResponse: ticket.lastResponse || ticket.createdAt
      }));
  }
};