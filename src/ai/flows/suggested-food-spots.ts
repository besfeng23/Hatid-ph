'use server';

/**
 * @fileOverview AI-powered tool that suggests food spots in Metro Manila.
 *
 * - getSuggestedFoodSpots - A function that suggests dining destinations.
 * - SuggestedFoodSpotsInput - The input type for the getSuggestedFoodSpots function.
 * - SuggestedFoodSpotsOutput - The return type for the getSuggestedFoodSpots function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const SuggestedFoodSpotsInputSchema = z.object({
  timeOfDay: z
    .string()
    .describe('The time of day, e.g., breakfast, lunch, dinner, or merienda.'),
  userPreferences: z
    .string()
    .describe('The user\'s food preferences, e.g., "loves spicy food, enjoys Filipino cuisine".'),
  location: z
    .string()
    .describe('The general area in Metro Manila, e.g., "Makati", "Quezon City".'),
});
export type SuggestedFoodSpotsInput = z.infer<
  typeof SuggestedFoodSpotsInputSchema
>;

const SuggestedFoodSpotsOutputSchema = z.object({
  suggestions: z
    .array(
      z.object({
        restaurantName: z
          .string()
          .describe('The name of the suggested restaurant.'),
        cuisine: z.string().describe('The type of cuisine served.'),
        reason: z
          .string()
          .describe(
            'The reason for suggesting this place, considering the time of day and user preferences.'
          ),
      })
    )
    .describe('An array of suggested food spots in Metro Manila.'),
});
export type SuggestedFoodSpotsOutput = z.infer<
  typeof SuggestedFoodSpotsOutputSchema
>;

export async function getSuggestedFoodSpots(
  input: SuggestedFoodSpotsInput
): Promise<SuggestedFoodSpotsOutput> {
  return suggestedFoodSpotsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestedFoodSpotsPrompt',
  input: { schema: SuggestedFoodSpotsInputSchema },
  output: { schema: SuggestedFoodSpotsOutputSchema },
  prompt: `You are a Filipino food and restaurant expert in Metro Manila.

  Based on the following user context:
  - Time of Day: {{timeOfDay}}
  - User Preferences: {{userPreferences}}
  - Location: {{location}}

  Suggest three interesting and highly-rated restaurants in or near the specified location.
  For each restaurant, provide the name, the cuisine, and a compelling reason why the user would enjoy it, connecting it to their preferences and the time of day.
  
  Example output should be a JSON object with a 'suggestions' array.
  For instance, if the user likes Filipino food for dinner in Quezon City, you might suggest a place known for its excellent Sisig.
  `,
});

const suggestedFoodSpotsFlow = ai.defineFlow(
  {
    name: 'suggestedFoodSpotsFlow',
    inputSchema: SuggestedFoodSpotsInputSchema,
    outputSchema: SuggestedFoodSpotsOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
