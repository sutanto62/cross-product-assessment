import type { FC } from 'react';
import type { Product, AssessmentScores } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

interface ProductAssessmentCardProps {
  product: Product;
  scores: AssessmentScores;
  onScoreChange: (productId: string, scope: keyof AssessmentScores, value: number) => void;
}

const SCOPE_DEFINITIONS = {
    business: "Understanding of the product's market position, use cases, and value proposition.",
    technical: "Knowledge of the product's architecture, APIs, and integration capabilities.",
    handsOn: "Practical experience in developing, deploying, and troubleshooting with the product."
}

const ProductAssessmentCard: FC<ProductAssessmentCardProps> = ({ product, scores, onScoreChange }) => {
  return (
    <Card className="shadow-md transition-shadow hover:shadow-lg">
      <CardHeader>
        <CardTitle>{product.name}</CardTitle>
        <CardDescription>{product.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 pt-2">
        <div>
          <Label htmlFor={`business-slider-${product.id}`} className="text-base">Business Knowledge</Label>
          <p className="text-sm text-muted-foreground mb-2">{SCOPE_DEFINITIONS.business}</p>
          <div className="flex items-center gap-4">
            <Slider
              id={`business-slider-${product.id}`}
              min={1} max={5} step={1}
              value={[scores.business]}
              onValueChange={([val]) => onScoreChange(product.id, 'business', val)}
            />
            <span className="font-bold text-lg text-primary w-4">{scores.business}</span>
          </div>
        </div>
        <div>
          <Label htmlFor={`technical-slider-${product.id}`} className="text-base">Technical Knowledge</Label>
          <p className="text-sm text-muted-foreground mb-2">{SCOPE_DEFINITIONS.technical}</p>
          <div className="flex items-center gap-4">
            <Slider
              id={`technical-slider-${product.id}`}
              min={1} max={5} step={1}
              value={[scores.technical]}
              onValueChange={([val]) => onScoreChange(product.id, 'technical', val)}
            />
            <span className="font-bold text-lg text-primary w-4">{scores.technical}</span>
          </div>
        </div>
        <div>
          <Label htmlFor={`handsOn-slider-${product.id}`} className="text-base">Hands-on Experience</Label>
          <p className="text-sm text-muted-foreground mb-2">{SCOPE_DEFINITIONS.handsOn}</p>
          <div className="flex items-center gap-4">
            <Slider
              id={`handsOn-slider-${product.id}`}
              min={1} max={5} step={1}
              value={[scores.handsOn]}
              onValueChange={([val]) => onScoreChange(product.id, 'handsOn', val)}
            />
            <span className="font-bold text-lg text-primary w-4">{scores.handsOn}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductAssessmentCard;
