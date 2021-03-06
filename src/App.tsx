import { InformationCircleIcon, ChartBarIcon } from '@heroicons/react/outline';
import { useState, useEffect } from 'react';
import { Alert } from './components/alerts/Alert';
import { Grid } from './components/grid/Grid';
import { Keyboard } from './components/keyboard/Keyboard';
import { AboutModal } from './components/modals/AboutModal';
import { InfoModal } from './components/modals/InfoModal';
import { StatsModal } from './components/modals/StatsModal';
import {
  GAME_TITLE,
  WIN_MESSAGES,
  GAME_COPIED_MESSAGE,
  ABOUT_GAME_MESSAGE,
  NOT_ENOUGH_LETTERS_MESSAGE,
  WORD_NOT_FOUND_MESSAGE,
  CORRECT_WORD_MESSAGE,
} from './constants/strings';
import { isWordInWordList, isWinningWord, solution } from './lib/words';
import { addStatsForCompletedGame, loadStats } from './lib/stats';
import {
  loadGameStateFromLocalStorage,
  saveGameStateToLocalStorage,
  StoredGameState,
} from './lib/localStorage';

import './App.css';
import { getWordID, submitWord } from './api';
import { CharStatus } from './lib/statuses';
import { getKeyStates, KeyStates } from './lib/getKeyStates';

const ALERT_TIME_MS = 2000;

function App() {
  const prefersDarkMode = window.matchMedia(
    '(prefers-color-scheme: dark)'
  ).matches;

  const [currentGuess, setCurrentGuess] = useState('');
  const [isGameWon, setIsGameWon] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [isNotEnoughLetters, setIsNotEnoughLetters] = useState(false);
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);
  const [isWordNotFoundAlertOpen, setIsWordNotFoundAlertOpen] = useState(false);
  const [isGameLost, setIsGameLost] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [successAlert, setSuccessAlert] = useState('');
  const [wordId, setWordId] = useState<number | null>(null);
  const [solutionWord, setSolutionWord] = useState<string>();
  const [keyStates, setKeyStates] = useState<KeyStates>({});
  const [guesses, setGuesses] = useState<string[]>(() => {
    const loaded = loadGameStateFromLocalStorage();
    if (loaded?.solution !== solution) {
      return [];
    }
    const gameWasWon = loaded.guesses.includes(solution);
    if (gameWasWon) {
      setIsGameWon(true);
    }
    if (loaded.guesses.length === 6 && !gameWasWon) {
      setIsGameLost(true);
    }
    return loaded.guesses;
  });

  const [stats, setStats] = useState(() => loadStats());

  useEffect(() => {
    getWordID().then(({ id }) => {
      setWordId(id);
      const currentState = loadGameStateFromLocalStorage();
      if (currentState?.lastWordId !== id) {
        setGuesses([]);
        setSolutionWord('');
        setKeyStates({});
      } else {
        setKeyStates(currentState?.keyStates || {});
        setGuesses(currentState.guesses);
      }
    });
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleDarkMode = (isDark: boolean) => {
    setIsDarkMode(isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  };

  useEffect(() => {
    const gameState: StoredGameState = {
      guesses,
      solution: solutionWord || '',
      solved: Boolean(solutionWord),
    };
    const currentState = loadGameStateFromLocalStorage();

    if (wordId) {
      if (currentState?.lastWordId !== wordId) {
        setGuesses([]);
        setSolutionWord('');
      }
      saveGameStateToLocalStorage({
        ...gameState,
        lastWordId: wordId,
        keyStates,
      });
    }
  }, [guesses, solutionWord, wordId]);

  useEffect(() => {
    if (isGameWon) {
      setSuccessAlert(
        WIN_MESSAGES[Math.floor(Math.random() * WIN_MESSAGES.length)]
      );
      setTimeout(() => {
        setSuccessAlert('');
        setIsStatsModalOpen(true);
      }, ALERT_TIME_MS);
    }
    if (isGameLost) {
      setTimeout(() => {
        setIsStatsModalOpen(true);
      }, ALERT_TIME_MS);
    }
  }, [isGameWon, isGameLost]);

  const onChar = (value: string) => {
    if (currentGuess.length < 5 && guesses.length < 6 && !isGameWon) {
      setCurrentGuess(`${currentGuess}${value}`);
    }
  };

  const onDelete = () => {
    setCurrentGuess(currentGuess.slice(0, -1));
  };

  const onEnter = async () => {
    if (isGameWon || isGameLost) {
      return;
    }
    if (!(currentGuess.length === 5)) {
      setIsNotEnoughLetters(true);
      return setTimeout(() => {
        setIsNotEnoughLetters(false);
      }, ALERT_TIME_MS);
    }

    if (!isWordInWordList(currentGuess)) {
      setIsWordNotFoundAlertOpen(true);
      return setTimeout(() => {
        setIsWordNotFoundAlertOpen(false);
      }, ALERT_TIME_MS);
    }

    const charStatusResult = await submitWord(currentGuess);
    const newKeyStates = getKeyStates(
      currentGuess,
      charStatusResult,
      keyStates
    );
    setKeyStates(newKeyStates);
    const winningWord = isWinningWord(charStatusResult);

    if (currentGuess.length === 5 && guesses.length < 6 && !isGameWon) {
      setGuesses([...guesses, currentGuess]);
      setCurrentGuess('');

      if (winningWord) {
        setStats(addStatsForCompletedGame(stats, guesses.length));
        setSolutionWord(currentGuess);
        return setIsGameWon(true);
      }

      if (guesses.length === 5) {
        setStats(addStatsForCompletedGame(stats, guesses.length + 1));
        setIsGameLost(true);
      }
    }
  };

  return (
    <div className="py-8 max-w-7xl mx-auto sm:px-6 lg:px-8">
      <div className="flex w-80 mx-auto items-center mb-8 mt-12">
        <h1 className="text-xl grow font-bold dark:text-white">{GAME_TITLE}</h1>
        <InformationCircleIcon
          className="h-6 w-6 cursor-pointer dark:stroke-white"
          onClick={() => setIsInfoModalOpen(true)}
        />
        <ChartBarIcon
          className="h-6 w-6 cursor-pointer dark:stroke-white"
          onClick={() => setIsStatsModalOpen(true)}
        />
      </div>
      <Grid guesses={guesses} currentGuess={currentGuess} />
      <Keyboard
        onChar={onChar}
        onDelete={onDelete}
        onEnter={onEnter}
        keyStates={keyStates}
      />
      <InfoModal
        isOpen={isInfoModalOpen}
        handleClose={() => setIsInfoModalOpen(false)}
      />
      <StatsModal
        isOpen={isStatsModalOpen}
        handleClose={() => setIsStatsModalOpen(false)}
        guesses={guesses}
        gameStats={stats}
        isGameLost={isGameLost}
        isGameWon={isGameWon}
        wordId={wordId}
        handleShare={() => {
          setSuccessAlert(GAME_COPIED_MESSAGE);
          return setTimeout(() => setSuccessAlert(''), ALERT_TIME_MS);
        }}
      />
      <AboutModal
        isOpen={isAboutModalOpen}
        handleClose={() => setIsAboutModalOpen(false)}
      />

      {/* <button
        type="button"
        className="mx-auto mt-8 flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 select-none"
        onClick={() => setIsAboutModalOpen(true)}
      >
        {ABOUT_GAME_MESSAGE}
      </button> */}

      <Alert message={NOT_ENOUGH_LETTERS_MESSAGE} isOpen={isNotEnoughLetters} />
      <Alert
        message={WORD_NOT_FOUND_MESSAGE}
        isOpen={isWordNotFoundAlertOpen}
      />
      <Alert
        message={successAlert}
        isOpen={successAlert !== ''}
        variant="success"
      />
    </div>
  );
}

export default App;
