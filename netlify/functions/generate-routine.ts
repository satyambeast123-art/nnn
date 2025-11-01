import { GoogleGenAI } from "@google/genai";
import type { Handler, HandlerEvent } from "@netlify/functions";

// Types and constants are self-contained within the function for portability.
interface Option {
  id: string;
  text: string;
}

interface QuizQuestion {
  id: number;
  question: string;
  options: Option[];
}

interface Answers {
  [key: number]: string;
}

const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: 'What triggers your lust?',
    options: [
      { id: 'A', text: 'Exposure to highly curated or sexually suggestive content on social media (e.g., Instagram, TikTok, Reddit).' },
      { id: 'B', text: 'Targeted advertising or explicit content encountered unexpectedly while browsing online.' },
      { id: 'C', text: 'Loneliness, boredom, or emotional stress, leading me to seek digital distractions or gratification.' },
      { id: 'D', text: 'Specific visual or auditory cues from media (e.g., movies, music videos, podcasts).' },
      { id: 'E', text: 'Imagining scenarios after reading or hearing about certain topics.' },
      { id: 'F', text: 'Other (please specify if comfortable).' },
    ],
  },
  {
    id: 2,
    question: 'How often do you masturbate?',
    options: [
      { id: 'A', text: 'Multiple times a day' },
      { id: 'B', text: 'Once a day' },
      { id: 'C', text: 'A few times a week' },
      { id: 'D', text: 'Once a week' },
      { id: 'E', text: 'A few times a month' },
      { id: 'F', text: 'Rarely or never' },
    ],
  },
  {
    id: 3,
    question: 'Do you feel guilt after ejaculating? If yes, then why?',
    options: [
      { id: 'A', text: 'Yes, I feel it detracts from my productivity or personal goals.' },
      { id: 'B', text: 'Yes, I feel it conflicts with my personal values or moral beliefs.' },
      { id: 'C', text: 'Yes, I feel it makes me less present or connected in my relationships.' },
      { id: 'D', text: 'Yes, I feel it\'s a sign of a lack of self-control.' },
      { id: 'E', text: 'No, I do not typically feel guilt.' },
      { id: 'F', text: 'Sometimes, depending on the circumstances or how I accessed content.' },
    ],
  },
  {
    id: 4,
    question: 'What kind of environment arouses you?',
    options: [
      { id: 'A', text: 'Private and solitary settings, especially at home.' },
      { id: 'B', text: 'When using a smartphone or computer in bed.' },
      { id: 'C', text: 'Browsing social media or specific websites online.' },
      { id: 'D', text: 'When feeling relaxed and stress-free.' },
      { id: 'E', text: 'When feeling stressed, anxious, or bored, seeking an escape.' },
      { id: 'F', text: 'Other (please specify if comfortable).' },
    ],
  },
  {
    id: 5,
    question: 'How many times have you already tried and failed (to achieve a self-discipline goal related to this area, e.g., NNN)?',
    options: [
      { id: 'A', text: 'This is my first attempt.' },
      { id: 'B', text: '1-2 times' },
      { id: 'C', text: '3-5 times' },
      { id: 'D', text: 'More than 5 times' },
      { id: 'E', text: 'I haven\'t specifically tried to stop, but I\'ve noticed a pattern.' },
    ],
  },
  {
    id: 6,
    question: 'What exactly were you thinking before giving into urges?',
    options: [
      { id: 'A', text: '"Just one quick look won\'t hurt."' },
      { id: 'B', text: '"I\'m stressed/bored/lonely, and this will make me feel better temporarily."' },
      { id: 'C', text: '"I deserve this; I\'ve been good all day/week."' },
      { id: 'D', text: '"It\'s too difficult to resist; I might as well give in."' },
      { id: 'E', text: '"I\'ll start fresh tomorrow/next week."' },
      { id: 'F', text: '"I\'m curious about this content."' },
      { id: 'G', text: 'Other (please describe briefly).' },
    ],
  },
  {
    id: 7,
    question: 'What age group do you belong to?',
    options: [
      { id: 'A', text: 'Under 18' },
      { id: 'B', text: '18-24' },
      { id: 'C', text: '25-34' },
      { id: 'D', text: '35-44' },
      { id: 'E', text: '45-54' },
      { id: 'F', text: '55+' },
    ],
  },
  {
    id: 8,
    question: 'What is your average daily screen time?',
    options: [
      { id: 'A', text: 'Less than 2 hours' },
      { id: 'B', text: '2-4 hours' },
      { id: 'C', text: '4-6 hours' },
      { id: 'D', text: '6-8 hours' },
      { id: 'E', text: 'More than 8 hours' },
    ],
  },
  {
    id: 9,
    question: 'Are you committed or single?',
    options: [
      { id: 'A', text: 'Single' },
      { id: 'B', text: 'In a relationship / Partnered' },
      { id: 'C', text: 'Married' },
      { id: 'D', text: 'Prefer not to say' },
    ],
  },
  {
    id: 10,
    question: 'How often do you encounter explicit content on social media?',
    options: [
      { id: 'A', text: 'Multiple times a day' },
      { id: 'B', text: 'Once a day' },
      { id: 'C', text: 'A few times a week' },
      { id: 'D', text: 'Once a week or less' },
      { id: 'E', text: 'Rarely or never' },
      { id: 'F', text: 'Only when actively searching for it' },
    ],
  },
];

function formatAnswersForPrompt(answers: Answers): string {
  return quizQuestions.map(q => {
    const answerId = answers[q.id];
    const answerText = q.options.find(opt => opt.id === answerId)?.text || 'Not answered';
    return `${q.id}) ${q.question}\n   Answer: ${answerText}`;
  }).join('\n\n');
}

export const handler: Handler = async (event: HandlerEvent) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  const API_KEY = process.env.API_KEY;
  if (!API_KEY) {
    console.error("API_KEY environment variable not set in Netlify function");
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Server configuration error: API key is missing.' }),
    };
  }
  const ai = new GoogleGenAI({ apiKey: API_KEY });

  try {
    if (!event.body) {
      return { statusCode: 400, body: JSON.stringify({ error: 'No quiz answers provided.' }) };
    }
    const answers: Answers = JSON.parse(event.body);
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

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: prompt,
    });
    
    const routine = response.text;

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ routine }),
    };

  } catch (error) {
    console.error("Error in Netlify function:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "An internal error occurred while generating the routine." }),
    };
  }
};
