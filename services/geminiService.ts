
import { GoogleGenAI } from "@google/genai";
import type { Answers } from '../types';
import { quizQuestions } from '../constants';

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

function formatAnswersForPrompt(answers: Answers): string {
  return quizQuestions.map(q => {
    const answerId = answers[q.id];
    const answerText = q.options.find(opt => opt.id === answerId)?.text || 'Not answered';
    return `${q.id}) ${q.question}\n   Answer: ${answerText}`;
  }).join('\n\n');
}

export const generateRoutine = async (answers: Answers): Promise<string> => {
  const formattedAnswers = formatAnswersForPrompt(answers);

  const prompt = `
    You are an AI assistant specializing in behavioral psychology and habit formation. Your goal is to create a personalized, supportive, and non-judgmental daily routine for a user who wants to manage their sexual urges and build self-discipline. The user has provided the following answers to a confidential quiz.

    **User's Quiz Answers:**
    ${formattedAnswers}

    **Your Task:**
    Based *only* on the user's answers, generate a comprehensive, actionable, and encouraging daily routine.

    **Instructions:**
    1.  **Tone:** Maintain a positive, empowering, and non-judgmental tone throughout. Avoid clinical or shaming language. Focus on building healthy habits, not just avoiding negative ones.
    2.  **Structure:** Organize the routine into the following sections using Markdown headings:
        *   ### 🌅 Morning Routine (First 90 minutes)
        *   ### ☀️ Daytime Strategies
        *   ### 🌙 Evening Wind-Down (Last 90 minutes)
        *   ### 🌊 Acknowledging & Navigating Urges (Your Toolkit)
    3.  **Personalization:** Directly reference the user's answers to tailor the advice. For example:
        *   If they are triggered by social media, suggest specific digital wellness habits.
        *   If they are triggered by boredom or stress, provide healthy coping mechanisms and alternative activities.
        *   If they feel guilt, offer reframing perspectives focused on self-compassion and progress.
    4.  **Actionable Advice:** Provide concrete, specific, and easy-to-implement suggestions. Instead of "exercise more," suggest "a 20-minute brisk walk after lunch."
    5.  **Urge Toolkit:** In the "Acknowledging & Navigating Urges" section, provide 3-4 simple, in-the-moment techniques (like deep breathing, changing environment, mindfulness exercises) that the user can employ when they feel an urge.
    6.  **Closing Statement:** End with a short, encouraging message about progress over perfection.

    Do not include any preamble before the first heading. Start directly with the "Morning Routine" section.
  `;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: prompt
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API call failed:", error);
    throw new Error("Failed to communicate with the AI model.");
  }
};
