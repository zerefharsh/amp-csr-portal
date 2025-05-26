import { MainLayout } from "@/components/layout/main-layout";
import { ReportsDashboard } from "@/components/reports/reports-dashboard";

export default function ReportsPage() {
  return (
    <MainLayout 
      title="Reports & Analytics" 
      subtitle="Generate comprehensive reports and analyze key business metrics"
    >
      <ReportsDashboard />
    </MainLayout>
  );
}