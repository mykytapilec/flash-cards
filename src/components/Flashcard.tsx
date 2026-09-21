import { useState } from 'react';
import type { Flashcard as FlashcardType } from '../types/flashcard';
import './Flashcard.css';

interface FlashcardProps {
  flashcard: FlashcardType;
}

function Flashcard({ flashcard }: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped((previousState) => !previousState);
  };

  return (
    <button
      className={`flashcard ${isFlipped ? 'flashcard--flipped' : ''}`}
      onClick={handleFlip}
      type="button"
      aria-label={
        isFlipped
          ? `Show question: ${flashcard.question}`
          : `Show answer to: ${flashcard.question}`
      }
    >
      <span className="flashcard__content">
        <span className="flashcard__label">
          {isFlipped ? 'Answer' : 'Question'}
        </span>

        <span className="flashcard__text">
          {isFlipped ? flashcard.answer : flashcard.question}
        </span>

        <span className="flashcard__hint">
          Click to {isFlipped ? 'see question' : 'reveal answer'}
        </span>
      </span>
    </button>
  );
}

export default Flashcard;
