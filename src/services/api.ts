import { 
  Member, 
  MemberWithDetails, 
  SubscriptionWithDetails, 
  DashboardMetrics, 
  MembersListResponse, 
  SubscriptionsListResponse,
  MemberFilters,
  SubscriptionFilters 
} from "@/types";

// Static Members Data
const MOCK_MemberS: Member[] = [
  {
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
  },
  {
    id: "2", 
    name: "Emily Davis",
    email: "emily.davis@email.com",
    phone: "(555) 987-6543",
    status: "active",
    createdAt: "2024-01-10T09:15:00Z",
    updatedAt: "2024-01-18T11:20:00Z",
    lastActivity: "2024-01-18T11:20:00Z",
    totalSubscriptions: 1,
    monthlyRevenue: 29.99,
    isOverdue: false,
  },
  {
    id: "3",
    name: "Michael Johnson",
    email: "michael.j@email.com",
    phone: "(555) 456-7890",
    status: "active",
    createdAt: "2024-01-05T16:45:00Z",
    updatedAt: "2024-01-12T08:30:00Z",
    lastActivity: "2024-01-12T08:30:00Z",
    totalSubscriptions: 1,
    monthlyRevenue: 29.99,
    isOverdue: true,
  },
  {
    id: "4",
    name: "Sarah Wilson",
    email: "sarah.wilson@email.com",
    phone: "(555) 321-0987",
    status: "suspended",
    createdAt: "2023-12-28T13:20:00Z",
    updatedAt: "2024-01-15T09:10:00Z",
    lastActivity: "2024-01-15T09:10:00Z",
    totalSubscriptions: 0,
    monthlyRevenue: 0,
    isOverdue: false,
  },
  {
    id: "5",
    name: "David Brown",
    email: "david.brown@email.com", 
    phone: "(555) 654-3210",
    status: "cancelled",
    createdAt: "2023-12-20T11:30:00Z",
    updatedAt: "2024-01-08T15:45:00Z",
    lastActivity: "2024-01-08T15:45:00Z",
    totalSubscriptions: 0,
    monthlyRevenue: 0,
    isOverdue: false,
  },
];

// Static Subscriptions Data
const MOCK_SUBSCRIPTIONS: SubscriptionWithDetails[] = [
  {
    id: "sub1",
    memberId: "1",
    vehicleId: "veh1",
    planName: "Premium Wash",
    amount: 29.99,
    status: "active",
    billingCycle: "monthly",
    nextBillingDate: "2024-02-15T00:00:00Z",
    startDate: "2024-01-15T00:00:00Z",
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-20T14:45:00Z",
    member: {
      id: "1",
      name: "John Smith",
      email: "john.smith@email.com",
      phone: "(555) 123-4567",
      status: "active"
    },
    vehicle: {
      id: "veh1",
      memberId: "1",
      make: "BMW",
      model: "X5",
      year: 2022,
      licensePlate: "ABC-123",
      color: "Black",
      createdAt: "2024-01-15T10:30:00Z",
      updatedAt: "2024-01-15T10:30:00Z",
    }
  },
  {
    id: "sub2",
    memberId: "1", 
    vehicleId: "veh2",
    planName: "Basic Wash",
    amount: 19.99,
    status: "active",
    billingCycle: "monthly",
    nextBillingDate: "2024-02-20T00:00:00Z",
    startDate: "2024-01-20T00:00:00Z",
    createdAt: "2024-01-20T14:45:00Z",
    updatedAt: "2024-01-20T14:45:00Z",
    member: {
      id: "1",
      name: "John Smith",
      email: "john.smith@email.com",
      phone: "(555) 123-4567",
      status: "active"
    },
    vehicle: {
      id: "veh2",
      memberId: "1",
      make: "Honda",
      model: "Civic",
      year: 2021,
      licensePlate: "XYZ-789",
      color: "White",
      createdAt: "2024-01-20T14:45:00Z",
      updatedAt: "2024-01-20T14:45:00Z",
    }
  },
  {
    id: "sub3",
    memberId: "2", 
    vehicleId: "veh3",
    planName: "Premium Wash",
    amount: 29.99,
    status: "overdue",
    billingCycle: "monthly",
    nextBillingDate: "2024-01-25T00:00:00Z",
    startDate: "2024-01-10T00:00:00Z",
    createdAt: "2024-01-10T09:15:00Z",
    updatedAt: "2024-01-18T11:20:00Z",
    member: {
      id: "2",
      name: "Emily Davis",
      email: "emily.davis@email.com",
      phone: "(555) 987-6543",
      status: "active"
    },
    vehicle: {
      id: "veh3",
      memberId: "2",
      make: "Tesla",
      model: "Model 3",
      year: 2023,
      licensePlate: "TES-001",
      color: "Blue",
      createdAt: "2024-01-10T09:15:00Z",
      updatedAt: "2024-01-10T09:15:00Z",
    }
  },
  {
    id: "sub4",
    memberId: "3", 
    vehicleId: "veh4",
    planName: "Basic Wash",
    amount: 19.99,
    status: "paused",
    billingCycle: "monthly",
    nextBillingDate: "2024-03-01T00:00:00Z",
    startDate: "2024-01-05T00:00:00Z",
    createdAt: "2024-01-05T16:45:00Z",
    updatedAt: "2024-01-12T08:30:00Z",
    member: {
      id: "3",
      name: "Michael Johnson",
      email: "michael.j@email.com",
      phone: "(555) 456-7890",
      status: "active"
    },
    vehicle: {
      id: "veh4",
      memberId: "3",
      make: "Ford",
      model: "F-150",
      year: 2020,
      licensePlate: "FRD-456",
      color: "Red",
      createdAt: "2024-01-05T16:45:00Z",
      updatedAt: "2024-01-05T16:45:00Z",
    }
  },
  {
    id: "sub5",
    memberId: "4", 
    vehicleId: "veh5",
    planName: "Premium Wash",
    amount: 29.99,
    status: "cancelled",
    billingCycle: "monthly",
    nextBillingDate: "2024-02-28T00:00:00Z",
    startDate: "2023-12-28T00:00:00Z",
    endDate: "2024-01-15T00:00:00Z",
    createdAt: "2023-12-28T13:20:00Z",
    updatedAt: "2024-01-15T09:10:00Z",
    member: {
      id: "4",
      name: "Sarah Wilson",
      email: "sarah.wilson@email.com",
      phone: "(555) 321-0987",
      status: "suspended"
    },
    vehicle: {
      id: "veh5",
      memberId: "4",
      make: "Audi",
      model: "A4",
      year: 2021,
      licensePlate: "AUD-789",
      color: "Silver",
      createdAt: "2023-12-28T13:20:00Z",
      updatedAt: "2023-12-28T13:20:00Z",
    }
  }
];

// Static Support Tickets Data
interface SupportTicket {
  id: string;
  customer: {
    id: string;
    name: string;
    email: string;
  };
  subject: string;
  description: string;
  priority: "high" | "medium" | "low";
  status: "open" | "in_progress" | "resolved" | "closed";
  category: "billing" | "technical" | "account";
  createdAt: string;
  assignedTo: string;
  lastResponse: string;
}

const MOCK_SUPPORT_TICKETS: SupportTicket[] = [
  {
    id: "T-001",
    customer: {
      id: "1",
      name: "John Smith",
      email: "john.smith@email.com"
    },
    subject: "Payment failed for subscription",
    description: "Customer's credit card was declined for monthly subscription payment",
    priority: "high",
    status: "open",
    category: "billing",
    createdAt: "2024-01-25T10:30:00Z",
    assignedTo: "Sarah Johnson",
    lastResponse: "2024-01-25T11:15:00Z"
  },
  {
    id: "T-002",
    customer: {
      id: "2",
      name: "Emily Davis",
      email: "emily.davis@email.com"
    },
    subject: "Request to transfer subscription",
    description: "Customer wants to transfer subscription from old vehicle to new Tesla Model 3",
    priority: "medium",
    status: "in_progress",
    category: "account",
    createdAt: "2024-01-25T09:45:00Z",
    assignedTo: "Mike Wilson",
    lastResponse: "2024-01-25T10:30:00Z"
  },
  {
    id: "T-003",
    customer: {
      id: "3",
      name: "Michael Johnson",
      email: "michael.j@email.com"
    },
    subject: "Cannot access car wash services",
    description: "Customer reports that wash stations are not recognizing their membership",
    priority: "high",
    status: "open",
    category: "technical",
    createdAt: "2024-01-25T08:20:00Z",
    assignedTo: "Sarah Johnson",
    lastResponse: "2024-01-25T09:00:00Z"
  },
  {
    id: "T-004",
    customer: {
      id: "4",
      name: "Sarah Wilson",
      email: "sarah.wilson@email.com"
    },
    subject: "Refund request for cancelled service",
    description: "Customer requesting refund for remaining days after early cancellation",
    priority: "low",
    status: "resolved",
    category: "billing",
    createdAt: "2024-01-24T16:30:00Z",
    assignedTo: "Jennifer Brown",
    lastResponse: "2024-01-25T08:45:00Z"
  },
  {
    id: "T-005",
    customer: {
      id: "5",
      name: "David Brown",
      email: "david.brown@email.com"
    },
    subject: "Update payment method",
    description: "Customer needs help updating expired credit card information",
    priority: "medium",
    status: "in_progress",
    category: "account",
    createdAt: "2024-01-24T14:15:00Z",
    assignedTo: "Mike Wilson",
    lastResponse: "2024-01-24T15:30:00Z"
  }
];

// Helper function to simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper function to filter Members
const filterMembers = (Members: Member[], filters: MemberFilters) => {
  return Members.filter(member => {
    const matchesSearch = !filters.search || 
      member.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      member.email.toLowerCase().includes(filters.search.toLowerCase());
    
    const matchesStatus = !filters.status || member.status === filters.status;
    
    return matchesSearch && matchesStatus;
  });
};

// Helper function to filter subscriptions
const filterSubscriptions = (subscriptions: SubscriptionWithDetails[], filters: SubscriptionFilters) => {
  return subscriptions.filter(subscription => {
    const matchesSearch = !filters.search || 
      subscription.member.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      subscription.member.email.toLowerCase().includes(filters.search.toLowerCase()) ||
      subscription.vehicle.licensePlate.toLowerCase().includes(filters.search.toLowerCase()) ||
      `${subscription.vehicle.make} ${subscription.vehicle.model}`.toLowerCase().includes(filters.search.toLowerCase());
    
    const matchesStatus = !filters.status || subscription.status === filters.status;
    const matchesPlan = !filters.planName || subscription.planName === filters.planName;
    
    return matchesSearch && matchesStatus && matchesPlan;
  });
};

// API Service
export const apiService = {
  // Dashboard APIs
  async getDashboardMetrics(): Promise<DashboardMetrics> {
    await delay(500);
    
    const activeMembers = MOCK_MemberS.filter(u => u.status === "active").length;
    const activeSubscriptions = MOCK_SUBSCRIPTIONS.filter(s => s.status === "active").length;
    const overdueSubscriptions = MOCK_SUBSCRIPTIONS.filter(s => s.status === "overdue").length;
    const monthlyRevenue = MOCK_SUBSCRIPTIONS
      .filter(s => s.status === "active")
      .reduce((sum, s) => sum + s.amount, 0);
    
    return {
      totalMembers: MOCK_MemberS.length,
      activeMembers,
      totalSubscriptions: MOCK_SUBSCRIPTIONS.length,
      activeSubscriptions,
      overdueSubscriptions,
      monthlyRevenue,
      memberGrowth: { value: 12, percentage: 12, trend: "up" },
      subscriptionGrowth: { value: 8, percentage: 8, trend: "up" },
      revenueGrowth: { value: 23, percentage: 23, trend: "up" }
    };
  },

  // Members APIs
  async getMembers(filters: MemberFilters = {}, page = 1, limit = 10): Promise<MembersListResponse> {
    await delay(300);
    
    const filteredMembers = filterMembers(MOCK_MemberS, filters);
    const total = filteredMembers.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedMembers = filteredMembers.slice(startIndex, endIndex);
    
    return {
      data: paginatedMembers,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  },

  async getMemberById(id: string): Promise<MemberWithDetails> {
    await delay(300);
    
    const member = MOCK_MemberS.find(u => u.id === id);
    if (!member) {
      throw new Error("User not found");
    }
    
    // Get member's subscriptions and convert to SubscriptionWithVehicle type
    const MemberSubscriptions = MOCK_SUBSCRIPTIONS
      .filter(s => s.memberId === id)
      .map(subscription => ({
        id: subscription.id,
        memberId: subscription.memberId,
        vehicleId: subscription.vehicleId,
        planName: subscription.planName,
        amount: subscription.amount,
        status: subscription.status,
        billingCycle: subscription.billingCycle,
        nextBillingDate: subscription.nextBillingDate,
        startDate: subscription.startDate,
        endDate: subscription.endDate,
        createdAt: subscription.createdAt,
        updatedAt: subscription.updatedAt,
        vehicle: subscription.vehicle
      }));
    
    const vehicles = MemberSubscriptions.map(s => s.vehicle);
    
    return {
      ...member,
      subscriptions: MemberSubscriptions,
      vehicles,
      recentActivity: [] // Simplified
    };
  },

  // Subscriptions APIs
  async getSubscriptions(filters: SubscriptionFilters = {}, page = 1, limit = 10): Promise<SubscriptionsListResponse> {
    await delay(300);
    
    const filteredSubscriptions = filterSubscriptions(MOCK_SUBSCRIPTIONS, filters);
    const total = filteredSubscriptions.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedSubscriptions = filteredSubscriptions.slice(startIndex, endIndex);
    
    return {
      data: paginatedSubscriptions,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  },

  async getSubscriptionById(id: string): Promise<SubscriptionWithDetails> {
    await delay(300);
    
    const subscription = MOCK_SUBSCRIPTIONS.find(s => s.id === id);
    if (!subscription) {
      throw new Error("Subscription not found");
    }
    
    return subscription;
  },

  // Support APIs
  async getSupportTickets(filters: any = {}): Promise<SupportTicket[]> {
    await delay(300);
    
    let tickets = [...MOCK_SUPPORT_TICKETS];
    
    if (filters.search) {
      tickets = tickets.filter(ticket => 
        ticket.customer.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        ticket.customer.email.toLowerCase().includes(filters.search.toLowerCase()) ||
        ticket.subject.toLowerCase().includes(filters.search.toLowerCase()) ||
        ticket.id.toLowerCase().includes(filters.search.toLowerCase())
      );
    }
    
    if (filters.status && filters.status !== "all") {
      tickets = tickets.filter(ticket => ticket.status === filters.status);
    }
    
    if (filters.priority && filters.priority !== "all") {
      tickets = tickets.filter(ticket => ticket.priority === filters.priority);
    }
    
    if (filters.category && filters.category !== "all") {
      tickets = tickets.filter(ticket => ticket.category === filters.category);
    }
    
    return tickets;
  }
};

export type { SupportTicket };