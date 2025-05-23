/**
 * AI Chat Utilities
 * This file contains utilities for the AI Doctor chat interface
 */

// Types for AI chat interactions
export interface AIChatRequest {
  messages: Array<{
    role: "system" | "user" | "assistant";
    content: string;
  }>;
  userInventory?: string[];
}

export interface AIChatResponse {
  content: string;
  remedies?: Array<{
    name: string;
    potency: string;
    indication: string;
    reasoning: string;
    source: string;
  }>;
}

/**
 * Initial system prompt template for the homeopathic AI doctor
 * This will be used once we connect to the ChatGPT API
 */
export const getSystemPrompt = (): string => `
You are Dr. Harmony, a homeopathic assistant trained on classical homeopathic materia medica.
Your purpose is to analyze symptoms and suggest homeopathic remedies based ONLY on authentic references.
IMPORTANT: Never suggest remedies based on general knowledge or imagination.

When suggesting remedies:
1. Only recommend remedies mentioned in classical texts like Kent, Boericke, Clarke, etc.
2. Mention the specific source of your recommendation
3. Include dosage information when available
4. Provide a brief reasoning for why this remedy matches the symptoms
5. Include a gentle, supportive message to encourage the user

Keep your responses concise and focused on the user's symptoms.
Ensure your recommendations are structured consistently.

Respond in JSON format with the following structure:
{
  "content": "Your supportive message and analysis",
  "remedies": [
    {
      "name": "Remedy name",
      "potency": "Recommended potency",
      "indication": "What symptoms it addresses",
      "reasoning": "Why this remedy is suggested",
      "source": "Source of the recommendation"
    }
  ]
}
`;

// Animation settings for chat elements
export const chatAnimationClasses = {
  messageContainer: "transition-all duration-300 ease-in-out",
  messageEnter: "animate-in slide-in-from-bottom-3 duration-300 fade-in",
  userBubble: "bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-br-sm",
  aiBubble: "bg-white dark:bg-gray-800 rounded-bl-sm border border-purple-100 dark:border-purple-800",
  remedyCard: "transition-all duration-200 hover:shadow-md hover:scale-[1.01] active:scale-[0.99]"
};

// Simulation of a future API call
// This will be replaced with actual ChatGPT API call
export const simulateChatResponse = async (request: AIChatRequest): Promise<AIChatResponse> => {
  // This is just a placeholder until we integrate with ChatGPT API
  return fetch('/api/ai-doctor', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      symptoms: request.messages[request.messages.length - 1].content,
      userInventory: request.userInventory || []
    }),
  }).then(response => {
    if (!response.ok) {
      throw new Error('Failed to get AI response');
    }
    return response.json();
  });
};