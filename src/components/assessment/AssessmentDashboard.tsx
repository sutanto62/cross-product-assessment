"use client";

import { useState } from 'react';
import type { Product, AssessmentScores } from '@/types';
import { generateImprovementSuggestions } from '@/ai/flows/generate-improvement-suggestions';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import AssessmentResults from './AssessmentResults';

const MOCK_PRODUCTS: Product[] = [
  { id: 'prod1', name: 'Firebase', description: 'Comprehensive app development platform.' },
  { id: 'prod2', name: 'Google Cloud Run', description: 'Serverless container deployment.' },
  { id: 'prod3', name: 'Next.js', description: 'The React framework for the web.' },
  { id: 'prod4', name: 'Genkit', description: 'Go-to developer tool for building with generative AI.' },
];

const SCOPE_DEFINITIONS = {
    business: "Understanding of the product's market position, use cases, and value proposition.",
    technical: "Knowledge of the product's architecture, APIs, and integration capabilities.",
    handsOn: "Practical experience in developing, deploying, and troubleshooting with the product."
}

export default function AssessmentDashboard() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [scores, setScores] = useState<AssessmentScores>({ business: 1, technical: 1, handsOn: 1 });
  const [submittedScores, setSubmittedScores] = useState<AssessmentScores | null>(null);
  const [suggestions, setSuggestions] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleProductSelect = (productId: string) => {
    const product = MOCK_PRODUCTS.find(p => p.id === productId);
    if (product) {
      setSelectedProduct(product);
      setScores({ business: 1, technical: 1, handsOn: 1 });
      setSubmittedScores(null);
      setSuggestions(null);
    }
  };

  const handleScoreChange = (scope: keyof AssessmentScores, value: number) => {
    setScores(prev => ({ ...prev, [scope]: value }));
  };

  const handleGenerate = async () => {
    if (!selectedProduct) return;

    setIsLoading(true);
    setSubmittedScores(scores);
    setSuggestions(null);

    try {
      const result = await generateImprovementSuggestions({
        productName: selectedProduct.name,
        businessScore: scores.business,
        technicalScore: scores.technical,
        handsOnScore: scores.handsOn,
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
            <CardTitle className="font-headline">1. Select a Product</CardTitle>
            <CardDescription>Choose a product to start your self-assessment.</CardDescription>
          </CardHeader>
          <CardContent>
            <Select onValueChange={handleProductSelect} value={selectedProduct?.id}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a product..." />
              </SelectTrigger>
              <SelectContent>
                {MOCK_PRODUCTS.map((product) => (
                  <SelectItem key={product.id} value={product.id}>
                    {product.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {selectedProduct && (
          <Card className="transition-all duration-500 animate-in fade-in-50">
            <CardHeader>
              <CardTitle className="font-headline">2. Assess Your Knowledge</CardTitle>
              <CardDescription>Rate your knowledge for <span className="font-bold">{selectedProduct.name}</span> on a scale of 1 (Novice) to 5 (Expert).</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div>
                <Label htmlFor="business-slider" className="text-lg">Business Knowledge</Label>
                <p className="text-sm text-muted-foreground mb-2">{SCOPE_DEFINITIONS.business}</p>
                <div className="flex items-center gap-4">
                  <Slider
                    id="business-slider"
                    min={1} max={5} step={1}
                    value={[scores.business]}
                    onValueChange={([val]) => handleScoreChange('business', val)}
                  />
                  <span className="font-bold text-lg text-primary w-4">{scores.business}</span>
                </div>
              </div>
              <div>
                <Label htmlFor="technical-slider" className="text-lg">Technical Knowledge</Label>
                 <p className="text-sm text-muted-foreground mb-2">{SCOPE_DEFINITIONS.technical}</p>
                <div className="flex items-center gap-4">
                  <Slider
                    id="technical-slider"
                    min={1} max={5} step={1}
                    value={[scores.technical]}
                    onValueChange={([val]) => handleScoreChange('technical', val)}
                  />
                  <span className="font-bold text-lg text-primary w-4">{scores.technical}</span>
                </div>
              </div>
              <div>
                <Label htmlFor="handsOn-slider" className="text-lg">Hands-on Experience</Label>
                 <p className="text-sm text-muted-foreground mb-2">{SCOPE_DEFINITIONS.handsOn}</p>
                <div className="flex items-center gap-4">
                  <Slider
                    id="handsOn-slider"
                    min={1} max={5} step={1}
                    value={[scores.handsOn]}
                    onValueChange={([val]) => handleScoreChange('handsOn', val)}
                  />
                  <span className="font-bold text-lg text-primary w-4">{scores.handsOn}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleGenerate} disabled={isLoading} className="w-full bg-primary hover:bg-primary/90">
                {isLoading ? 'Generating...' : 'View My Assessment'}
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
      <div>
        <AssessmentResults
          product={selectedProduct}
          scores={submittedScores}
          suggestions={suggestions}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
