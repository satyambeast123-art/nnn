
import React, { useState } from 'react';
import type { QuizQuestion, Answers, Option } from '../types';

interface QuizProps {
  questions: QuizQuestion[];
  onComplete: (answers: Answers) => void;
}

const Quiz: React.FC<QuizProps> = ({ questions, onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  const handleSelectOption = (option: Option) => {
    setSelectedOptionId(option.id);
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: option.id }));
  };

  const handleNext = () => {
    if (selectedOptionId === null) return;

    if (isLastQuestion) {
      onComplete(answers);
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOptionId(answers[questions[currentQuestionIndex + 1].id] || null);
    }
  };
  
  const handleBack = () => {
    if (currentQuestionIndex > 0) {
        setCurrentQuestionIndex(prev => prev - 1);
        setSelectedOptionId(answers[questions[currentQuestionIndex - 1].id] || null);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-xl shadow-2xl w-full animate-fade-in">
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between mb-1">
          <span className="text-base font-medium text-brand-primary dark:text-white">Question {currentQuestionIndex + 1} of {questions.length}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
          <div className="bg-brand-secondary h-2.5 rounded-full transition-all duration-500" style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}></div>
        </div>
      </div>

      {/* Question */}
      <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6" key={currentQuestion.id}>
        {currentQuestion.question}
      </h2>

      {/* Options */}
      <div className="space-y-4 mb-8">
        {currentQuestion.options.map((option) => (
          <button
            key={option.id}
            onClick={() => handleSelectOption(option)}
            className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200
              ${selectedOptionId === option.id 
                ? 'bg-brand-light dark:bg-brand-dark border-brand-primary dark:border-brand-secondary' 
                : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:border-brand-secondary dark:hover:border-brand-secondary'
              }`}
          >
            <span className="font-semibold text-gray-800 dark:text-gray-200">{option.text}</span>
          </button>
        ))}
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <button
          onClick={handleBack}
          disabled={currentQuestionIndex === 0}
          className="px-6 py-2 text-gray-600 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Back
        </button>
        <button
          onClick={handleNext}
          disabled={selectedOptionId === null}
          className="px-8 py-3 bg-brand-primary text-white font-bold rounded-lg shadow-lg hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-secondary focus:ring-opacity-75 transition-transform transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isLastQuestion ? 'Generate Routine' : 'Next'}
        </button>
      </div>
    </div>
  );
};

export default Quiz;
