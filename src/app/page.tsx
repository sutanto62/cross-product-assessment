import AssessmentDashboard from '@/components/assessment/AssessmentDashboard';
import Header from '@/components/layout/Header';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-8">
        <AssessmentDashboard />
      </main>
    </div>
  );
}
