import Flashcard from './components/Flashcard';
import { flashcards } from './data/flashcards';
import './App.css';

function App() {
  return (
    <main className="app">
      <header className="app__header">
        <h1>Flash Cards</h1>
        <p className="app__description">
          Create, manage, and study your flash cards.
        </p>
      </header>

      <section className="app__content">
        <Flashcard flashcard={flashcards[0]} />
      </section>
    </main>
  );
}

export default App;