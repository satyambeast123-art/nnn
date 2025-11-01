
import React, { useState, useCallback } from 'react';
import Quiz from './components/Quiz';
import RoutineDisplay from './components/RoutineDisplay';
import LoadingScreen from './components/LoadingScreen';
import { quizQuestions } from './constants';
import { generateRoutine } from './services/geminiService';
import type { Answers } from './types';
import { Header, Footer } from './components/Layout';

type AppState = 'quiz' | 'loading' | 'result' | 'error';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('quiz');
  const [routine, setRoutine] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleQuizComplete = useCallback(async (answers: Answers) => {
    setAppState('loading');
    setError('');
    try {
      const generatedRoutine = await generateRoutine(answers);
      setRoutine(generatedRoutine);
      setAppState('result');
    } catch (err) {
      console.error('Error generating routine:', err);
      setError('Sorry, we encountered an issue generating your routine. Please try again.');
      setAppState('error');
    }
  }, []);

  const handleRestart = useCallback(() => {
    setRoutine('');
    setError('');
    setAppState('quiz');
  }, []);

  const renderContent = () => {
    switch (appState) {
      case 'quiz':
        return <Quiz questions={quizQuestions} onComplete={handleQuizComplete} />;
      case 'loading':
        return <LoadingScreen />;
      case 'result':
        return <RoutineDisplay routine={routine} onRestart={handleRestart} />;
      case 'error':
        return (
          <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-xl animate-fade-in">
            <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">An Error Occurred</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">{error}</p>
            <button
              onClick={handleRestart}
              className="px-6 py-3 bg-brand-primary text-white font-semibold rounded-lg shadow-md hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-secondary focus:ring-opacity-75 transition-colors"
            >
              Try Again
            </button>
          </div>
        );
      default:
        return <Quiz questions={quizQuestions} onComplete={handleQuizComplete} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-between bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 p-4 font-sans">
      <Header />
      <main className="w-full max-w-2xl mx-auto my-8">
        {renderContent()}
      </main>
      <Footer />
    </div>
  );
};

export default App;
