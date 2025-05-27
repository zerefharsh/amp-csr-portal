// db.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseKey)

/**
 * Test the Supabase connection by performing a simple query
 * @returns Promise<boolean> - true if connection successful, false otherwise
 */
export async function testConnection(): Promise<boolean> {
  try {
    console.log('🔄 Testing Supabase connection...')

    // Simple test query - count rows in members table (doesn't matter if it's empty)
    const { data, error, count } = await supabase
      .from('members')
      .select('id', { count: 'exact', head: true })

    if (error) {
      console.error('Supabase connection test failed:', error.message)
      return false
    }

    console.log('Supabase connection successful!')
    console.log(`Members table accessible (${count || 0} records found)`)
    return true
  } catch (err) {
    console.error('Supabase connection test error:', err)
    return false
  }
}

function toCamelCase(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
}

// Transform object keys from snake_case to camelCase
function transformKeys<T = any>(obj: any): T {
  if (obj === null || obj === undefined) return obj
  if (Array.isArray(obj)) return obj.map(transformKeys) as T
  if (typeof obj !== 'object') return obj

  const transformed: any = {}
  for (const [key, value] of Object.entries(obj)) {
    const camelKey = toCamelCase(key)
    transformed[camelKey] = transformKeys(value)
  }
  return transformed as T
}

export async function getMembers(filters: { search?: string; status?: string } = {}, page = 1, limit = 10) {
  let query = supabase
    .from('members')
    .select('*', { count: 'exact' })

  if (filters.search) {
    query = query.or(`name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`)
  }

  if (filters.status) {
    query = query.eq('status', filters.status)
  }

  const from = (page - 1) * limit
  const to = from + limit - 1

  const { data, error, count } = await query.range(from, to)
  if (error) throw error

  return {
    data: transformKeys(data || []),
    total: count || 0,
    page,
    limit,
    totalPages: Math.ceil((count || 0) / limit)
  }
}

export async function getMemberById(id: string) {
  const { data, error } = await supabase
    .from('members')
    .select(`
    *,
    subscriptions(
      *,
      vehicle:vehicles(*)
    ),
    vehicles(*)
  `)
    .eq('id', id)
    .maybeSingle();

  if (error) throw error

  const transformed = transformKeys(data)
  // Ensure recentActivity exists
  transformed.recentActivity = transformed.recentActivity || []

  return transformed
}

// Subscription Methods
export async function getSubscriptions(filters: { search?: string; status?: string; planName?: string } = {}, page = 1, limit = 10) {
  let query = supabase
    .from('subscriptions')
    .select(`
      *,
      member:members!inner(id, name, email, phone, status),
      vehicle:vehicles!inner(*)
    `, { count: 'exact' })

  if (filters.search) {
    query = query.or(`
      member.name.ilike.%${filters.search}%,
      member.email.ilike.%${filters.search}%,
      vehicle.license_plate.ilike.%${filters.search}%
    `)
  }

  if (filters.status) {
    query = query.eq('status', filters.status)
  }

  if (filters.planName) {
    query = query.eq('plan_name', filters.planName)
  }

  const from = (page - 1) * limit
  const to = from + limit - 1

  const { data, error, count } = await query.range(from, to)
  if (error) throw error

  return {
    data: transformKeys(data || []),
    total: count || 0,
    page,
    limit,
    totalPages: Math.ceil((count || 0) / limit)
  }
}

export async function getSubscriptionById(id: string) {
  const { data, error } = await supabase
    .from('subscriptions')
    .select(`
      *,
      member:members!inner(id, name, email, phone, status),
      vehicle:vehicles!inner(*)
    `)
    .eq('id', id)
    .single()

  if (error) throw error
  return transformKeys(data)
}

// Vehicle Methods
export async function getVehiclesByMemberId(memberId: string) {
  const { data, error } = await supabase
    .from('vehicles')
    .select('*')
    .eq('member_id', memberId)

  if (error) throw error
  return transformKeys(data || [])
}

// Support Ticket Methods
export async function getSupportTickets(filters: { search?: string; status?: string; priority?: string; category?: string } = {}) {
  let query = supabase
    .from('support_tickets')
    .select(`
      *,
      member:members(id, name, email)
    `);

  if (filters.search) {
    query = query.or(`
      customer_name.ilike.%${filters.search}%,
      customer_email.ilike.%${filters.search}%,
      subject.ilike.%${filters.search}%,
      id.ilike.%${filters.search}%
    `)
  }

  if (filters.status && filters.status !== 'all') {
    query = query.eq('status', filters.status)
  }

  if (filters.priority && filters.priority !== 'all') {
    query = query.eq('priority', filters.priority)
  }

  if (filters.category && filters.category !== 'all') {
    query = query.eq('category', filters.category)
  }

  const { data, error } = await query.order('created_at', { ascending: false })
  if (error) throw error

  return transformKeys(data || [])
}

// Dashboard Methods
export async function getDashboardMetrics() {
  const { count: totalMembers } = await supabase
    .from('members')
    .select('*', { count: 'exact', head: true })

  const { count: activeMembers } = await supabase
    .from('members')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'active')

  const { count: totalSubscriptions } = await supabase
    .from('subscriptions')
    .select('*', { count: 'exact', head: true })

  const { count: activeSubscriptions } = await supabase
    .from('subscriptions')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'active')

  const { count: overdueSubscriptions } = await supabase
    .from('subscriptions')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'overdue')

  const { data: revenueData } = await supabase
    .from('subscriptions')
    .select('amount')
    .eq('status', 'active')

  const monthlyRevenue = revenueData?.reduce((sum, sub) => sum + (sub.amount || 0), 0) || 0

  return {
    totalMembers: totalMembers || 0,
    activeMembers: activeMembers || 0,
    totalSubscriptions: totalSubscriptions || 0,
    activeSubscriptions: activeSubscriptions || 0,
    overdueSubscriptions: overdueSubscriptions || 0,
    monthlyRevenue,
    memberGrowth: { value: 0, percentage: 0, trend: 'stable' as const },
    subscriptionGrowth: { value: 0, percentage: 0, trend: 'stable' as const },
    revenueGrowth: { value: 0, percentage: 0, trend: 'stable' as const }
  }
}

// Member CRUD Operations
export async function updateMember(id: string, updates: Partial<{
  name: string;
  email: string;
  phone: string;
  status: string;
}>) {
  // Convert camelCase to snake_case for database
  const dbUpdates: any = {};

  if (updates.name !== undefined) dbUpdates.name = updates.name;
  if (updates.email !== undefined) dbUpdates.email = updates.email;
  if (updates.phone !== undefined) dbUpdates.phone = updates.phone;
  if (updates.status !== undefined) dbUpdates.status = updates.status;

  // Always update the updated_at timestamp
  dbUpdates.updated_at = new Date().toISOString();

  const { data, error } = await supabase
    .from('members')
    .update(dbUpdates)
    .eq('id', id)
    .select('*')
    .single();

  if (error) throw error;

  // Transform back to camelCase
  return transformKeys(data);
}

// Do we need single finds without inner data? 
// maybe save data transfer otherwise negligible ^^?

// export async function getMemberInfoById(id: string) {
//   const { data, error } = await supabase
//     .from('members')
//     .select(`
//       id,
//       name,
//       email,
//       phone,
//       status,
//       created_at,
//       updated_at,
//       last_activity,
//       total_subscriptions,
//       monthly_revenue,
//       is_overdue
//     `)
//     .eq('id', id)
//     .single();

//   if (error) throw error;

//   // Transform to camelCase
//   return transformKeys(data);
// }

// Export supabase client as default for easy importing
export default supabase;