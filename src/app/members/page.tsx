import { MainLayout } from "@/components/layout/main-layout";
import { MembersTable } from "@/components/members/members-table";

export default function MembersPage() {
  return (
    <MainLayout 
      title="Members" 
      subtitle="Manage customer accounts and subscriptions"
    >
      <MembersTable />
    </MainLayout>
  );
}