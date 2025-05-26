import { MainLayout } from "@/components/layout/main-layout";
import { SubscriptionEditForm } from "@/components/subscriptions/subscription-edit-form";

interface SubscriptionEditPageProps {
  params: Promise<{ id: string }>;
}

export default async function SubscriptionEditPage({ params }: SubscriptionEditPageProps) {
  const { id } = await params;
  return (
    <MainLayout 
      title="Edit Subscription" 
      subtitle={`Modify subscription details for ID: ${id}`}
    >
      <SubscriptionEditForm subscriptionId={id} />
    </MainLayout>
  );
}