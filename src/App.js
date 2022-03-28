import { useState, useEffect } from 'react';
import Wordle from './Wordle.js';
import Modal from './Modal.js';
import './App.css';

import {
    getRandomTarget,
    getDailyWord,
    makeGivens,
} from './helpers.js';

import {
    threeLetterWords,
    fourLetterWords,
    fourLetterJQXZ,
    sixLetterWords,
    sixLetterTargets,
    sevenLetterWords,
    sevenLetterTargets,
} from './words'

const gameModes = {
    three: { mode: 'three', dictionary: threeLetterWords, targets: threeLetterWords, numberOfGivens: 10, text: 'Three letter NASPA' },
    four: { mode: 'four', dictionary: fourLetterWords, targets: fourLetterWords, numberOfGivens: 5, text: 'Four letter NASPA' },
    fourJQXZ: { mode: 'fourJQXZ', dictionary: fourLetterJQXZ, targets: fourLetterJQXZ, text: 'Four letter NASPA JQXZ' },
    six: { mode: 'six', dictionary: sixLetterWords, targets: sixLetterTargets, text: 'Six letter NASPA' },
    dailySix: { mode: 'dailySix', dictionary: sixLetterWords, targets: sixLetterTargets, daily: true, text: 'Daily six' },
    curatedSix: { mode: 'curatedSix', dictionary: sixLetterWords, targets: sixLetterTargets, text: 'Curated six letter words' },
    seven: { mode: 'seven', dictionary: sevenLetterWords, targets: sevenLetterTargets, text: 'Seven letter NASPA' },
    dailySeven: { mode: 'dailySeven', dictionary: sevenLetterWords, targets: sevenLetterTargets, daily: true, text: 'Daily seven' },
    curatedSeven: { mode: 'curatedSeven', dictionary: sevenLetterWords, targets: sevenLetterTargets, text: 'Curated seven letter words' },
};

const getInitialGameState = (gameMode) => {
    const target = gameMode.daily ? getDailyWord(gameMode.targets) : getRandomTarget(gameMode.targets);
    return { target, guesses: [], givens: makeGivens(target, gameMode.numberOfGivens) };
};

const setVH = () => document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);

function App() {
    const [gameMode, setGameMode] = useState(gameModes.curatedSix);
    const [gameState, setGameState] = useState(getInitialGameState(gameMode))
    const [modalDisplay, setModalDisplay] = useState(false);

    const isValidWord = (str) => gameMode.dictionary.includes(str.toUpperCase());
    const handleGuess = (guess) => {
        if (!isValidWord(guess)) return false;

        // If you win or lose, we will display the modal after 1000ms
        if (guess === gameState.target) {
            setTimeout(() => setModalDisplay('win'), 1000);
        } else if (gameState.guesses.length === 5) {
            setTimeout(() => setModalDisplay('lose'), 1000)
        }

        setGameState({ ...gameState, guesses: [...gameState.guesses, guess] });
        return true;
    }

    const play = () => {
        setModalDisplay(false);
        setGameState(getInitialGameState(gameMode));
    };

    useEffect(() => {
        setVH();
        window.onresize = setVH;
    }, [])

    return (
        <div className="App">
            <div className="App__header">
                Scwordle
                <button onClick={() => setModalDisplay('stats')}>Stats</button>
                <button onClick={() => setModalDisplay('settings')}>Settings</button>
            </div>
            <Wordle target={gameState.target} givens={gameState.givens} guesses={gameState.guesses} onGuess={handleGuess} />
            <Modal open={!!modalDisplay} onClose={() => setModalDisplay(false)}>
                {modalDisplay === 'win' && 'You won!'}
                {modalDisplay === 'lose' && `You lost!  The word was ${gameState.target}`}
                {modalDisplay === 'settings' && (
                    <>
                        {Object.values(gameModes).filter(mode => !mode.daily).map(mode => (
                            <button className={mode.mode === gameMode.mode && 'selected'} onClick={() => setGameMode(mode)}>
                                {mode.text}
                            </button>
                        ))}
                        <hr />
                        {Object.values(gameModes).filter(mode => mode.daily).map(mode => (
                            <button className={mode.mode === gameMode.mode && 'selected'} onClick={() => setGameMode(mode)}>
                                {mode.text}
                            </button>
                        ))}
                    < />
                )}
                {gameMode.daily ? (
                    'Next scwordle tomorrow!'
                ) : (
                    <button onClick={play}> Play Again </button>
                )}
            </Modal>
        </div>
    );
}

export default App;
