import { MainLayout } from "@/components/layout/main-layout";
import { SubscriptionDetailClient } from "@/components/subscriptions/subscription-detail-client";

interface SubscriptionDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function SubscriptionDetailPage({ params }: SubscriptionDetailPageProps) {
  const { id } = await params;
  
  return (
    <MainLayout 
      title="Subscription Details" 
      subtitle={`Subscription ID: ${id}`}
    >
      <SubscriptionDetailClient subscriptionId={id} />
    </MainLayout>
  );
}