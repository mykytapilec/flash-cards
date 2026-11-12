
# Flash Cards

A flash card application built with React, TypeScript, and Vite. Create, edit, delete, and study flashcards while tracking your progress.

## Project

This project was built as part of the [Flash Cards project](https://roadmap.sh/projects/flash-cards) from roadmap.sh.

## Features

- Display flashcards with questions and answers.
- Flip cards to reveal answers.
- Navigate between flashcards.
- Track study progress with a progress bar.
- Create new flashcards.
- Edit existing flashcards.
- Delete flashcards.
- Persist flashcards using browser LocalStorage.
- Restore the initial flashcards when no saved data exists.

## Tech Stack

- React
- TypeScript
- Vite
- CSS
- LocalStorage API

## Getting Started

### Prerequisites

- Node.js
- npm

### Installation

Clone the repository and install dependencies:

    git clone https://github.com/mykytapilec/flash-cards.git
    cd flash-cards
    npm install

### Development

Start the development server:

    npm run dev

### Production Build

Build the application for production:

    npm run build

### Lint

Run ESLint:

    npm run lint

## Data Persistence

Flashcards are stored in the browser's LocalStorage.

Your changes are preserved after refreshing the page, but they are specific to the current browser and device.

Clearing browser storage will remove saved flashcards and restore the initial dataset on the next application load.
