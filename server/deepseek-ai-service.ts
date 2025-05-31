/**
 * DeepSeek R1 AI Service for HomeoInvent via OpenRouter API
 * 
 * This service consolidates ALL AI functionality in the app to use DeepSeek R1 via OpenRouter:
 * - AI Doctor (Dr. Harmony) - Symptom analysis and remedy suggestions
 * - AI Helper - Inventory management and trend analysis
 * - Learning Assistant - Quiz generation and educational content
 * - Chatbot responses - All conversational AI interactions
 * 
 * API Configuration:
 * - Endpoint: https://openrouter.ai/api/v1/chat/completions
 * - Model: deepseek-chat
 * - Authorization: Bearer OPENROUTER_API_KEY
 * 
 * DeepSeek R1 is used for:
 * 1. Analyzing symptoms and suggesting homeopathic remedies
 * 2. Generating educational content and quiz questions
 * 3. Providing inventory management insights
 * 4. Creating personalized learning experiences
 * 5. Handling natural language conversations about homeopathy
 */

import { findRemediesBySymptoms } from './homeopathic-knowledge.js';
import { BOERICKE_REMEDIES, findBoerickeRemedies, isGreeting, getGreetingResponse } from './boericke-materia-medica.js';
import { searchRemediesBySymptoms } from './remedies-database.js';

interface DeepSeekResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

interface RemedySuggestion {
  name: string;
  potency: string;
  indication: string;
  source: string;
  reasoning: string;
  confidence: number;
  dosage?: string;
  frequency?: string;
  inInventory?: boolean;
}

interface LearningContent {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

/**
 * OpenRouter API Configuration for DeepSeek R1
 * The API key should be set in environment variables as OPENROUTER_API_KEY
 * 
 * Setup Instructions:
 * 1. Get your API key from https://openrouter.ai/
 * 2. Add OPENROUTER_API_KEY to your .env file
 * 3. The service will automatically use DeepSeek via OpenRouter
 */
class DeepSeekAIService {
  private apiKey: string;
  private baseUrl: string = 'https://openrouter.ai/api/v1/chat/completions';

  constructor() {
    // Updated to use OPENROUTER_API_KEY instead of DEEPSEEK_API_KEY
    this.apiKey = process.env.OPENROUTER_API_KEY || '';
    if (!this.apiKey) {
      console.warn('⚠️ OPENROUTER_API_KEY not found in environment variables. AI features will use fallback responses.');
      console.log('📋 Setup: Add OPENROUTER_API_KEY to your .env file to enable DeepSeek R1 AI features');
    }
  }

  /**
   * Core method to call DeepSeek R1 API via OpenRouter
   * Used by all AI functionality in the app
   * 
   * API Configuration:
   * - Uses OpenRouter endpoint: https://openrouter.ai/api/v1/chat/completions
   * - Model: deepseek-chat (DeepSeek R1 via OpenRouter)
   * - Requires OPENROUTER_API_KEY in environment variables
   */
  private async callDeepSeekAPI(messages: Array<{role: string, content: string}>, temperature: number = 0.7): Promise<string> {
    if (!this.apiKey) {
      throw new Error('OpenRouter API key not configured for DeepSeek access');
    }

    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          'HTTP-Referer': 'https://homeoinvent.replit.app', // For OpenRouter analytics
          'X-Title': 'HomeoInvent - Homeopathic Medicine Manager' // App identification
        },
        body: JSON.stringify({
          model: 'deepseek/deepseek-r1', // Updated to use deepseek-chat model via OpenRouter
          messages: messages,
          temperature: temperature,
          max_tokens: 2000,
          stream: false
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`OpenRouter API error: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data: DeepSeekResponse = await response.json();
      return data.choices[0]?.message?.content || 'No response from AI service';
    } catch (error) {
      console.error('OpenRouter DeepSeek API call failed:', error);
      throw error;
    }
  }

  /**
   * AI DOCTOR FUNCTIONALITY (Dr. Harmony)
   * Analyzes symptoms and suggests homeopathic remedies using DeepSeek R1
   * 
   * @param symptoms - User's symptom description
   * @param userInventory - User's available medicines for inventory-aware suggestions
   * @returns Structured remedy suggestions with reasoning
   */
  async analyzeSymptoms(symptoms: string, userInventory: string[] = []): Promise<{
    response: string;
    remedies: RemedySuggestion[];
    disclaimer: string;
  }> {
    // Handle greetings with quick responses
    if (isGreeting(symptoms)) {
      return {
        response: getGreetingResponse(),
        remedies: [],
        disclaimer: "Always consult with a qualified homeopathic practitioner for personalized treatment."
      };
    }

    // Get local remedy matches first (as fallback and context)
    const localMatches = findRemediesBySymptoms(symptoms);
    const boerickeMatches = findBoerickeRemedies(symptoms);
    
    try {
      // Use DeepSeek R1 for advanced symptom analysis
      const prompt = `As an expert homeopathic practitioner, analyze these symptoms and suggest appropriate remedies: "${symptoms}"

Consider these aspects:
1. Symptom pattern analysis
2. Constitutional remedy selection
3. Acute vs chronic presentation
4. Modalities (what makes symptoms better/worse)
5. Mental and emotional state

Available user inventory: ${userInventory.length > 0 ? userInventory.join(', ') : 'No inventory provided'}

Provide:
- 3-5 most suitable remedies
- Potency recommendations
- Clear reasoning for each suggestion
- Dosage guidance
- When to seek professional help

Format as clear, practical advice for educational purposes.`;

    /*  const messages = [
        {
          role: 'system',
          content: 'You are Dr. Harmony, an expert homeopathic AI assistant. Provide evidence-based remedy suggestions using classical homeopathy principles. Always emphasize educational purpose and recommend professional consultation for serious conditions.'
        },
        {
          role: 'user',
          content: prompt
        }
      ];*/

      const messages = [
  {
    role: 'system',
    content: `You are an expert Homeopathic AI Doctor. Your job is to analyze symptoms provided by the user and suggest 2-3 best homeopathic remedies.
Each remedy should include:
1. Name
2. Potency (e.g., 30C or 200C)
3. Key reason for choosing it
4. Short advice or note

Only answer in this format. Don’t add extra text. Always be clear and structured.`
  },
  { role: 'user', content: prompt }
];


      const aiResponse = await this.callDeepSeekAPI(messages, 0.7);
      
      // Parse AI response and combine with local knowledge
      const remedies = this.parseRemedySuggestions(aiResponse, userInventory);
      
      return {
        response: aiResponse,
        remedies: remedies,
        disclaimer: "🔸 Educational purposes only. Always consult a qualified homeopathic practitioner for personalized treatment and serious health conditions."
      };

    } catch (error) {
      console.error('OpenRouter DeepSeek symptom analysis failed, using local fallback:', error);
      
      // Fallback to local knowledge when API fails
      const fallbackRemedies = [...localMatches, ...boerickeMatches].slice(0, 3).map(remedy => ({
        name: remedy.name,
        potency: (remedy as any).potencies?.[0] || (remedy as any).potency || '30C',
        indication: (remedy as any).keySymptoms?.[0] || (remedy as any).keyIndications?.[0] || 'General symptoms',
        source: 'Local Knowledge Base',
        reasoning: 'Based on symptom matching in local database',
        confidence: 0.7,
        inInventory: userInventory.includes(remedy.name)
      }));

      return {
        response: `Based on the symptoms "${symptoms}", here are some traditional homeopathic remedies to consider. Please consult with a qualified practitioner for proper evaluation.`,
        remedies: fallbackRemedies,
        disclaimer: "🔸 This response uses local knowledge base. For enhanced AI analysis, please ensure OPENROUTER_API_KEY is properly configured."
      };
    }
  }

  /**
   * AI HELPER FUNCTIONALITY
   * Provides inventory management insights and trend analysis using DeepSeek R1
   * 
   * @param query - User's question about inventory, trends, or general help
   * @param context - Current inventory and usage data for context
   * @returns Helpful response with actionable insights
   */
  async provideInventoryHelp(query: string, context: {
    medicines: any[];
    recentUsage?: any[];
    trends?: any[];
  }): Promise<{
    response: string;
    suggestions: string[];
    actionType: 'trend' | 'substitution' | 'dosage' | 'general';
  }> {
    try {
      const prompt = `As an AI Helper for homeopathic inventory management, respond to this query: "${query}"

Current inventory context:
- Total medicines: ${context.medicines.length}
- Available remedies: ${context.medicines.map(m => `${m.name} (${m.potency})`).join(', ')}
- Recent usage: ${context.recentUsage ? 'Available' : 'Not tracked'}

Provide helpful insights about:
- Inventory optimization
- Usage patterns and trends
- Alternative remedy suggestions
- Storage and organization tips
- Reordering recommendations

Be practical and actionable in your response.`;

      const messages = [
        {
          role: 'system',
          content: `You are a helpful AI assistant specializing in homeopathy.
Your responsibilities include:
1. Suggesting alternative homeopathic remedies when asked.
2. Providing general dosage guidance for common homeopathic medicines (while clearly stating that users should consult a certified practitioner for personalized doses).
3. Offering general support and answering user questions about homeopathic use, remedy types, storage, and inventory — but never diagnosing or prescribing.

Be clear, professional, and informative. If the question is outside your scope, gently redirect the user to consult a qualified homeopathic doctor. `
        },
        {
          role: 'user',
          content: prompt
        }
      ];

      const aiResponse = await this.callDeepSeekAPI(messages, 0.6);
      
      // Determine action type based on query
      const actionType = this.determineActionType(query);
      
      // Extract actionable suggestions from response
      const suggestions = this.extractSuggestions(aiResponse);

      return {
        response: aiResponse,
        suggestions: suggestions,
        actionType: actionType
      };

    } catch (error) {
      console.error('OpenRouter DeepSeek inventory help failed, using fallback:', error);
      
      return {
        response: `I can help you with your inventory! You currently have ${context.medicines.length} medicines. For enhanced AI-powered insights and recommendations, please ensure OPENROUTER_API_KEY is properly configured.`,
        suggestions: [
          'Organize medicines by location',
          'Track expiry dates',
          'Monitor usage patterns',
          'Consider common remedies for restocking'
        ],
        actionType: 'general'
      };
    }
  }

  /**
   * LEARNING ASSISTANT FUNCTIONALITY
   * Generates educational content and quiz questions using DeepSeek R1
   * 
   * @param topic - Learning topic (remedy name, concept, etc.)
   * @param difficulty - Learning level
   * @param questionType - Type of question to generate
   * @returns Educational content and quiz questions
   */
  async generateLearningContent(
    topic: string, 
    difficulty: 'beginner' | 'intermediate' | 'advanced' = 'beginner',
    questionType: 'multiple_choice' | 'explanation' | 'case_study' = 'multiple_choice'
  ): Promise<{
    content: LearningContent | null;
    explanation: string;
    relatedTopics: string[];
  }> {
    try {
      const prompt = `Create educational content about "${topic}" in homeopathy for ${difficulty} level.

Generate a ${questionType} question that tests understanding of:
- Key indications and uses
- Symptom patterns
- Modalities (better/worse conditions)
- Potency selection
- Clinical applications

For multiple choice: Provide 4 options with 1 correct answer and detailed explanation.
For explanation: Provide a comprehensive learning summary.
For case study: Create a practical scenario.

Include related topics for further learning.`;

      const messages = [
        {
          role: 'system',
          content: `You are an expert homeopathy educator and content creator. Your goal is to produce accurate, engaging, and clinically relevant learning materials based on the principles of classical homeopathy.

Use authentic sources and standard references such as the Organon of Medicine, Materia Medica, and Repertory. Your content should be clear, educational, and practical for students, practitioners, or those interested in homeopathy.

Avoid giving direct medical advice or personalized prescriptions. Focus on knowledge-building, remedy understanding, case analysis, and foundational theory rooted in classical homeopathy.`
        },
        {
          role: 'user',
          content: prompt
        }
      ];

      const aiResponse = await this.callDeepSeekAPI(messages, 0.5);
      
      // Parse response into structured learning content
      const content = this.parseLearningContent(aiResponse, difficulty);
      const relatedTopics = this.extractRelatedTopics(aiResponse);

      return {
        content: content,
        explanation: aiResponse,
        relatedTopics: relatedTopics
      };

    } catch (error) {
      console.error('OpenRouter DeepSeek learning content generation failed:', error);
      
      return {
        content: null,
        explanation: `Learning content for "${topic}" is being prepared. Please ensure OPENROUTER_API_KEY is properly configured for enhanced educational features.`,
        relatedTopics: ['Basic homeopathy principles', 'Remedy selection', 'Potency guidelines']
      };
    }
  }

  /**
   * GENERAL CHATBOT FUNCTIONALITY
   * Handles conversational AI for all general queries using DeepSeek R1
   * 
   * @param message - User's message or question
   * @param context - Conversation context and user data
   * @returns Natural conversational response
   */
  async handleGeneralChat(message: string, context: {
    conversationHistory?: Array<{role: string, content: string}>;
    userProfile?: any;
    currentMode?: string;
  }): Promise<{
    response: string;
    suggestions: string[];
    mode: string;
  }> {
    try {
      // Build conversation context
      const conversationMessages = [
        {
          role: 'system',
          content: 'You are a helpful AI assistant for HomeoInvent, specializing in homeopathic medicine management and education. Be friendly, informative, and always emphasize educational purposes. Guide users to appropriate features of the app.'
        },
        ...(context.conversationHistory || []),
        {
          role: 'user',
          content: message
        }
      ];

      const aiResponse = await this.callDeepSeekAPI(conversationMessages, 0.8);
      
      // Generate contextual suggestions
      const suggestions = this.generateChatSuggestions(message, aiResponse);
      
      // Determine conversation mode
      const mode = this.determineChatMode(message);

      return {
        response: aiResponse,
        suggestions: suggestions,
        mode: mode
      };

    } catch (error) {
      console.error('OpenRouter DeepSeek chat failed, using fallback:', error);
      
      return {
        response: "I'm here to help with your homeopathic medicine management and learning! For enhanced AI-powered conversations and insights, please ensure OPENROUTER_API_KEY is properly configured.",
        suggestions: [
          'Ask about medicine inventory',
          'Learn about homeopathic remedies',
          'Get help with app features',
          'Find remedy information'
        ],
        mode: 'general'
      };
    }
  }

  // Helper methods for parsing and processing AI responses

  private parseRemedySuggestions(aiResponse: string, userInventory: string[]): RemedySuggestion[] {
    // Extract remedy information from AI response
    // This is a simplified parser - can be enhanced based on actual response format
    const remedies: RemedySuggestion[] = [];
    
    // Basic pattern matching for common remedy names
    const commonRemedies = ['Arnica', 'Belladonna', 'Chamomilla', 'Nux vomica', 'Pulsatilla', 'Sulphur', 'Calcarea carbonica'];
    
    commonRemedies.forEach(remedy => {
      if (aiResponse.toLowerCase().includes(remedy.toLowerCase())) {
        remedies.push({
          name: remedy,
          potency: '30C',
          indication: 'As mentioned in AI analysis',
          source: 'AI Analysis',
          reasoning: 'Identified in comprehensive symptom analysis',
          confidence: 0.8,
          inInventory: userInventory.some(inv => inv.toLowerCase().includes(remedy.toLowerCase()))
        });
      }
    });

    return remedies.slice(0, 5); // Limit to 5 suggestions
  }

  private determineActionType(query: string): 'trend' | 'substitution' | 'dosage' | 'general' {
    const lowerQuery = query.toLowerCase();
    if (lowerQuery.includes('trend') || lowerQuery.includes('usage') || lowerQuery.includes('pattern')) {
      return 'trend';
    }
    if (lowerQuery.includes('alternative') || lowerQuery.includes('substitute') || lowerQuery.includes('replace')) {
      return 'substitution';
    }
    if (lowerQuery.includes('dosage') || lowerQuery.includes('dose') || lowerQuery.includes('how much')) {
      return 'dosage';
    }
    return 'general';
  }

  private extractSuggestions(response: string): string[] {
    // Extract actionable suggestions from AI response
    const suggestions: string[] = [];
    const lines = response.split('\n');
    
    lines.forEach(line => {
      if (line.includes('•') || line.includes('-') || line.includes('1.') || line.includes('2.')) {
        const clean = line.replace(/[•\-\d\.]/g, '').trim();
        if (clean.length > 10 && clean.length < 100) {
          suggestions.push(clean);
        }
      }
    });

    return suggestions.slice(0, 4); // Limit to 4 suggestions
  }

  private parseLearningContent(aiResponse: string, difficulty: string): LearningContent | null {
    // Parse AI response to extract structured learning content
    // This is a simplified parser - can be enhanced based on actual response format
    
    try {
      // Look for question patterns in the response
      const questionMatch = aiResponse.match(/Question:?\s*(.+?)(?:\n|Options:|A\)|1\.)/i);
      if (questionMatch) {
        return {
          question: questionMatch[1].trim(),
          options: ['Option A', 'Option B', 'Option C', 'Option D'], // Simplified - enhance based on actual format
          correctAnswer: 0,
          explanation: 'Detailed explanation from DeepSeek analysis',
          difficulty: difficulty as 'beginner' | 'intermediate' | 'advanced'
        };
      }
    } catch (error) {
      console.error('Error parsing learning content:', error);
    }

    return null;
  }

  private extractRelatedTopics(response: string): string[] {
    // Extract related learning topics from AI response
    return [
      'Classical homeopathy principles',
      'Remedy relationships',
      'Constitutional prescribing',
      'Acute vs chronic treatment'
    ];
  }

  private generateChatSuggestions(message: string, response: string): string[] {
    // Generate contextual suggestions based on conversation
    const suggestions = [
      'Tell me more about this topic',
      'How can I learn more?',
      'Show me related information',
      'What should I do next?'
    ];

    return suggestions;
  }

  private determineChatMode(message: string): string {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('symptom') || lowerMessage.includes('pain') || lowerMessage.includes('feel')) {
      return 'symptom';
    }
    if (lowerMessage.includes('learn') || lowerMessage.includes('study') || lowerMessage.includes('quiz')) {
      return 'learning';
    }
    if (lowerMessage.includes('inventory') || lowerMessage.includes('medicine') || lowerMessage.includes('stock')) {
      return 'inventory';
    }
    
    return 'general';
  }
}

// Export singleton instance
export const deepSeekAI = new DeepSeekAIService();

// Export types for use in other files
export type { RemedySuggestion, LearningContent };