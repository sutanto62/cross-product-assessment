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

const ImprovementSuggestionsInputSchema = z.object({
  productName: z.string().describe('The name of the product being assessed.'),
  businessScore: z.number().describe('The self-assessment score for business knowledge (Likert scale).'),
  technicalScore: z.number().describe('The self-assessment score for technical knowledge (Likert scale).'),
  handsOnScore: z.number().describe('The self-assessment score for hands-on experience (Likert scale).'),
});
export type ImprovementSuggestionsInput = z.infer<typeof ImprovementSuggestionsInputSchema>;

const ImprovementSuggestionsOutputSchema = z.object({
  suggestions: z.string().describe('Personalized improvement suggestions based on the self-assessment data.'),
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
  prompt: `You are an AI assistant designed to provide personalized improvement suggestions to engineers based on their self-assessment scores for product knowledge.

  Product: {{productName}}
  Business Knowledge Score: {{businessScore}}
  Technical Knowledge Score: {{technicalScore}}
  Hands-on Experience Score: {{handsOnScore}}

  Based on these scores, provide specific and actionable suggestions for the engineer to improve their knowledge in each area. Focus on resources, learning paths, and practical exercises that can help them enhance their understanding and skills. The suggestions should be concise and easy to follow.
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
