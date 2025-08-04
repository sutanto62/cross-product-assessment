"use client";

import { useMemo } from 'react';
import { PolarGrid, PolarAngleAxis, Radar, RadarChart } from "recharts";
import { ClipboardCopy, Download } from 'lucide-react';

import type { AssessmentScores } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from '@/components/ui/separator';
import { useToast } from "@/hooks/use-toast";

interface AssessmentResultsProps {
  scores: Record<string, AssessmentScores> | null;
  suggestions: string | null;
  isLoading: boolean;
}

const chartConfig = {
  score: {
    label: "Score",
    color: "hsl(var(--accent))",
  },
} satisfies ChartConfig;

export default function AssessmentResults({ scores, suggestions, isLoading }: AssessmentResultsProps) {
  const { toast } = useToast();

  const aggregateScores = useMemo(() => {
    if (!scores) return null;
    
    const productIds = Object.keys(scores);
    const numProducts = productIds.length;
    if (numProducts === 0) return { business: 0, technical: 0, handsOn: 0 };

    const totalScores = productIds.reduce((acc, productId) => {
        acc.business += scores[productId].business;
        acc.technical += scores[productId].technical;
        acc.handsOn += scores[productId].handsOn;
        return acc;
    }, { business: 0, technical: 0, handsOn: 0 });

    return {
        business: totalScores.business / numProducts,
        technical: totalScores.technical / numProducts,
        handsOn: totalScores.handsOn / numProducts,
    };
  }, [scores]);

  const chartData = useMemo(() => {
    if (!aggregateScores) return [];
    return [
      { scope: "Business", score: aggregateScores.business },
      { scope: "Technical", score: aggregateScores.technical },
      { scope: "Hands-on", score: aggregateScores.handsOn },
    ];
  }, [aggregateScores]);

  const handleShare = () => {
    if (!aggregateScores) return;
    const textToCopy = `My Aggregated Skills Compass Assessment:\n- Business: ${aggregateScores.business.toFixed(1)}/5\n- Technical: ${aggregateScores.technical.toFixed(1)}/5\n- Hands-on: ${aggregateScores.handsOn.toFixed(1)}/5`;
    navigator.clipboard.writeText(textToCopy);
    toast({
      title: "Copied to clipboard!",
      description: "You can now share your aggregated assessment results.",
    });
  };
  
  const handleSave = () => {
    toast({
      title: "Assessment Saved",
      description: "Your assessment results have been saved (simulation).",
    });
  };

  if (!scores) {
     return (
      <Card className="min-h-[500px] flex items-center justify-center border-dashed">
        <CardContent className="text-center">
          <p className="text-5xl mb-4">📊</p>
          <p className="text-muted-foreground font-headline text-xl">Ready for your results?</p>
          <p className="text-muted-foreground">Complete your assessments and click the button to see your aggregate score.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Your Aggregated Assessment</CardTitle>
        <CardDescription>Here's a visual breakdown of your average scores across all products.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[300px]">
          <RadarChart data={chartData} domain={[0, 5]}>
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
            <PolarAngleAxis dataKey="scope" />
            <PolarGrid />
            <Radar
              dataKey="score"
              fill="var(--color-score)"
              fillOpacity={0.6}
              stroke="var(--color-score)"
            />
          </RadarChart>
        </ChartContainer>
        
        <Separator />

        <div>
            <h3 className="font-headline text-lg mb-2">AI-Powered Suggestions</h3>
            {isLoading && (
                 <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-4/5" />
                </div>
            )}
            {suggestions && (
                <div className="text-sm bg-muted/50 p-4 rounded-lg prose prose-sm max-w-none">
                    <p>{suggestions}</p>
                </div>
            )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
          <Button variant="outline" onClick={handleSave}>
              <Download className="mr-2 h-4 w-4"/>
              Save
          </Button>
          <Button onClick={handleShare}>
              <ClipboardCopy className="mr-2 h-4 w-4"/>
              Share
          </Button>
      </CardFooter>
    </Card>
  );
}
