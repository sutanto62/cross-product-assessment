import AssessmentDashboard from '@/components/assessment/AssessmentDashboard';
import Header from '@/components/layout/Header';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-8">
        <h1 className="text-3xl font-bold font-headline mb-2">Skills Self-Assessment</h1>
        <p className="text-muted-foreground mb-8">
          Rate your knowledge for each product on a scale of 1 (Novice) to 5 (Expert). 
          Your results will be aggregated to give you a holistic view of your skills.
        </p>
        <AssessmentDashboard />
      </main>
    </div>
  );
}
