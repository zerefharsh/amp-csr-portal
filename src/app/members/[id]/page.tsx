import { MainLayout } from "@/components/layout/main-layout";
import { MemberDetailClient } from "@/components/members/member-detail-client";

interface MemberDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function MemberDetailPage({ params }: MemberDetailPageProps) {
  const { id } = await params;
  return (
    <MainLayout 
      title="User Details" 
      subtitle={`Customer ID: ${id}`}
    >
      <MemberDetailClient memberId={id} />
    </MainLayout>
  );
}