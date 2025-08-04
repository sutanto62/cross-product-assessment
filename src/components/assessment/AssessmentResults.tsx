"use client";

import { useMemo } from 'react';
import { PolarGrid, PolarAngleAxis, Radar, RadarChart } from "recharts";
import { ClipboardCopy, Download } from 'lucide-react';

import type { Product, AssessmentScores } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from '@/components/ui/separator';
import { useToast } from "@/hooks/use-toast";

interface AssessmentResultsProps {
  product: Product | null;
  scores: AssessmentScores | null;
  suggestions: string | null;
  isLoading: boolean;
}

const chartConfig = {
  score: {
    label: "Score",
    color: "hsl(var(--accent))",
  },
} satisfies ChartConfig;

export default function AssessmentResults({ product, scores, suggestions, isLoading }: AssessmentResultsProps) {
  const { toast } = useToast();

  const chartData = useMemo(() => {
    if (!scores) return [];
    return [
      { scope: "Business", score: scores.business },
      { scope: "Technical", score: scores.technical },
      { scope: "Hands-on", score: scores.handsOn },
    ];
  }, [scores]);

  const handleShare = () => {
    if (!product || !scores) return;
    const textToCopy = `My Skills Compass Assessment for ${product.name}:\n- Business: ${scores.business}/5\n- Technical: ${scores.technical}/5\n- Hands-on: ${scores.handsOn}/5`;
    navigator.clipboard.writeText(textToCopy);
    toast({
      title: "Copied to clipboard!",
      description: "You can now share your assessment results.",
    });
  };
  
  const handleSave = () => {
    toast({
      title: "Assessment Saved",
      description: "Your assessment results have been saved (simulation).",
    });
  };

  if (!product) {
    return (
      <Card className="min-h-[500px] flex items-center justify-center border-dashed">
        <CardContent className="text-center">
            <div className="text-5xl mb-4">🧭</div>
            <p className="text-muted-foreground font-headline text-xl">Your journey awaits</p>
            <p className="text-muted-foreground">Select a product to chart your skills.</p>
        </CardContent>
      </Card>
    );
  }

  if (!scores) {
     return (
      <Card className="min-h-[500px] flex items-center justify-center border-dashed">
        <CardContent className="text-center">
          <p className="text-5xl mb-4">📊</p>
          <p className="text-muted-foreground font-headline text-xl">Ready for your results?</p>
          <p className="text-muted-foreground">Complete your assessment and click "View My Assessment".</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="sticky top-8">
      <CardHeader>
        <CardTitle className="font-headline">Your Assessment for {product.name}</CardTitle>
        <CardDescription>Here's a visual breakdown of your self-assessed knowledge.</CardDescription>
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
