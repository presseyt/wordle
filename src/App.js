import { useState, useEffect } from 'react';
import Wordle from './Wordle.js';
import Modal from './Modal.js';
import Stats from './Stats.js';
import Settings from './Settings.js';
import './App.css';

import {
    getRandomTarget,
    getDailyWord,
    makeGivens,
    updateStats,
    gameModes,
    getLocalStorageJson,
    putLocalStorageJson,
} from './helpers.js';

const getInitialGameState = (gameMode) => {
    const savedState = gameMode.daily && getLocalStorageJson(gameMode.mode);
    const target = gameMode.daily ? getDailyWord(gameMode.targets) : getRandomTarget(gameMode.targets);
    return {
        target,
        guesses: (savedState?.target === target && savedState?.guesses) || [],
        givens: (savedState?.target === target && savedState?.givens) || makeGivens(target, gameMode.numberOfGivens),
    };
};

const setVH = () => document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);

function App() {
    const [gameMode, setGameMode] = useState(gameModes[localStorage.getItem('mode') || '6c']);
    const [gameState, setGameState] = useState(getInitialGameState(gameMode))
    const [modalDisplay, setModalDisplay] = useState(false);
    const inProgress = !!(gameState.guesses.length && gameState.guesses.length < 6 && gameState.guesses[gameState.guesses.length - 1] !== gameState.target);

    const isValidWord = (str) => gameMode.dictionary.includes(str.toUpperCase());
    const handleGuess = (guess) => {
        if (!isValidWord(guess)) return false;

        // If you win or lose, we will display the modal after 1000ms
        if (guess === gameState.target) {
            setTimeout(() => setModalDisplay('win'), 1000);
            updateStats(gameMode.mode, gameState.guesses.length + 1);
        } else if (gameState.guesses.length === 5) {
            setTimeout(() => setModalDisplay('lose'), 1000);
            updateStats(gameMode.mode, 'fail');
        }

        const nextState = { ...gameState, guesses: [...gameState.guesses, guess] };
        if (gameMode.daily) putLocalStorageJson(gameMode.mode, nextState);
        setGameState(nextState);
        return true;
    }

    const play = (mode) => {
        setModalDisplay(false);
        setGameState(getInitialGameState(mode));
    };
    const handleSelectMode = (mode) => {
        localStorage.setItem('mode', mode.mode)
        setModalDisplay(false);
        setGameMode(mode);
        play(mode);
    };

    useEffect(() => {
        setVH();
        window.onresize = setVH;
    }, [])

    return (
        <div className="App">
            <div className="App__header">
                {gameMode.daily ? 'Scwordle - daily' : 'Scwordle - practice'}
                <button onClick={() => setModalDisplay('stats')}>Stats</button>
                <button onClick={() => setModalDisplay('settings')}>Settings</button>
            </div>
            <Wordle target={gameState.target} givens={gameState.givens} guesses={gameState.guesses} onGuess={handleGuess} />
            <Modal open={!!modalDisplay} onClose={() => setModalDisplay(false)}>
                {modalDisplay === 'settings' ? (
                    <Settings mode={gameMode.mode} onSelect={handleSelectMode} />
                ) : (
                    <>
                        {modalDisplay === 'win' && 'You won!'}
                        {modalDisplay === 'lose' && `You lost!  The word was ${gameState.target}`}
                        {(modalDisplay === 'win' || modalDisplay === 'lose' || modalDisplay === 'stats') && (
                            <Stats mode={gameMode.mode} target={gameState.target} result={!inProgress && gameState.guesses.length} />
                        )}
                        {gameMode.daily ? (
                            'Next scwordle tomorrow!'
                        ) : (
                            <button className="Play" onClick={() => play(gameMode)}> Play Again </button>
                        )}
                    </ >
                )}
            </Modal>
        </div>
    );
}

export default App;
