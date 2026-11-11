import { useState } from 'react';
import Flashcard from './components/Flashcard';
import { flashcards } from './data/flashcards';
import './App.css';

function App() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentFlashcard = flashcards[currentIndex];
  const progress = ((currentIndex + 1) / flashcards.length) * 100;

  const handlePrevious = () => {
    setCurrentIndex((previousIndex) =>
      previousIndex === 0 ? flashcards.length - 1 : previousIndex - 1,
    );
  };

  const handleNext = () => {
    setCurrentIndex((previousIndex) =>
      previousIndex === flashcards.length - 1 ? 0 : previousIndex + 1,
    );
  };

  return (
    <main className="app">
      <header className="app__header">
        <h1>Flash Cards</h1>
        <p className="app__description">
          Create, manage, and study your flash cards.
        </p>
      </header>

      <section className="app__content">
        <div
          className="app__progress"
          role="progressbar"
          aria-label="Flashcard progress"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress}
        >
          <div className="app__progress-track">
            <div
              className="app__progress-bar"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="app__progress-label">
            {currentIndex + 1} of {flashcards.length} cards
          </span>
        </div>

        <Flashcard key={currentFlashcard.id} flashcard={currentFlashcard} />

        <div className="app__navigation">
          <button
            className="app__navigation-button"
            onClick={handlePrevious}
            type="button"
          >
            Previous
          </button>

          <span className="app__counter">
            {currentIndex + 1} / {flashcards.length}
          </span>

          <button
            className="app__navigation-button"
            onClick={handleNext}
            type="button"
          >
            Next
          </button>
        </div>
      </section>
    </main>
  );
}

export default App;
