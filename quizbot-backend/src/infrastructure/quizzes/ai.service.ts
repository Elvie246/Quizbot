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
    // Using 1.5-flash for speed and free tier quotas
    this.model = this.genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: { responseMimeType: "application/json" } // Force JSON mode
    });
  }

  /**
   * Generates a quiz based on a given topic or content.
   */
  async generateQuiz(topic: string, count: number = 5) {
    const prompt = `
      Create a quiz about "${topic}" with exactly ${count} multiple choice questions.
      Follow this JSON structure:
      {
        "title": "Quiz Title",
        "description": "Brief description of the quiz topic",
        "questions": [
          {
            "text": "Question text?",
            "options": [
              { "text": "Option 1", "isCorrect": true },
              { "text": "Option 2", "isCorrect": false },
              { "text": "Option 3", "isCorrect": false },
              { "text": "Option 4", "isCorrect": false }
            ]
          }
        ]
      }
      Ensure only one option is correct per question. Return only valid JSON.
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const responseText = result.response.text();
      return JSON.parse(responseText);
    } catch (error) {
      console.error('AI Generation Error:', error);
      throw new InternalServerErrorException('Failed to generate quiz from AI');
    }
  }
}
