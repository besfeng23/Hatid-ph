// src/ai/flows/personalized-recommendations.ts
'use server';

/**
 * @fileOverview A flow for providing personalized recommendations for drivers and riders based on their preferences and travel patterns within Metro Manila.
 *
 * - getPersonalizedRecommendations - A function that returns personalized recommendations.
 * - PersonalizedRecommendationsInput - The input type for the getPersonalizedRecommendations function.
 * - PersonalizedRecommendationsOutput - The return type for the getPersonalizedRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedRecommendationsInputSchema = z.object({
  userId: z.string().describe('The ID of the user requesting recommendations.'),
  travelHistory: z.array(z.string()).describe('The user travel history.'),
  preferences: z.string().describe('The user ride preferences.'),
});

export type PersonalizedRecommendationsInput = z.infer<
  typeof PersonalizedRecommendationsInputSchema
>;

const PersonalizedRecommendationsOutputSchema = z.object({
  driverRecommendations: z
    .array(z.string())
    .describe('A list of recommended drivers based on user preferences.'),
  rideOptionsRecommendations: z
    .array(z.string())
    .describe('A list of recommended ride options based on user preferences.'),
  preferredRoutes: z
    .array(z.string())
    .describe('A list of recommended routes based on user travel patterns.'),
});

export type PersonalizedRecommendationsOutput = z.infer<
  typeof PersonalizedRecommendationsOutputSchema
>;

export async function getPersonalizedRecommendations(
  input: PersonalizedRecommendationsInput
): Promise<PersonalizedRecommendationsOutput> {
  return personalizedRecommendationsFlow(input);
}

const personalizedRecommendationsPrompt = ai.definePrompt({
  name: 'personalizedRecommendationsPrompt',
  input: {schema: PersonalizedRecommendationsInputSchema},
  output: {schema: PersonalizedRecommendationsOutputSchema},
  prompt: `You are a ride recommendation expert for the Hatid app in Metro Manila.

  Based on the user's travel history and preferences, provide personalized recommendations for drivers, ride options, and preferred routes.

  User ID: {{{userId}}}
  Travel History: {{{travelHistory}}}
  Preferences: {{{preferences}}}

  Driver Recommendations:
  Ride Options Recommendations:
  Preferred Routes:`,
});

const personalizedRecommendationsFlow = ai.defineFlow(
  {
    name: 'personalizedRecommendationsFlow',
    inputSchema: PersonalizedRecommendationsInputSchema,
    outputSchema: PersonalizedRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await personalizedRecommendationsPrompt(input);
    return output!;
  }
);
