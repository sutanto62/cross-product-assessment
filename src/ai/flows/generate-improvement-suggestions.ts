'use server';

/**
 * @fileOverview A flow to generate personalized improvement suggestions based on self-assessment scores.
 *
 * - generateImprovementSuggestions - A function that generates improvement suggestions.
 * - ImprovementSuggestionsInput - The input type for the generateImprovementSuggestions function.
 * - ImprovementSuggestionsOutput - The return type for the generateImprovementSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProductAssessmentSchema = z.object({
  productName: z.string().describe('The name of the product being assessed.'),
  businessScore: z.number().describe('The self-assessment score for business knowledge (Likert scale).'),
  technicalScore: z.number().describe('The self-assessment score for technical knowledge (Likert scale).'),
  handsOnScore: z.number().describe('The self-assessment score for hands-on experience (Likert scale).'),
});

const ImprovementSuggestionsInputSchema = z.object({
  role: z.enum(['Frontend', 'Backend']).describe('The engineering role of the user.'),
  assessments: z.array(ProductAssessmentSchema).describe('An array of self-assessments for various products.'),
});
export type ImprovementSuggestionsInput = z.infer<typeof ImprovementSuggestionsInputSchema>;

const ImprovementSuggestionsOutputSchema = z.object({
  suggestions: z.string().describe('Personalized improvement suggestions based on the aggregated self-assessment data.'),
});
export type ImprovementSuggestionsOutput = z.infer<typeof ImprovementSuggestionsOutputSchema>;

export async function generateImprovementSuggestions(
  input: ImprovementSuggestionsInput
): Promise<ImprovementSuggestionsOutput> {
  return generateImprovementSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'improvementSuggestionsPrompt',
  input: {schema: ImprovementSuggestionsInputSchema},
  output: {schema: ImprovementSuggestionsOutputSchema},
  prompt: `You are an AI assistant designed to provide personalized improvement suggestions to a {{role}} engineer based on an aggregate of their self-assessment scores across multiple products.

  Here are the user's self-assessments:
  {{#each assessments}}
  - Product: {{productName}}
    - Business Knowledge: {{businessScore}}/5
    - Technical Knowledge: {{technicalScore}}/5
    - Hands-on Experience: {{handsOnScore}}/5
  {{/each}}

  First, calculate the average score for each category (Business, Technical, Hands-on) across all products.
  
  Then, based on these average scores and their role as a {{role}} engineer, provide specific, actionable, and holistic suggestions for the engineer to improve their knowledge in each area. Focus on identifying cross-cutting themes and general skill areas rather than product-specific advice. The suggestions should be concise, high-level, and easy to follow. Structure the output as a single paragraph.
  Suggestions:`,
});

const generateImprovementSuggestionsFlow = ai.defineFlow(
  {
    name: 'generateImprovementSuggestionsFlow',
    inputSchema: ImprovementSuggestionsInputSchema,
    outputSchema: ImprovementSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
