import { useState, useEffect } from 'react';
import Wordle from './Wordle.js';
import Modal from './Modal.js';
import './App.css';

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
    three: { mode: 'three', dictionary: threeLetterWords, targets: threeLetterWords, givens: 9, text: 'Three letter NASPA' },
    four: { mode: 'four', dictionary: fourLetterWords, targets: fourLetterWords, givens: 5, text: 'Four letter NASPA' },
    fourJQXZ: { mode: 'fourJQXZ', dictionary: fourLetterJQXZ, targets: fourLetterJQXZ, text: 'Four letter NASPA JQXZ' },
    six: { mode: 'six', dictionary: sixLetterWords, targets: sixLetterTargets, text: 'Six letter NASPA' },
    dailySix: { mode: 'dailySix', dictionary: sixLetterWords, targets: sixLetterTargets, daily: true, text: 'Daily six' },
    curatedSix: { mode: 'curatedSix', dictionary: sixLetterWords, targets: sixLetterTargets, text: 'Curated six letter words' },
    seven: { mode: 'seven', dictionary: sevenLetterWords, targets: sevenLetterTargets, text: 'Seven letter NASPA' },
    dailySeven: { mode: 'dailySeven', dictionary: sevenLetterWords, targets: sevenLetterTargets, daily: true, text: 'Daily seven' },
    curatedSeven: { mode: 'curatedSeven', dictionary: sevenLetterWords, targets: sevenLetterTargets, text: 'Curated seven letter words' },
};

const setVH = () => document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
const getDailyWord = (_targets) => {
    const daysElapsed = Math.floor((new Date() - new Date('2022-03-01')) / (24*60*60*1000)) + 15;
    const prime = 881; // 863
    const index = prime * daysElapsed % _targets.length;
    const permute = (word) => word[4] + word[2] + word[1] + word[5] + word[0] + word[3] + word[6];
    const jumbled = _targets.map(permute).sort();
    return permute(jumbled[index]).slice(0, _targets[0].length);
}
const getRandomTarget = (_targets) => {
    if (!_targets) return null;
    const index = Math.floor(Math.random() * _targets.length);
    return _targets[index];
}


function App() {
    const [{ mode, targets, dictionary, givens, daily }, setMode] = useState(gameModes.curatedSix);
    const [targetWord, setTargetWord] = useState(daily ? getDailyWord(targets) : getRandomTarget(targets));
    const [modalDisplay, setModalDisplay] = useState(false);

    const isValidWord = (str) => dictionary.includes(str.toUpperCase());

    const play = () => {
        setModalDisplay(false);
        setTargetWord(getRandomTarget(targets));
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
            <Wordle target={targetWord} isValidWord={isValidWord} givens={givens} setModal={setModalDisplay} />
            <Modal open={!!modalDisplay} onClose={() => setModalDisplay(false)}>
                {modalDisplay === 'win' && 'You won!'}
                {modalDisplay === 'lose' && `You lost!  The word was ${targetWord}`}
                {daily ? (
                    'Next scwordle tomorrow!'
                ) : (
                    <button onClick={play}> Play Again </button>
                )}
                {modalDisplay === 'settings' && (
                    <>
                        {Object.values(gameModes).filter(gameMode => !gameMode.daily).map(gameMode => (
                            <button className={gameMode.mode === mode && 'selected'} onClick={() => setMode(gameMode)}>
                                {gameMode.text}
                            </button>
                        ))}
                        <hr />
                        {Object.values(gameModes).filter(gameMode => gameMode.daily).map(gameMode => (
                            <button className={gameMode.mode === mode && 'selected'} onClick={() => setMode(gameMode)}>
                                {gameMode.text}
                            </button>
                        ))}
                    < />
                )}
            </Modal>
        </div>
    );
}

export default App;
