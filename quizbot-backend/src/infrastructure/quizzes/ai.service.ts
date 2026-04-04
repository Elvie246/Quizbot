import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * AIService handles communication with Google Gemini to generate quizzes.
 * Ensures JSON format and handles AI errors.
 */
@Injectable()
export class AIService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    this.genAI = new GoogleGenerativeAI(apiKey || 'fallback_key');
    // Using gemini-2.0-flash as identified in available models
    this.model = this.genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash"
    });
  }

  /**
   * Generates a quiz based on a given topic or content.
   */
  async generateQuiz(topic: string, count: number = 5) {
    const prompt = `
      You are an expert educator. Create a high-quality quiz based on the following content or topic:
      "${topic}"
      
      Generate exactly ${count} multiple choice questions.
      Each question must have exactly 4 options.
      Only one option must be marked as "isCorrect": true.
      The output must be a valid JSON object following this EXACT structure:
      {
        "title": "A concise and descriptive title for the quiz",
        "description": "A brief summary of what this quiz covers (max 2 sentences)",
        "questions": [
          {
            "text": "The question text?",
            "options": [
              { "text": "Option A", "isCorrect": true },
              { "text": "Option B", "isCorrect": false },
              { "text": "Option C", "isCorrect": false },
              { "text": "Option D", "isCorrect": false }
            ]
          }
        ]
      }
      
      Important: 
      - If the input above is a long text, extract key concepts to form questions.
      - Return ONLY the JSON object. Do not include any explanation or markdown formatting (e.g., no \`\`\`json).
    `;

    try {
      const result = await this.model.generateContent(prompt);
      let responseText = result.response.text();
      
      // Basic cleanup in case Gemini still includes markdown
      responseText = responseText.replace(/```json\n?|```/g, '').trim();
      
      return JSON.parse(responseText);
    } catch (error: any) {
      console.error('AI Generation Error Detail:', JSON.stringify(error, null, 2));
      if (error.status === 429) {
        throw new InternalServerErrorException('Gemini API quota exceeded. Please wait a minute.');
      }
      throw new InternalServerErrorException('Failed to generate quiz from AI: ' + (error.message || 'Unknown error'));
    }
  }
}
