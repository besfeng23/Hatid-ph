'use server';

/**
 * @fileOverview AI-powered tool that suggests destinations in Metro Manila based on user search history and local events.
 *
 * - getSuggestedPlaces - A function that suggests destinations in Metro Manila based on user search history and local events.
 * - SuggestedPlacesInput - The input type for the getSuggestedPlaces function.
 * - SuggestedPlacesOutput - The return type for the getSuggestedPlaces function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestedPlacesInputSchema = z.object({
  searchHistory: z
    .string()
    .describe('The user search history, including past destinations and keywords.'),
  localEvents: z
    .string()
    .describe('Information about local events happening in Metro Manila.'),
});
export type SuggestedPlacesInput = z.infer<typeof SuggestedPlacesInputSchema>;

const SuggestedPlacesOutputSchema = z.object({
  suggestions: z.array(
    z.object({
      placeName: z.string().describe('The name of the suggested place.'),
      description: z.string().describe('A brief description of the place.'),
      reason: z.string().describe('The reason for suggesting this place based on search history and local events.'),
    })
  ).describe('An array of suggested places in Metro Manila.'),
});
export type SuggestedPlacesOutput = z.infer<typeof SuggestedPlacesOutputSchema>;

export async function getSuggestedPlaces(input: SuggestedPlacesInput): Promise<SuggestedPlacesOutput> {
  return suggestedPlacesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestedPlacesPrompt',
  input: {schema: SuggestedPlacesInputSchema},
  output: {schema: SuggestedPlacesOutputSchema},
  prompt: `You are a local guide expert in Metro Manila, adept at suggesting places to visit based on user preferences and current local events.

  Based on the user's search history:
  {{searchHistory}}

  And considering these local events in Metro Manila:
  {{localEvents}}

  Suggest places to visit in Metro Manila. Provide a brief description of each place and explain why it is being suggested, considering both the search history and local events.
  Ensure that the place name, description, and reason are all included in the output.  The place should be within Metro Manila. Focus on events that are accessible via ride-sharing apps.
  Format the output as a JSON array of suggestions, each including placeName, description, and reason.
  `,
});

const suggestedPlacesFlow = ai.defineFlow(
  {
    name: 'suggestedPlacesFlow',
    inputSchema: SuggestedPlacesInputSchema,
    outputSchema: SuggestedPlacesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
