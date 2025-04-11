// src/ai/flows/generate-search-index.ts
'use server';

/**
 * @fileOverview Generates a textual description of an image for search indexing.
 *
 * - generateSearchIndex - A function that generates the search index for an image.
 * - GenerateSearchIndexInput - The input type for the generateSearchIndex function.
 * - GenerateSearchIndexOutput - The return type for the generateSearchIndex function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const GenerateSearchIndexInputSchema = z.object({
  photoUrl: z.string().describe('The URL of the image.'),
});
export type GenerateSearchIndexInput = z.infer<typeof GenerateSearchIndexInputSchema>;

const GenerateSearchIndexOutputSchema = z.object({
  description: z.string().describe('A textual description of the image.'),
});
export type GenerateSearchIndexOutput = z.infer<typeof GenerateSearchIndexOutputSchema>;

export async function generateSearchIndex(input: GenerateSearchIndexInput): Promise<GenerateSearchIndexOutput> {
  return generateSearchIndexFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSearchIndexPrompt',
  input: {
    schema: z.object({
      photoUrl: z.string().describe('The URL of the image.'),
    }),
  },
  output: {
    schema: z.object({
      description: z.string().describe('A textual description of the image.'),
    }),
  },
  prompt: `You are an AI image description generator.  Please provide a detailed textual description of the image at the following URL:

{{media url=photoUrl}}`,
});

const generateSearchIndexFlow = ai.defineFlow<
  typeof GenerateSearchIndexInputSchema,
  typeof GenerateSearchIndexOutputSchema
>({
  name: 'generateSearchIndexFlow',
  inputSchema: GenerateSearchIndexInputSchema,
  outputSchema: GenerateSearchIndexOutputSchema,
},
async input => {
  const {output} = await prompt(input);
  return output!;
}
);
