
import React from 'react';

interface RoutineDisplayProps {
  routine: string;
  onRestart: () => void;
}

const RoutineDisplay: React.FC<RoutineDisplayProps> = ({ routine, onRestart }) => {
  const formattedRoutine = routine.split('\n').map((line, index) => {
    if (line.startsWith('### ')) {
      return <h3 key={index} className="text-2xl font-bold text-brand-primary dark:text-brand-light mt-6 mb-3">{line.substring(4)}</h3>;
    }
    if (line.startsWith('**')) {
        const parts = line.split('**');
        return (
            <p key={index} className="my-2 text-gray-700 dark:text-gray-300">
                <strong>{parts[1]}</strong>{parts.slice(2).join('**')}
            </p>
        );
    }
    if (line.trim().startsWith('* ') || line.trim().startsWith('- ')) {
      return (
        <li key={index} className="ml-6 list-disc text-gray-700 dark:text-gray-300">
          {line.substring(2)}
        </li>
      );
    }
    if (line.trim() === '') {
      return null;
    }
    return <p key={index} className="my-2 text-gray-700 dark:text-gray-300">{line}</p>;
  });

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(routine).then(() => {
      alert('Routine copied to clipboard!');
    }, (err) => {
      console.error('Could not copy text: ', err);
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-xl shadow-2xl w-full animate-slide-in-up">
      <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-gray-100 mb-6">Your Personalized Routine</h2>
      <div className="prose prose-lg dark:prose-invert max-w-none">
        {formattedRoutine}
      </div>
      <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={handleCopyToClipboard}
          className="w-full sm:w-auto px-6 py-3 bg-green-600 text-white font-bold rounded-lg shadow-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75 transition-transform transform hover:scale-105"
        >
          Copy Routine
        </button>
        <button
          onClick={onRestart}
          className="w-full sm:w-auto px-6 py-3 bg-brand-primary text-white font-bold rounded-lg shadow-lg hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-secondary focus:ring-opacity-75 transition-transform transform hover:scale-105"
        >
          Start Over
        </button>
      </div>
    </div>
  );
};

export default RoutineDisplay;
