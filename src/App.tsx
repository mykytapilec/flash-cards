
import { useState, type FormEvent } from 'react';
import Flashcard from './components/Flashcard';
import { flashcards as initialFlashcards } from './data/flashcards';
import type { Flashcard as FlashcardType } from './types/flashcard';
import './App.css';

function App() {
  const [flashcards, setFlashcards] =
    useState<FlashcardType[]>(initialFlashcards);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState('');

  const currentFlashcard = flashcards[currentIndex];
  const progress =
    flashcards.length > 0
      ? ((currentIndex + 1) / flashcards.length) * 100
      : 0;

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

  const handleAddFlashcard = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedQuestion = question.trim();
    const trimmedAnswer = answer.trim();

    if (!trimmedQuestion || !trimmedAnswer) {
      setError('Please fill in both fields.');
      return;
    }

    const newFlashcard: FlashcardType = {
      id: crypto.randomUUID(),
      question: trimmedQuestion,
      answer: trimmedAnswer,
    };

    setFlashcards((previousFlashcards) => [
      ...previousFlashcards,
      newFlashcard,
    ]);

    setCurrentIndex(flashcards.length);
    setQuestion('');
    setAnswer('');
    setError('');
  };

  const handleDeleteFlashcard = () => {
    setFlashcards((previousFlashcards) =>
      previousFlashcards.filter(
        (flashcard) => flashcard.id !== currentFlashcard.id,
      ),
    );

    setCurrentIndex((previousIndex) =>
      previousIndex >= flashcards.length - 1
        ? Math.max(previousIndex - 1, 0)
        : previousIndex,
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
            {flashcards.length > 0
              ? `${currentIndex + 1} of ${flashcards.length} cards`
              : 'No cards available'}
          </span>
        </div>

        {currentFlashcard ? (
          <>
            <Flashcard
              key={currentFlashcard.id}
              flashcard={currentFlashcard}
            />

            <div className="app__navigation">
              <button
                className="app__navigation-button"
                onClick={handlePrevious}
                type="button"
                disabled={flashcards.length <= 1}
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
                disabled={flashcards.length <= 1}
              >
                Next
              </button>
            </div>

            <button
              className="app__delete-button"
              onClick={handleDeleteFlashcard}
              type="button"
            >
              Delete Flashcard
            </button>
          </>
        ) : (
          <div className="app__empty-state">
            <h2>No flashcards available</h2>
            <p>Add a new flashcard to start studying again.</p>
          </div>
        )}

        <form className="app__form" onSubmit={handleAddFlashcard}>
          <h2 className="app__form-title">Add a new flashcard</h2>

          <div className="app__form-field">
            <label className="app__form-label" htmlFor="question">
              Question
            </label>
            <input
              className="app__form-input"
              id="question"
              name="question"
              onChange={(event) => {
                setQuestion(event.target.value);
                setError('');
              }}
              placeholder="Enter a question"
              type="text"
              value={question}
            />
          </div>

          <div className="app__form-field">
            <label className="app__form-label" htmlFor="answer">
              Answer
            </label>
            <textarea
              className="app__form-textarea"
              id="answer"
              name="answer"
              onChange={(event) => {
                setAnswer(event.target.value);
                setError('');
              }}
              placeholder="Enter an answer"
              rows={3}
              value={answer}
            />
          </div>

          {error && (
            <p className="app__form-error" role="alert">
              {error}
            </p>
          )}

          <button className="app__form-button" type="submit">
            Add Flashcard
          </button>
        </form>
      </section>
    </main>
  );
}

export default App;
