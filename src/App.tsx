
import { useEffect, useState, type FormEvent } from 'react';
import Flashcard from './components/Flashcard';
import { flashcards as initialFlashcards } from './data/flashcards';
import type { Flashcard as FlashcardType } from './types/flashcard';
import './App.css';

const STORAGE_KEY = 'flash-cards';

function isValidFlashcard(value: unknown): value is FlashcardType {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const flashcard = value as Record<string, unknown>;

  return (
    typeof flashcard.id === 'string' &&
    typeof flashcard.question === 'string' &&
    typeof flashcard.answer === 'string'
  );
}

function loadFlashcards(): FlashcardType[] {
  try {
    const storedFlashcards = localStorage.getItem(STORAGE_KEY);

    if (!storedFlashcards) {
      return initialFlashcards;
    }

    const parsedFlashcards: unknown = JSON.parse(storedFlashcards);

    if (
      !Array.isArray(parsedFlashcards) ||
      !parsedFlashcards.every(isValidFlashcard)
    ) {
      return initialFlashcards;
    }

    return parsedFlashcards;
  } catch {
    return initialFlashcards;
  }
}

function App() {
  const [flashcards, setFlashcards] =
    useState<FlashcardType[]>(loadFlashcards);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const currentFlashcard = flashcards[currentIndex];
  const progress =
    flashcards.length > 0
      ? ((currentIndex + 1) / flashcards.length) * 100
      : 0;

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(flashcards));
    } catch {
      console.error('Unable to save flashcards to local storage.');
    }
  }, [flashcards]);

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

  const handleStartEditing = () => {
    setQuestion(currentFlashcard.question);
    setAnswer(currentFlashcard.answer);
    setError('');
    setIsEditing(true);
  };

  const handleCancelEditing = () => {
    setQuestion('');
    setAnswer('');
    setError('');
    setIsEditing(false);
  };

  const handleSaveChanges = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedQuestion = question.trim();
    const trimmedAnswer = answer.trim();

    if (!trimmedQuestion || !trimmedAnswer) {
      setError('Please fill in both fields.');
      return;
    }

    setFlashcards((previousFlashcards) =>
      previousFlashcards.map((flashcard) =>
        flashcard.id === currentFlashcard.id
          ? {
              ...flashcard,
              question: trimmedQuestion,
              answer: trimmedAnswer,
            }
          : flashcard,
      ),
    );

    setQuestion('');
    setAnswer('');
    setError('');
    setIsEditing(false);
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
            {isEditing ? (
              <form
                className="app__form app__edit-form"
                onSubmit={handleSaveChanges}
              >
                <h2 className="app__form-title">Edit flashcard</h2>

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

                <div className="app__form-actions">
                  <button className="app__form-button" type="submit">
                    Save Changes
                  </button>

                  <button
                    className="app__cancel-button"
                    onClick={handleCancelEditing}
                    type="button"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
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

                <div className="app__card-actions">
                  <button
                    className="app__edit-button"
                    onClick={handleStartEditing}
                    type="button"
                  >
                    Edit Flashcard
                  </button>

                  <button
                    className="app__delete-button"
                    onClick={handleDeleteFlashcard}
                    type="button"
                  >
                    Delete Flashcard
                  </button>
                </div>
              </>
            )}
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
            <label className="app__form-label" htmlFor="new-question">
              Question
            </label>
            <input
              className="app__form-input"
              id="new-question"
              name="question"
              onChange={(event) => {
                setQuestion(event.target.value);
                setError('');
              }}
              placeholder="Enter a question"
              type="text"
              value={isEditing ? '' : question}
              disabled={isEditing}
            />
          </div>

          <div className="app__form-field">
            <label className="app__form-label" htmlFor="new-answer">
              Answer
            </label>
            <textarea
              className="app__form-textarea"
              id="new-answer"
              name="answer"
              onChange={(event) => {
                setAnswer(event.target.value);
                setError('');
              }}
              placeholder="Enter an answer"
              rows={3}
              value={isEditing ? '' : answer}
              disabled={isEditing}
            />
          </div>

          {!isEditing && error && (
            <p className="app__form-error" role="alert">
              {error}
            </p>
          )}

          <button
            className="app__form-button"
            type="submit"
            disabled={isEditing}
          >
            Add Flashcard
          </button>
        </form>
      </section>
    </main>
  );
}

export default App;
