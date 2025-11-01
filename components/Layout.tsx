
import React from 'react';

export const Header: React.FC = () => (
  <header className="w-full text-center">
    <h1 className="text-3xl md:text-4xl font-bold text-brand-primary dark:text-brand-light">
      Your Personalized Path to Discipline
    </h1>
    <p className="mt-2 text-md md:text-lg text-gray-600 dark:text-gray-400">
      Answer a few questions to generate a custom routine to help you stay on track.
    </p>
  </header>
);

export const Footer: React.FC = () => (
  <footer className="w-full text-center text-xs text-gray-500 dark:text-gray-400 mt-8">
    <p>
      Disclaimer: This tool provides suggestions and is not a substitute for professional medical or psychological advice. 
      Your privacy is respected; your answers are not stored.
    </p>
    <p>&copy; {new Date().getFullYear()} Self-Discipline Routine Generator. All Rights Reserved.</p>
  </footer>
);
