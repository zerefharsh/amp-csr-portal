import { MainLayout } from "@/components/layout/main-layout";
import { SupportDashboard } from "@/components/support/support-dashboard";

export default function SupportPage() {
  return (
    <MainLayout 
      title="Support" 
      subtitle="Customer support tools and ticket management"
    >
      <SupportDashboard />
    </MainLayout>
  );
}