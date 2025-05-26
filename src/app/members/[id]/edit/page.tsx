import { MainLayout } from "@/components/layout/main-layout";
import { MemberEditForm } from "@/components/members/member-edit-form";

interface MemberEditPageProps {
  params: Promise<{ id: string }>;
}

export default async function MemberEditPage({ params }: MemberEditPageProps) {
  const { id } = await params;
  
  return (
    <MainLayout 
      title="Edit User" 
      subtitle={`Modify customer details for ID: ${id}`}
    >
      <MemberEditForm memberId={id} />
    </MainLayout>
  );
}