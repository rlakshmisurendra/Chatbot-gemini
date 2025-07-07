interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{ text: string }>;
    };
  }>;
}

export class GeminiService {
  private apiKey: string;
  private baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateResponse(prompt: string): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are an expert C programming language tutor and assistant. Your role is to help users learn C programming by:

1. Answering questions about C syntax, concepts, and best practices
2. Explaining code step by step with detailed breakdowns
3. Helping debug programs and fix errors
4. Providing clear examples for any C programming concept
5. Offering guidance on algorithms and data structures in C
6. Explaining memory management, pointers, and advanced topics
7. Suggesting improvements and optimizations for code

Always provide helpful, accurate, and educational responses. Include code examples when appropriate and explain concepts clearly. Be encouraging and supportive in your teaching approach.

User question: ${prompt}`
            }]
          }]
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      const data: GeminiResponse = await response.json();
      return data.candidates[0]?.content.parts[0]?.text || 'Sorry, I couldn\'t generate a response.';
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      return 'I\'m having trouble connecting to the AI service. Please check your API key and try again.';
    }
  }
}