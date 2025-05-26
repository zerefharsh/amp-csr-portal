import { MainLayout } from "@/components/layout/main-layout";
import { SubscriptionsTable } from "@/components/subscriptions/subscriptions-table";

export default function SubscriptionsPage() {
  return (
    <MainLayout 
      title="Subscriptions" 
      subtitle="Manage all customer vehicle subscriptions"
    >
      <SubscriptionsTable />
    </MainLayout>
  );
}