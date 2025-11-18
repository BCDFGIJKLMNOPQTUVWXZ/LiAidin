// client/src/components/shared/TypingText.jsx
import React, { useState, useEffect } from 'react';

const TypingText = ({ text, delay = 100, infinite = false, className = "" }) => {
  const [currentText, setCurrentText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setCurrentText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, delay);

      return () => clearTimeout(timeout);
    } else if (infinite) {
      const timeout = setTimeout(() => {
        setCurrentIndex(0);
        setCurrentText('');
      }, 2000);

      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, delay, infinite]);

  const words = currentText.split(' ');
  const firstWord = words[0];
  const rest = words.slice(1).join(' ');

  return (
    <span className={className}>
      <span className="text-teal-400">{firstWord}</span>
      {rest && ` ${rest}`}
    </span>
  );
};

export default TypingText;
