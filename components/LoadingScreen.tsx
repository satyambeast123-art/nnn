
import React, { useState, useEffect } from 'react';

const loadingMessages = [
    "Analyzing your responses...",
    "Consulting behavioral patterns...",
    "Crafting personalized strategies...",
    "Tailoring your daily plan...",
    "Building your path to discipline...",
];

const LoadingScreen: React.FC = () => {
    const [messageIndex, setMessageIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setMessageIndex((prevIndex) => (prevIndex + 1) % loadingMessages.length);
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-xl animate-fade-in">
            <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-brand-primary dark:border-brand-secondary"></div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mt-6 mb-2">Generating Your Routine</h2>
            <p className="text-gray-600 dark:text-gray-400 transition-opacity duration-500">
                {loadingMessages[messageIndex]}
            </p>
        </div>
    );
};

export default LoadingScreen;
