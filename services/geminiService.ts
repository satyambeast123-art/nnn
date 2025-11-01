import type { Answers } from '../types';

export const generateRoutine = async (answers: Answers): Promise<string> => {
  try {
    const response = await fetch('/.netlify/functions/generate-routine', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(answers),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: `Request failed with status ${response.status}` }));
      throw new Error(errorData.error || 'An unknown error occurred.');
    }

    const data = await response.json();
    if (!data.routine) {
      throw new Error("Received an invalid response from the server.");
    }
    
    return data.routine;
  } catch (error) {
    console.error("Failed to generate routine:", error);
    // Re-throwing a more user-friendly error message.
    // The App.tsx component will catch this and display a message.
    if (error instanceof Error) {
        throw new Error(`Failed to communicate with the AI model: ${error.message}`);
    }
    throw new Error("An unknown error occurred while communicating with the server.");
  }
};
