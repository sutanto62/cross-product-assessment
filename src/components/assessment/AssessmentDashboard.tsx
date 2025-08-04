"use client";

import { useState } from 'react';
import type { Product, AssessmentScores } from '@/types';
import { generateImprovementSuggestions } from '@/ai/flows/generate-improvement-suggestions';

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import AssessmentResults from './AssessmentResults';
import ProductAssessmentCard from './ProductAssessmentCard';

const MOCK_PRODUCTS: Product[] = [
  { id: 'prod1', name: 'Agen', description: 'Manages agent network and performance.' },
  { id: 'prod2', name: 'Duta', description: 'Brand ambassador and promotion platform.' },
  { id: 'prod3', name: 'Estate', description: 'Platform for managing estates.' },
  { id: 'prod4', name: 'Mitra', description: 'Partner relationship management.' },
  { id: 'prod5', name: 'Petani', description: 'Tools and resources for farmers.' },
  { id: 'prod6', name: 'Supir', description: 'Driver management and logistics.' },
  { id: 'prod7', name: 'KebunPro', description: 'Professional plantation management suite.' },
];

export default function AssessmentDashboard() {
  const [scores, setScores] = useState<Record<string, AssessmentScores>>(
    MOCK_PRODUCTS.reduce((acc, product) => {
        acc[product.id] = { business: 1, technical: 1, handsOn: 1 };
        return acc;
    }, {} as Record<string, AssessmentScores>)
  );
  const [submittedScores, setSubmittedScores] = useState<Record<string, AssessmentScores> | null>(null);
  const [suggestions, setSuggestions] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleScoreChange = (productId: string, scope: keyof AssessmentScores, value: number) => {
    setScores(prev => ({
        ...prev,
        [productId]: {
            ...prev[productId],
            [scope]: value
        }
    }));
  };

  const handleGenerate = async () => {
    setIsLoading(true);
    setSubmittedScores(scores);
    setSuggestions(null);

    const productAssessments = Object.entries(scores).map(([productId, productScores]) => {
        const product = MOCK_PRODUCTS.find(p => p.id === productId)!;
        return {
            productName: product.name,
            businessScore: productScores.business,
            technicalScore: productScores.technical,
            handsOnScore: productScores.handsOn,
        };
    });

    try {
      const result = await generateImprovementSuggestions({
        assessments: productAssessments,
      });
      setSuggestions(result.suggestions);
    } catch (error) {
      console.error("Error generating suggestions:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate improvement suggestions. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Product Assessments</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {MOCK_PRODUCTS.map(product => (
              <ProductAssessmentCard 
                key={product.id}
                product={product}
                scores={scores[product.id]}
                onScoreChange={handleScoreChange}
              />
            ))}
          </CardContent>
          <CardFooter className="flex-col items-stretch gap-4">
              <Button onClick={handleGenerate} disabled={isLoading} className="w-full bg-primary hover:bg-primary/90 text-lg py-6">
                {isLoading ? 'Generating...' : 'View My Aggregate Assessment'}
              </Button>
          </CardFooter>
        </Card>
      </div>
      <div className="sticky top-8">
        <AssessmentResults
          scores={submittedScores}
          suggestions={suggestions}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
